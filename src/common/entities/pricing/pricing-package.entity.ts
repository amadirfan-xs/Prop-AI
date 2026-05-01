import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pricing_packages' })
export class PricingPackageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    priceDisplay: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    priceValue: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'jsonb' })
    features: any[];

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isPremium: boolean;

    @Column({ type: 'boolean', default: false })
    isOrganizational: boolean;

    @Column({ type: 'varchar', length: 50, nullable: true })
    buttonText: string;

    @Column({ type: 'integer', default: 5 })
    propertyLimit: number;

    @Column({ type: 'integer', default: 1 })
    stakeholderLimit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    overagePrice: number;

    @Column({ type: 'jsonb', nullable: true })
    featuresConfig: any;

    @Column({ type: 'varchar', length: 150, nullable: true })
    stripePriceId: string;
}
