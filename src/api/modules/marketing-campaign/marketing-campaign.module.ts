import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '@/api/modules/auth/auth.module';
import { CoreModule } from '@/api/modules/core/core.module';
import { PermissionModule } from '@/api/modules/permission/permission.module';
import { MarketingCampaignService } from './services/marketing-campaign.service';
import { MarketingCampaignController } from './controllers/marketing-campaign.controller';
import { MarketingTemplateController } from './controllers/marketing-template.controller';
import { CampaignProcessor } from './services/campaign.processor';
import { EncryptionService } from '@/common/services/encryption.service';
import { DataSource } from 'typeorm';
import { MarketingCampaignEntity } from '@/common/entities/marketing/marketing-campaign.entity';
import { MarketingTemplateEntity } from '@/common/entities/marketing/marketing-template.entity';
import { DATA_SOURCE, MARKETING_CAMPAIGN_REPOSITORY, MARKETING_TEMPLATE_REPOSITORY } from '@/common/enums/repositories';
import { CAMPAIGN_QUEUE } from './types/campaign-queue.types';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    PermissionModule,
    BullModule.registerQueue({
      name: CAMPAIGN_QUEUE,
    }),
  ],
  controllers: [MarketingCampaignController, MarketingTemplateController],
  providers: [
    {
      provide: MARKETING_CAMPAIGN_REPOSITORY,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(MarketingCampaignEntity),
      inject: [DATA_SOURCE],
    },
    MarketingCampaignService,
    CampaignProcessor,
    EncryptionService,
  ],
  exports: [MarketingCampaignService],
})
export class MarketingCampaignModule {}
