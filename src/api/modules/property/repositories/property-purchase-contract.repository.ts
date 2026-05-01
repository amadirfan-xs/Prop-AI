import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PropertyPurchaseContractSource } from '@/api/modules/property/types/property-purchase-contract-source.enum';
import { PropertyPurchaseContractEntity, PropertyPurchaseContractStatus } from '@/common/entities/property-purchase-contract/property-purchase-contract.entity';
import { PROPERTY_PURCHASE_CONTRACT_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class PropertyPurchaseContractRepository {
  constructor(
    @Inject(PROPERTY_PURCHASE_CONTRACT_REPOSITORY)
    private readonly propertyPurchaseContractEntityRepository: Repository<PropertyPurchaseContractEntity>,
  ) {}

  async createLatestVersion(input: {
    propertyId: number;
    documentKey: string;
    inputSource: PropertyPurchaseContractSource;
    htmlContent?: string;
  }): Promise<PropertyPurchaseContractEntity> {
    return this.propertyPurchaseContractEntityRepository.manager.transaction(
      async (manager) => {
        const currentLatest = await manager.findOne(
          PropertyPurchaseContractEntity,
          {
            where: {
              property_id: input.propertyId,
              is_latest: true,
            },
            order: { id: 'DESC' },
          },
        );

        if (currentLatest) {
          await manager.update(
            PropertyPurchaseContractEntity,
            { id: currentLatest.id },
            { 
              is_latest: false,
              status: PropertyPurchaseContractStatus.SUPERSEDED
            },
          );
        }

        const created = manager.create(PropertyPurchaseContractEntity, {
          property_id: input.propertyId,
          document_key: input.documentKey,
          input_source: input.inputSource,
          is_latest: true,
          parent_id: currentLatest ? currentLatest.id : null,
          html_content: input.htmlContent || null,
          status: PropertyPurchaseContractStatus.PENDING
        });

        return manager.save(PropertyPurchaseContractEntity, created);
      },
    );
  }

  findLatestByPropertyId(
    propertyId: number,
  ): Promise<PropertyPurchaseContractEntity | null> {
    return this.propertyPurchaseContractEntityRepository.findOne({
      where: {
        property_id: propertyId,
        is_latest: true,
      },
      order: { id: 'DESC' },
    });
  }

  findById(id: number): Promise<PropertyPurchaseContractEntity | null> {
    return this.propertyPurchaseContractEntityRepository.findOne({
      where: { id },
    });
  }

  async updateVersion(
    id: number,
    data: Partial<PropertyPurchaseContractEntity>,
  ): Promise<void> {
    await this.propertyPurchaseContractEntityRepository.update(id, data);
  }

  async listByPropertyId(
    propertyId: number,
  ): Promise<PropertyPurchaseContractEntity[]> {
    return this.propertyPurchaseContractEntityRepository.find({
      where: { property_id: propertyId },
      order: { created_at: 'DESC' },
    });
  }
}
