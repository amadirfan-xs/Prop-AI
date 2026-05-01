import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyStakeholderEntity } from '@/common/entities/property-stakeholder/property-stakeholder.entity';
import { PROPERTY_STAKEHOLDER_REPOSITORY } from '@/common/enums/repositories';

type CreatePropertyStakeholderInput = {
  propertyId: number;
  userId: number;
  invitedBy: number;
  name: string;
  email: string;
  userTypeId: number;
  userType: string;
  inviteStatus: 'pending' | 'completed';
};

@Injectable()
export class PropertyStakeholderRepository {
  constructor(
    @Inject(PROPERTY_STAKEHOLDER_REPOSITORY)
    private readonly propertyStakeholderEntityRepository: Repository<PropertyStakeholderEntity>,
  ) {}

  findByPropertyAndEmail(
    propertyId: number,
    email: string,
  ): Promise<PropertyStakeholderEntity | null> {
    return this.propertyStakeholderEntityRepository.findOne({
      where: { property_id: propertyId, email },
    });
  }

  findByPropertyAndUserId(
    propertyId: number,
    userId: number,
  ): Promise<PropertyStakeholderEntity | null> {
    return this.propertyStakeholderEntityRepository.findOne({
      where: { property_id: propertyId, user_id: userId },
    });
  }

  listByPropertyId(propertyId: number): Promise<PropertyStakeholderEntity[]> {
    return this.propertyStakeholderEntityRepository.find({
      where: { property_id: propertyId },
      order: { id: 'ASC' },
    });
  }

  createStakeholder(
    input: CreatePropertyStakeholderInput,
  ): Promise<PropertyStakeholderEntity> {
    return this.propertyStakeholderEntityRepository.save({
      property_id: input.propertyId,
      user_id: input.userId,
      invited_by: input.invitedBy,
      name: input.name,
      email: input.email,
      user_type_id: input.userTypeId,
      user_type: input.userType,
      invite_status: input.inviteStatus,
    });
  }

  async findDistinctPropertyIdsByUserId(userId: number): Promise<number[]> {
    const rows = await this.propertyStakeholderEntityRepository
      .createQueryBuilder('stakeholder')
      .select('DISTINCT stakeholder.property_id', 'property_id')
      .where('stakeholder.user_id = :userId', { userId })
      .orderBy('stakeholder.property_id', 'DESC')
      .getRawMany<{ property_id: number }>();

    return rows.map((row) => Number(row.property_id)).filter((id) => id > 0);
  }

  async findById(id: number): Promise<PropertyStakeholderEntity | null> {
    return this.propertyStakeholderEntityRepository.findOne({
      where: { id },
    });
  }

  async updateInviteTimestamp(id: number): Promise<void> {
    await this.propertyStakeholderEntityRepository.update(id, {
      last_invite_sent_at: new Date(),
    });
  }

  async updateDecision(id: number, decision: string): Promise<void> {
    await this.propertyStakeholderEntityRepository.update(id, { contract_decision: decision });
  }

  async countStakeholdersByPropertyAndRole(
    propertyId: number,
    userTypeId: number,
  ): Promise<number> {
    return this.propertyStakeholderEntityRepository.count({
      where: {
        property_id: propertyId,
        user_type_id: userTypeId,
      },
    });
  }
}
