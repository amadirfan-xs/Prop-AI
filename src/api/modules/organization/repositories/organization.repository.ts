import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '@/common/entities/organization/organization.entity';
import { PropertyEntity } from '@/common/entities/property/property.entity';
import { UserEntity } from '@/common/entities/user/user.entity';
import { PropertyStakeholderEntity } from '@/common/entities/property-stakeholder/property-stakeholder.entity';
import { PropertyActivityEntity } from '@/common/entities/property-activity/property-activity.entity';
import { ORGANIZATION_REPOSITORY } from '@/common/enums/repositories';
import { UserTypes } from '@/common/enums/user-types';

@Injectable()
export class OrganizationRepository {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repository: Repository<OrganizationEntity>,
  ) {}

  findById(id: number): Promise<OrganizationEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByAgentId(agentId: number): Promise<OrganizationEntity | null> {
    return this.repository.findOne({ where: { submittedByAgentId: agentId } });
  }

  async createOrganization(data: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    const org = this.repository.create(data);
    return this.repository.save(org);
  }

  save(organization: OrganizationEntity): Promise<OrganizationEntity> {
    return this.repository.save(organization);
  }

  async getDashboardStats(orgId: number) {
    // 1. Basic counts from properties
    const propertyStats = await this.repository.manager.createQueryBuilder(PropertyEntity, 'p')
      .select('p.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('p.organization_id = :orgId', { orgId })
      .groupBy('p.status')
      .getRawMany();

    const stats = {
      TOTAL_PROPERTIES: 0,
      ACTIVE_LISTINGS: 0,
      COMPLETED_DEALS: 0,
      PENDING_CONTRACTS: 0
    };

    propertyStats.forEach(s => {
      const cnt = parseInt(s.count, 10);
      stats.TOTAL_PROPERTIES += cnt;
      if (s.status === 'Active') stats.ACTIVE_LISTINGS = cnt;
      if (s.status === 'Completed') stats.COMPLETED_DEALS = cnt;
      if (s.status === 'Pending') stats.PENDING_CONTRACTS = cnt;
    });

    // 2. Count agents
    const agentCount = await this.repository.manager.createQueryBuilder(UserEntity, 'u')
      .where('u.organizationId = :orgId', { orgId })
      .andWhere('u.userTypeId = :typeId', { typeId: UserTypes.ORG_AGENT })
      .getCount();

    // 3. Count unique stakeholders across all org properties
    const stakeholderStats = await this.repository.manager.createQueryBuilder(PropertyStakeholderEntity, 's')
      .innerJoin(PropertyEntity, 'p', 'p.id = s.property_id')
      .select('s.user_type_id', 'typeId')
      .addSelect('COUNT(DISTINCT s.user_id)', 'count')
      .where('p.organization_id = :orgId', { orgId })
      .groupBy('s.user_type_id')
      .getRawMany();

    const stakeholders = {
      TOTAL_BUYERS: 0,
      TOTAL_SELLERS: 0
    };

    stakeholderStats.forEach(s => {
      if (parseInt(s.typeId, 10) === 3) stakeholders.TOTAL_BUYERS = parseInt(s.count, 10);
      if (parseInt(s.typeId, 10) === 2) stakeholders.TOTAL_SELLERS = parseInt(s.count, 10);
    });

    return {
      ...stats,
      TOTAL_AGENTS: agentCount,
      ...stakeholders
    };
  }

  async getAgentPerformance(orgId: number, limit = 5) {
    return this.repository.manager.createQueryBuilder(UserEntity, 'u')
      .leftJoin(PropertyEntity, 'p', 'p.agent_user_id = u.id')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('u.profilePictureUrl', 'avatar')
      .addSelect('COUNT(p.id)', 'totalProperties')
      .addSelect("COUNT(CASE WHEN p.status = 'Completed' THEN 1 END)", 'dealsClosed')
      .where('u.organizationId = :orgId', { orgId })
      .andWhere('u.userTypeId = :typeId', { typeId: UserTypes.ORG_AGENT })
      .groupBy('u.id, u.name, u.email, u.profilePictureUrl')
      .orderBy('COUNT(p.id)', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getRecentActivity(orgId: number, limit = 10) {
    return this.repository.manager.createQueryBuilder(PropertyActivityEntity, 'a')
      .innerJoin(PropertyEntity, 'p', 'p.id = a.property_id')
      .innerJoin(UserEntity, 'u', 'u.id = a.actor_id')
      .select('a.id', 'id')
      .addSelect('a.event', 'event')
      .addSelect('a.description', 'description')
      .addSelect('a.created_at', 'timestamp')
      .addSelect('u.name', 'actorName')
      .addSelect('p.property_title', 'propertyName')
      .where('p.organization_id = :orgId', { orgId })
      .orderBy('a.created_at', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getRecentProperties(orgId: number, limit = 5) {
      return this.repository.manager.createQueryBuilder(PropertyEntity, 'p')
        .leftJoin(UserEntity, 'u', 'u.id = p.agent_user_id')
        .select('p.id', 'id')
        .addSelect('p.property_title', 'title')
        .addSelect('p.status', 'status')
        .addSelect('p.fulfillment_status', 'fulfillmentStatus')
        .addSelect('p.property_media', 'media')
        .addSelect('u.name', 'agentName')
        .where('p.organization_id = :orgId', { orgId })
        .orderBy('p.created_at', 'DESC')
        .limit(limit)
        .getRawMany();
  }

  async getPaginatedProperties(orgId: number, params: { page: number; limit: number; search?: string; type?: string; status?: string }) {
    const { page, limit, search, type, status } = params;
    
    const query = this.repository.manager.createQueryBuilder(PropertyEntity, 'p')
      .where('p.organization_id = :orgId', { orgId });

    if (search) {
      query.andWhere('p.property_title ILIKE :search', { search: `%${search}%` });
    }
    if (type && type !== 'All') {
      query.andWhere('p.property_type = :type', { type });
    }
    if (status && status !== 'All') {
      query.andWhere('p.status = :status', { status });
    }

    const total = await query.getCount();
    const items = await query
      .leftJoinAndSelect('p.agent', 'agent')
      .orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { items, total };
  }

  async getPaginatedActivity(orgId: number, params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const queryBase = this.repository.manager.createQueryBuilder(PropertyActivityEntity, 'a')
      .innerJoin(PropertyEntity, 'p', 'p.id = a.property_id')
      .innerJoin(UserEntity, 'u', 'u.id = a.actor_id')
      .where('p.organization_id = :orgId', { orgId });

    if (search) {
      queryBase.andWhere('(a.description ILIKE :search OR a.event ILIKE :search OR u.name ILIKE :search OR p.property_title ILIKE :search)', { search: `%${search}%` });
    }

    const total = await queryBase.getCount();

    const items = await queryBase
      .select('a.id', 'id')
      .addSelect('a.event', 'event')
      .addSelect('a.description', 'description')
      .addSelect('a.created_at', 'timestamp')
      .addSelect('u.name', 'actorName')
      .addSelect('p.property_title', 'propertyName')
      .orderBy('a.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    return { items, total };
  }

  async getAgentStats(orgId: number) {
    const counts = await this.repository.manager.createQueryBuilder(UserEntity, 'u')
      .select('u.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('u.organizationId = :orgId', { orgId })
      .andWhere('u.userTypeId = :typeId', { typeId: UserTypes.ORG_AGENT })
      .groupBy('u.status')
      .getRawMany();

    const stats = {
      totalAgents: 0,
      activeAgents: 0,
      invitedAgents: 0,
      totalProperties: 0,
      listingsPerAgent: '0.0'
    };

    counts.forEach(c => {
      const cnt = parseInt(c.count, 10);
      stats.totalAgents += cnt;
      if (c.status === 'ACTIVE') stats.activeAgents = cnt;
      if (c.status === 'INVITED') stats.invitedAgents = cnt;
    });

    const propertyCount = await this.repository.manager.createQueryBuilder(PropertyEntity, 'p')
      .where('p.organization_id = :orgId', { orgId })
      .getCount();

    stats.totalProperties = propertyCount;
    stats.listingsPerAgent = stats.activeAgents > 0 
      ? (propertyCount / stats.activeAgents).toFixed(1)
      : '0.0';

    return stats;
  }

  async getAgents(orgId: number, params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    
    const query = this.repository.manager.createQueryBuilder(UserEntity, 'u')
      .leftJoin(PropertyEntity, 'p', 'p.agent_user_id = u.id')
      .leftJoin(PropertyStakeholderEntity, 's', 's.property_id = p.id')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('u.profilePictureUrl', 'avatar')
      .addSelect('u.createdAt', 'createdAt')
      .addSelect('u.status', 'status')
      .addSelect('u.verified', 'verified')
      .addSelect('COUNT(DISTINCT p.id)', 'properties')
      .addSelect("COUNT(DISTINCT CASE WHEN p.status = 'Completed' THEN 1 END)", 'dealsClosed')
      .addSelect("COUNT(DISTINCT CASE WHEN s.user_type_id = 3 THEN s.id END)", 'buyers')
      .addSelect("COUNT(DISTINCT CASE WHEN s.user_type_id = 2 THEN s.id END)", 'sellers')
      .where('u.organizationId = :orgId', { orgId })
      .andWhere('u.userTypeId = :typeId', { typeId: UserTypes.ORG_AGENT });

    if (search) {
      query.andWhere('(u.name ILIKE :search OR u.email ILIKE :search)', { search: `%${search}%` });
    }

    query.groupBy('u.id, u.name, u.email, u.profilePictureUrl, u.createdAt, u.status, u.verified')
      .orderBy('u.name', 'ASC');

    const total = await query.getCount();
    const items = await query
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    return { items, total };
  }

  async getStakeholderStats(orgId: number) {
    const stats = await this.repository.manager.createQueryBuilder(PropertyStakeholderEntity, 's')
      .innerJoin(PropertyEntity, 'p', 'p.id = s.property_id')
      .select('s.user_type_id', 'typeId')
      .addSelect('COUNT(DISTINCT s.user_id)', 'count')
      .where('p.organization_id = :orgId', { orgId })
      .groupBy('s.user_type_id')
      .getRawMany();

    const result = {
      totalBuyers: 0,
      totalSellers: 0,
      totalStakeholders: 0,
      activeProjects: 0
    };

    stats.forEach(s => {
      const cnt = parseInt(s.count, 10);
      result.totalStakeholders += cnt;
      if (parseInt(s.typeId, 10) === 3) result.totalBuyers = cnt;
      if (parseInt(s.typeId, 10) === 2) result.totalSellers = cnt;
    });

    result.activeProjects = await this.repository.manager.createQueryBuilder(PropertyEntity, 'p')
      .where('p.organization_id = :orgId', { orgId })
      .andWhere('p.status = :status', { status: 'Active' })
      .getCount();

    return result;
  }

  async getPaginatedStakeholders(orgId: number, params: { page: number; limit: number; search?: string; type?: string }) {
    const { page, limit, search, type } = params;

    const query = this.repository.manager.createQueryBuilder(PropertyStakeholderEntity, 's')
      .innerJoin(PropertyEntity, 'p', 'p.id = s.property_id')
      .leftJoin(UserEntity, 'u', 'u.id = s.user_id')
      .leftJoin(UserEntity, 'a', 'a.id = p.agent_user_id')
      .select('s.id', 'stakeholderId')
      .addSelect('s.name', 'name')
      .addSelect('s.email', 'email')
      .addSelect('u.profilePictureUrl', 'avatar')
      .addSelect('s.user_type_id', 'typeId')
      .addSelect('s.created_at', 'addedAt')
      .addSelect('p.property_title', 'propertyName')
      .addSelect('p.id', 'propertyId')
      .addSelect('a.name', 'agentName')
      .where('p.organization_id = :orgId', { orgId });

    if (search) {
      query.andWhere('(s.name ILIKE :search OR s.email ILIKE :search OR p.property_title ILIKE :search)', { search: `%${search}%` });
    }

    if (type && type !== 'All') {
      const typeId = type === 'Buyer' ? 3 : 2;
      query.andWhere('s.user_type_id = :typeId', { typeId });
    }

    query.orderBy('s.created_at', 'DESC');

    const total = await query.getCount();
    const items = await query
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    return { items, total };
  }

  async getBrokerageSpotlight(orgId: number) {
    const topAgent = await this.repository.manager.createQueryBuilder(UserEntity, 'u')
      .leftJoin(PropertyEntity, 'p', 'p.agent_user_id = u.id')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.profilePictureUrl', 'avatar')
      .addSelect('COUNT(p.id)', 'stakeholderCount')
      .where('u.organizationId = :orgId', { orgId })
      .andWhere('u.userTypeId = :typeId', { typeId: UserTypes.ORG_AGENT })
      .groupBy('u.id, u.name, u.profilePictureUrl')
      .orderBy('COUNT(p.id)', 'DESC')
      .getRawOne();

    if (!topAgent) return null;

    return {
      name: topAgent.name,
      avatar: topAgent.avatar,
      managedStakeholders: parseInt(topAgent.stakeholderCount, 10),
      avgClosureTime: '18 Days', // Placeholder logic for now
      successRate: '94%' // Placeholder logic for now
    };
  }

  async getStakeholderNeedsAttention(orgId: number) {
    const pendingStakeholders = await this.repository.manager.createQueryBuilder(PropertyStakeholderEntity, 's')
      .innerJoin(PropertyEntity, 'p', 'p.id = s.property_id')
      .select('s.name', 'title')
      .addSelect('p.property_title', 'propertyName')
      .addSelect('s.invite_status', 'status')
      .where('p.organization_id = :orgId', { orgId })
      .andWhere('s.invite_status = :status', { status: 'SENT' })
      .orderBy('s.created_at', 'DESC')
      .limit(3)
      .getRawMany();

    return pendingStakeholders.map(s => ({
      title: 'Pending Invitation',
      desc: `${s.title} has not accepted invitation for ${s.propertyName}`,
      type: 'info',
      icon: 'schedule'
    }));
  }
}
