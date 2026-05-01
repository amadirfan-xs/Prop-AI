import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JsonBodyMiddleware } from '@/api/middleware/jsonBody.middleware';
import { StripeRawBodyMiddleware } from '@/api/middleware/stripeRawBody.middleware';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { CoreModule } from '@/api/modules/core/core.module';
import { HealthModule } from '@/api/modules/health/health.module';
import { MailModule } from '@/api/modules/infrastructure/mail.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { PropertyModule } from '@/api/modules/property/property.module';
import { SocialPostingModule } from '@/api/modules/social-posting/social-posting.module';
import { UserModule } from '@/api/modules/user/user.module';
import { OrganizationModule } from '@/api/modules/organization/organization.module';
import { envValidationSchema } from '@/common/config/env.validation';
import { MemoryInterceptor } from '@/common/interceptors/memory.interceptor';
import { DatabaseModule } from '@/common/modules/database.module';
import { UserEmailConfigModule } from './modules/user-email-config/user-email-config.module';
import { MarketingCampaignModule } from './modules/marketing-campaign/marketing-campaign.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      expandVariables: true,
    }),
    DatabaseModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    ScheduleModule.forRoot(),
    MailModule,
    UserModule,
    AuthModule,
    PropertyModule,
    SocialPostingModule,
    HealthModule,
    PermissionModule,
    UserEmailConfigModule,
    MarketingCampaignModule,
    PricingModule,
    OrganizationModule,
    AiModule,
    NotificationModule,
  ],
  providers: [
    JsonBodyMiddleware,
    StripeRawBodyMiddleware,
    { provide: APP_INTERCEPTOR, useClass: MemoryInterceptor },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(StripeRawBodyMiddleware)
      .forRoutes({ path: 'api/stripe/webhook', method: RequestMethod.POST });

    consumer.apply(JsonBodyMiddleware).forRoutes('*');
  }
}
