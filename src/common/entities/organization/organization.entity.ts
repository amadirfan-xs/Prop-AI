import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'organization' })
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  headquarters: string;

  @Column({ type: 'text', nullable: true })
  privacyPolicy: string;

  @Column({ type: 'text', nullable: true })
  companyDescription: string;

  @Column({ type: 'varchar', length: 50, default: 'ORGANIZATIONAL' })
  plan: string;

  @Column({ type: 'boolean', default: false })
  isAuthorizedSigner: boolean;

  @Column({ type: 'integer', nullable: true, unique: true })
  submittedByAgentId: number;

  // Contact Info
  @Column({ type: 'varchar', length: 255, nullable: true })
  contactName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPhone: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contactJobTitle: string;

  // Capacity Info
  @Column({ type: 'integer', nullable: true })
  numAgents: number;

  @Column({ type: 'integer', nullable: true })
  numListings: number;

  // Branding Info
  @Column({ type: 'text', nullable: true })
  logoUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  primaryColor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteUrl: string;

  // Notes
  @Column({ type: 'text', nullable: true })
  additionalNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
