import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '@/api/modules/permission/repositories/permission.repository';
import type { PermissionContext } from '@/api/modules/permission/types/permission-service.types';

@Injectable()
export class PermissionService {
  private readonly cacheTtlMs = 30_000;
  private readonly permissionCache = new Map<
    string,
    { value: boolean; expiresAt: number }
  >();

  constructor(private readonly permissionRepository: PermissionRepository) { }

  async isPermission(context: PermissionContext): Promise<boolean> {
    const key = this.getCacheKey(context);
    const now = Date.now();
    const cached = this.permissionCache.get(key);
    if (cached && cached.expiresAt > now) {
      return cached.value;
    }

    const value = await this.permissionRepository.isPermission(context);
    this.permissionCache.set(key, {
      value,
      expiresAt: now + this.cacheTtlMs,
    });
    return value;
  }

  private getCacheKey(context: PermissionContext): string {
    const roleIds = [...context.userTypeIds].sort().join(',');
    return [
      context.endpoint.toLowerCase(),
      context.method.toUpperCase(),
      String(context.userId),
      roleIds,
    ].join('|');
  }
}
