import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'property_social_post' })
@Index('idx_property_social_post_property', ['property_id'])
@Index('idx_property_social_post_agent', ['agent_user_id'])
@Index('idx_property_social_post_status', ['status'])
export class PropertySocialPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_id: number;

  @Column({ type: 'integer' })
  agent_user_id: number;

  @Column({ type: 'text' })
  caption: string;

  @Column({ type: 'varchar', length: 20 })
  mode: string;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
