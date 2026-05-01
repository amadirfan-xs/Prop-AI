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

@Entity({ name: 'user_email_configuration' })
export class UserEmailConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', name: 'app_name', length: 255 })
  appName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text' })
  encryptedAppPassword: string;

  @Column({ type: 'varchar', length: 255 })
  iv: string;

  @Column({ type: 'varchar', name: 'config_type', length: 50, default: 'app_password' })
  configType: string; // 'app_password' | 'smtp'

  @Column({ type: 'varchar', length: 255, nullable: true })
  host: string;

  @Column({ type: 'integer', nullable: true })
  port: number;

  @Column({ type: 'boolean', default: false, nullable: true })
  secure: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
