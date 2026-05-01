import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PropertyEntity } from '../property/property.entity';
import { UserEmailConfigEntity } from '../email-config/user-email-config.entity';

@Entity({ name: 'marketing_campaigns' })
export class MarketingCampaignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'property_id' })
  propertyId: number;

  @ManyToOne(() => PropertyEntity)
  @JoinColumn({ name: 'property_id' })
  property: PropertyEntity;

  @Column({ name: 'email_config_id' })
  emailConfigId: number;

  @ManyToOne(() => UserEmailConfigEntity)
  @JoinColumn({ name: 'email_config_id' })
  emailConfig: UserEmailConfigEntity;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json' })
  recipients: string[];

  @Column({ type: 'timestamp', name: 'scheduled_at', nullable: true })
  scheduledAt: Date | null;

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string; // draft, scheduled, sent, failed

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
