import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  Req,
  Sse,
  MessageEvent,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { CreatePropertyDto } from '@/api/modules/property/dto/create-property.dto';
import { ListMyPropertiesDto } from '@/api/modules/property/dto/list-my-properties.dto';
import { InvitePropertyStakeholderDto } from '@/api/modules/property/dto/invite-property-stakeholder.dto';
import { RemovePropertyMediaDto } from '@/api/modules/property/dto/remove-property-media.dto';
import { UploadPurchaseContractDto } from '@/api/modules/property/dto/upload-purchase-contract.dto';
import { ListInquiryDto } from '@/api/modules/property/dto/list-inquiry.dto';
import { PropertyService } from '@/api/modules/property/services/property.service';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';

const MAX_FILES_PER_REQUEST = 10;

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Property')
@ApiBearerAuth('bearer')
@ApiForbiddenResponse({
  description: 'Authenticated but missing permission for this route',
})
@Controller('api/property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @ApiOperation({ summary: 'Create new property listing' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiOkResponse({ description: 'Property created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post()
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  createProperty(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreatePropertyDto,
  ): Promise<{ id: number; message: string }> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.createProperty(agentUserId, body);
  }

  @ApiOperation({
    summary:
      'Upload one or more property images (max 10 per property total); only original file stored in S3; originalKey saved in property_media JSON',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['files'],
    },
  })
  @ApiOkResponse({ description: 'Property media uploaded successfully' })
  @ApiBadRequestResponse({ description: 'Invalid files or limit exceeded' })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post(':propertyId/upload-media')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES_PER_REQUEST, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadMedia(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): ReturnType<PropertyService['uploadPropertyMedia']> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.uploadPropertyMedia(
      agentUserId,
      propertyId,
      files,
    );
  }

  @ApiOperation({
    summary:
      'Upload purchase contract PDF or provide HTML to convert and store as PDF in S3',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        htmlContent: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ description: 'Purchase contract saved successfully' })
  @ApiBadRequestResponse({
    description: 'Provide either a valid PDF file or htmlContent',
  })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post(':propertyId/purchase-contract')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  uploadPurchaseContract(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() body: UploadPurchaseContractDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): ReturnType<PropertyService['uploadPurchaseContract']> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.uploadPurchaseContract(
      agentUserId,
      propertyId,
      body,
      files?.[0],
    );
  }

  @ApiOperation({
    summary: 'Get latest purchase contract signed URL by property id',
  })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({
    description: 'Latest purchase contract returned successfully',
  })
  @ApiNotFoundResponse({
    description: 'Property not found or latest purchase contract missing',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Get(':propertyId/purchase-contract/latest')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getLatestPurchaseContract(
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): ReturnType<PropertyService['getLatestPurchaseContract']> {
    return this.propertyService.getLatestPurchaseContract(propertyId);
  }

  @Get(':propertyId/purchase-contract/versions/:versionId')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getPurchaseContractVersion(
    @Param('versionId', ParseIntPipe) versionId: number,
  ): ReturnType<PropertyService['getContractVersion']> {
    return this.propertyService.getContractVersion(versionId);
  }

  @Post(':propertyId/purchase-contract/versions/:versionId/generate-pdf')
  @UseGuards(AccessTokenAuthGuard)
  generatePurchaseContractPdf(
    @Param('versionId', ParseIntPipe) versionId: number,
  ): ReturnType<PropertyService['generateContractPdf']> {
    return this.propertyService.generateContractPdf(versionId);
  }

  @ApiOperation({ summary: 'Invite a stakeholder for a property' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiBody({ type: InvitePropertyStakeholderDto })
  @ApiOkResponse({ description: 'Stakeholder invited successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request payload' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post(':propertyId/invite-stakeholder')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  inviteStakeholder(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() body: InvitePropertyStakeholderDto,
  ): ReturnType<PropertyService['inviteStakeholder']> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.inviteStakeholder(
      agentUserId,
      propertyId,
      body,
    );
  }

  @ApiOperation({
    summary:
      'List current user properties (title, status, monthly price, address, and signed image URLs)',
  })
  @ApiOkResponse({ description: 'Properties returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Get('my-properties')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  listMyProperties(
    @Req() request: AuthenticatedRequest,
    @Query() query: ListMyPropertiesDto,
  ): ReturnType<PropertyService['listMyProperties']> {
    const userId = Number(request.user?.id);
    return this.propertyService.listMyProperties(userId, query);
  }

  @ApiOperation({
    summary:
      'List seller properties where current user is added as stakeholder (same fields as my-properties)',
  })
  @ApiOkResponse({ description: 'Seller properties returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiForbiddenResponse({
    description: 'Only seller users can access this endpoint',
  })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Get('seller-properties')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  listSellerProperties(
    @Req() request: AuthenticatedRequest,
    @Query() query: ListMyPropertiesDto,
  ): ReturnType<PropertyService['listMyProperties']> {
    const userId = Number(request.user?.id);
    return this.propertyService.listMyProperties(userId, query);
  }

    @ApiOperation({ summary: 'List all contract templates' })
    @ApiOkResponse({ description: 'Contract templates returned' })
    @Get('contract-templates')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    async listContractTemplates(): ReturnType<PropertyService['listContractTemplates']> {
      const data=await this.propertyService.listContractTemplates();
        return data;
    }

    @ApiOperation({ summary: 'Get a specific contract template' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ description: 'Contract template details returned' })
    @ApiNotFoundResponse({ description: 'Template not found' })
    @Get('contract-templates/:id')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    getContractTemplate(
        @Param('id', ParseIntPipe) id: number,
    ): ReturnType<PropertyService['getContractTemplate']> {
        return this.propertyService.getContractTemplate(id);
    }

    @ApiOperation({
        summary:
            'Get full property details; property_media includes originalKey + signedUrl per image',
    })
    @ApiParam({ name: 'propertyId', type: Number })
    @ApiOkResponse({ description: 'Property details returned' })
    @ApiNotFoundResponse({ description: 'Property not found' })
    @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
    @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
    @Get(':propertyId')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    getPropertyById(
        @Req() request: AuthenticatedRequest,
        @Param('propertyId', ParseIntPipe) propertyId: number,
    ): ReturnType<PropertyService['getPropertyById']> {
        const agentUserId = Number(request.user?.id);
        return this.propertyService.getPropertyById(agentUserId, propertyId);
    }

    @ApiOperation({ summary: 'List all versions of a purchase contract' })
    @ApiParam({ name: 'propertyId', type: Number })
    @ApiOkResponse({ description: 'Contract versions returned' })
    @Get(':propertyId/purchase-contract/versions')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    listContractVersions(
        @Param('propertyId', ParseIntPipe) propertyId: number,
    ): ReturnType<PropertyService['listContractVersions']> {
        return this.propertyService.listContractVersions(propertyId);
    }

    @ApiOperation({ summary: 'Submit a decision on the purchase contract' })
    @ApiParam({ name: 'propertyId', type: Number })
    @ApiOkResponse({ description: 'Decision submitted successfully' })
    @Post(':propertyId/contract/decision')
    @RegisterPermissions()
    @UseGuards(AccessTokenAuthGuard, PermissionGuard)
    submitContractDecision(
        @Req() request: AuthenticatedRequest,
        @Param('propertyId', ParseIntPipe) propertyId: number,
        @Body() body: { decision: string; comment?: string },
    ): ReturnType<PropertyService['submitContractDecision']> {
        const userId = Number(request.user?.id);
        return this.propertyService.submitContractDecision(userId, propertyId, body);
    }

  @ApiOperation({
    summary:
      'Remove a property media image by originalKey and delete it from storage',
  })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiBody({ type: RemovePropertyMediaDto })
  @ApiOkResponse({ description: 'Property media removed successfully' })
  @ApiBadRequestResponse({ description: 'Invalid key or request payload' })
  @ApiNotFoundResponse({
    description: 'Property not found or image key not found',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post(':propertyId/remove-media')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  removePropertyMedia(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() body: RemovePropertyMediaDto,
  ): ReturnType<PropertyService['removePropertyMedia']> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.removePropertyMedia(
      agentUserId,
      propertyId,
      body.key,
    );
  }

  @ApiOperation({ summary: 'Get property activity history' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Activity history returned' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @Get(':propertyId/activities')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getPropertyActivities(
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): ReturnType<PropertyService['getPropertyActivities']> {
    return this.propertyService.getPropertyActivities(propertyId, 50);
  }

  @ApiOperation({ summary: 'Get property marketing schedule' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Marketing schedule returned' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @Get(':propertyId/marketing')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getPropertyMarketing(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): ReturnType<PropertyService['getPropertyMarketingSchedule']> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.getPropertyMarketingSchedule(
      propertyId,
      agentUserId,
      50,
    );
  }

  @ApiOperation({ summary: 'Resend invitation to a pending stakeholder' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiParam({ name: 'stakeholderId', type: Number })
  @ApiOkResponse({ description: 'Invitation resent successfully' })
  @ApiBadRequestResponse({ description: 'User not pending or 1-hour limit' })
  @ApiNotFoundResponse({ description: 'Stakeholder not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post(':propertyId/stakeholders/:stakeholderId/resend-invite')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  resendInvite(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Param('stakeholderId', ParseIntPipe) stakeholderId: number,
  ): Promise<{ message: string }> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.resendStakeholderInvite(
      agentUserId,
      propertyId,
      stakeholderId,
    );
  }

  @ApiOperation({ summary: 'Get QR scan statistics for a property' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'QR scan statistics returned' })
  @Get(':propertyId/qr-stats')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getQrStats(
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): ReturnType<PropertyService['getQrScanStats']> {
    return this.propertyService.getQrScanStats(propertyId);
  }

  @ApiOperation({ summary: 'List all inquiries for the agent across all properties' })
  @Get('leads/inquiries')
  @UseGuards(AccessTokenAuthGuard)
  listInquiries(
    @Req() request: AuthenticatedRequest,
    @Query() query: ListInquiryDto
  ) {
    const agentId = Number(request.user?.id);
    return this.propertyService.listInquiriesForAgent(agentId, query);
  }

  @ApiOperation({ summary: 'SSE stream for new inquiries' })
  @Sse('leads/inquiries/stream')
  @UseGuards(AccessTokenAuthGuard)
  inquiryStream(@Req() request: AuthenticatedRequest) {
    const agentId = Number(request.user?.id);
    return this.propertyService.getInquiryStream(agentId);
  }

  @ApiOperation({ summary: 'Mark an inquiry as read' })
  @Patch('leads/inquiries/:id/read')
  @UseGuards(AccessTokenAuthGuard)
  markAsRead(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number
  ) {
    const agentId = Number(request.user?.id);
    return this.propertyService.markInquiryAsRead(id, agentId);
  }

  @ApiOperation({ summary: 'Get dashboard statistics and analytics' })
  @ApiOkResponse({ description: 'Dashboard stats returned successfully' })
  @Get('dashboard/stats')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  getDashboardStats(
    @Req() request: AuthenticatedRequest,
    @Query('roleId') roleId?: number,
  ) {
    const userId = Number(request.user?.id);
    return this.propertyService.getDashboardAnalytics(userId, roleId ? Number(roleId) : undefined);
  }

  @ApiOperation({ summary: 'Generate a video slideshow from property images' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Video generated successfully' })
  @Post(':propertyId/generate-video')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  generateVideo(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): Promise<{ originalKey: string; signedUrl: string }> {
    const agentUserId = Number(request.user?.id);
    return this.propertyService.generatePropertyVideo(agentUserId, propertyId);
  }
}
