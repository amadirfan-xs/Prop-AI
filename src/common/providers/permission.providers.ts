import { DataSource } from 'typeorm';
import {
  DATA_SOURCE,
  PERMISSION_GROUP_REPOSITORY,
  PERMISSION_REPOSITORY,
  USER_PERMISSION_REPOSITORY,
  USER_TYPE_PERMISSION_REPOSITORY,
} from '@/common/enums/repositories';
import { PermissionGroupEntity } from '@/common/entities/permission-group/permission-group.entity';
import { PermissionEntity } from '@/common/entities/permission/permission.entity';
import { UserPermissionEntity } from '@/common/entities/user-permission/user-permission.entity';
import { UserTypePermissionEntity } from '@/common/entities/user-type-permission/user-type-permission.entity';

export const permissionProviders = [
  {
    provide: PERMISSION_GROUP_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PermissionGroupEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: PERMISSION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PermissionEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_PERMISSION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserPermissionEntity),
    inject: [DATA_SOURCE],
  },
  {
    provide: USER_TYPE_PERMISSION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserTypePermissionEntity),
    inject: [DATA_SOURCE],
  },
];
