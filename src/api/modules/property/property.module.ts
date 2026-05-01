import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { MailModule } from '@/api/modules/infrastructure/mail.module';
import { StorageModule } from '@/api/modules/infrastructure/storage.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { PropertyController } from '@/api/modules/property/controllers/property.controller';
import { PropertyPurchaseContractRepository } from '@/api/modules/property/repositories/property-purchase-contract.repository';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertyStakeholderRepository } from '@/api/modules/property/repositories/property-stakeholder.repository';
import { PropertyActivityRepository } from '@/api/modules/property/repositories/property-activity.repository';
import { PropertyPurchaseContractTemplateRepository } from '@/api/modules/property/repositories/property-purchase-contract-template.repository';
import { PropertyPurchaseContractDecisionRepository } from '@/api/modules/property/repositories/property-purchase-contract-decision.repository';
import { PropertyService } from '@/api/modules/property/services/property.service';
import { PropertyQrScanRepository } from '@/api/modules/property/repositories/property-qr-scan.repository';
import { PropertyInquiryRepository } from '@/api/modules/property/repositories/property-inquiry.repository';
import { ContractGateway } from '@/api/modules/property/gateways/contract.gateway';
import { UserModule } from '@/api/modules/user/user.module';
import { SocialPostingModule } from '@/api/modules/social-posting/social-posting.module';
import { PricingModule } from '@/api/modules/pricing/pricing.module';
import { PublicPropertyController } from '@/api/modules/property/controllers/public-property.controller';
import { propertyProviders } from '@/common/providers/property.providers';
import { NotificationModule } from '@/api/modules/notification/notification.module';

@Module({
  imports: [
    StorageModule,
    AuthModule,
    PermissionModule,
    UserModule,
    MailModule,
    SocialPostingModule,
    PricingModule,
    NotificationModule,
  ],
  controllers: [PropertyController, PublicPropertyController],
  providers: [
    ...propertyProviders,
    PropertyRepository,
    PropertyPurchaseContractRepository,
    PropertyPurchaseContractTemplateRepository,
    PropertyPurchaseContractDecisionRepository,
    PropertyStakeholderRepository,
    PropertyActivityRepository,
    PropertyQrScanRepository,
    PropertyInquiryRepository,
    PropertyService,
    ContractGateway,
  ],
  exports: [PropertyService, ContractGateway, PropertyRepository],
})
export class PropertyModule {}
