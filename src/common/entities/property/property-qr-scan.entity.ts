import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'property_qr_scans' })
export class PropertyQrScanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  property_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @CreateDateColumn()
  scanned_at: Date;
}
