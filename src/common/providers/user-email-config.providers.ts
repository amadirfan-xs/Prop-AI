import { DataSource } from 'typeorm';
import { UserEmailConfigEntity } from '@/common/entities/email-config/user-email-config.entity';
import { DATA_SOURCE, USER_EMAIL_CONFIG_REPOSITORY } from '@/common/enums/repositories';

export const userEmailConfigProviders = [
  {
    provide: USER_EMAIL_CONFIG_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEmailConfigEntity),
    inject: [DATA_SOURCE],
  },
];
