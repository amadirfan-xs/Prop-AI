import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SocialOauthSessionEntity } from '@/common/entities/social-oauth-session/social-oauth-session.entity';
import { SOCIAL_OAUTH_SESSION_REPOSITORY } from '@/common/enums/repositories';

type CreatePendingSocialOAuthSessionInput = {
  userId: number;
  platform: string;
  stateHash: string;
  expiresAt: Date;
};

@Injectable()
export class SocialOAuthSessionRepository {
  constructor(
    @Inject(SOCIAL_OAUTH_SESSION_REPOSITORY)
    private readonly repository: Repository<SocialOauthSessionEntity>,
  ) {}

  createPending(
    input: CreatePendingSocialOAuthSessionInput,
  ): Promise<SocialOauthSessionEntity> {
    return this.repository.save({
      user_id: input.userId,
      platform: input.platform,
      state_hash: input.stateHash,
      status: 'pending',
      expires_at: input.expiresAt,
      consumed_at: null,
      error_message: null,
      metadata: {},
    });
  }

  async consumePendingByStateHash(
    stateHash: string,
    now: Date,
  ): Promise<SocialOauthSessionEntity | null> {
    const session = await this.repository.findOne({
      where: {
        state_hash: stateHash,
        status: 'pending',
      },
      order: { id: 'DESC' },
    });
    if (!session) {
      return null;
    }
    if (session.expires_at.getTime() <= now.getTime()) {
      await this.repository.update(
        { id: session.id, status: 'pending' },
        {
          status: 'expired',
          error_message: 'OAuth session expired',
          consumed_at: now,
        },
      );
      return null;
    }
    const updated = await this.repository.update(
      { id: session.id, status: 'pending' },
      {
        status: 'consumed',
        consumed_at: now,
        error_message: null,
      },
    );
    if (!updated.affected) {
      return null;
    }
    session.status = 'consumed';
    session.consumed_at = now;
    return session;
  }

  async markSuccess(sessionId: number): Promise<void> {
    await this.repository.update(
      { id: sessionId },
      {
        status: 'success',
        error_message: null,
      },
    );
  }

  async markFailed(sessionId: number, message: string): Promise<void> {
    await this.repository.update(
      { id: sessionId },
      {
        status: 'failed',
        error_message: message,
      },
    );
  }
}
