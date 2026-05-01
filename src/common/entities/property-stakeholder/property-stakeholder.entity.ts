import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'property_stakeholders' })
export class PropertyStakeholderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_id: number;

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'integer' })
  invited_by: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'integer' })
  user_type_id: number;

  @Column({ type: 'varchar', length: 20 })
  user_type: string;

  @Column({ type: 'varchar', length: 20 })
  invite_status: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contract_decision: string | null;

  @Column({ type: 'timestamp', nullable: true })
  last_invite_sent_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
