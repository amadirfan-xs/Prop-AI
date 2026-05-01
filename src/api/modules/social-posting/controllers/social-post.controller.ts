import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, type Response } from 'express';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';
import { ConnectMetaDto } from '@/api/modules/social-posting/dto/connect-meta.dto';
import { CreateSocialPostDto } from '@/api/modules/social-posting/dto/create-social-post.dto';
import { StartSocialConnectDto } from '@/api/modules/social-posting/dto/start-social-connect.dto';
import { UpdateSocialPostStatusDto } from '@/api/modules/social-posting/dto/update-social-post-status.dto';
import { SocialPostingService } from '@/api/modules/social-posting/services/social-posting.service';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
  };
};

@ApiTags('Property Social')
@ApiBearerAuth('bearer')
@Controller('api/property')
export class SocialPostController {
  constructor(private readonly socialPostingService: SocialPostingService) {}

  @ApiOperation({
    summary: 'Start social OAuth flow and return authorization URL',
  })
  @ApiOkResponse({ description: 'Social OAuth URL generated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid platform or user token' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @Post('social/connect/start')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  startSocialConnect(
    @Req() request: AuthenticatedRequest,
    @Body() body: StartSocialConnectDto,
  ): ReturnType<SocialPostingService['startSocialConnect']> {
    return this.socialPostingService.startSocialConnect(
      Number(request.user?.id),
      body,
    );
  }

  @ApiOperation({ summary: 'OAuth callback endpoint for Meta social connect' })
  @ApiOkResponse({ description: 'Redirects to frontend success/failure URL' })
  @Get('social/connect/callback/meta')
  async completeMetaSocialConnect(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') providerError: string | undefined,
    @Query('error_description') providerErrorDescription: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const result =
      await this.socialPostingService.completeMetaConnectFromCallback({
        code,
        state,
        providerError,
        providerErrorDescription,
      });
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'OAuth callback endpoint for LinkedIn social connect' })
  @ApiOkResponse({ description: 'Redirects to frontend success/failure URL' })
  @Get('social/connect/callback/linkedin')
  async completeLinkedInSocialConnect(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') providerError: string | undefined,
    @Query('error_description') providerErrorDescription: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const result =
      await this.socialPostingService.completeLinkedInConnectFromCallback({
        code,
        state,
        providerError,
        providerErrorDescription,
      });
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'OAuth callback endpoint for TikTok social connect' })
  @ApiOkResponse({ description: 'Redirects to frontend success/failure URL' })
  @Get('social/connect/callback/tiktok')
  async completeTikTokSocialConnect(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') providerError: string | undefined,
    @Query('error_description') providerErrorDescription: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const result =
      await this.socialPostingService.completeTikTokConnectFromCallback({
        code,
        state,
        providerError,
        providerErrorDescription,
      });
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'Connect Meta account and sync FB/IG destinations' })
  @ApiOkResponse({ description: 'Meta account connected successfully' })
  @ApiBadRequestResponse({ description: 'Invalid OAuth code or redirect URI' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected server error' })
  @Post('social/meta/connect')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  connectMeta(
    @Req() request: AuthenticatedRequest,
    @Body() body: ConnectMetaDto,
  ): ReturnType<SocialPostingService['connectMeta']> {
    return this.socialPostingService.connectMeta(
      Number(request.user?.id),
      body,
    );
  }

  @ApiOperation({ summary: 'List linked social destinations for current user' })
  @ApiOkResponse({ description: 'Social destinations returned' })
  @Get('social/destinations')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  listDestinations(
    @Req() request: AuthenticatedRequest,
  ): ReturnType<SocialPostingService['listDestinations']> {
    return this.socialPostingService.listDestinations(Number(request.user?.id));
  }

  @ApiOperation({ summary: 'Create social post job (post now or schedule)' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Social posting job created' })
  @ApiBadRequestResponse({
    description: 'Invalid payload or destination state',
  })
  @Post(':propertyId/social-post')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  createSocialPost(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() body: CreateSocialPostDto,
  ): ReturnType<SocialPostingService['createSocialPost']> {
    return this.socialPostingService.createSocialPost(
      Number(request.user?.id),
      propertyId,
      body,
    );
  }

  @ApiOperation({ summary: 'List social posting history for a property' })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Social post history returned' })
  @Get(':propertyId/social-posts')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  listSocialPosts(
    @Req() request: AuthenticatedRequest,
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ): ReturnType<SocialPostingService['listSocialPosts']> {
    return this.socialPostingService.listSocialPosts(
      Number(request.user?.id),
      propertyId,
    );
  }

  @ApiOperation({
    summary: 'Clear queued jobs for a social post and set failed/cancelled',
  })
  @ApiParam({ name: 'socialPostId', type: Number })
  @ApiOkResponse({
    description: 'Social post status updated and queue cleared',
  })
  @Post('social-post/:socialPostId/status')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  updateSocialPostStatus(
    @Req() request: AuthenticatedRequest,
    @Param('socialPostId', ParseIntPipe) socialPostId: number,
    @Body() body: UpdateSocialPostStatusDto,
  ): ReturnType<SocialPostingService['updateSocialPostStatus']> {
    return this.socialPostingService.updateSocialPostStatus(
      Number(request.user?.id),
      socialPostId,
      body,
    );
  }

  @ApiOperation({ summary: 'Disconnect a social destination' })
  @ApiParam({ name: 'destinationId', type: Number })
  @ApiOkResponse({ description: 'Social destination disconnected' })
  @Delete('social/destinations/:destinationId')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  disconnectDestination(
    @Req() request: AuthenticatedRequest,
    @Param('destinationId', ParseIntPipe) destinationId: number,
  ): Promise<void> {
    return this.socialPostingService.disconnectDestination(
      Number(request.user?.id),
      destinationId,
    );
  }

  @ApiOperation({ summary: 'Disconnect all destinations for a platform' })
  @ApiParam({ name: 'platform', type: String })
  @ApiOkResponse({ description: 'Platform disconnected' })
  @Delete('social/connect/:platform')
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  disconnectPlatform(
    @Req() request: AuthenticatedRequest,
    @Param('platform') platform: string,
  ): Promise<void> {
    return this.socialPostingService.disconnectPlatform(
      Number(request.user?.id),
      platform,
    );
  }
}
