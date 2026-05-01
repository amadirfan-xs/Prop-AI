import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { mailerConfig } from '@/common/config/node-mailer.config';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [NodeMailerService],
  exports: [NodeMailerService, MailerModule],
})
export class MailModule {}
