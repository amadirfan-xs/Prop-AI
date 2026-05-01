import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PropertyQrScanEntity } from '@/common/entities/property/property-qr-scan.entity';
import { DATA_SOURCE } from '@/common/enums/repositories';

@Injectable()
export class PropertyQrScanRepository {
  private repository: Repository<PropertyQrScanEntity>;

  constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PropertyQrScanEntity);
  }

  async createScan(data: Partial<PropertyQrScanEntity>): Promise<PropertyQrScanEntity> {
    const scan = this.repository.create(data);
    return this.repository.save(scan);
  }

  async countByProperty(propertyId: number): Promise<number> {
    return this.repository.count({ where: { property_id: propertyId } });
  }

  async listLatestScans(propertyId: number, limit = 10): Promise<PropertyQrScanEntity[]> {
    return this.repository.find({
      where: { property_id: propertyId },
      order: { scanned_at: 'DESC' },
      take: limit,
    });
  }
}
