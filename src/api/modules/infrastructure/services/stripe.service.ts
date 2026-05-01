import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: any;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
        this.logger.warn('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(secretKey || '');
  }

  async createCheckoutSession(userId: number, email: string, packageId: number, priceId: string) {
    const baseUrl = this.configService.get<string>('BASE_URL_FRONTEND');
    
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // Can be 'subscription' if using Stripe recursive billing, but user said "renew every month" manually or similar.
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/failure`,
      customer_email: email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        packageId: packageId.toString(),
        type: 'subscription_upgrade'
      }
    });
  }

  async createBuySlotsSession(userId: number, email: string, quantity: number) {
    const baseUrl = this.configService.get<string>('BASE_URL_FRONTEND');
    
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Extra Property Slot',
              description: 'One-time purchase of an additional property creation slot.',
            },
            unit_amount: 100, // $1.00
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/payment/success?success=slots_purchased`,
      cancel_url: `${baseUrl}/payment/failure`,
      customer_email: email,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        quantity: quantity.toString(),
        type: 'extra_slots_purchase'
      }
    });
  }

  constructEvent(payload: string | Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
  }
}
