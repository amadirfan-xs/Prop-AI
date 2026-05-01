import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';

class HealthCheckBodyDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

@ApiTags('ApiHealth')
@ApiBearerAuth('bearer')
@ApiForbiddenResponse({
  description: 'Authenticated but missing permission for this route',
})
@Controller('api/health')
export class ApiHealthController {
  @ApiOperation({
    summary:
      'Health check (use Authorize for Bearer JWT, or access-token header)',
  })
  @ApiOkResponse({ description: 'Health check successful' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid access token' })
  @Get()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  health(): { status: string } {
    return { status: 'ok' };
  }

  @ApiOperation({
    summary:
      'Health check with accessToken in body (optional; prefer Authorize Bearer)',
  })
  @ApiBody({ type: HealthCheckBodyDto })
  @ApiOkResponse({ description: 'Health check successful' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid access token' })
  @Post()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  healthWithBody(@Body() body: HealthCheckBodyDto): { status: string } {
    void body;
    return { status: 'ok' };
  }
}
