import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyPurchaseContractDecisionEntity } from '@/common/entities/property-purchase-contract-decision/property-purchase-contract-decision.entity';
import { PROPERTY_PURCHASE_CONTRACT_DECISION_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class PropertyPurchaseContractDecisionRepository {
  constructor(
    @Inject(PROPERTY_PURCHASE_CONTRACT_DECISION_REPOSITORY)
    private readonly repository: Repository<PropertyPurchaseContractDecisionEntity>,
  ) {}

  async createOrUpdate(input: {
    contract_id: number;
    user_id: number;
    decision: string;
    comment?: string;
  }): Promise<PropertyPurchaseContractDecisionEntity> {
    const existing = await this.repository.findOne({
      where: {
        contract_id: input.contract_id,
        user_id: input.user_id,
      },
    });

    if (existing) {
      existing.decision = input.decision;
      existing.comment = input.comment || null;
      return this.repository.save(existing);
    }

    const created = this.repository.create({
      contract_id: input.contract_id,
      user_id: input.user_id,
      decision: input.decision,
      comment: input.comment || null,
    });
    return this.repository.save(created);
  }

  async listByContractId(contractId: number): Promise<PropertyPurchaseContractDecisionEntity[]> {
    return this.repository.find({
      where: { contract_id: contractId },
      order: { created_at: 'DESC' },
    });
  }
}
