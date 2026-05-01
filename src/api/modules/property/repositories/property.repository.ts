import { Inject, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { PropertyEntity } from '@/common/entities/property/property.entity';
import { PROPERTY_REPOSITORY } from '@/common/enums/repositories';
import type { PropertyMediaKeys } from '@/api/modules/property/types/property-media.types';
import { PropertyStatus } from '@/api/modules/property/types/property-status.enum';

type CreatePropertyInput = {
  agentUserId: number;
  propertyTitle: string;
  propertyDescription: string;
  propertyType: string;
  askingPriceMonthly: number;
  beds: number;
  baths: number;
  totalSqft: number;
  streetAddress: string;
  city: string;
  zipCode: string;
  listingHighlights: string[];
  organizationId?: number | null;
};

type ListSummaryByAgentInput = {
  agentUserId: number;
  page: number;
  limit: number;
  search?: string;
  status?: PropertyStatus;
  propertyType?: string;
};

type ListSummaryByIdsInput = {
  propertyIds: number[];
  page: number;
  limit: number;
  search?: string;
  status?: PropertyStatus;
  propertyType?: string;
};

@Injectable()
export class PropertyRepository {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyEntityRepository: Repository<PropertyEntity>,
  ) { }

  async createProperty(input: CreatePropertyInput): Promise<PropertyEntity> {
    return this.propertyEntityRepository.save({
      agent_user_id: input.agentUserId,
      property_title: input.propertyTitle.trim(),
      property_description: input.propertyDescription.trim(),
      property_type: input.propertyType.trim(),
      status: PropertyStatus.DRAFT,
      asking_price_monthly: input.askingPriceMonthly.toFixed(2),
      beds: input.beds,
      baths: input.baths,
      total_sqft: input.totalSqft,
      street_address: input.streetAddress.trim(),
      city: input.city.trim(),
      zip_code: input.zipCode.trim(),
      listing_highlights: input.listingHighlights,
      property_media: [],
      organization_id: input.organizationId ?? null,
    });
  }

  findByIdAndAgent(
    propertyId: number,
    agentUserId: number,
  ): Promise<PropertyEntity | null> {
    return this.propertyEntityRepository.findOne({
      where: { id: propertyId, agent_user_id: agentUserId },
    });
  }

  findById(propertyId: number): Promise<PropertyEntity | null> {
    return this.propertyEntityRepository.findOne({
      where: { id: propertyId },
    });
  }

  async listSummaryByAgent(input: ListSummaryByAgentInput): Promise<{
    items: PropertyEntity[];
    total: number;
  }> {
    const query = this.propertyEntityRepository
      .createQueryBuilder('property')
      .select([
        'property.id',
        'property.property_title',
        'property.status',
        'property.asking_price_monthly',
        'property.street_address',
        'property.city',
        'property.zip_code',
        'property.property_media',
      ])
      .where('property.agent_user_id = :agentUserId', {
        agentUserId: input.agentUserId,
      });

    if (input.search?.trim()) {
      query.andWhere(
        '(property.property_title ILIKE :search OR property.street_address ILIKE :search)',
        { search: `%${input.search.trim()}%` },
      );
    }

    if (input.status) {
      query.andWhere('property.status = :status', { status: input.status });
    }

    if (input.propertyType) {
      query.andWhere('property.property_type = :propertyType', { propertyType: input.propertyType });
    }

    const [items, total] = await query
      .orderBy('property.id', 'DESC')
      .skip((input.page - 1) * input.limit)
      .take(input.limit)
      .getManyAndCount();

    return { items, total };
  }

  async listSummaryByUser(input: {
    userId: number;
    page: number;
    limit: number;
    search?: string;
    status?: PropertyStatus;
    propertyType?: string;
    organizationId?: number | null;
  }): Promise<{
    items: PropertyEntity[];
    total: number;
  }> {
    const query = this.propertyEntityRepository
      .createQueryBuilder('property')
      .select([
        'property.id',
        'property.property_title',
        'property.status',
        'property.asking_price_monthly',
        'property.street_address',
        'property.city',
        'property.zip_code',
        'property.property_media',
        'property.fulfillment_status',
      ])
      .where('(property.agent_user_id = :userId OR property.id IN (SELECT stakeholder.property_id FROM property_stakeholders stakeholder WHERE stakeholder.user_id = :userId) OR (property.organization_id IS NOT NULL AND property.organization_id = :orgId))', {
        userId: input.userId,
        orgId: input.organizationId || -1
      });

    if (input.search?.trim()) {
      query.andWhere(
        '(property.property_title ILIKE :search OR property.street_address ILIKE :search)',
        { search: `%${input.search.trim()}%` },
      );
    }

    if (input.status) {
      query.andWhere('property.status = :status', { status: input.status });
    }

    if (input.propertyType) {
      query.andWhere('property.property_type = :propertyType', { propertyType: input.propertyType });
    }

    const [items, total] = await query
      .orderBy('property.id', 'DESC')
      .skip((input.page - 1) * input.limit)
      .take(input.limit)
      .getManyAndCount();

    return { items, total };
  }

  async listSummaryByIds(input: ListSummaryByIdsInput): Promise<{
    items: PropertyEntity[];
    total: number;
  }> {
    if (!input.propertyIds.length) {
      return { items: [], total: 0 };
    }

    const query = this.propertyEntityRepository
      .createQueryBuilder('property')
      .select([
        'property.id',
        'property.property_title',
        'property.status',
        'property.asking_price_monthly',
        'property.street_address',
        'property.city',
        'property.zip_code',
        'property.property_media',
      ])
      .where('property.id IN (:...propertyIds)', {
        propertyIds: input.propertyIds,
      });

    if (input.search?.trim()) {
      query.andWhere(
        '(property.property_title ILIKE :search OR property.street_address ILIKE :search)',
        { search: `%${input.search.trim()}%` },
      );
    }

    if (input.status) {
      query.andWhere('property.status = :status', { status: input.status });
    }

    if (input.propertyType) {
      query.andWhere('property.property_type = :propertyType', { propertyType: input.propertyType });
    }

    const [items, total] = await query
      .orderBy('property.id', 'DESC')
      .skip((input.page - 1) * input.limit)
      .take(input.limit)
      .getManyAndCount();

    return { items, total };
  }

  async appendPropertyMedia(
    propertyId: number,
    agentUserId: number,
    items: PropertyMediaKeys[],
  ): Promise<PropertyEntity | null> {
    const property = await this.propertyEntityRepository.findOne({
      where: { id: propertyId, agent_user_id: agentUserId },
    });
    if (!property) {
      return null;
    }
    const existing = Array.isArray(property.property_media)
      ? property.property_media
      : [];
    property.property_media = [...existing, ...items];
    return this.propertyEntityRepository.save(property);
  }

  async removePropertyMediaByOriginalKey(
    propertyId: number,
    agentUserId: number,
    originalKey: string,
  ): Promise<{ property: PropertyEntity; removed: boolean } | null> {
    const property = await this.propertyEntityRepository.findOne({
      where: { id: propertyId, agent_user_id: agentUserId },
    });
    if (!property) {
      return null;
    }

    const existing = Array.isArray(property.property_media)
      ? property.property_media
      : [];
    const normalizedKey = originalKey.trim();
    const next = existing.filter((item) => item.originalKey !== normalizedKey);
    const removed = next.length !== existing.length;

    if (!removed) {
      return { property, removed: false };
    }

    property.property_media = next;
    const saved = await this.propertyEntityRepository.save(property);
    return { property: saved, removed: true };
  }

  async activatePropertyIfDraft(propertyId: number): Promise<void> {
    await this.propertyEntityRepository.update(
      { id: propertyId, status: PropertyStatus.DRAFT },
      { status: PropertyStatus.ACTIVE },
    );
  }

  async updateFulfillmentStatus(propertyId: number, status: string): Promise<void> {
    await this.propertyEntityRepository.update(propertyId, { fulfillment_status: status });
  }

  async updateStatus(propertyId: number, status: PropertyStatus): Promise<void> {
    await this.propertyEntityRepository.update(propertyId, { status });
  }

  async getDashboardAnalytics(userId: number, roleId?: number, organizationId?: number) {
    const isAgent = Number(roleId) === 1 || Number(roleId) === 5;
    const isOrgOwner = Number(roleId) === 4;

    const query = this.propertyEntityRepository
      .createQueryBuilder('property')
      .select('property.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('property.status');

    if (isOrgOwner && organizationId) {
      query.where('property.organization_id = :organizationId', { organizationId });
    } else if (isAgent) {
      query.where('property.agent_user_id = :userId', { userId });
    } else {
      query.where(
        'property.id IN (SELECT stakeholder.property_id FROM property_stakeholders stakeholder WHERE stakeholder.user_id = :userId)',
        { userId },
      );
    }

    const propertyCounts = await query.getRawMany();

    const counts = {
      TOTAL: 0,
      ACTIVE: 0,
      PENDING: 0,
      COMPLETED: 0,
    };

    propertyCounts.forEach((pc) => {
      const count = parseInt(pc.count, 10);
      counts.TOTAL += count;
      if (pc.status === PropertyStatus.ACTIVE) counts.ACTIVE = count;
      if (pc.status === PropertyStatus.PENDING) counts.PENDING = count;
      if (pc.status === PropertyStatus.COMPLETED) counts.COMPLETED = count;
    });

    // Get trend data for last 7 months
    const trendQuery = this.propertyEntityRepository
      .createQueryBuilder('property')
      .select("TO_CHAR(property.created_at, 'Mon')", 'month')
      .addSelect("TO_CHAR(property.created_at, 'MM')", 'monthNum')
      .addSelect('COUNT(*)', 'value')
      
    if (isOrgOwner && organizationId) {
      trendQuery.where('property.organization_id = :organizationId', { organizationId });
    } else if (isAgent) {
      trendQuery.where('property.agent_user_id = :userId', { userId });
    } else {
      trendQuery.where(
        'property.id IN (SELECT stakeholder.property_id FROM property_stakeholders stakeholder WHERE stakeholder.user_id = :userId)',
        { userId },
      );
    }

    trendQuery.andWhere("property.created_at >= NOW() - INTERVAL '7 months'")
      .groupBy("TO_CHAR(property.created_at, 'Mon'), TO_CHAR(property.created_at, 'MM')")
      .orderBy("TO_CHAR(property.created_at, 'MM')", 'ASC');

    const trendData = await trendQuery.getRawMany();

    return {
      stats: counts,
      trends: trendData.map((t) => ({
        month: t.month,
        value: parseInt(t.value, 10),
      })),
    };
  }

  async linkPropertiesToOrganization(agentUserId: number, organizationId: number): Promise<void> {
    await this.propertyEntityRepository.update(
      { agent_user_id: agentUserId },
      { organization_id: organizationId }
    );
  }
}
