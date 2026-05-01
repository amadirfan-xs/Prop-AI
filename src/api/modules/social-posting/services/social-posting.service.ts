import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConnectMetaDto } from '@/api/modules/social-posting/dto/connect-meta.dto';
import {
  CreateSocialPostDto,
  CreateSocialPostTargetDto,
} from '@/api/modules/social-posting/dto/create-social-post.dto';
import { StartSocialConnectDto } from '@/api/modules/social-posting/dto/start-social-connect.dto';
import { UpdateSocialPostStatusDto } from '@/api/modules/social-posting/dto/update-social-post-status.dto';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertySocialPostRepository } from '@/api/modules/social-posting/repositories/property-social-post.repository';
import { PropertyActivityRepository } from '@/api/modules/property/repositories/property-activity.repository';
import { SocialAccountRepository } from '@/api/modules/social-posting/repositories/social-account.repository';
import { SocialDestinationRepository } from '@/api/modules/social-posting/repositories/social-destination.repository';
import { SocialOAuthSessionRepository } from '@/api/modules/social-posting/repositories/social-oauth-session.repository';
import { MetaGraphService } from '@/api/modules/social-posting/services/meta-graph.service';
import { LinkedInService } from '@/api/modules/social-posting/services/linkedin.service';
import { TikTokService } from '@/api/modules/social-posting/services/tiktok.service';
import { SocialTokenCryptoService } from '@/api/modules/social-posting/services/social-token-crypto.service';
import {
  SOCIAL_POST_JOB,
  SOCIAL_POST_QUEUE,
  type SocialPostJobPayload,
} from '@/api/modules/social-posting/types/social-queue.types';
import { SOCIAL_PLATFORMS } from '@/api/modules/social-posting/types/social-post.types';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { ENVConfigService } from '@/common/config/env.config';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { NotificationService } from '@/api/modules/notification/services/notification.service';

@Injectable()
export class SocialPostingService {
  constructor(
    private readonly socialAccountRepository: SocialAccountRepository,
    private readonly socialDestinationRepository: SocialDestinationRepository,
    private readonly socialOAuthSessionRepository: SocialOAuthSessionRepository,
    private readonly propertySocialPostRepository: PropertySocialPostRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly metaGraphService: MetaGraphService,
    private readonly linkedinService: LinkedInService,
    private readonly tiktokService: TikTokService,
    private readonly tokenCryptoService: SocialTokenCryptoService,
    private readonly userAccountService: UserAccountService,
    private readonly nodeMailerService: NodeMailerService,
    private readonly envConfigService: ENVConfigService,
    private readonly appwriteService: AppwriteService,
    private readonly propertyActivityRepository: PropertyActivityRepository,
    private readonly notificationService: NotificationService,
    @InjectQueue(SOCIAL_POST_QUEUE) private readonly socialPostQueue: Queue,
  ) {}

  async startSocialConnect(
    userId: number,
    input: StartSocialConnectDto,
  ): Promise<{ requestId: number; authorizationUrl: string }> {
    this.assertUserId(userId);
    if (!SOCIAL_PLATFORMS.includes(input.platform)) {
      throw new BadRequestException('Unsupported social platform');
    }
    const rawState = randomBytes(32).toString('hex');
    const expiresAt = new Date(
      Date.now() + this.getOAuthStateTTLSeconds() * 1000,
    );
    const session = await this.socialOAuthSessionRepository.createPending({
      userId,
      platform: input.platform,
      stateHash: this.hashOAuthState(rawState),
      expiresAt,
    });
    let authorizationUrl = '';
    if (input.platform === 'facebook' || input.platform === 'instagram') {
      if (!this.envConfigService.getSafe('META_APP_ID')) {
        throw new BadRequestException('Facebook/Instagram integration is not configured.');
      }
      authorizationUrl = this.metaGraphService.getAuthorizationUrl(
        input.platform,
        rawState,
      );
    } else if (input.platform === 'linkedin') {
      if (!this.envConfigService.getSafe('LINKEDIN_CLIENT_ID')) {
        throw new BadRequestException('LinkedIn integration is not configured.');
      }
      authorizationUrl = this.linkedinService.getAuthorizationUrl(rawState);
    } else if (input.platform === 'tiktok') {
      if (!this.envConfigService.getSafe('TIKTOK_CLIENT_KEY')) {
        throw new BadRequestException('TikTok integration is not configured.');
      }
      authorizationUrl = this.tiktokService.getAuthorizationUrl(rawState);
    }

    return {
      requestId: session.id,
      authorizationUrl,
    };
  }

