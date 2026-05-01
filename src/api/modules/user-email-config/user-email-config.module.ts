import { Module } from '@nestjs/common';
import { UserEmailConfigService } from './services/user-email-config.service';
import { UserEmailConfigController } from './controllers/user-email-config.controller';
import { EncryptionService } from '@/common/services/encryption.service';
import { userEmailConfigProviders } from '@/common/providers/user-email-config.providers';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from '@/api/modules/core/core.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';

@Module({
  imports: [
    JwtModule.register({}),
    CoreModule,
    PermissionModule,
  ],
  controllers: [UserEmailConfigController],
  providers: [
    ...userEmailConfigProviders,
    UserEmailConfigService, 
    EncryptionService
  ],
  exports: [UserEmailConfigService],
})
export class UserEmailConfigModule {}
