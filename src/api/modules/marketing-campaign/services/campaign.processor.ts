import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { MarketingCampaignEntity } from '@/common/entities/marketing/marketing-campaign.entity';
import { MARKETING_CAMPAIGN_REPOSITORY } from '@/common/enums/repositories';
import { EncryptionService } from '@/common/services/encryption.service';
import { CAMPAIGN_QUEUE, CAMPAIGN_JOB, CampaignJobPayload } from '../types/campaign-queue.types';

@Processor(CAMPAIGN_QUEUE)
export class CampaignProcessor extends WorkerHost {
  private readonly logger = new Logger(CampaignProcessor.name);

  constructor(
    @Inject(MARKETING_CAMPAIGN_REPOSITORY)
    private readonly repository: Repository<MarketingCampaignEntity>,
    private readonly encryptionService: EncryptionService,
  ) {
    super();
  }

  async process(job: Job<CampaignJobPayload>): Promise<void> {
    this.logger.log(`Processing campaign job ${job.id} for campaign ${job.data.campaignId}`);
    
    if (job.name !== CAMPAIGN_JOB) {
      this.logger.warn(`Unsupported job received: ${job.name}`);
      return;
    }

    const { campaignId } = job.data;
    const campaign = await this.repository.findOne({
      where: { id: campaignId },
      relations: ['emailConfig', 'property'],
    });

    if (!campaign) {
      this.logger.error(`Campaign ${campaignId} not found`);
      return;
    }

    if (!campaign.emailConfig) {
      this.logger.error(`No email configuration found for campaign ${campaignId}`);
      await this.repository.update(campaignId, { status: 'failed' });
      return;
    }

    try {
      await this.repository.update(campaignId, { status: 'sending' });

      const decryptedPassword = this.encryptionService.decrypt(
        campaign.emailConfig.encryptedAppPassword,
        campaign.emailConfig.iv
      );

      // Create dynamic transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Assuming Gmail for now as per project context, can be modernized later
        auth: {
          user: campaign.emailConfig.email,
          pass: decryptedPassword,
        },
      });

      // Send to all recipients
      for (const recipient of campaign.recipients) {
        try {
          // Replace property name in content/subject
          const subject = campaign.subject.replace(/{property_name}/g, campaign.property.property_title);
          const content = campaign.content.replace(/{property_name}/g, campaign.property.property_title);

          await transporter.sendMail({
            from: campaign.emailConfig.email,
            to: recipient,
            subject: subject,
            html: content,
          });
          
          this.logger.log(`Campaign ${campaignId}: Email sent to ${recipient}`);
        } catch (error) {
          this.logger.error(`Failed to send email to ${recipient}`, error);
        }
      }

      await this.repository.update(campaignId, { status: 'sent' });
      this.logger.log(`Campaign ${campaignId} completed successfully`);

    } catch (error) {
      this.logger.error(`Campaign ${campaignId} failed`, error);
      await this.repository.update(campaignId, { status: 'failed' });
    }
  }
}
