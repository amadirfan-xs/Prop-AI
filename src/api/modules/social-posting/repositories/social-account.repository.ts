import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SocialAccountEntity } from '@/common/entities/social-account/social-account.entity';
import { SOCIAL_ACCOUNT_REPOSITORY } from '@/common/enums/repositories';

type UpsertSocialAccountInput = {
  userId: number;
  platform: string;
  platformUserId: string;
  displayName: string | null;
  encryptedAccessToken: string;
  tokenExpiresAt: Date | null;
  scopes: string[];
};

@Injectable()
export class SocialAccountRepository {
  constructor(
    @Inject(SOCIAL_ACCOUNT_REPOSITORY)
    private readonly repository: Repository<SocialAccountEntity>,
  ) {}

  async upsert(input: UpsertSocialAccountInput): Promise<SocialAccountEntity> {
    const existing = await this.repository.findOne({
      where: {
        user_id: input.userId,
        platform: input.platform,
        platform_user_id: input.platformUserId,
      },
    });
    if (existing) {
      existing.display_name = input.displayName;
      existing.access_token_encrypted = input.encryptedAccessToken;
      existing.token_expires_at = input.tokenExpiresAt;
      existing.scopes = input.scopes;
      existing.is_active = true;
      existing.last_token_error = null;
      return this.repository.save(existing);
    }
    return this.repository.save({
      user_id: input.userId,
      platform: input.platform,
      platform_user_id: input.platformUserId,
      display_name: input.displayName,
      access_token_encrypted: input.encryptedAccessToken,
      token_expires_at: input.tokenExpiresAt,
      scopes: input.scopes,
      is_active: true,
      last_token_error: null,
      last_token_check_at: new Date(),
    });
  }

  listByUser(userId: number): Promise<SocialAccountEntity[]> {
    return this.repository.find({
      where: { user_id: userId, is_active: true },
      order: { id: 'ASC' },
    });
  }

  async markTokenIssue(accountId: number, errorMessage: string): Promise<void> {
    await this.repository.update(
      { id: accountId },
      {
        is_active: false,
        last_token_error: errorMessage,
        last_token_check_at: new Date(),
      },
    );
  }
}
