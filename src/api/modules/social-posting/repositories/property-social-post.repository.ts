import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertySocialPostEntity } from '@/common/entities/property-social-post/property-social-post.entity';
import { PropertySocialPostTargetEntity } from '@/common/entities/property-social-post-target/property-social-post-target.entity';
import {
  PROPERTY_SOCIAL_POST_REPOSITORY,
  PROPERTY_SOCIAL_POST_TARGET_REPOSITORY,
} from '@/common/enums/repositories';

type CreatePropertySocialPostInput = {
  propertyId: number;
  agentUserId: number;
  caption: string;
  mode: string;
  status: string;
};

type CreatePropertySocialPostTargetInput = {
  propertySocialPostId: number;
  platform: string;
  socialDestinationId: number | null;
  scheduledFor: Date | null;
  status: string;
  errorMessage?: string | null;
};

@Injectable()
export class PropertySocialPostRepository {
  constructor(
    @Inject(PROPERTY_SOCIAL_POST_REPOSITORY)
    private readonly postRepository: Repository<PropertySocialPostEntity>,
    @Inject(PROPERTY_SOCIAL_POST_TARGET_REPOSITORY)
    private readonly targetRepository: Repository<PropertySocialPostTargetEntity>,
  ) {}

  createPost(
    input: CreatePropertySocialPostInput,
  ): Promise<PropertySocialPostEntity> {
    return this.postRepository.save({
      property_id: input.propertyId,
      agent_user_id: input.agentUserId,
      caption: input.caption,
      mode: input.mode,
      status: input.status,
    });
  }

  createTargets(
    inputs: CreatePropertySocialPostTargetInput[],
  ): Promise<PropertySocialPostTargetEntity[]> {
    return this.targetRepository.save(
      inputs.map((item) => ({
        property_social_post_id: item.propertySocialPostId,
        platform: item.platform,
        social_destination_id: item.socialDestinationId,
        scheduled_for: item.scheduledFor,
        status: item.status,
        error_message: item.errorMessage,
      })),
    );
  }

  listByProperty(
    propertyId: number,
    agentUserId: number,
  ): Promise<PropertySocialPostEntity[]> {
    return this.postRepository.find({
      where: { property_id: propertyId, agent_user_id: agentUserId },
      order: { id: 'DESC' },
    });
  }

  listTargetsByPostIds(
    postIds: number[],
  ): Promise<PropertySocialPostTargetEntity[]> {
    if (!postIds.length) {
      return Promise.resolve([]);
    }
    return this.targetRepository.find({
      where: postIds.map((id) => ({ property_social_post_id: id })),
      order: { id: 'ASC' },
    });
  }

  findTargetById(
    targetId: number,
  ): Promise<PropertySocialPostTargetEntity | null> {
    return this.targetRepository.findOne({ where: { id: targetId } });
  }

  findPostById(postId: number): Promise<PropertySocialPostEntity | null> {
    return this.postRepository.findOne({ where: { id: postId } });
  }

  findPostByIdAndAgent(
    postId: number,
    agentUserId: number,
  ): Promise<PropertySocialPostEntity | null> {
    return this.postRepository.findOne({
      where: { id: postId, agent_user_id: agentUserId },
    });
  }

  async markTargetProcessing(targetId: number): Promise<void> {
    await this.targetRepository.update(
      { id: targetId },
      { status: 'processing', last_attempt_at: new Date() },
    );
  }

  async markTargetPosted(
    targetId: number,
    externalPostId: string,
  ): Promise<void> {
    await this.targetRepository.update(
      { id: targetId },
      {
        status: 'posted',
        external_post_id: externalPostId,
        error_message: null,
      },
    );
  }

  async markTargetFailed(
    targetId: number,
    errorMessage: string,
  ): Promise<void> {
    const target = await this.findTargetById(targetId);
    const nextRetry = target ? target.retry_count + 1 : 1;
    await this.targetRepository.update(
      { id: targetId },
      {
        status: 'failed',
        error_message: errorMessage,
        retry_count: nextRetry,
        last_attempt_at: new Date(),
      },
    );
  }

  async markPostStatus(postId: number, status: string): Promise<void> {
    await this.postRepository.update({ id: postId }, { status });
  }

  async markTargetsStatusForPost(
    postId: number,
    status: string,
    errorMessage: string | null,
  ): Promise<void> {
    await this.targetRepository.update(
      { property_social_post_id: postId },
      { status, error_message: errorMessage, last_attempt_at: new Date() },
    );
  }
}
