import { Module } from '@nestjs/common';
import { AdminHealthController } from '@/admin/controllers/admin-health.controller';
import { AdminRoleGuard } from '@/common/guards/admin-role/admin-role.guard';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { CoreModule } from '@/api/modules/core/core.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [AdminHealthController],
  providers: [AdminRoleGuard],
})
export class AdminModule {}
