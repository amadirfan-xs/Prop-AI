import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyInquiryEntity } from '@/common/entities/property/property-inquiry.entity';
import { PROPERTY_INQUIRY_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class PropertyInquiryRepository {
  constructor(
    @Inject(PROPERTY_INQUIRY_REPOSITORY)
    private readonly repository: Repository<PropertyInquiryEntity>,
  ) {}

  async createInquiry(input: {
    propertyId: number;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }): Promise<PropertyInquiryEntity> {
    return this.repository.save({
      property_id: input.propertyId,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      message: input.message.trim(),
    });
  }

  async findByProperty(propertyId: number): Promise<PropertyInquiryEntity[]> {
    return this.repository.find({
      where: { property_id: propertyId },
      order: { created_at: 'DESC' },
    });
  }

  async listByAgent(agentId: number, options: { page?: number; limit?: number; search?: string }): Promise<{ items: any[]; meta: any }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.repository.createQueryBuilder('inquiry')
      .innerJoin('property', 'p', 'p.id = inquiry.property_id')
      .select([
        'inquiry.id as id',
        'inquiry.property_id as property_id',
        'inquiry.first_name as first_name',
        'inquiry.last_name as last_name',
        'inquiry.email as email',
        'inquiry.message as message',
        'inquiry.is_read as is_read',
        'inquiry.created_at as created_at',
        'p.property_title as property_title'
      ])
      .where('p.agent_user_id = :agentId', { agentId });

    if (options.search) {
      query.andWhere(
        '(inquiry.first_name ILIKE :search OR inquiry.last_name ILIKE :search OR p.property_title ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const [rawItems, totalItems] = await Promise.all([
      query.orderBy('inquiry.created_at', 'DESC')
        .offset(skip)
        .limit(limit)
        .getRawMany(),
      query.getCount()
    ]);

    return {
      items: rawItems,
      meta: {
        totalItems,
        itemCount: rawItems.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    };
  }

  async markAsRead(id: number, agentId: number): Promise<boolean> {
    // Verify ownership before marking as read
    const inquiry = await this.repository.createQueryBuilder('inquiry')
      .innerJoin('property', 'p', 'p.id = inquiry.property_id')
      .where('inquiry.id = :id AND p.agent_user_id = :agentId', { id, agentId })
      .getOne();

    if (!inquiry) return false;

    await this.repository.update(id, { is_read: true });
    return true;
  }
}
