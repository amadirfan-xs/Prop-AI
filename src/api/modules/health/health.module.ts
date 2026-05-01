import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { ApiHealthController } from '@/api/modules/health/controllers/api-health.controller';
import { PermissionModule } from '@/api/modules/permission/permission.module';

@Module({
  imports: [AuthModule, PermissionModule],
  controllers: [ApiHealthController],
})
export class HealthModule {}
