import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { PermissionRepository } from '@/api/modules/permission/repositories/permission.repository';
import { PermissionService } from '@/api/modules/permission/services/permission.service';
import { RegisterPermissionService } from '@/api/modules/permission/services/register-permission.service';
import { permissionProviders } from '@/common/providers/permission.providers';

@Module({
  imports: [DiscoveryModule],
  providers: [
    ...permissionProviders,
    PermissionRepository,
    PermissionService,
    RegisterPermissionService,
    PermissionGuard,
    MetadataScanner,
    Reflector,
  ],
  exports: [PermissionGuard, PermissionService],
})
export class PermissionModule {}
