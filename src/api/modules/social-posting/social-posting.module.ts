import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { MailModule } from '@/api/modules/infrastructure/mail.module';
import { StorageModule } from '@/api/modules/infrastructure/storage.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { NotificationModule } from '@/api/modules/notification/notification.module';
import { SocialPostController } from '@/api/modules/social-posting/controllers/social-post.controller';
import { PropertySocialPostRepository } from '@/api/modules/social-posting/repositories/property-social-post.repository';
import { SocialAccountRepository } from '@/api/modules/social-posting/repositories/social-account.repository';
import { SocialDestinationRepository } from '@/api/modules/social-posting/repositories/social-destination.repository';
import { SocialOAuthSessionRepository } from '@/api/modules/social-posting/repositories/social-oauth-session.repository';
import { MetaGraphService } from '@/api/modules/social-posting/services/meta-graph.service';
import { LinkedInService } from '@/api/modules/social-posting/services/linkedin.service';
import { TikTokService } from '@/api/modules/social-posting/services/tiktok.service';
import { SocialPostProcessor } from '@/api/modules/social-posting/services/social-post.processor';
import { SocialPostingService } from '@/api/modules/social-posting/services/social-posting.service';
import { SocialTokenCryptoService } from '@/api/modules/social-posting/services/social-token-crypto.service';
import { SOCIAL_POST_QUEUE } from '@/api/modules/social-posting/types/social-queue.types';
import { UserModule } from '@/api/modules/user/user.module';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertyActivityRepository } from '@/api/modules/property/repositories/property-activity.repository';
import { propertyProviders } from '@/common/providers/property.providers';
import { socialProviders } from '@/common/providers/social.providers';

@Module({
  imports: [
    AuthModule,
    StorageModule,
    UserModule,
    MailModule,
    PermissionModule,
    NotificationModule,
    BullModule.registerQueue({ name: SOCIAL_POST_QUEUE }),
  ],
  controllers: [SocialPostController],
  providers: [
    ...propertyProviders,
    ...socialProviders,
    PropertyRepository,
    PropertyActivityRepository,
    PropertySocialPostRepository,
    SocialAccountRepository,
    SocialDestinationRepository,
    SocialOAuthSessionRepository,
    SocialPostingService,
    MetaGraphService,
    LinkedInService,
    TikTokService,
    SocialTokenCryptoService,
    SocialPostProcessor,
  ],
  exports: [SocialPostingService, PropertySocialPostRepository],
})
export class SocialPostingModule {}
