import { DataSource } from 'typeorm';
import { UserEntity } from '@/common/entities/user/user.entity';
import { UserRoleEntity } from '@/common/entities/user-role/user-role.entity';
import {
  USER_REPOSITORY,
  USER_ROLE_REPOSITORY,
  DATA_SOURCE,
} from '@/common/enums/repositories';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_ROLE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserRoleEntity),
    inject: [DATA_SOURCE],
  },
];
