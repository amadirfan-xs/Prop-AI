import { Inject, Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { DATA_SOURCE } from '@/common/enums/repositories';
import { PricingPackageEntity } from '@/common/entities/pricing/pricing-package.entity';
import { UserSubscriptionEntity } from '@/common/entities/user/user-subscription.entity';
import { PaymentEntity } from '@/common/entities/pricing/payment.entity';
import { PropertyEntity } from '@/common/entities/property/property.entity';
import { StripeService } from '../infrastructure/services/stripe.service';

@Injectable()
export class PricingService {
    private readonly logger = new Logger(PricingService.name);
    private readonly packageRepository: Repository<PricingPackageEntity>;
    private readonly subscriptionRepository: Repository<UserSubscriptionEntity>;
    private readonly paymentRepository: Repository<PaymentEntity>;

    constructor(
        @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
        private readonly stripeService: StripeService,
    ) {
        this.packageRepository = this.dataSource.getRepository(PricingPackageEntity);
        this.subscriptionRepository = this.dataSource.getRepository(UserSubscriptionEntity);
        this.paymentRepository = this.dataSource.getRepository(PaymentEntity);
    }

    async findAllActivePackages(): Promise<PricingPackageEntity[]> {
        return this.packageRepository.find({
            where: { isActive: true },
            order: { priceValue: 'ASC' },
        });
    }

    async getUserCurrentSubscription(userId: number): Promise<UserSubscriptionEntity | null> {
        return this.subscriptionRepository.findOne({
            where: { userId, isCurrent: true },
            relations: ['package'],
        });
    }

    async createCheckoutSession(userId: number, email: string, packageId: number) {
        const pkg = await this.packageRepository.findOneBy({ id: packageId });
        if (!pkg) throw new NotFoundException('Package not found');
        if (!pkg.stripePriceId) throw new NotFoundException('Stripe price not configured for this package');

        return this.stripeService.createCheckoutSession(userId, email, packageId, pkg.stripePriceId);
    }

    async createBuySlotsSession(userId: number, email: string, quantity: number) {
        if (quantity < 1) throw new BadRequestException('Quantity must be at least 1');
        return this.stripeService.createBuySlotsSession(userId, email, quantity);
    }

    async handleStripeWebhook(payload: Buffer, signature: string) {
        let event;
        try {
            event = this.stripeService.constructEvent(payload, signature);
        } catch (err: any) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }

        const session = event.data.object as any;
        this.logger.log(`Received Stripe event: ${event.type} for session: ${session.id}`);
        const userId = parseInt(session.metadata.userId, 10);

        if (event.type === 'checkout.session.completed') {
            if (session.metadata.type === 'subscription_upgrade') {
                const packageId = parseInt(session.metadata.packageId, 10);
                this.logger.log(`Upgrading user ${userId} to package ${packageId}`);
                await this.activatePremiumSubscription(userId, packageId);
                
                await this.logPayment(userId, session, 'subscription');
            } else if (session.metadata.type === 'extra_slots_purchase') {
                const quantity = parseInt(session.metadata.quantity, 10);
                this.logger.log(`Adding ${quantity} slots for user ${userId}`);
                await this.addExtraSlots(userId, quantity);
                
                await this.logPayment(userId, session, 'overage');
            }
        }

        return { received: true };
    }

    private async addExtraSlots(userId: number, quantity: number) {
        const sub = await this.subscriptionRepository.findOneBy({ userId, isCurrent: true });
        if (sub) {
            sub.extraPropertySlots = (sub.extraPropertySlots || 0) + quantity;
            await this.subscriptionRepository.save(sub);
        }
    }

    private async logPayment(userId: number, session: any, type: 'subscription' | 'overage') {
        await this.paymentRepository.save({
            userId,
            amount: session.amount_total / 100,
            currency: session.currency,
            stripeSessionId: session.id,
            type,
            status: 'paid'
        });
    }

    async getRemainingCapacity(userId: number): Promise<{ limit: number; count: number; remaining: number }> {
        const sub = await this.getUserCurrentSubscription(userId);
        if (!sub) return { limit: 5, count: 0, remaining: 5 };

        const baseLimit = sub.package?.propertyLimit || 5;
        const totalLimit = baseLimit + (sub.extraPropertySlots || 0);
        const count = await this.dataSource.getRepository(PropertyEntity).count({
            where: {
                agent_user_id: userId,
                created_at: Between(sub.startDate, sub.endDate || new Date())
            } as any
        });

        return {
            limit: totalLimit,
            count,
            remaining: Math.max(0, totalLimit - count)
        };
    }

    async activatePremiumSubscription(userId: number, packageId: number) {
        const pkg = await this.packageRepository.findOneBy({ id: packageId });
        if (!pkg) throw new NotFoundException('Package not found');

        // 1. Expire existing
        await this.subscriptionRepository.update(
            { userId, isCurrent: true },
            { isCurrent: false, endDate: new Date(), status: 'expired' }
        );

        // 2. Create new 1-month sub
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        const subscription = this.subscriptionRepository.create({
            userId,
            packageId,
            status: 'active',
            isCurrent: true,
            startDate,
            endDate
        });

        return this.subscriptionRepository.save(subscription);
    }

    async activateFreeSubscription(userId: number, packageId: number) {
        const pkg = await this.packageRepository.findOneBy({ id: packageId });
        if (!pkg) throw new NotFoundException('Package not found');
        if (pkg.priceValue > 0) throw new BadRequestException('This is not a free plan');

        // 1. Expire existing
        await this.subscriptionRepository.update(
            { userId, isCurrent: true },
            { isCurrent: false, endDate: new Date(), status: 'expired' }
        );

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        const subscription = this.subscriptionRepository.create({
            userId,
            packageId,
            status: 'active',
            isCurrent: true,
            startDate,
            endDate
        });

        return this.subscriptionRepository.save(subscription);
    }

    async getPaymentHistory(userId: number): Promise<PaymentEntity[]> {
        return this.paymentRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async subscribeUserToDefaultPlan(userId: number): Promise<UserSubscriptionEntity> {
        const freePackage = await this.packageRepository.findOne({
            where: { name: 'Free Plan' },
        });

        if (!freePackage) {
            throw new NotFoundException('Default Free Plan not found');
        }

        return this.subscribeUserToPackage(userId, freePackage.id);
    }

    async subscribeUserToOrganizationalPlan(userId: number): Promise<UserSubscriptionEntity> {
        const orgPackage = await this.packageRepository.findOne({
            where: { isOrganizational: true },
        });

        if (!orgPackage) {
            throw new NotFoundException('Organizational Plan not found');
        }

        return this.subscribeUserToPackage(userId, orgPackage.id);
    }

    async subscribeUserToPackage(userId: number, packageId: number): Promise<UserSubscriptionEntity> {
        const pkg = await this.packageRepository.findOneBy({ id: packageId });
        if (!pkg) throw new NotFoundException('Package not found');

        // 1. Mark existing current subscription as not current
        await this.subscriptionRepository.update(
            { userId, isCurrent: true },
            { isCurrent: false, endDate: new Date(), status: 'expired' }
        );

        // 2. Create new subscription (manual subscribe usually implies 1 month too as per requirement)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        const subscription = this.subscriptionRepository.create({
            userId,
            packageId,
            status: 'active',
            isCurrent: true,
            startDate,
            endDate
        });

        const saved = await this.subscriptionRepository.save(subscription);
        
        // Return with package details
        const result = await this.subscriptionRepository.findOne({
            where: { id: saved.id },
            relations: ['package']
        });

        if (!result) {
            throw new Error('Failed to retrieve newly created subscription');
        }

        return result;
    }

    async getSubscriptionHistory(userId: number): Promise<UserSubscriptionEntity[]> {
        return this.subscriptionRepository.find({
            where: { userId },
            relations: ['package'],
            order: { startDate: 'DESC' },
        });
    }
}
