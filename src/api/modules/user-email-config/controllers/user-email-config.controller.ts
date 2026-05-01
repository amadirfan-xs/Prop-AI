import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { UserEmailConfigService } from '../services/user-email-config.service';
import {
  CreateEmailConfigDto,
  UpdateEmailConfigDto,
} from '../dto/email-config.dto';

@ApiTags('User Email Configurations')
@ApiBearerAuth('bearer')
@Controller('api/user-email-configs')
export class UserEmailConfigController {
  constructor(private readonly service: UserEmailConfigService) {}

  @ApiOperation({ summary: 'Create a new email configuration' })
  @Post()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  create(@Req() req: { user: { id: number } }, @Body() dto: CreateEmailConfigDto) {
    return this.service.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get all email configurations for current user' })
  @Get()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  findAll(@Req() req: { user: { id: number } }) {
    return this.service.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Update an email configuration' })
  @Patch(':id')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  update(
    @Req() req: { user: { id: number } },
    @Param('id') id: string,
    @Body() dto: UpdateEmailConfigDto,
  ) {
    return this.service.update(req.user.id, +id, dto);
  }

  @ApiOperation({ summary: 'Delete an email configuration' })
  @Delete(':id')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  remove(@Req() req: { user: { id: number } }, @Param('id') id: string) {
    return this.service.remove(req.user.id, +id);
  }
}
