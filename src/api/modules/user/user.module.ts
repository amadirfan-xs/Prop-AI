import { Module } from '@nestjs/common';
import { UserRepository } from '@/api/modules/user/repositories/user.repository';
import { UserRoleRepository } from '@/api/modules/user/repositories/user-role.repository';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { userProviders } from '@/common/providers/user.providers';
import { ProfileController } from './controllers/profile.controller';
import { StorageModule } from '../infrastructure/storage.module';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from '../core/core.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    StorageModule, 
    JwtModule.register({}),
    CoreModule,
    PermissionModule,
  ],
  controllers: [ProfileController],
  providers: [
    ...userProviders,
    UserRepository,
    UserRoleRepository,
    UserAccountService,
  ],
  exports: [UserAccountService],
})
export class UserModule { }