  async completeMetaConnectFromCallback(input: {
    code?: string;
    state?: string;
    providerError?: string;
    providerErrorDescription?: string;
  }): Promise<{ redirectUrl: string }> {
    const errorUrl = this.getConnectErrorUrl();
    const successUrl = this.getConnectSuccessUrl();
    if (input.providerError) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: input.providerErrorDescription || input.providerError,
        }),
      };
    }
    if (!input.code || !input.state) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Missing code or state',
        }),
      };
    }

    const session =
      await this.socialOAuthSessionRepository.consumePendingByStateHash(
        this.hashOAuthState(input.state),
        new Date(),
      );
    if (!session) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Invalid or expired OAuth state',
        }),
      };
    }

    try {
      const connection = await this.metaGraphService.connectWithCode(
        input.code,
      );
      await this.syncMetaConnection(session.user_id, connection);
      await this.socialOAuthSessionRepository.markSuccess(session.id);
      return {
        redirectUrl: this.withQuery(successUrl, { platform: session.platform }),
      };
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'Meta connection failed';
      await this.socialOAuthSessionRepository.markFailed(session.id, reason);
      return { redirectUrl: this.withQuery(errorUrl, { reason }) };
    }
  }

  async completeLinkedInConnectFromCallback(input: {
    code?: string;
    state?: string;
    providerError?: string;
    providerErrorDescription?: string;
  }): Promise<{ redirectUrl: string }> {
    const errorUrl = this.getConnectErrorUrl();
    const successUrl = this.getConnectSuccessUrl();
    if (input.providerError) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: input.providerErrorDescription || input.providerError,
        }),
      };
    }
    if (!input.code || !input.state) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Missing code or state',
        }),
      };
    }

    const session =
      await this.socialOAuthSessionRepository.consumePendingByStateHash(
        this.hashOAuthState(input.state),
        new Date(),
      );
    if (!session) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Invalid or expired OAuth state',
        }),
      };
    }

    try {
      const connection = await this.linkedinService.connectWithCode(input.code);
      await this.syncLinkedInConnection(session.user_id, connection);
      await this.socialOAuthSessionRepository.markSuccess(session.id);
      return {
        redirectUrl: this.withQuery(successUrl, { platform: session.platform }),
      };
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'LinkedIn connection failed';
      await this.socialOAuthSessionRepository.markFailed(session.id, reason);
      return { redirectUrl: this.withQuery(errorUrl, { reason }) };
    }
  }

  async completeTikTokConnectFromCallback(input: {
    code?: string;
    state?: string;
    providerError?: string;
    providerErrorDescription?: string;
  }): Promise<{ redirectUrl: string }> {
    const errorUrl = this.getConnectErrorUrl();
    const successUrl = this.getConnectSuccessUrl();
    if (input.providerError) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: input.providerErrorDescription || input.providerError,
        }),
      };
    }
    if (!input.code || !input.state) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Missing code or state',
        }),
      };
    }

    const session =
      await this.socialOAuthSessionRepository.consumePendingByStateHash(
        this.hashOAuthState(input.state),
        new Date(),
      );
    if (!session) {
      return {
        redirectUrl: this.withQuery(errorUrl, {
          reason: 'Invalid or expired OAuth state',
        }),
      };
    }

    try {
      const connection = await this.tiktokService.connectWithCode(input.code);
      await this.syncTikTokConnection(session.user_id, connection);
      await this.socialOAuthSessionRepository.markSuccess(session.id);
      return {
        redirectUrl: this.withQuery(successUrl, { platform: session.platform }),
      };
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'TikTok connection failed';
      await this.socialOAuthSessionRepository.markFailed(session.id, reason);
      return { redirectUrl: this.withQuery(errorUrl, { reason }) };
    }
  }

  async connectMeta(
    userId: number,
    input: ConnectMetaDto,
  ): Promise<{
    socialAccountId: number;
    destinations: Array<{ id: number; platform: string; name: string }>;
  }> {
    this.assertUserId(userId);
    const connection = await this.metaGraphService.connectWithCode(
      input.code,
      input.redirectUri,
    );
    return this.syncMetaConnection(userId, connection);
  }

  async listDestinations(userId: number): Promise<
    Array<{
      id: number;
      platform: string;
      destinationId: string;
      destinationName: string;
      isDefault: boolean;
    }>
  > {
    this.assertUserId(userId);
    const accounts = await this.socialAccountRepository.listByUser(userId);
    const ids = accounts.map((item) => item.id);
    const destinations =
      await this.socialDestinationRepository.listByUserSocialAccountIds(ids);
    return destinations.map((item) => ({
      id: item.id,
      platform: item.platform,
      destinationId: item.destination_id,
      destinationName: item.destination_name,
      isDefault: item.is_default,
    }));
  }

  async createSocialPost(
    userId: number,
    propertyId: number,
    body: CreateSocialPostDto,
  ): Promise<{ postId: number; queuedTargets: number }> {
    this.assertUserId(userId);
    const property = await this.propertyRepository.findByIdAndAgent(
      propertyId,
      userId,
    );
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (
      !Array.isArray(property.property_media) ||
      property.property_media.length === 0
    ) {
      throw new BadRequestException(
        'Property must have at least one media item before social posting',
      );
    }

    const accounts = await this.socialAccountRepository.listByUser(userId);
    const accountIds = accounts.map((item) => item.id);

    const targets = await Promise.all(
      body.targets.map((target) =>
        this.validateAndResolveTarget(target, accountIds, body.mode),
      ),
    );

    const post = await this.propertySocialPostRepository.createPost({
      propertyId,
      agentUserId: userId,
      caption: body.caption.trim(),
      mode: body.mode,
      status: body.mode === 'post_now' ? 'queued' : 'scheduled',
    });
    const createdTargets =
      await this.propertySocialPostRepository.createTargets(
        targets.map((target) => ({
          propertySocialPostId: post.id,
          platform: target.platform,
          socialDestinationId: target.destination.id,
          scheduledFor: target.scheduledFor,
          status:
            target.destination.id === null
              ? 'failed'
              : body.mode === 'post_now'
              ? 'queued'
              : 'scheduled',
          errorMessage:
            target.destination.id === null
              ? 'Connect at least one social account first'
              : null,
        })),
      );

    await this.propertyRepository.activatePropertyIfDraft(propertyId);

    for (const target of createdTargets) {
      if (target.status === 'failed') continue;
      const payload: SocialPostJobPayload = {
        targetId: target.id,
        userId,
        propertyId,
      };
      const delayMs = target.scheduled_for
        ? Math.max(target.scheduled_for.getTime() - Date.now(), 0)
        : 0;
      await this.socialPostQueue.add(SOCIAL_POST_JOB, payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 30_000 },
        removeOnComplete: 500,
        removeOnFail: 1000,
        delay: delayMs,
        jobId: this.getQueueJobId(target.id),
      });
    }

    await this.propertyActivityRepository.logActivity({
      property_id: propertyId,
      actor_id: userId,
      event: 'Social Post Created',
      description: `Social media post created for ${body.targets
        .map((t) => t.platform)
        .join(', ')}`,
      metadata: { postId: post.id, mode: body.mode },
    });

    return { postId: post.id, queuedTargets: createdTargets.length };
  }

  async updateSocialPostStatus(
    userId: number,
    socialPostId: number,
    body: UpdateSocialPostStatusDto,
  ): Promise<{ postId: number; status: string; clearedJobs: number }> {
    this.assertUserId(userId);
    const post = await this.propertySocialPostRepository.findPostByIdAndAgent(
      socialPostId,
      userId,
    );
    if (!post) {
      throw new NotFoundException('Social post not found');
    }
    const targets =
      await this.propertySocialPostRepository.listTargetsByPostIds([post.id]);
    let clearedJobs = 0;
    for (const target of targets) {
      const job = await this.socialPostQueue.getJob(
        this.getQueueJobId(target.id),
      );
      if (job) {
        await job.remove();
        clearedJobs += 1;
      }
    }

    const errorMessage =
      body.status === 'failed'
        ? 'Manually marked as failed by operator'
        : 'Manually cancelled by operator';
    await this.propertySocialPostRepository.markTargetsStatusForPost(
      post.id,
      body.status,
      errorMessage,
    );
    await this.propertySocialPostRepository.markPostStatus(
      post.id,
      body.status,
    );

    return { postId: post.id, status: body.status, clearedJobs };
  }

  async listSocialPosts(
    userId: number,
    propertyId: number,
  ): Promise<
    Array<{
      id: number;
      caption: string;
      mode: string;
      status: string;
      targets: Array<{
        id: number;
        platform: string;
        scheduledFor: Date | null;
        status: string;
        errorMessage: string | null;
      }>;
    }>
  > {
    this.assertUserId(userId);
    const posts = await this.propertySocialPostRepository.listByProperty(
      propertyId,
      userId,
    );
    const targets =
      await this.propertySocialPostRepository.listTargetsByPostIds(
        posts.map((item) => item.id),
      );
    return posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      mode: post.mode,
      status: post.status,
      targets: targets
        .filter((target) => target.property_social_post_id === post.id)
        .map((target) => ({
          id: target.id,
          platform: target.platform,
          scheduledFor: target.scheduled_for,
          createdAt: target.created_at,
          status: target.status,
          errorMessage: target.error_message,
        })),
    }));
  }

  async processSocialPostTarget(targetId: number): Promise<void> {
    const target =
      await this.propertySocialPostRepository.findTargetById(targetId);
    if (!target) {
      return;
    }
    const post = await this.propertySocialPostRepository.findPostById(
      target.property_social_post_id,
    );
    if (!post) {
      return;
    }
    const destination = target.social_destination_id
      ? await this.socialDestinationRepository.findById(
          target.social_destination_id,
        )
      : null;
    if (!destination) {
      await this.propertySocialPostRepository.markTargetFailed(
        target.id,
        'Social destination not found',
      );
      return;
    }
    await this.propertySocialPostRepository.markTargetProcessing(target.id);
    const property = await this.propertyRepository.findById(post.property_id);
    if (!property) {
      await this.propertySocialPostRepository.markTargetFailed(
        target.id,
        'Property not found',
      );
      return;
    }

    try {

      const mediaItems = Array.isArray(property.property_media)
        ? property.property_media.slice(0, 10)
        : [];

      const imageUrls: string[] = [];
      for (const item of mediaItems) {
        const url = await this.appwriteService.getSignedURL(item.originalKey);
        if (url) imageUrls.push(url);
      }

      const decryptedToken = this.tokenCryptoService.decrypt(
        destination.destination_access_token_encrypted,
      );
      let externalPostId = '';
      if (target.platform === 'facebook' || target.platform === 'instagram') {
        if (target.platform === 'facebook') {
          const published = await this.metaGraphService.publishToFacebookPage(
            destination.destination_id,
            decryptedToken,
            post.caption,
            imageUrls,
          );
          externalPostId = published.postId;
        } else {
          const published = await this.metaGraphService.publishToInstagramBusiness(
            destination.destination_id,
            decryptedToken,
            post.caption,
            imageUrls,
          );
          externalPostId = published.postId;
        }
      } else if (target.platform === 'linkedin') {
        const published = await this.linkedinService.publishPost(
          decryptedToken,
          destination.destination_id,
          post.caption,
          imageUrls,
        );
        externalPostId = published.postId;
      } else if (target.platform === 'tiktok') {
        // Find the video (mp4) in media items
        const videoItem = property.property_media.find(item => item.originalKey.toLowerCase().endsWith('.mp4'));
        if (!videoItem) {
          throw new BadRequestException('TikTok requires a video. Please generate a video for this property first.');
        }
        const videoUrl = await this.appwriteService.getSignedURL(videoItem.originalKey);
        if (!videoUrl) {
          throw new InternalServerErrorException('Failed to generate signed URL for TikTok video');
        }

        const published = await this.tiktokService.publishVideo(
          decryptedToken,
          destination.destination_id,
          post.caption,
          videoUrl,
        );
        externalPostId = published.postId;
      } else {
        throw new BadRequestException('Unsupported social platform');
      }
      await this.propertySocialPostRepository.markTargetPosted(
        target.id,
        externalPostId,
      );
      await this.refreshPostStatusFromTargets(post.id);

      // Notify success
      await this.notificationService.createNotification(post.agent_user_id, {
        type: 'SOCIAL_POST_SUCCESS',
        title: 'Social Post Published',
        message: `Your ${target.platform} post for "${property.property_title}" has been successfully published.`,
        metadata: {
            propertyId: property.id,
            platform: target.platform,
            postId: post.id
        }
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to publish social post';
      await this.propertySocialPostRepository.markTargetFailed(
        target.id,
        message,
      );
      await this.refreshPostStatusFromTargets(post.id);

      // Notify failure
      await this.notificationService.createNotification(post.agent_user_id, {
        type: 'SOCIAL_POST_FAILURE',
        title: 'Social Post Failed',
        message: `Your ${target.platform} post for "${property.property_title}" failed to publish. Error: ${message}`,
        metadata: {
          propertyId: post.property_id,
          platform: target.platform,
          postId: post.id,
          error: message,
        },
      });

      if (/token|OAuth|expired|invalid/i.test(message)) {
        await this.socialAccountRepository.markTokenIssue(
          destination.social_account_id,
          message,
        );
      }
      throw error;
    }
  }

  private async validateAndResolveTarget(
    target: CreateSocialPostTargetDto,
    socialAccountIds: number[],
    mode: string,
  ): Promise<{
    platform: string;
    destination: { id: number | null };
    scheduledFor: Date | null;
  }> {
    const destination =
      socialAccountIds.length > 0 && target.socialDestinationId
        ? await this.socialDestinationRepository.findByIdForAccounts(
            target.socialDestinationId,
            socialAccountIds,
          )
        : null;

    if (!destination) {
      return {
        platform: target.platform,
        destination: { id: null },
        scheduledFor:
          mode === 'schedule' && target.scheduledFor
            ? new Date(target.scheduledFor)
            : null,
      };
    }

    if (destination.platform !== target.platform) {
      throw new BadRequestException(
        'Platform and destination mismatch for selected target',
      );
    }
    const scheduledFor = target.scheduledFor
      ? new Date(target.scheduledFor)
      : null;
    if (mode === 'schedule') {
      if (!scheduledFor || Number.isNaN(scheduledFor.getTime())) {
        throw new BadRequestException(
          'scheduledFor is required for schedule mode',
        );
      }
      if (scheduledFor.getTime() <= Date.now()) {
        throw new BadRequestException('scheduledFor must be a future time');
      }
    }
    return {
      platform: target.platform,
      destination: { id: destination.id },
      scheduledFor,
    };
  }

  private async notifyPostFailure(
    userId: number,
    propertyId: number,
    caption: string,
    target: {
      targetId: number;
      platform: string;
      scheduledFor: Date | null;
      errorMessage: string;
    },
  ): Promise<void> {
    const user = await this.userAccountService.findById(userId);
    if (!user?.email) {
      return;
    }
    const property = await this.propertyRepository.findById(propertyId);
    await this.nodeMailerService.sendEmail(
      user.email,
      'social-post-failure',
      'Social Post Failed - Action Required',
      {
        userName: user.name,
        propertyId,
        propertyTitle: property?.property_title || 'N/A',
        propertyAddress: property
          ? `${property.street_address}, ${property.city}`
          : 'N/A',
        caption,
        platform: target.platform,
        targetId: target.targetId,
        scheduledFor: target.scheduledFor?.toISOString() || 'immediate',
        errorMessage: target.errorMessage,
      },
    );
  }

  private assertUserId(userId: number): void {
    if (!userId || Number.isNaN(userId)) {
      throw new BadRequestException('Invalid user id in token');
    }
  }

  private getQueueJobId(targetId: number): string {
    return `social-target-${targetId}`;
  }

  private async refreshPostStatusFromTargets(postId: number): Promise<void> {
    const targets =
      await this.propertySocialPostRepository.listTargetsByPostIds([postId]);
    if (!targets.length) {
      return;
    }

    const statuses = targets.map((target) => target.status);
    const has = (status: string): boolean => statuses.includes(status);
    const all = (status: string): boolean =>
      statuses.every((s) => s === status);

    let nextStatus = 'queued';
    if (all('cancelled')) {
      nextStatus = 'cancelled';
    } else if (all('posted')) {
      nextStatus = 'posted';
    } else if (has('processing')) {
      nextStatus = 'processing';
    } else if (has('queued')) {
      nextStatus = 'queued';
    } else if (has('scheduled')) {
      nextStatus = 'scheduled';
    } else if (has('failed') && has('posted')) {
      nextStatus = 'partial_failed';
    } else if (has('failed')) {
      nextStatus = 'failed';
    } else if (has('posted')) {
      nextStatus = 'partial_posted';
    }

    await this.propertySocialPostRepository.markPostStatus(postId, nextStatus);
  }

  private async syncLinkedInConnection(
    userId: number,
    connection: {
      platformUserId: string;
      displayName: string;
      accessToken: string;
      expiresAt: Date | null;
      scopes: string[];
      destinations: Array<{ id: string; name: string; platform: string }>;
    },
  ): Promise<{
    socialAccountId: number;
    destinations: Array<{ id: number; platform: string; name: string }>;
  }> {
    const account = await this.socialAccountRepository.upsert({
      userId,
      platform: 'linkedin',
      platformUserId: connection.platformUserId,
      displayName: connection.displayName,
      encryptedAccessToken: this.tokenCryptoService.encrypt(
        connection.accessToken,
      ),
      tokenExpiresAt: connection.expiresAt,
      scopes: connection.scopes,
    });

    const destinations = await this.socialDestinationRepository.upsertMany(
      connection.destinations.map((dest, idx) => ({
        socialAccountId: account.id,
        platform: 'linkedin',
        destinationId: dest.id,
        destinationName: dest.name,
        encryptedDestinationToken: this.tokenCryptoService.encrypt(
          connection.accessToken,
        ),
        isDefault: idx === 0,
      })),
    );

    return {
      socialAccountId: account.id,
      destinations: destinations.map((item) => ({
        id: item.id,
        platform: item.platform,
        name: item.destination_name,
      })),
    };
  }

  private async syncTikTokConnection(
    userId: number,
    connection: {
      platformUserId: string;
      displayName: string;
      accessToken: string;
      expiresAt: Date | null;
      scopes: string[];
      destinations: Array<{ id: string; name: string; platform: string }>;
    },
  ): Promise<{
    socialAccountId: number;
    destinations: Array<{ id: number; platform: string; name: string }>;
  }> {
    const account = await this.socialAccountRepository.upsert({
      userId,
      platform: 'tiktok',
      platformUserId: connection.platformUserId,
      displayName: connection.displayName,
      encryptedAccessToken: this.tokenCryptoService.encrypt(
        connection.accessToken,
      ),
      tokenExpiresAt: connection.expiresAt,
      scopes: connection.scopes,
    });

    const destinations = await this.socialDestinationRepository.upsertMany(
      connection.destinations.map((dest, idx) => ({
        socialAccountId: account.id,
        platform: 'tiktok',
        destinationId: dest.id,
        destinationName: dest.name,
        encryptedDestinationToken: this.tokenCryptoService.encrypt(
          connection.accessToken,
        ),
        isDefault: idx === 0,
      })),
    );

    return {
      socialAccountId: account.id,
      destinations: destinations.map((item) => ({
        id: item.id,
        platform: item.platform,
        name: item.destination_name,
      })),
    };
  }

  private async syncMetaConnection(
    userId: number,
    connection: {
      platformUserId: string;
      displayName: string;
      accessToken: string;
      expiresAt: Date | null;
      scopes: string[];
      pages: Array<{ id: string; name: string; access_token: string }>;
      instagramAccounts: Array<{
        id: string;
        name: string;
        accessToken: string;
      }>;
    },
  ): Promise<{
    socialAccountId: number;
    destinations: Array<{ id: number; platform: string; name: string }>;
  }> {
    const account = await this.socialAccountRepository.upsert({
      userId,
      platform: 'facebook',
      platformUserId: connection.platformUserId,
      displayName: connection.displayName,
      encryptedAccessToken: this.tokenCryptoService.encrypt(
        connection.accessToken,
      ),
      tokenExpiresAt: connection.expiresAt,
      scopes: connection.scopes,
    });

    const destinations = await this.socialDestinationRepository.upsertMany([
      ...connection.pages.map((page, idx) => ({
        socialAccountId: account.id,
        platform: 'facebook',
        destinationId: page.id,
        destinationName: page.name,
        encryptedDestinationToken: this.tokenCryptoService.encrypt(
          page.access_token,
        ),
        isDefault: idx === 0,
      })),
      ...connection.instagramAccounts.map((ig, idx) => ({
        socialAccountId: account.id,
        platform: 'instagram',
        destinationId: ig.id,
        destinationName: ig.name,
        encryptedDestinationToken: this.tokenCryptoService.encrypt(
          ig.accessToken,
        ),
        isDefault: idx === 0 && connection.pages.length === 0,
      })),
    ]);

    return {
      socialAccountId: account.id,
      destinations: destinations.map((item) => ({
        id: item.id,
        platform: item.platform,
        name: item.destination_name,
      })),
    };
  }

  private hashOAuthState(rawState: string): string {
    return createHash('sha256').update(rawState).digest('hex');
  }

  private getOAuthStateTTLSeconds(): number {
    const configured = process.env.SOCIAL_OAUTH_STATE_TTL_SECONDS;
    const parsed = configured ? Number(configured) : Number.NaN;
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 600;
    }
    return parsed;
  }

  private getConnectSuccessUrl(): string {
    return this.envConfigService.get<string>('SOCIAL_CONNECT_SUCCESS_URL');
  }

  private getConnectErrorUrl(): string {
    return this.envConfigService.get<string>('SOCIAL_CONNECT_ERROR_URL');
  }

  async disconnectDestination(
    userId: number,
    destinationId: number,
  ): Promise<void> {
    const accounts = await this.socialAccountRepository.listByUser(userId);
    const accountIds = accounts.map((a) => a.id);
    const destination =
      await this.socialDestinationRepository.findByIdForAccounts(
        destinationId,
        accountIds,
      );

    if (!destination) {
      throw new NotFoundException('Social destination not found');
    }

    await this.socialDestinationRepository.delete(destinationId);
  }

  async disconnectPlatform(userId: number, platform: string): Promise<void> {
    const accounts = await this.socialAccountRepository.listByUser(userId);
    const accountIds = accounts.map((a) => a.id);
    await this.socialDestinationRepository.deleteByPlatform(
      accountIds,
      platform,
    );
  }

  private withQuery(base: string, query: Record<string, string>): string {
    const url = new URL(base);
    for (const [key, value] of Object.entries(query)) {
      if (value.trim()) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }
}
