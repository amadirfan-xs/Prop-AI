import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { PropertyMediaKeys } from '../../../api/modules/property/types/property-media.types';
import { PropertyStatus } from '../../../api/modules/property/types/property-status.enum';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'property' })
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  agent_user_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'agent_user_id' })
  agent: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  property_title: string;

  @Column({ type: 'text' })
  property_description: string;

  @Column({ type: 'varchar', length: 120 })
  property_type: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: PropertyStatus.DRAFT,
  })
  status: PropertyStatus;

  @Column({
    type: 'varchar',
    length: 40,
    default: 'In Review',
  })
  fulfillment_status: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  asking_price_monthly: string;

  @Column({ type: 'integer' })
  beds: number;

  @Column({ type: 'integer' })
  baths: number;

  @Column({ type: 'integer' })
  total_sqft: number;

  @Column({ type: 'varchar', length: 255 })
  street_address: string;

  @Column({ type: 'varchar', length: 120 })
  city: string;

  @Column({ type: 'varchar', length: 20 })
  zip_code: string;

  /** Short bullet-style highlights shown in listing UI (e.g. "Near metro"). */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  listing_highlights: string[];

  /** Array of { originalKey } per image (original file only in S3). */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  property_media: PropertyMediaKeys[];

  @Column({ type: 'integer', nullable: true })
  organization_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
