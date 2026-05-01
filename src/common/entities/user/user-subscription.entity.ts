import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PricingPackageEntity } from '../pricing/pricing-package.entity';

@Entity({ name: 'user_subscriptions' })
export class UserSubscriptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    userId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'integer' })
    packageId: number;

    @ManyToOne(() => PricingPackageEntity)
    @JoinColumn({ name: 'packageId' })
    package: PricingPackageEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date | null;

    @Column({ type: 'varchar', length: 50, default: 'active' })
    status: string; // active, expired, canceled

    @Column({ type: 'boolean', default: true })
    isCurrent: boolean;

    @Column({ type: 'integer', default: 0 })
    extraPropertySlots: number;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
