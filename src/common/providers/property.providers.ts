import { DataSource } from 'typeorm';
import { PropertyEntity } from '@/common/entities/property/property.entity';
import { PropertyPurchaseContractEntity } from '@/common/entities/property-purchase-contract/property-purchase-contract.entity';
import { PropertyStakeholderEntity } from '@/common/entities/property-stakeholder/property-stakeholder.entity';
import { PropertyActivityEntity } from '@/common/entities/property-activity/property-activity.entity';
import { PropertyPurchaseContractTemplateEntity } from '@/common/entities/property-purchase-contract-template/property-purchase-contract-template.entity';
import { PropertyPurchaseContractDecisionEntity } from '@/common/entities/property-purchase-contract-decision/property-purchase-contract-decision.entity';
import { PropertyQrScanEntity } from '@/common/entities/property/property-qr-scan.entity';
import { PropertyInquiryEntity } from '@/common/entities/property/property-inquiry.entity';
import {
  DATA_SOURCE,
  PROPERTY_ACTIVITY_REPOSITORY,
  PROPERTY_PURCHASE_CONTRACT_DECISION_REPOSITORY,
  PROPERTY_PURCHASE_CONTRACT_REPOSITORY,
  PROPERTY_PURCHASE_CONTRACT_TEMPLATE_REPOSITORY,
  PROPERTY_REPOSITORY,
  PROPERTY_STAKEHOLDER_REPOSITORY,
  PROPERTY_QR_SCAN_REPOSITORY,
  PROPERTY_INQUIRY_REPOSITORY,
} from '@/common/enums/repositories';

export const propertyProviders = [
  {
    provide: PROPERTY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_PURCHASE_CONTRACT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyPurchaseContractEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_STAKEHOLDER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyStakeholderEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_ACTIVITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyActivityEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_PURCHASE_CONTRACT_TEMPLATE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyPurchaseContractTemplateEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_PURCHASE_CONTRACT_DECISION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyPurchaseContractDecisionEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_QR_SCAN_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyQrScanEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PROPERTY_INQUIRY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PropertyInquiryEntity),
    inject: [DATA_SOURCE],
  },
];
