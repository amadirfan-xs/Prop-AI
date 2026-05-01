import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { AuthController } from '@/api/modules/auth/controllers/auth.controller';
import { AuthService } from '@/api/modules/auth/services/auth.service';
import { MailModule } from '@/api/modules/infrastructure/mail.module';
import { UserModule } from '@/api/modules/user/user.module';
import { PricingModule } from '@/api/modules/pricing/pricing.module';
import { StorageModule } from '@/api/modules/infrastructure/storage.module';

@Module({
  imports: [UserModule, MailModule, PricingModule, StorageModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenAuthGuard],
  exports: [AccessTokenAuthGuard, JwtModule, PassportModule],
})
export class AuthModule {}
