import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SocialDestinationEntity } from '@/common/entities/social-destination/social-destination.entity';
import { SOCIAL_DESTINATION_REPOSITORY } from '@/common/enums/repositories';

type UpsertSocialDestinationInput = {
  socialAccountId: number;
  platform: string;
  destinationId: string;
  destinationName: string;
  encryptedDestinationToken: string;
  isDefault?: boolean;
};

@Injectable()
export class SocialDestinationRepository {
  constructor(
    @Inject(SOCIAL_DESTINATION_REPOSITORY)
    private readonly repository: Repository<SocialDestinationEntity>,
  ) {}

  async upsertMany(
    inputs: UpsertSocialDestinationInput[],
  ): Promise<SocialDestinationEntity[]> {
    const saved: SocialDestinationEntity[] = [];
    for (const input of inputs) {
      const existing = await this.repository.findOne({
        where: {
          social_account_id: input.socialAccountId,
          platform: input.platform,
          destination_id: input.destinationId,
        },
      });
      if (existing) {
        existing.destination_name = input.destinationName;
        existing.destination_access_token_encrypted =
          input.encryptedDestinationToken;
        existing.is_default = Boolean(input.isDefault);
        existing.is_active = true;
        saved.push(await this.repository.save(existing));
        continue;
      }
      saved.push(
        await this.repository.save({
          social_account_id: input.socialAccountId,
          platform: input.platform,
          destination_id: input.destinationId,
          destination_name: input.destinationName,
          destination_access_token_encrypted: input.encryptedDestinationToken,
          is_default: Boolean(input.isDefault),
          is_active: true,
        }),
      );
    }
    return saved;
  }

  listByUserSocialAccountIds(
    socialAccountIds: number[],
  ): Promise<SocialDestinationEntity[]> {
    if (!socialAccountIds.length) {
      return Promise.resolve([]);
    }
    return this.repository.find({
      where: socialAccountIds.map((id) => ({
        social_account_id: id,
        is_active: true,
      })),
      order: { is_default: 'DESC', id: 'ASC' },
    });
  }

  findByIdForAccounts(
    destinationId: number,
    socialAccountIds: number[],
  ): Promise<SocialDestinationEntity | null> {
    if (!socialAccountIds.length) {
      return Promise.resolve(null);
    }
    return this.repository.findOne({
      where: socialAccountIds.map((accountId) => ({
        id: destinationId,
        social_account_id: accountId,
        is_active: true,
      })),
    });
  }

  findById(destinationId: number): Promise<SocialDestinationEntity | null> {
    return this.repository.findOne({
      where: { id: destinationId, is_active: true },
    });
  }

  async delete(destinationId: number): Promise<void> {
    await this.repository.delete(destinationId);
  }

  async deleteByPlatform(
    socialAccountIds: number[],
    platform: string,
  ): Promise<void> {
    if (!socialAccountIds.length) return;
    await this.repository.delete(
      socialAccountIds.map((id) => ({
        social_account_id: id,
        platform,
      })),
    );
  }
}
