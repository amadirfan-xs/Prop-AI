import { Body, Controller, Post, UseGuards, Request, Param, ParseIntPipe, Get, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrganizationService } from '@/api/modules/organization/services/organization.service';
import { UpgradeOrganizationDto } from '@/api/modules/organization/dto/upgrade-organization.dto';
import { InviteAgentDto } from '@/api/modules/organization/dto/invite-agent.dto';
import { 
  ActivityQueryDto, 
  AgentQueryDto, 
  PropertyQueryDto, 
  StakeholderQueryDto 
} from '@/api/modules/organization/dto/query-params.dto';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { PermissionGuard } from '../../permission/guards/permission.guard';
import { RegisterPermissions } from '@/api/decorators/register-permission.decorator';

@ApiTags('Organization')
@ApiBearerAuth('bearer')
@Controller('api/organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Submit an upgrade request for organizational plan' })
  @ApiResponse({ status: 201, description: 'Upgrade request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Already submitted or invalid data' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Post('upgrade')
  async upgradeToOrganizationalPlan(@Request() req: any, @Body() dto: UpgradeOrganizationDto) {
    return this.organizationService.upgradeToOrganizationalPlan(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Approve an organization upgrade request (Admin only)' })
  @ApiResponse({ status: 200, description: 'Organization approved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Post('approve/:id')
  async approveOrganizationUpgrade(@Param('id', ParseIntPipe) orgId: number) {
    return this.organizationService.approveOrganizationUpgrade(orgId);
  }

  @ApiOperation({ summary: 'Invite a new agent to the organization' })
  @ApiResponse({ status: 201, description: 'Agent invited successfully' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Post('invite-agent')
  async inviteAgent(@Request() req: any, @Body() dto: InviteAgentDto) {
    return this.organizationService.inviteAgent(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get overall dashboard statistics for the organization' })
  @ApiResponse({ status: 200, description: 'Returns property, agent, and stakeholder statistics' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('dashboard/stats')
  async getDashboardData(@Request() req: any) {
    return this.organizationService.getDashboardData(req.user.id);
  }

  @ApiOperation({ summary: 'Get paginated recent activities across all organization properties' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of activities' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('activities')
  async getActivities(@Request() req: any, @Query() query: ActivityQueryDto) {
    const result = await this.organizationService.getPaginatedActivities(req.user.id, query);
    return {
      items: result.items,
      meta: {
        totalItems: result.total,
        itemsPerPage: Number(query.limit || 10),
        currentPage: Number(query.page || 1),
      },
    };
  }

  @ApiOperation({ summary: 'Get paginated properties owned by the organization' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of properties' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('properties')
  async getProperties(@Request() req: any, @Query() query: PropertyQueryDto) {
    const result = await this.organizationService.getPaginatedProperties(req.user.id, query);
    return {
      items: result.items,
      meta: {
        totalItems: result.total,
        itemsPerPage: Number(query.limit || 10),
        currentPage: Number(query.page || 1),
      },
    };
  }

  @ApiOperation({ summary: 'Get agent-specific metrics for the organization' })
  @ApiResponse({ status: 200, description: 'Returns stats on active vs invited agents' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('agent-stats')
  async getAgentStats(@Request() req: any) {
    return this.organizationService.getAgentStats(req.user.id);
  }

  @ApiOperation({ summary: 'Get paginated list of agents in the organization' })
  @ApiResponse({ status: 200, description: 'Returns paginated agent roster with performance metrics' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('agents')
  async getAgents(@Request() req: any, @Query() query: AgentQueryDto) {
    const result = await this.organizationService.getAgents(req.user.id, query);
    return {
        items: result.items,
        meta: {
            totalItems: result.total,
            itemsPerPage: Number(query.limit || 10),
            currentPage: Number(query.page || 1),
        },
    };
  }

  @ApiOperation({ summary: 'Get stakeholder demographics for the organization' })
  @ApiResponse({ status: 200, description: 'Returns buyer vs seller counts' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('stakeholder-stats')
  async getStakeholderStats(@Request() req: any) {
    return this.organizationService.getStakeholderStats(req.user.id);
  }

  @ApiOperation({ summary: 'Get paginated list of all stakeholders across organization properties' })
  @ApiResponse({ status: 200, description: 'Returns paginated stakeholder list' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('stakeholders')
  async getStakeholders(@Request() req: any, @Query() query: StakeholderQueryDto) {
    const result = await this.organizationService.getStakeholders(req.user.id, query);
    return {
        items: result.items,
        meta: {
            totalItems: result.total,
            itemsPerPage: Number(query.limit || 10),
            currentPage: Number(query.page || 1),
        },
    };
  }

  @ApiOperation({ summary: 'Get top-performing agent for the spotlight widget' })
  @ApiResponse({ status: 200, description: 'Returns the current spotlight agent statistics' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('stakeholders/spotlight')
  async getBrokerageSpotlight(@Request() req: any) {
    return this.organizationService.getBrokerageSpotlight(req.user.id);
  }

  @ApiOperation({ summary: 'Get urgent tasks or pending invitations for stakeholders' })
  @ApiResponse({ status: 200, description: 'Returns a list of items requiring attention' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('stakeholders/needs-attention')
  async getStakeholderNeedsAttention(@Request() req: any) {
    return this.organizationService.getStakeholderNeedsAttention(req.user.id);
  }

  @ApiOperation({ summary: 'Get current organization details' })
  @ApiResponse({ status: 200, description: 'Returns full organization profile' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Get('me')
  async getMyOrganization(@Request() req: any) {
    return this.organizationService.getMyOrganization(req.user.id);
  }

  @ApiOperation({ summary: 'Update organization details' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @RegisterPermissions()
  @UseGuards(AccessTokenAuthGuard, PermissionGuard)
  @Patch('me')
  async updateMyOrganization(@Request() req: any, @Body() dto: Partial<UpgradeOrganizationDto>) {
    return this.organizationService.updateMyOrganization(req.user.id, dto);
  }
}
