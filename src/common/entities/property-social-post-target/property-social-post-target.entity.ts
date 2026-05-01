import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'property_social_post_target' })
@Index('idx_property_social_post_target_post', ['property_social_post_id'])
@Index('idx_property_social_post_target_schedule', ['scheduled_for'])
@Index('idx_property_social_post_target_status', ['status'])
export class PropertySocialPostTargetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_social_post_id: number;

  @Column({ type: 'varchar', length: 30 })
  platform: string;

  @Column({ type: 'integer', nullable: true })
  social_destination_id: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  scheduled_for: Date | null;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  external_post_id: string | null;

  @Column({ type: 'text', nullable: true })
  error_message: string | null;

  @Column({ type: 'integer', default: 0 })
  retry_count: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_attempt_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
