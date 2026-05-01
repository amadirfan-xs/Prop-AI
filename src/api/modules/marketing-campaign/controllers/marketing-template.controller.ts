import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { MARKETING_TEMPLATE_REPOSITORY } from '@/common/enums/repositories';
import { Repository } from 'typeorm';
import { MarketingTemplateEntity } from '@/common/entities/marketing/marketing-template.entity';

@ApiTags('Marketing Templates')
@ApiBearerAuth('bearer')
@Controller('api/marketing-templates')
export class MarketingTemplateController {
  constructor(
    @Inject(MARKETING_TEMPLATE_REPOSITORY)
    private readonly repository: Repository<MarketingTemplateEntity>,
  ) {}

  @ApiOperation({ summary: 'Get all marketing email templates' })
  @Get()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  async findAll() {
    return this.repository.find({
        order: { name: 'ASC' }
    });
  }
}
