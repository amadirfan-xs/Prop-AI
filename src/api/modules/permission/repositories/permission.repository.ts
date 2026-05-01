import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import {
  PERMISSION_GROUP_REPOSITORY,
  PERMISSION_REPOSITORY,
  USER_PERMISSION_REPOSITORY,
  USER_TYPE_PERMISSION_REPOSITORY,
} from '@/common/enums/repositories';
import { PermissionGroupEntity } from '@/common/entities/permission-group/permission-group.entity';
import { PermissionEntity } from '@/common/entities/permission/permission.entity';
import { UserPermissionEntity } from '@/common/entities/user-permission/user-permission.entity';
import { UserTypePermissionEntity } from '@/common/entities/user-type-permission/user-type-permission.entity';

type UpsertPermissionInput = {
  endpoint: string;
  method: string;
  name: string;
};

type PermissionContext = {
  endpoint: string;
  method: string;
  userId: number;
  userTypeIds: number[];
};

@Injectable()
export class PermissionRepository {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionEntityRepo: Repository<PermissionEntity>,
    @Inject(PERMISSION_GROUP_REPOSITORY)
    private readonly permissionGroupEntityRepo: Repository<PermissionGroupEntity>,
    @Inject(USER_PERMISSION_REPOSITORY)
    private readonly userPermissionEntityRepo: Repository<UserPermissionEntity>,
    @Inject(USER_TYPE_PERMISSION_REPOSITORY)
    private readonly userTypePermissionEntityRepo: Repository<UserTypePermissionEntity>,
  ) { }

  async upsertEndpointPermission(
    input: UpsertPermissionInput,
  ): Promise<PermissionEntity> {
    const normalizedEndpoint = input.endpoint.toLowerCase();
    const normalizedMethod = input.method.toUpperCase();
    const current = await this.permissionEntityRepo.findOne({
      where: { endpoint: normalizedEndpoint, method: normalizedMethod },
    });
    const defaultGroup = await this.ensureDefaultGroup();

    if (current) {
      if (!current.name || !current.permissionGroupId) {
        current.name = input.name;
        current.permissionGroupId =
          current.permissionGroupId ?? defaultGroup.id;
        return this.permissionEntityRepo.save(current);
      }
      return current;
    }

    return this.permissionEntityRepo.save({
      name: input.name,
      endpoint: normalizedEndpoint,
      method: normalizedMethod,
      permissionGroupId: defaultGroup.id,
    });
  }

  async isPermission(context: PermissionContext): Promise<boolean> {
    const permission = await this.permissionEntityRepo.findOne({
      where: {
        endpoint: context.endpoint.toLowerCase(),
        method: context.method.toUpperCase(),
      },
    });
    if (!permission) {
      return false;
    }

    const userPermission = await this.userPermissionEntityRepo.findOne({
      where: { userId: context.userId, permissionId: permission.id },
    });
    if (userPermission) {
      return userPermission.granted;
    }

    if (!context.userTypeIds || context.userTypeIds.length === 0) {
      return false;
    }

    const rolePermission = await this.userTypePermissionEntityRepo.findOne({
      where: {
        userTypeId: In(context.userTypeIds),
        permissionId: permission.id,
        granted: true,
      },
    });

    return !!rolePermission;
  }

  async grantPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    const existing = await this.userTypePermissionEntityRepo.findOne({
      where: { userTypeId: roleId, permissionId: permissionId },
    });

    if (!existing) {
      await this.userTypePermissionEntityRepo.save({
        userTypeId: roleId,
        permissionId: permissionId,
        granted: true,
      });
    } else if (!existing.granted) {
      existing.granted = true;
      await this.userTypePermissionEntityRepo.save(existing);
    }
  }

  private async ensureDefaultGroup(): Promise<PermissionGroupEntity> {
    const existing = await this.permissionGroupEntityRepo.findOne({
      where: { name: 'General' },
    });
    if (existing) {
      return existing;
    }
    return this.permissionGroupEntityRepo.save({ name: 'General' });
  }
}
