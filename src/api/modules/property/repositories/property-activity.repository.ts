import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyActivityEntity } from '@/common/entities/property-activity/property-activity.entity';
import { PROPERTY_ACTIVITY_REPOSITORY } from '@/common/enums/repositories';

type LogActivityInput = {
  property_id: number;
  actor_id: number;
  event: string;
  description: string;
  metadata?: Record<string, any> | null;
};

@Injectable()
export class PropertyActivityRepository {
  constructor(
    @Inject(PROPERTY_ACTIVITY_REPOSITORY)
    private readonly repository: Repository<PropertyActivityEntity>,
  ) {}

  async logActivity(input: LogActivityInput): Promise<PropertyActivityEntity> {
    return this.repository.save({
      property_id: input.property_id,
      actor_id: input.actor_id,
      event: input.event,
      description: input.description,
      metadata: input.metadata || null,
    });
  }

  async listByProperty(
    propertyId: number,
    limit = 10,
  ): Promise<PropertyActivityEntity[]> {
    return this.repository.find({
      where: { property_id: propertyId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
