import { DataSource } from 'typeorm';
import { PermissionGroupEntity } from '@/common/entities/permission-group/permission-group.entity';
import { PermissionEntity } from '@/common/entities/permission/permission.entity';
import { PropertyEntity } from '@/common/entities/property/property.entity';
import { PropertyPurchaseContractEntity } from '@/common/entities/property-purchase-contract/property-purchase-contract.entity';
import { PropertyStakeholderEntity } from '@/common/entities/property-stakeholder/property-stakeholder.entity';
import { PropertySocialPostEntity } from '@/common/entities/property-social-post/property-social-post.entity';
import { PropertySocialPostTargetEntity } from '@/common/entities/property-social-post-target/property-social-post-target.entity';
import { SocialAccountEntity } from '@/common/entities/social-account/social-account.entity';
import { SocialDestinationEntity } from '@/common/entities/social-destination/social-destination.entity';
import { SocialOauthSessionEntity } from '@/common/entities/social-oauth-session/social-oauth-session.entity';
import { UserEntity } from '@/common/entities/user/user.entity';
import { UserTypeEntity } from '@/common/entities/user-type/user-type.entity';
import { UserPermissionEntity } from '@/common/entities/user-permission/user-permission.entity';
import { UserTypePermissionEntity } from '@/common/entities/user-type-permission/user-type-permission.entity';
import { UserRoleEntity } from '@/common/entities/user-role/user-role.entity';
import { PropertyActivityEntity } from '@/common/entities/property-activity/property-activity.entity';
import { PropertyPurchaseContractTemplateEntity } from '@/common/entities/property-purchase-contract-template/property-purchase-contract-template.entity';
import { PropertyPurchaseContractDecisionEntity } from '@/common/entities/property-purchase-contract-decision/property-purchase-contract-decision.entity';
import { UserEmailConfigEntity } from '@/common/entities/email-config/user-email-config.entity';
import { MarketingCampaignEntity } from '@/common/entities/marketing/marketing-campaign.entity';
import { MarketingTemplateEntity } from '@/common/entities/marketing/marketing-template.entity';
import { PricingPackageEntity } from '@/common/entities/pricing/pricing-package.entity';
import { UserSubscriptionEntity } from '@/common/entities/user/user-subscription.entity';
import { PropertyQrScanEntity } from '@/common/entities/property/property-qr-scan.entity';
import { PropertyInquiryEntity } from '@/common/entities/property/property-inquiry.entity';
import { NotificationEntity } from '@/api/modules/notification/entities/notification.entity';
import { DATA_SOURCE, MARKETING_CAMPAIGN_REPOSITORY, MARKETING_TEMPLATE_REPOSITORY } from '@/common/enums/repositories';
import { OrganizationEntity } from '@/common/entities/organization/organization.entity';
import { PaymentEntity } from '@/common/entities/pricing/payment.entity';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dbHost = process.env.POSTGRES_HOST ?? process.env.DB_HOST;
      const dbPort = Number(
        process.env.POSTGRES_PORT ?? process.env.DB_PORT ?? 5432,
      );
      const dbUser = process.env.POSTGRES_USER ?? process.env.DB_USERNAME;
      const dbPassword =
        process.env.POSTGRES_PASSWORD ?? process.env.DB_PASSWORD;
      const dbName = process.env.POSTGRES_DB ?? process.env.DB_NAME;

      const dataSource = new DataSource({
        type: 'postgres',
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPassword,
        database: dbName,
        entities: [
          PermissionEntity,
          PermissionGroupEntity,
          PropertyEntity,
          PropertyPurchaseContractEntity,
          PropertyStakeholderEntity,
          PropertySocialPostEntity,
          PropertySocialPostTargetEntity,
          SocialAccountEntity,
          SocialDestinationEntity,
          SocialOauthSessionEntity,
          UserEntity,
          UserRoleEntity,
          UserTypeEntity,
          UserPermissionEntity,
          UserTypePermissionEntity,
          PropertyActivityEntity,
          PropertyPurchaseContractTemplateEntity,
          PropertyPurchaseContractDecisionEntity,
          UserEmailConfigEntity,
          MarketingCampaignEntity,
          MarketingTemplateEntity,
          PricingPackageEntity,
          UserSubscriptionEntity,
          PropertyQrScanEntity,
          PropertyInquiryEntity,
          OrganizationEntity,
          PaymentEntity,
          NotificationEntity,
        ],
      });

      return dataSource.isInitialized ? dataSource : dataSource.initialize();
    },
  },
  {
    provide: MARKETING_CAMPAIGN_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MarketingCampaignEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: MARKETING_TEMPLATE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MarketingTemplateEntity),
    inject: [DATA_SOURCE],
  },
];
