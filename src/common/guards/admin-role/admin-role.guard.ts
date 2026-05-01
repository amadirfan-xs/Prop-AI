import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();
    const token = request.headers['access-token'];
    if (!token) {
      throw new UnauthorizedException('access-token header is required');
    }

    const payload = this.jwtService.verify<{
      roles?: string[];
      userTypeName?: string;
    }>(token, { secret: process.env.JWT_SECRET });

    const hasAdminRole =
      payload.userTypeName === 'admin' || payload.roles?.includes('admin');
    if (!hasAdminRole) {
      throw new UnauthorizedException('Admin role is required');
    }

    return true;
  }
}
