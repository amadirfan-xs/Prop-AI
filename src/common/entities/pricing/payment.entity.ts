import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'payments' })
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    userId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 10, default: 'USD' })
    currency: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    stripeSessionId: string;

    @Column({ type: 'varchar', length: 50 })
    type: 'subscription' | 'overage';

    @Column({ type: 'varchar', length: 20, default: 'paid' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}
