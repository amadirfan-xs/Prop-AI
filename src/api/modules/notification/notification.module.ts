import { Module } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './gateways/notification.gateway';

@Module({
  imports: [
    UserModule,
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
