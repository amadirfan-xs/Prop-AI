import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

import { join } from 'path';
import { DataSource } from 'typeorm';
import { PermissionGroupEntity } from '../entities/permission-group/permission-group.entity';
import { PermissionEntity } from '../entities/permission/permission.entity';
import { PropertyEntity } from '../entities/property/property.entity';
import { PropertyStakeholderEntity } from '../entities/property-stakeholder/property-stakeholder.entity';
import { PropertySocialPostEntity } from '../entities/property-social-post/property-social-post.entity';
import { PropertySocialPostTargetEntity } from '../entities/property-social-post-target/property-social-post-target.entity';
import { SocialAccountEntity } from '../entities/social-account/social-account.entity';
import { SocialDestinationEntity } from '../entities/social-destination/social-destination.entity';
import { UserEntity } from '../entities/user/user.entity';
import { UserRoleEntity } from '../entities/user-role/user-role.entity';
import { UserTypeEntity } from '../entities/user-type/user-type.entity';
import { UserPermissionEntity } from '../entities/user-permission/user-permission.entity';
import { UserTypePermissionEntity } from '../entities/user-type-permission/user-type-permission.entity';
import { SocialOauthSessionEntity } from '../entities/social-oauth-session/social-oauth-session.entity';
import { PropertyPurchaseContractEntity } from '../entities/property-purchase-contract/property-purchase-contract.entity';
import { PropertyActivityEntity } from '../entities/property-activity/property-activity.entity';
import { PropertyPurchaseContractTemplateEntity } from '../entities/property-purchase-contract-template/property-purchase-contract-template.entity';
import { PropertyPurchaseContractDecisionEntity } from '../entities/property-purchase-contract-decision/property-purchase-contract-decision.entity';
import { UserEmailConfigEntity } from '../entities/email-config/user-email-config.entity';
import { MarketingCampaignEntity } from '../entities/marketing/marketing-campaign.entity';
import { MarketingTemplateEntity } from '../entities/marketing/marketing-template.entity';
import { PricingPackageEntity } from '../entities/pricing/pricing-package.entity';
import { UserSubscriptionEntity } from '../entities/user/user-subscription.entity';
import { PropertyQrScanEntity } from '../entities/property/property-qr-scan.entity';
import { PropertyInquiryEntity } from '../entities/property/property-inquiry.entity';
import { OrganizationEntity } from '../entities/organization/organization.entity';
import { PaymentEntity } from '../entities/pricing/payment.entity';

dotenvConfig();

const dbHost = process.env.POSTGRES_HOST ?? process.env.DB_HOST;
const dbPort = Number(process.env.POSTGRES_PORT ?? process.env.DB_PORT ?? 5432);
const dbUser = process.env.POSTGRES_USER ?? process.env.DB_USERNAME;
const dbPassword = process.env.POSTGRES_PASSWORD ?? process.env.DB_PASSWORD;
const dbName = process.env.POSTGRES_DB ?? process.env.DB_NAME;

export default new DataSource({
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
    PropertyStakeholderEntity,
    PropertySocialPostEntity,
    PropertySocialPostTargetEntity,
    SocialAccountEntity,
    SocialDestinationEntity,
    UserEntity,
    UserRoleEntity,
    UserTypeEntity,
    UserPermissionEntity,
    UserTypePermissionEntity,
    SocialOauthSessionEntity,
    PropertyPurchaseContractEntity,
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
  ],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
});
