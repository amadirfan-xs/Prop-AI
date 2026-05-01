import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PermissionService } from '@/api/modules/permission/services/permission.service';
import { HelperService } from '@/common/utils/helper.service';

type RequestUser = {
  id: number;
  roles?: number[];
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly helperService: HelperService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      params: Record<string, string>;
      query: Record<string, string>;
      route?: { path?: string };
      baseUrl?: string;
      originalUrl?: string;
      method: string;
      user?: RequestUser;
    }>();

    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('User context missing for permission check');
    }

    const endpoint = this.resolveEndpoint(
      request.baseUrl ?? '',
      request.route?.path ?? '',
      request.originalUrl ?? '',
    );
    
    const allowed = await this.permissionService.isPermission({
      endpoint,
      method: request.method,
      userId: user.id,
      userTypeIds: user.roles ?? [],
    });

    if (!allowed) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }

  private resolveEndpoint(
    baseUrl: string,
    routePath: string,
    originalUrl: string,
  ): string {
    if (routePath) {
      return this.helperService.buildRouteKey(baseUrl, routePath);
    }
    const withoutQuery = originalUrl.split('?')[0] ?? '/';
    return this.helperService.normalizeEndpoint(withoutQuery);
  }
}
