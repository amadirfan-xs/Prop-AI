import { Controller, Get, Post, Body, Req, UseGuards,  Headers, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { PricingService } from './pricing.service';
import { StripeService } from '@/api/modules/infrastructure/services/stripe.service';
import type { Request } from 'express';

@ApiTags('Pricing & Subscriptions')
@ApiBearerAuth('bearer')
@Controller('api/pricing')
export class PricingController {
    constructor(
        private readonly pricingService: PricingService,
        private readonly stripeService: StripeService,
    ) {}

    @ApiOperation({ summary: 'Get all active pricing packages' })
    @Get('packages')
    async getPackages() {
        return this.pricingService.findAllActivePackages();
    }

    @ApiOperation({ summary: 'Create Stripe checkout session for a package' })
    @Post('create-checkout-session')
    @UseGuards(AccessTokenAuthGuard)
    async createCheckoutSession(
        @Req() req: any,
        @Body('packageId') packageId: number
    ) {
        const userId = req.user.id;
        const email = req.user.email;
        return this.pricingService.createCheckoutSession(userId, email, packageId);
    }

    @ApiOperation({ summary: 'Create Stripe session to buy extra property slots' })
    @Post('create-buy-slots-session')
    @UseGuards(AccessTokenAuthGuard)
    async createBuySlotsSession(
        @Req() req: any,
        @Body('quantity') quantity: number
    ) {
        const userId = req.user.id;
        const email = req.user.email;
        return this.pricingService.createBuySlotsSession(userId, email, quantity);
    }

    @ApiOperation({ summary: 'Subscribe to a free plan directly' })
    @Post('subscribe-free')
    @UseGuards(AccessTokenAuthGuard)
    async subscribeFree(
        @Req() req: any,
        @Body('packageId') packageId: number
    ) {
        const userId = req.user.id;
        return this.pricingService.activateFreeSubscription(userId, packageId);
    }

    @ApiOperation({ summary: 'Stripe Webhook handler' })
    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string
    ) {
        if (!signature) throw new BadRequestException('Missing stripe-signature header');
        return this.pricingService.handleStripeWebhook(req.rawBody as any, signature);
    }

    @ApiOperation({ summary: 'Get payment history' })
    @Get('payments')
    @UseGuards(AccessTokenAuthGuard)
    async getPayments(@Req() req: { user: { id: number } }) {
        return this.pricingService.getPaymentHistory(req.user.id);
    }

    @ApiOperation({ summary: 'Get current user subscription' })
    @Get('my-subscription')
    @UseGuards(AccessTokenAuthGuard)
    async getMySubscription(@Req() req: { user: { id: number } }) {
        return this.pricingService.getUserCurrentSubscription(req.user.id);
    }

    @ApiOperation({ summary: 'Get user subscription history' })
    @Get('history')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    async getHistory(@Req() req: { user: { id: number } }) {
        return this.pricingService.getSubscriptionHistory(req.user.id);
    }

    @ApiOperation({ summary: 'Subscribe to a package' })
    @Post('subscribe')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    async subscribe(
        @Req() req: { user: { id: number } },
        @Body('packageId') packageId: number
    ) {
        return this.pricingService.subscribeUserToPackage(req.user.id, packageId);
    }
}
