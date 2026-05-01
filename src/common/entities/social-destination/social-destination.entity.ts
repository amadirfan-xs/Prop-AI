import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'social_destination' })
@Index(
  'uniq_social_destination_account_platform_destination',
  ['social_account_id', 'platform', 'destination_id'],
  {
    unique: true,
  },
)
export class SocialDestinationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  social_account_id: number;

  @Column({ type: 'varchar', length: 30 })
  platform: string;

  @Column({ type: 'varchar', length: 150 })
  destination_id: string;

  @Column({ type: 'varchar', length: 255 })
  destination_name: string;

  @Column({ type: 'text' })
  destination_access_token_encrypted: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
