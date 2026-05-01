import { DataSource } from 'typeorm';
import { PropertySocialPostEntity } from '@/common/entities/property-social-post/property-social-post.entity';
import { PropertySocialPostTargetEntity } from '@/common/entities/property-social-post-target/property-social-post-target.entity';
import { SocialAccountEntity } from '@/common/entities/social-account/social-account.entity';
import { SocialDestinationEntity } from '@/common/entities/social-destination/social-destination.entity';
import { SocialOauthSessionEntity } from '@/common/entities/social-oauth-session/social-oauth-session.entity';
import {
  DATA_SOURCE,
  PROPERTY_SOCIAL_POST_REPOSITORY,
  PROPERTY_SOCIAL_POST_TARGET_REPOSITORY,
  SOCIAL_ACCOUNT_REPOSITORY,
  SOCIAL_DESTINATION_REPOSITORY,
  SOCIAL_OAUTH_SESSION_REPOSITORY,
} from '@/common/enums/repositories';

export const socialProviders = [
  {
    provide: SOCIAL_ACCOUNT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SocialAccountEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: SOCIAL_DESTINATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SocialDestinationEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: SOCIAL_OAUTH_SESSION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SocialOauthSessionEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_SOCIAL_POST_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertySocialPostEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_SOCIAL_POST_TARGET_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertySocialPostTargetEntity),
    inject: [DATA_SOURCE],
  },
];
