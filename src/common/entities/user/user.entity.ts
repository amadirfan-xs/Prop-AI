import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_account' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  tempPassword: string | null;

  @Column({ type: 'boolean', default: true })
  verified: boolean;

  @Column({ type: 'varchar', length: 4, nullable: true })
  resetPIN: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPINExpirationAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  resendPasswordLimit: number;

  @Column({ type: 'varchar', length: 8, nullable: true })
  verificationCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpirationAt: Date | null;

  @Column({ type: 'integer', default: 0 })
  resendEmailLimit: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  profilePictureUrl: string | null;

  @Column({ type: 'integer', nullable: true })
  userTypeId: number | null;

  @Column({ type: 'integer', nullable: true })
  invitedBy: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  calendlyUrl: string | null;
  @Column({ type: 'integer', nullable: true })
  organizationId: number | null;

  @Column({ type: 'boolean', default: false })
  isOrgOwner: boolean;

  @Column({ type: 'boolean', default: false })
  isAuthorizedSigner: boolean;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
