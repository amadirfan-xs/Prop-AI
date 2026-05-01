import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { MarketingCampaignEntity } from '@/common/entities/marketing/marketing-campaign.entity';
import { MARKETING_CAMPAIGN_REPOSITORY } from '@/common/enums/repositories';
import { CAMPAIGN_QUEUE, CAMPAIGN_JOB, CampaignJobPayload } from '../types/campaign-queue.types';

@Injectable()
export class MarketingCampaignService {
  constructor(
    @Inject(MARKETING_CAMPAIGN_REPOSITORY)
    private readonly repository: Repository<MarketingCampaignEntity>,
    @InjectQueue(CAMPAIGN_QUEUE)
    private readonly campaignQueue: Queue<CampaignJobPayload>,
  ) {}

  async create(userId: number, dto: any) {
    const campaign = this.repository.create({
      userId,
      propertyId: dto.propertyId,
      emailConfigId: dto.emailConfigId,
      name: dto.name,
      subject: dto.subject,
      content: dto.content,
      recipients: dto.recipients,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      status: dto.scheduledAt ? 'scheduled' : 'pending',
    });

    const savedCampaign = await this.repository.save(campaign);

    // Queue the job
    const scheduledTime = dto.scheduledAt ? new Date(dto.scheduledAt).getTime() : 0;
    const serverTime = Date.now();
    const delay = dto.scheduledAt ? Math.max(0, scheduledTime - serverTime) : 0;

    console.log(`[Campaign Scheduling] Campaign: ${savedCampaign.id}`);
    console.log(`[Campaign Scheduling] Input string: ${dto.scheduledAt}`);
    console.log(`[Campaign Scheduling] Scheduled Time (ms): ${scheduledTime}`);
    console.log(`[Campaign Scheduling] Server Time (ms): ${serverTime}`);
    console.log(`[Campaign Scheduling] Calculated Delay (ms): ${delay}`);

    await this.campaignQueue.add(
      CAMPAIGN_JOB,
      { campaignId: savedCampaign.id },
      { delay },
    );

    return savedCampaign;
  }

  async findAll(userId: number) {
    return this.repository.find({
      where: { userId },
      relations: ['property', 'emailConfig'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: number, id: number) {
    const campaign = await this.repository.findOne({
      where: { id, userId },
      relations: ['property', 'emailConfig'],
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}
