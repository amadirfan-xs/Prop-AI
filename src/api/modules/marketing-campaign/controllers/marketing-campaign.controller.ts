import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { MarketingCampaignService } from '../services/marketing-campaign.service';

@ApiTags('Marketing Campaigns')
@ApiBearerAuth('bearer')
@Controller('api/marketing-campaigns')
export class MarketingCampaignController {
  constructor(private readonly service: MarketingCampaignService) {}

  @ApiOperation({ summary: 'Create a new marketing campaign' })
  @Post()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  create(@Req() req: { user: { id: number } }, @Body() dto: any) {
    return this.service.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get all marketing campaigns for current user' })
  @Get()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  findAll(@Req() req: { user: { id: number } }) {
    return this.service.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get a specific marketing campaign' })
  @Get(':id')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  findOne(@Req() req: { user: { id: number } }, @Param('id') id: string) {
    return this.service.findOne(req.user.id, +id);
  }
}
