import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminRoleGuard } from '@/common/guards/admin-role/admin-role.guard';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';

@Controller('admin/health')
export class AdminHealthController {
  @Get()
  @UseGuards(AccessTokenAuthGuard, AdminRoleGuard)
  health(): { status: string } {
    return { status: 'ok' };
  }
}
