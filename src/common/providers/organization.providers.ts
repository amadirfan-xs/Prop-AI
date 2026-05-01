import { DataSource } from 'typeorm';
import { OrganizationEntity } from '@/common/entities/organization/organization.entity';
import {
  ORGANIZATION_REPOSITORY,
  DATA_SOURCE,
} from '@/common/enums/repositories';

export const organizationProviders = [
  {
    provide: ORGANIZATION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OrganizationEntity),
    inject: [DATA_SOURCE],
  },
];
