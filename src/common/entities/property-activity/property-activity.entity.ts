import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'property_activity' })
@Index('idx_property_activity_property_id', ['property_id'])
@Index('idx_property_activity_created_at', ['created_at'])
export class PropertyActivityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_id: number;

  @Column({ type: 'integer' })
  actor_id: number;

  @Column({ type: 'varchar', length: 100 })
  event: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @CreateDateColumn()
  created_at: Date;
}
