import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyPurchaseContractSource } from '../../../api/modules/property/types/property-purchase-contract-source.enum';

export enum PropertyPurchaseContractStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUESTED_CHANGES = 'REQUESTED_CHANGES',
  SUPERSEDED = 'SUPERSEDED',
}

@Entity({ name: 'property_purchase_contract' })
@Index('idx_property_purchase_contract_property_id', ['property_id'])
@Index('idx_property_purchase_contract_is_latest', ['is_latest'])
export class PropertyPurchaseContractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_id: number;

  @Column({ type: 'varchar', length: 30, default: PropertyPurchaseContractStatus.PENDING })
  status: PropertyPurchaseContractStatus;

  @Column({ type: 'varchar', length: 1000 })
  document_key: string;

  @Column({ type: 'varchar', length: 10 })
  input_source: PropertyPurchaseContractSource;

  @Column({ type: 'boolean', default: true })
  is_latest: boolean;

  @Column({ type: 'integer', nullable: true })
  parent_id: number | null;

  @Column({ type: 'text', nullable: true })
  html_content: string | null;

  @Column({ type: 'integer', nullable: true })
  template_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
