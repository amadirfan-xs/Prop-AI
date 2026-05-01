import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrganizationRepository } from '@/api/modules/organization/repositories/organization.repository';
import { OrganizationEntity } from '@/common/entities/organization/organization.entity';
import { UpgradeOrganizationDto } from '@/api/modules/organization/dto/upgrade-organization.dto';
import { InviteAgentDto } from '@/api/modules/organization/dto/invite-agent.dto';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { PricingService } from '@/api/modules/pricing/pricing.service';
import { UserTypes } from '@/common/enums/user-types';
import { randomBytes } from 'crypto';
import { scryptSync } from 'crypto';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userAccountService: UserAccountService,
    private readonly nodeMailerService: NodeMailerService,
    private readonly pricingService: PricingService,
    private readonly propertyRepository: PropertyRepository,
    private readonly configService: ConfigService,
  ) {}

  async upgradeToOrganizationalPlan(userId: number, dto: UpgradeOrganizationDto): Promise<OrganizationEntity> {
    const user = await this.userAccountService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const existingOrg = await this.organizationRepository.findByAgentId(userId);
    if (existingOrg) {
        throw new BadRequestException('You have already submitted an upgrade request. Multiple requests are not allowed.');
    }

    const organizationData: Partial<OrganizationEntity> = {
        name: dto.name,
        taxId: dto.taxId,
        headquarters: dto.headquarters,
        privacyPolicy: dto.privacyPolicy,
        companyDescription: dto.companyDescription,
        plan: dto.plan,
        isAuthorizedSigner: dto.isAuthorizedSigner,
        submittedByAgentId: userId,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        contactJobTitle: dto.contactJobTitle,
        numAgents: dto.numAgents,
        numListings: dto.numListings,
        logoUrl: dto.logoUrl,
        primaryColor: dto.primaryColor,
        websiteUrl: dto.websiteUrl,
        additionalNotes: dto.additionalNotes,
    };

    return await this.organizationRepository.createOrganization(organizationData);
  }

  async approveOrganizationUpgrade(orgId: number): Promise<{ success: boolean }> {
    const organization = await this.organizationRepository.findById(orgId);
    if (!organization) throw new NotFoundException('Organization not found');

    const agent = await this.userAccountService.findById(organization.submittedByAgentId);
    if (!agent) throw new NotFoundException('Requesting agent not found');

    agent.organizationId = organization.id;
    agent.isOrgOwner = true;
    agent.userTypeId = UserTypes.ORGANIZATION_OWNER;

    await this.userAccountService.save(agent);
    
    try {
        await this.pricingService.subscribeUserToOrganizationalPlan(agent.id);
    } catch (error) {
        console.error('Failed to subscribe agent to organizational plan:', error);
    }

    await this.userAccountService.addUserRole(agent.id, UserTypes.ORGANIZATION_OWNER);

    await this.propertyRepository.linkPropertiesToOrganization(agent.id, organization.id);

    try {
        await this.nodeMailerService.sendEmail(
            organization.contactEmail,
            'org-confirmation',
            'Organization Approved!',
            {
                name: agent.name,
                orgName: organization.name,
                loginUrl: `${this.configService.get('BASE_URL_FRONTEND')}/login`,
            }
        );
    } catch (error) {
        console.error('Failed to send org confirmation email:', error);
    }

    return { success: true };
  }

  async inviteAgent(inviterUserId: number, dto: InviteAgentDto): Promise<{ success: boolean; message: string }> {
    const inviter = await this.userAccountService.findById(inviterUserId);
    if (!inviter || !inviter.organizationId) {
      throw new BadRequestException('You must be part of an organization to invite agents');
    }

    const email = dto.email.trim().toLowerCase();
    
    if (dto.phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(dto.phone.replace(/\s+/g, ''))) {
            throw new BadRequestException('Invalid phone number format');
        }
    }

    const organization = await this.organizationRepository.findById(inviter.organizationId);
    if (!organization) throw new NotFoundException('Organization not found');

    let user = await this.userAccountService.findByEmail(email);

    if (user) {
      if (user.organizationId === inviter.organizationId) {
        throw new BadRequestException('This agent is already part of any organization');
      }
      user.organizationId = inviter.organizationId;
      user.status = 'INVITED';
      if (dto.phone) user.phoneNumber = dto.phone;
      await this.userAccountService.save(user);
      await this.userAccountService.addUserRole(user.id, UserTypes.ORG_AGENT);
    } else {
      const tempPassword = randomBytes(8).toString('hex');
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(tempPassword, salt, 64).toString('hex');
      const passwordHash = `${salt}:${hash}`;

      user = await this.userAccountService.createUser({
        name: dto.name,
        email: email,
        passwordHash: passwordHash,
        tempPassword: tempPassword,
        userTypeId: UserTypes.ORG_AGENT,
        organizationId: inviter.organizationId,
        status: 'INVITED',
        verified: false,
        phoneNumber: dto.phone || null,
        invitedBy: inviterUserId
      });
    }

    try {
        await this.nodeMailerService.sendEmail(
            email,
            'agent-invitation',
            `Invitation to join ${organization.name}`,
            {
                name: user.name,
                orgName: organization.name,
                tempPassword: user.tempPassword,
                loginUrl: `${this.configService.get('BASE_URL_FRONTEND')}/login`,
            }
        );
    } catch (error) {
        console.error('Failed to send agent invitation email:', error);
    }

    return { 
      success: true, 
      message: user.tempPassword ? 'Agent created and invited' : 'Agent linked and invited'
    };
  }

  async getDashboardData(userId: number): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found for this user.');
    }

    const orgId = user.organizationId;

    const [stats, agents, activities, properties] = await Promise.all([
      this.organizationRepository.getDashboardStats(orgId),
      this.organizationRepository.getAgentPerformance(orgId, 5),
      this.organizationRepository.getRecentActivity(orgId, 5),
      this.organizationRepository.getRecentProperties(orgId, 2),
    ]);

    return {
      stats,
      agents,
      activities,
      properties
    };
  }

  async getPaginatedActivities(userId: number, params: any): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getPaginatedActivity(user.organizationId, params);
  }

  async getPaginatedProperties(userId: number, params: any): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getPaginatedProperties(user.organizationId, params);
  }

  async getAgentStats(userId: number): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getAgentStats(user.organizationId);
  }

  async getAgents(userId: number, params: any): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getAgents(user.organizationId, {
        page: Number(params.page || 1),
        limit: Number(params.limit || 10),
        search: params.search
    });
  }

  async getStakeholderStats(userId: number): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getStakeholderStats(user.organizationId);
  }

  async getStakeholders(userId: number, params: any): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getPaginatedStakeholders(user.organizationId, {
        page: Number(params.page || 1),
        limit: Number(params.limit || 10),
        search: params.search,
        type: params.type
    });
  }

  async getBrokerageSpotlight(userId: number): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getBrokerageSpotlight(user.organizationId);
  }

  async getStakeholderNeedsAttention(userId: number): Promise<any> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    return this.organizationRepository.getStakeholderNeedsAttention(user.organizationId);
  }

  async getMyOrganization(userId: number): Promise<OrganizationEntity> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    const org = await this.organizationRepository.findById(user.organizationId);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateMyOrganization(userId: number, dto: Partial<UpgradeOrganizationDto>): Promise<OrganizationEntity> {
    const user = await this.userAccountService.findById(userId);
    if (!user || !user.organizationId) {
      throw new BadRequestException('Unauthorized or organization not found');
    }
    const org = await this.organizationRepository.findById(user.organizationId);
    if (!org) throw new NotFoundException('Organization not found');

    // Update only the fields provided
    Object.assign(org, dto);
    
    return await this.organizationRepository.save(org);
  }
}
