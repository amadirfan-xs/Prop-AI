import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionRepository } from '@/api/modules/permission/repositories/permission.repository';
import { REGISTER_PERMISSION } from '@/common/enums/repositories';
import { HelperService } from '@/common/utils/helper.service';

@Injectable()
export class RegisterPermissionService implements OnModuleInit {
  private readonly logger = new Logger(RegisterPermissionService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly permissionRepository: PermissionRepository,
    private readonly helperService: HelperService,
  ) {}

  async onModuleInit(): Promise<void> {
    const controllers = this.discoveryService.getControllers();
    const tasks: Array<Promise<unknown>> = [];

    for (const wrapper of controllers) {
      const instance = wrapper.instance as object | undefined;
      const prototype = instance
        ? (Object.getPrototypeOf(instance) as object)
        : undefined;
      if (!instance || !prototype) {
        continue;
      }

      const controllerPath = this.getPathMetadata(
        wrapper.metatype ?? undefined,
      );
      if (!controllerPath) {
        continue;
      }

      const controllerEnabled = wrapper.metatype
        ? (this.reflector.get<boolean>(REGISTER_PERMISSION, wrapper.metatype) ??
          true)
        : true;

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (methodName: string) => {
          const handler = (
            instance as Record<string, (...args: unknown[]) => unknown>
          )[methodName];
          if (!handler) {
            return;
          }

          const routePath = this.getPathMetadata(handler);
          const requestMethod = this.getMethodMetadata(handler);
          if (routePath === undefined || requestMethod === undefined) {
            return;
          }

          const methodEnabled =
            this.reflector.get<boolean>(REGISTER_PERMISSION, handler) ??
            controllerEnabled;
          if (!methodEnabled) {
            return;
          }

          const method = RequestMethod[Number(requestMethod)]?.toUpperCase();
          if (!method) {
            return;
          }

          const endpoint = this.helperService.buildRouteKey(
            String(controllerPath),
            String(routePath),
          );
          const permissionName = this.helperService.formatPermissionName(
            endpoint,
            method,
          );

          const task = (async () => {
             const permission = await this.permissionRepository.upsertEndpointPermission({
               endpoint,
               method,
               name: permissionName,
             });

             // Auto-handle ORGANIZATION_OWNER permissions
             if (endpoint.startsWith('/api/organization')) {
               await this.permissionRepository.grantPermissionToRole(4, permission.id);
             }
           })();

          tasks.push(task);
        },
      );
    }

    try {
      await Promise.all(tasks);
      this.logger.log(
        `Permission scan complete. Registered ${tasks.length} routes.`,
      );
    } catch (error) {
      this.logger.error('Permission registration failed on startup', error);
      throw error;
    }
  }

  private getPathMetadata(target: object | undefined): string | undefined {
    if (!target) {
      return undefined;
    }
    const value = Reflect.getMetadata(PATH_METADATA, target) as
      | string
      | string[]
      | undefined;
    if (Array.isArray(value)) {
      return value.join('/');
    }
    return value;
  }

  private getMethodMetadata(target: object): number | undefined {
    return Reflect.getMetadata(METHOD_METADATA, target) as number | undefined;
  }
}
