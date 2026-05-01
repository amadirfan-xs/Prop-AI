import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'social_account' })
@Index(
  'uniq_social_account_user_platform_provider',
  ['user_id', 'platform', 'platform_user_id'],
  {
    unique: true,
  },
)
export class SocialAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'varchar', length: 30 })
  platform: string;

  @Column({ type: 'varchar', length: 120 })
  platform_user_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name: string | null;

  @Column({ type: 'text' })
  access_token_encrypted: string;

  @Column({ type: 'timestamptz', nullable: true })
  token_expires_at: Date | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  scopes: string[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_token_check_at: Date | null;

  @Column({ type: 'text', nullable: true })
  last_token_error: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
