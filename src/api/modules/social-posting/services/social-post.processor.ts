import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SocialPostingService } from '@/api/modules/social-posting/services/social-posting.service';
import {
  SOCIAL_POST_JOB,
  SOCIAL_POST_QUEUE,
  type SocialPostJobPayload,
} from '@/api/modules/social-posting/types/social-queue.types';

@Processor(SOCIAL_POST_QUEUE)
export class SocialPostProcessor extends WorkerHost {
  private readonly logger = new Logger(SocialPostProcessor.name);

  constructor(private readonly socialPostingService: SocialPostingService) {
    super();
  }

  async process(job: Job<SocialPostJobPayload>): Promise<void> {
    if (job.name !== SOCIAL_POST_JOB) {
      this.logger.warn(`Unsupported job received: ${job.name}`);
      return;
    }
    await this.socialPostingService.processSocialPostTarget(job.data.targetId);
  }
}
