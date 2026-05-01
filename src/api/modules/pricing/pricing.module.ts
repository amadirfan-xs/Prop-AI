import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { CoreModule } from '@/api/modules/core/core.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeService } from '@/api/modules/infrastructure/services/stripe.service';
import { MailModule } from '@/api/modules/infrastructure/mail.module';

@Module({
    imports: [
        JwtModule.register({}),
        CoreModule, 
        PermissionModule,
        MailModule
    ],
    controllers: [PricingController],
    providers: [PricingService, StripeService],
    exports: [PricingService, StripeService],
})
export class PricingModule {}
