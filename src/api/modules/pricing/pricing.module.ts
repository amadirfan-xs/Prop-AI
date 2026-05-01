import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { CoreModule } from '@/api/modules/core/core.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeService } from '@/api/modules/infrastructure/services/stripe.service';

@Module({
    imports: [
        JwtModule.register({}),
        CoreModule, 
        PermissionModule
    ],
    controllers: [PricingController],
    providers: [PricingService, StripeService],
    exports: [PricingService, StripeService],
})
export class PricingModule {}
