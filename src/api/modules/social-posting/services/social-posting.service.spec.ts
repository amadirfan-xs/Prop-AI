import { Queue } from 'bullmq';
import { StartSocialConnectDto } from '@/api/modules/social-posting/dto/start-social-connect.dto';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertySocialPostRepository } from '@/api/modules/social-posting/repositories/property-social-post.repository';
import { SocialAccountRepository } from '@/api/modules/social-posting/repositories/social-account.repository';
import { SocialDestinationRepository } from '@/api/modules/social-posting/repositories/social-destination.repository';
import { SocialOAuthSessionRepository } from '@/api/modules/social-posting/repositories/social-oauth-session.repository';
import { MetaGraphService } from '@/api/modules/social-posting/services/meta-graph.service';
import { LinkedInService } from '@/api/modules/social-posting/services/linkedin.service';
import { TikTokService } from '@/api/modules/social-posting/services/tiktok.service';
import { SocialPostingService } from '@/api/modules/social-posting/services/social-posting.service';
import { SocialTokenCryptoService } from '@/api/modules/social-posting/services/social-token-crypto.service';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { ENVConfigService } from '@/common/config/env.config';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { PropertyActivityRepository } from '@/api/modules/property/repositories/property-activity.repository';

describe('SocialPostingService', () => {
  const socialAccountRepository = {
    upsert: jest.fn(),
    listByUser: jest.fn(),
    markTokenIssue: jest.fn(),
  };
  const socialDestinationRepository = {
    upsertMany: jest.fn(),
    listByUserSocialAccountIds: jest.fn(),
    findByIdForAccounts: jest.fn(),
    findById: jest.fn(),
  };
  const socialOAuthSessionRepository = {
    createPending: jest.fn(),
    consumePendingByStateHash: jest.fn(),
    markSuccess: jest.fn(),
    markFailed: jest.fn(),
  };
  const propertySocialPostRepository = {
    createPost: jest.fn(),
    createTargets: jest.fn(),
    findPostByIdAndAgent: jest.fn(),
    listTargetsByPostIds: jest.fn(),
    markTargetsStatusForPost: jest.fn(),
    markPostStatus: jest.fn(),
    listByProperty: jest.fn(),
    findTargetById: jest.fn(),
    findPostById: jest.fn(),
    markTargetFailed: jest.fn(),
    markTargetProcessing: jest.fn(),
    markTargetPosted: jest.fn(),
  };
  const propertyRepository = {
    findByIdAndAgent: jest.fn(),
    findById: jest.fn(),
    activatePropertyIfDraft: jest.fn(),
  };
  const metaGraphService = {
    getAuthorizationUrl: jest.fn(),
    connectWithCode: jest.fn(),
    publishToFacebookPage: jest.fn(),
    publishToInstagramBusiness: jest.fn(),
  };
  const linkedinService = {
    getAuthorizationUrl: jest.fn(),
    connectWithCode: jest.fn(),
    publishPost: jest.fn(),
  };
  const tiktokService = {
    getAuthorizationUrl: jest.fn(),
    connectWithCode: jest.fn(),
    publishVideo: jest.fn(),
  };
  const tokenCryptoService = {
    encrypt: jest.fn((value: string) => `enc-${value}`),
    decrypt: jest.fn(),
  };
  const userAccountService = {
    findById: jest.fn(),
  };
  const nodeMailerService = {
    sendEmail: jest.fn(),
  };
  const envConfigService = {
    get: jest.fn(),
    getSafe: jest.fn(),
  };
  const appwriteService = {
    getSignedURL: jest.fn(),
  };
  const propertyActivityRepository = {
    logActivity: jest.fn(),
  };
  const queue = {
    add: jest.fn(),
    getJob: jest.fn(),
  };

  let service: SocialPostingService;

  beforeEach(() => {
    jest.clearAllMocks();
    envConfigService.get.mockImplementation((key: string) => {
      if (key === 'SOCIAL_CONNECT_SUCCESS_URL') {
        return 'https://frontend.local/success';
      }
      if (key === 'SOCIAL_CONNECT_ERROR_URL') {
        return 'https://frontend.local/error';
      }
      return '';
    });
    envConfigService.getSafe.mockImplementation((key: string) => {
      if (key === 'META_APP_ID' || key === 'LINKEDIN_CLIENT_ID' || key === 'TIKTOK_CLIENT_KEY') {
        return 'mock-id';
      }
      return null;
    });

    service = new SocialPostingService(
      socialAccountRepository as any,
      socialDestinationRepository as any,
      socialOAuthSessionRepository as any,
      propertySocialPostRepository as any,
      propertyRepository as any,
      metaGraphService as any,
      linkedinService as any,
      tiktokService as any,
      tokenCryptoService as any,
      userAccountService as any,
      nodeMailerService as any,
      envConfigService as any,
      appwriteService as any,
      propertyActivityRepository as any,
      {} as any, 
      queue as any,
    );
  });

  it('starts social connect and returns authorization URL', async () => {
    const input: StartSocialConnectDto = { platform: 'facebook' };
    socialOAuthSessionRepository.createPending.mockResolvedValue({ id: 11 });
    metaGraphService.getAuthorizationUrl.mockReturnValue(
      'https://facebook.com/oauth',
    );

    const result = await service.startSocialConnect(7, input);

    expect(socialOAuthSessionRepository.createPending).toHaveBeenCalledTimes(1);
    expect(result.authorizationUrl).toBe('https://facebook.com/oauth');
  });
});
