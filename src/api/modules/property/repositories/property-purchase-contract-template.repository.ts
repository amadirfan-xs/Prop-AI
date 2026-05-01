import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyPurchaseContractTemplateEntity } from '@/common/entities/property-purchase-contract-template/property-purchase-contract-template.entity';
import { PROPERTY_PURCHASE_CONTRACT_TEMPLATE_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class PropertyPurchaseContractTemplateRepository {
  constructor(
    @Inject(PROPERTY_PURCHASE_CONTRACT_TEMPLATE_REPOSITORY)
    private readonly repository: Repository<PropertyPurchaseContractTemplateEntity>,
  ) {}

  async findAll(): Promise<PropertyPurchaseContractTemplateEntity[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<PropertyPurchaseContractTemplateEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
