import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, randomUUID, scryptSync } from 'crypto';
import { existsSync } from 'fs';
import { Request, Response } from 'express';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { VideoProcessingService } from '@/api/modules/infrastructure/services/video-processing.service';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { InvitePropertyStakeholderDto } from '@/api/modules/property/dto/invite-property-stakeholder.dto';
import { ContractGateway } from '@/api/modules/property/gateways/contract.gateway';
import { PropertyPurchaseContractStatus } from '@/common/entities/property-purchase-contract/property-purchase-contract.entity';
import { PropertyPurchaseContractRepository } from '@/api/modules/property/repositories/property-purchase-contract.repository';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertyStakeholderRepository } from '@/api/modules/property/repositories/property-stakeholder.repository';
import type { CreatePropertyInput } from '@/api/modules/property/types/property-service.types';
import { PropertyStatus } from '@/api/modules/property/types/property-status.enum';
import { PropertyPurchaseContractSource } from '@/api/modules/property/types/property-purchase-contract-source.enum';
import type {
  PropertyMediaKeys,
  PropertyMediaWithSignedUrls,
} from '@/api/modules/property/types/property-media.types';
import type { UploadPurchaseContractDto } from '@/api/modules/property/dto/upload-purchase-contract.dto';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { PropertyActivityRepository } from '@/api/modules/property/repositories/property-activity.repository';
import { PropertySocialPostRepository } from '@/api/modules/social-posting/repositories/property-social-post.repository';
import type { PropertyEntity } from '@/common/entities/property/property.entity';
import type { ListMyPropertiesDto } from '@/api/modules/property/dto/list-my-properties.dto';
import { FulfillmentStatus } from '@/api/modules/property/types/fulfillment-status.enum';
import { ContractDecision } from '@/api/modules/property/types/contract-decision.enum';
import { PropertyPurchaseContractDecisionRepository } from '../repositories/property-purchase-contract-decision.repository';
import { PropertyPurchaseContractTemplateRepository } from '../repositories/property-purchase-contract-template.repository';
import { PropertyQrScanRepository } from '../repositories/property-qr-scan.repository';
import { PropertyInquiryRepository } from '../repositories/property-inquiry.repository';
import { PricingService } from '@/api/modules/pricing/pricing.service';
import { UserTypes } from '@/common/enums/user-types';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NotificationService } from '@/api/modules/notification/services/notification.service';
import * as geoip from 'geoip-lite';

const MAX_PROPERTY_IMAGES = 10;
const MAX_REMOVAL_KEY_LENGTH = 1024;

@Injectable()
export class PropertyService {
  private readonly logger = new Logger(PropertyService.name);
  private readonly maxImageSizeBytes = 10 * 1024 * 1024;
  private readonly inquiryEvents = new Subject<any>();

  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly propertyPurchaseContractRepository: PropertyPurchaseContractRepository,
    private readonly propertyPurchaseContractTemplateRepository: PropertyPurchaseContractTemplateRepository,
    private readonly propertyPurchaseContractDecisionRepository: PropertyPurchaseContractDecisionRepository,
    private readonly propertyStakeholderRepository: PropertyStakeholderRepository,
    private readonly propertyActivityRepository: PropertyActivityRepository,
    private readonly propertySocialPostRepository: PropertySocialPostRepository,
    private readonly userAccountService: UserAccountService,
    private readonly nodeMailerService: NodeMailerService,
    private readonly appwriteService: AppwriteService,
    private readonly contractGateway: ContractGateway,
    private readonly propertyQrScanRepository: PropertyQrScanRepository,
    private readonly propertyInquiryRepository: PropertyInquiryRepository,
    private readonly pricingService: PricingService,
    private readonly notificationService: NotificationService,
    private readonly videoProcessingService: VideoProcessingService,
  ) { }

  async createProperty(
    agentUserId: number,
    input: CreatePropertyInput,
  ): Promise<{ id: number; message: string }> {
    if (!agentUserId || Number.isNaN(agentUserId)) {
      throw new BadRequestException('Invalid agent user id in token');
    }

    const highlights = this.normalizeListingHighlights(input.listingHighlights);

    const agent = await this.userAccountService.findById(agentUserId);
    const capacity = await this.pricingService.getRemainingCapacity(agentUserId);

    if (capacity.remaining <= 0) {
        throw new ForbiddenException(
            `Property limit reached (${capacity.limit}). Please upgrade your plan or purchase extra slots on the Billing page to continue.`,
        );
    }

    const property = await this.propertyRepository.createProperty({
      agentUserId,
      ...input,
      listingHighlights: highlights,
      organizationId: agent?.organizationId,
    });

    await this.propertyActivityRepository.logActivity({
      property_id: property.id,
      actor_id: agentUserId,
      event: 'Property Created',
      description: `Property listing "${property.property_title}" was created.`,
      metadata: { title: property.property_title },
    });

    // Notify Agent
    await this.notificationService.createNotification(agentUserId, {
      type: 'PROPERTY_CREATED',
      title: 'Property Created',
      message: `Your property listing "${property.property_title}" has been created successfully.`,
      metadata: { propertyId: property.id },
    });

    // Notify Org Admins
    if (property.organization_id) {
      const admins = await this.userAccountService.findOrgAdmins(property.organization_id);
      for (const admin of admins) {
        if (admin.id === agentUserId) continue; // Don't notify agent twice
        await this.notificationService.createNotification(admin.id, {
          type: 'PROPERTY_CREATED',
          title: 'New Property Listing',
          message: `${agent?.name || 'An agent'} created a new property: "${property.property_title}".`,
          metadata: { propertyId: property.id },
        });
      }
    }

    return {
      id: property.id,
      message: 'Property created successfully',
    };
  }

  async uploadPropertyMedia(
    agentUserId: number,
    propertyId: number,
    files: Express.Multer.File[] | undefined,
  ): Promise<{
    added: PropertyMediaWithSignedUrls[];
    totalCount: number;
  }> {
    try {
      this.assertValidAgent(agentUserId);
      if (!files?.length) {
        throw new BadRequestException('At least one image file is required');
      }

      const property = await this.propertyRepository.findByIdAndAgent(
        propertyId,
        agentUserId,
      );
      if (!property) {
        throw new NotFoundException('Property not found');
      }

      const existing = Array.isArray(property.property_media)
        ? property.property_media
        : [];
      if (existing.length + files.length > MAX_PROPERTY_IMAGES) {
        throw new BadRequestException(
          `A property can have at most ${MAX_PROPERTY_IMAGES} images (${existing.length} already uploaded)`,
        );
      }

      const newItems: PropertyMediaKeys[] = [];
      const addedWithUrls: PropertyMediaWithSignedUrls[] = [];

      for (const file of files) {
        this.validateImageFile(file);
        const keys = await this.uploadOriginalToS3(propertyId, file);
        newItems.push(keys);
        addedWithUrls.push(await this.signMediaItem(keys));
      }

      const updated = await this.propertyRepository.appendPropertyMedia(
        propertyId,
        agentUserId,
        newItems,
      );
      if (!updated) {
        throw new NotFoundException('Property not found');
      }

      await this.propertyActivityRepository.logActivity({
        property_id: propertyId,
        actor_id: agentUserId,
        event: 'Media Uploaded',
        description: `${files.length} new media files were uploaded.`,
        metadata: { count: files.length },
      });

      return {
        added: addedWithUrls,
        totalCount: updated.property_media.length,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload property media');
    }
  }

  async getPropertyById(
    userId: number,
    propertyId: number,
  ): Promise<{
    id: number;
    agent_user_id: number;
    property_title: string;
    status: PropertyStatus;
    property_description: string;
    property_type: string;
    asking_price_monthly: string;
    beds: number;
    baths: number;
    total_sqft: number;
    street_address: string;
    city: string;
    zip_code: string;
    listing_highlights: string[];
    created_at: Date;
    updated_at: Date;
    property_media: PropertyMediaWithSignedUrls[];
    stakeholders: Array<{
      id: number;
      user: {
        id: number;
        name: string;
        email: string;
        profile_image_url: string | null;
        phone_number: string | null;
      };
      userType: {
        id: number;
        name: string;
      };
      status: string;
    }>;
    marketing_schedule?: Array<{
      id: number;
      platform: string;
      scheduled_for: Date | null;
      status: string;
    }>;
    contract_status?: {
      source: string;
      created_at: Date;
    };
    recent_activities?: Array<{
      event: string;
      description: string;
      created_at: Date;
      actor_name: string;
    }>;
  }> {
    this.assertValidAgent(userId);
    const user = await this.userAccountService.findById(userId);
    let property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const isCreator = property.agent_user_id === userId;
    const isOrgMember = user?.organizationId && property.organization_id === user.organizationId;

    if (!isCreator && !isOrgMember) {
      const stakeholder = await this.propertyStakeholderRepository.findByPropertyAndUserId(
        propertyId,
        userId,
      );
      if (!stakeholder) {
        throw new NotFoundException('Property not found or access denied');
      }
    }

    const stakeholderEntities =
      await this.propertyStakeholderRepository.listByPropertyId(propertyId);

  
    const stakeholderUserIds = [
      ...new Set([
        ...stakeholderEntities.map((s) => s.user_id),
        property.agent_user_id,
      ]),
    ].filter((id) => id > 0);
    
    const users = await this.userAccountService.listByIds(stakeholderUserIds);
    const userMap = new Map(users.map((u) => [u.id, u]));

    const activities = await this.getPropertyActivities(propertyId, 5);

    const marketing_schedule = await this.getPropertyMarketingSchedule(
      propertyId,
      property.agent_user_id,
      5,
    );

    const latestContract =
      await this.propertyPurchaseContractRepository.findLatestByPropertyId(
        propertyId,
      );

    const media = await this.mapMediaWithSignedUrls(property);

    return {
      id: property.id,
      agent_user_id: property.agent_user_id,
      property_title: property.property_title,
      status: property.status,
      property_description: property.property_description,
      property_type: property.property_type,
      asking_price_monthly: property.asking_price_monthly,
      beds: property.beds,
      baths: property.baths,
      total_sqft: property.total_sqft,
      street_address: property.street_address,
      city: property.city,
      zip_code: property.zip_code,
      listing_highlights: Array.isArray(property.listing_highlights)
        ? property.listing_highlights
        : [],
      created_at: property.created_at,
      updated_at: property.updated_at,
      property_media: media,
      stakeholders: [
        // Include Listing Agent
        await (async () => {
          const u = userMap.get(property.agent_user_id);
          return {
            id: 0, // System-assigned ID for the listing agent row
            user: {
              id: property.agent_user_id,
              name: u?.name || 'Listing Agent',
              email: u?.email || '',
              profile_image_url: u?.profilePictureUrl
                ? await this.appwriteService.getSignedURL(u.profilePictureUrl)
                : null,
              phone_number: u?.phoneNumber || null,
            },
            userType: {
              id: u?.userTypeId || 1,
              name: 'Listing Agent',
            },
            status: 'Active',
          };
        })(),
        ...await Promise.all(
          stakeholderEntities.map(async (s) => {
            const u = userMap.get(s.user_id);
            return {
              id: s.id,
              user: {
                id: s.user_id,
                name: s.name,
                email: s.email,
                profile_image_url: u?.profilePictureUrl
                  ? await this.appwriteService.getSignedURL(u.profilePictureUrl)
                  : null,
                phone_number: u?.phoneNumber || null,
              },
              userType: {
                id: s.user_type_id,
                name:
                  s.user_type_id === 2
                    ? 'Seller'
                    : s.user_type_id === 3
                    ? 'Buyer'
                    : s.user_type,
              },
              status: s.invite_status,
            };
          }),
        ),
      ],
      marketing_schedule,
      contract_status: latestContract
        ? {
            source: latestContract.input_source,
            created_at: latestContract.created_at,
          }
        : undefined,
      recent_activities: activities,
    };
  }

  async getPropertyActivities(propertyId: number, limit = 50) {
    const activityEntities =
      await this.propertyActivityRepository.listByProperty(propertyId, limit);
    const actorIds = [...new Set(activityEntities.map((a) => a.actor_id))];
    const actors = await this.userAccountService.listByIds(actorIds);
    const actorMap = new Map(actors.map((u) => [u.id, u]));

    return activityEntities.map((a) => ({
      event: a.event,
      description: a.description,
      created_at: a.created_at,
      actor_name: actorMap.get(a.actor_id)?.name || 'Unknown User',
    }));
  }

  async getPropertyMarketingSchedule(
    propertyId: number,
    agentUserId: number,
    limit = 50,
  ) {
    const posts = await this.propertySocialPostRepository.listByProperty(
      propertyId,
      agentUserId,
    );
    const targets = await this.propertySocialPostRepository.listTargetsByPostIds(
      posts.slice(0, limit).map((p) => p.id),
    );

    return targets.map((t) => ({
      id: t.id,
      platform: t.platform,
      scheduled_for: t.scheduled_for,
      created_at: t.created_at,
      status: t.status,
    }));
  }

  async listMyProperties(
    userId: number,
    query: ListMyPropertiesDto,
  ): Promise<{
    items: Array<{
      id: number;
      property_title: string;
      status: PropertyStatus;
      fulfillment_status: string;
      asking_price_monthly: string;
      street_address: string;
      city: string;
      zip_code: string;
      property_media: PropertyMediaWithSignedUrls[];
    }>;
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    this.assertValidAgent(userId);
    const user = await this.userAccountService.findById(userId);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { items, total } = await this.propertyRepository.listSummaryByUser({
      userId,
      page,
      limit,
      search: query.search,
      status: query.status,
      propertyType: query.type,
      organizationId: user?.isOrgOwner ? user?.organizationId : null
    });
    const mappedItems = await Promise.all(
      items.map(async (property) => ({
        id: property.id,
        property_title: property.property_title,
        status: property.status,
        fulfillment_status: property.fulfillment_status,
        asking_price_monthly: property.asking_price_monthly,
        street_address: property.street_address,
        city: property.city,
        zip_code: property.zip_code,
        property_media: await this.mapMediaWithSignedUrls(property),
      })),
    );
    return {
      items: mappedItems,
      meta: this.calculatePaginationMetadata(total, page, limit),
    };
  }

  private calculatePaginationMetadata(totalItems: number, page: number, limit: number) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalItems,
      itemCount: totalItems > 0 ? (page === totalPages ? totalItems - (page - 1) * limit : limit) : 0,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };
  }

  async removePropertyMedia(
    agentUserId: number,
    propertyId: number,
    key: string,
  ): Promise<{ removed: true; remainingCount: number }> {
    try {
      this.assertValidAgent(agentUserId);
      const normalizedKey = key?.trim();
      if (!normalizedKey) {
        throw new BadRequestException('Image key is required');
      }
      if (normalizedKey.length > MAX_REMOVAL_KEY_LENGTH) {
        throw new BadRequestException('Image key is too long');
      }

      const result =
        await this.propertyRepository.removePropertyMediaByOriginalKey(
          propertyId,
          agentUserId,
          normalizedKey,
        );
      if (!result) {
        throw new NotFoundException('Property not found');
      }
      if (!result.removed) {
        throw new NotFoundException('Image key not found in property media');
      }

      await this.appwriteService.deleteFile(normalizedKey);

      return {
        removed: true,
        remainingCount: Array.isArray(result.property.property_media)
          ? result.property.property_media.length
          : 0,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove property media');
    }
  }

  async uploadPurchaseContract(
    agentUserId: number,
    propertyId: number,
    body: UploadPurchaseContractDto,
    file?: Express.Multer.File,
  ): Promise<{
    id: number;
    property_id: number;
    document_key: string;
    input_source: PropertyPurchaseContractSource;
    is_latest: boolean;
    parent_id: number | null;
    signed_url: string | null;
  }> {
    this.assertValidAgent(agentUserId);
    const property = await this.propertyRepository.findByIdAndAgent(
      propertyId,
      agentUserId,
    );
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const htmlContent = body.htmlContent?.trim();
    if (file && htmlContent) {
      throw new BadRequestException(
        'Provide either file or htmlContent, not both',
      );
    }
    if (!file && !htmlContent) {
      throw new BadRequestException(
        'Either a PDF file or htmlContent is required',
      );
    }

    let source: PropertyPurchaseContractSource;
    let pdfBuffer: Buffer | null = null;
    if (file) {
      this.validatePdfFile(file);
      source = PropertyPurchaseContractSource.PDF;
      pdfBuffer = file.buffer;
    } else {
      source = PropertyPurchaseContractSource.HTML;
      if (body.generatePdf !== false) {
          pdfBuffer = await this.convertHtmlToPdfBuffer(htmlContent as string);
      }
    }

    const latest = await this.propertyPurchaseContractRepository.findLatestByPropertyId(propertyId);
    const canUpdate = body.allowUpdateLatest && latest && latest.input_source === PropertyPurchaseContractSource.HTML && source === PropertyPurchaseContractSource.HTML;

    const key = canUpdate ? latest.document_key : this.buildPurchaseContractKey(propertyId);
    
    if (pdfBuffer) {
        await this.appwriteService.uploadPDF(pdfBuffer, key);
    }

    let saved;
    if (canUpdate) {
        await this.propertyPurchaseContractRepository.updateVersion(latest.id, {
            html_content: htmlContent,
            updated_at: new Date()
        });
        saved = await this.propertyPurchaseContractRepository.findLatestByPropertyId(propertyId);
    } else {
        saved = await this.propertyPurchaseContractRepository.createLatestVersion({
            propertyId,
            documentKey: key,
            inputSource: source,
            htmlContent: htmlContent,
        });
    }

    if (!saved) {
        throw new InternalServerErrorException('Failed to save contract version');
    }

    // Move property out of draft and into Active status since it has a contract
    await this.propertyRepository.updateStatus(propertyId, PropertyStatus.ACTIVE);
    await this.syncPropertyFulfillmentStatus(propertyId);

    await this.propertyActivityRepository.logActivity({
      property_id: propertyId,
      actor_id: agentUserId,
      event: 'Contract Uploaded',
      description: `Purchase contract was uploaded via ${source}.`,
      metadata: { source },
    });

    const stakeholders = await this.propertyStakeholderRepository.listByPropertyId(propertyId);
    const notifiedUserIds = new Set<number>([agentUserId]);

    // Notify Agent
    await this.notificationService.createNotification(agentUserId, {
        type: 'CONTRACT_UPLOADED',
        title: 'Contract Drafted',
        message: `The purchase contract for ${property.property_title} has been successfully uploaded/drafted.`,
        metadata: { propertyId, contractId: saved.id }
    });

    // Notify Stakeholders (Buyer/Seller)
    for (const stakeholder of stakeholders) {
        if (notifiedUserIds.has(stakeholder.user_id)) continue;
        await this.notificationService.createNotification(stakeholder.user_id, {
            type: 'CONTRACT_UPLOADED',
            title: 'New Contract for Review',
            message: `A new purchase contract for ${property.property_title} is ready for your review.`,
            metadata: { propertyId, contractId: saved.id }
        });
        notifiedUserIds.add(stakeholder.user_id);
    }

    // Notify Org Admins
    if (property.organization_id) {
        const admins = await this.userAccountService.findOrgAdmins(property.organization_id);
        for (const admin of admins) {
            if (notifiedUserIds.has(admin.id)) continue;
            await this.notificationService.createNotification(admin.id, {
                type: 'CONTRACT_UPLOADED',
                title: 'New Property Contract',
                message: `A contract has been initiated for property: ${property.property_title}.`,
                metadata: { propertyId, contractId: saved.id }
            });
            notifiedUserIds.add(admin.id);
        }
    }

    this.contractGateway.emitContractUpdate(propertyId, 'versionUpdated', {
        versionId: saved.id,
        status: saved.status,
        source: saved.input_source,
        actorId: agentUserId
    });

    return {
      id: saved.id,
      property_id: saved.property_id,
      document_key: saved.document_key,
      input_source: saved.input_source,
      is_latest: saved.is_latest,
      parent_id: saved.parent_id,
      signed_url: await this.appwriteService.getSignedURL(
        saved.document_key,
        432000,
        'application/pdf',
        { responseContentDisposition: 'inline' },
      ),
    };
  }

    async listContractTemplates(): Promise<any[]> {
        try {
            const data = await this.propertyPurchaseContractTemplateRepository.findAll();
            this.logger.log(`Fetched ${data.length} contract templates`);
            return data;
        } catch (error: any) {
            this.logger.error(`Failed to fetch contract templates: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error retrieving contract templates');
        }
    }

    async getContractTemplate(id: number): Promise<any> {
        const template = await this.propertyPurchaseContractTemplateRepository.findById(id);
        if (!template) {
            throw new NotFoundException('Contract template not found');
        }
        return template;
    }

    async getContractVersion(id: number): Promise<any> {
        const version = await this.propertyPurchaseContractRepository.findById(id);
        if (!version) {
            throw new NotFoundException('Contract version not found');
        }
        
        return {
            ...version,
            signed_url: version.input_source === PropertyPurchaseContractSource.PDF || version.document_key 
                ? await this.appwriteService.getSignedURL(
                    version.document_key,
                    432000,
                    'application/pdf',
                    { responseContentDisposition: 'inline' }
                ).catch(() => null)
                : null
        };
    }

    async generateContractPdf(versionId: number): Promise<any> {
        const version = await this.propertyPurchaseContractRepository.findById(versionId);
        if (!version) {
            throw new NotFoundException('Contract version not found');
        }

        if (version.input_source !== PropertyPurchaseContractSource.HTML) {
            throw new BadRequestException('PDF generation is only available for HTML-sourced contracts');
        }

        const pdfBuffer = await this.convertHtmlToPdfBuffer(version.html_content as string);
        await this.appwriteService.uploadPDF(pdfBuffer, version.document_key);

        const signedUrl = await this.appwriteService.getSignedURL(
            version.document_key,
            432000,
            'application/pdf',
            { responseContentDisposition: 'inline' }
        );

        return { signed_url: signedUrl };
    }

    async listContractVersions(propertyId: number): Promise<any[]> {
        const versions = await this.propertyPurchaseContractRepository.listByPropertyId(propertyId);
        const stakeholders = await this.propertyStakeholderRepository.listByPropertyId(propertyId);

        return Promise.all(
            versions.map(async (v) => {
                const decisions = await this.propertyPurchaseContractDecisionRepository.listByContractId(v.id);
                const populatedDecisions = await Promise.all(decisions.map(async d => {
                    const stakeholder = stakeholders.find(s => s.user_id === d.user_id);
                    return {
                        ...d,
                        userName: stakeholder?.name || 'Unknown User'
                    };
                }));

                const stats = this.calculateConsensusStats(stakeholders, decisions);

                return {
                    ...v,
                    status: v.status || PropertyPurchaseContractStatus.PENDING,
                    decisions: populatedDecisions,
                    consensusStats: stats,
                    signed_url: v.document_key 
                        ? await this.appwriteService.getSignedURL(v.document_key, 432000, 'application/pdf', { responseContentDisposition: 'inline' }).catch(() => null)
                        : null
                };
            })
        );
    }

    async getLatestPurchaseContract(propertyId: number): Promise<{
        property_id: number;
        input_source: PropertyPurchaseContractSource;
        is_latest: boolean;
        signed_url: string | null;
    }> {
        const property = await this.propertyRepository.findById(propertyId);
        if (!property) {
            throw new NotFoundException('Property not found');
        }

        const latest = await this.propertyPurchaseContractRepository.findLatestByPropertyId(propertyId);
        if (!latest) {
            throw new NotFoundException('Latest purchase contract not found');
        }

        return {
            property_id: latest.property_id,
            input_source: latest.input_source,
            is_latest: latest.is_latest,
            signed_url: await this.appwriteService.getSignedURL(
                latest.document_key,
                432000,
                'application/pdf',
                { responseContentDisposition: 'inline' },
            ),
        };
    }

    async submitContractDecision(userId: number, propertyId: number, body: { decision: string; comment?: string }): Promise<any> {
        const latest = await this.propertyPurchaseContractRepository.findLatestByPropertyId(propertyId);
        if (!latest) {
            throw new NotFoundException('No active contract version found to decide on');
        }

        const stakeholder = await this.propertyStakeholderRepository.findByPropertyAndUserId(propertyId, userId);
        if (!stakeholder) {
            throw new ForbiddenException('You are not a stakeholder for this property');
        }

        const existingDecisions = await this.propertyPurchaseContractDecisionRepository.listByContractId(latest.id);
        const userDecision = existingDecisions.find(d => d.user_id === userId);
        
        if (userDecision?.decision === ContractDecision.REJECT && body.decision !== ContractDecision.REJECT) {
            throw new BadRequestException('You have rejected this version. Negotiation is blocked until a new version is created.');
        }

        const decision = await this.propertyPurchaseContractDecisionRepository.createOrUpdate({
            contract_id: latest.id,
            user_id: userId,
            decision: body.decision as ContractDecision,
            comment: body.comment
        });

        let newStatus = PropertyPurchaseContractStatus.PENDING;
        if (body.decision === ContractDecision.REJECT) {
            newStatus = PropertyPurchaseContractStatus.REJECTED;
        } else if (body.decision === ContractDecision.REQUEST_CHANGE) {
            newStatus = PropertyPurchaseContractStatus.REQUESTED_CHANGES;
        }

        if (newStatus !== PropertyPurchaseContractStatus.PENDING) {
            await this.propertyPurchaseContractRepository.updateVersion(latest.id, { status: newStatus });
        }

        await this.propertyActivityRepository.logActivity({
            property_id: propertyId,
            actor_id: userId,
            event: 'Contract Decision',
            description: `${stakeholder.name} marked the contract as ${body.decision}.`,
            metadata: { decision: body.decision, version: latest.id }
        });

        // Notify all stakeholders in real-time
        this.contractGateway.emitContractUpdate(propertyId, 'decisionSubmitted', {
            versionId: latest.id,
            userId,
            userName: stakeholder.name,
            decision: body.decision,
            comment: body.comment,
            versionStatus: newStatus
        });

        if (body.decision === ContractDecision.APPROVE) {
            await this.evaluateContractConsensus(propertyId, latest.id);
        }

        await this.syncPropertyFulfillmentStatus(propertyId);

        return decision;
    }

    private calculateConsensusStats(stakeholders: any[], decisions: any[]) {
        const decisionMap = new Map(decisions.map(d => [d.user_id, d.decision]));
        const requiredSigners = stakeholders.filter(s => 
            s.user_type_id === UserTypes.SELLER || s.user_type_id === UserTypes.BUYER
        );

        const getGroupStats = (typeId: number) => {
            const group = stakeholders.filter(s => s.user_type_id === typeId);
            return {
                total: group.length,
                approved: group.filter(s => decisionMap.get(s.user_id) === ContractDecision.APPROVE).length,
                rejected: group.filter(s => decisionMap.get(s.user_id) === ContractDecision.REJECT).length,
                requestChange: group.filter(s => decisionMap.get(s.user_id) === ContractDecision.REQUEST_CHANGE).length,
            };
        };

        const sellers = getGroupStats(UserTypes.SELLER);
        const buyers = getGroupStats(UserTypes.BUYER);

        const rejections = requiredSigners.filter(s => decisionMap.get(s.user_id) === ContractDecision.REJECT);
        
        return {
            totalSellers: sellers.total,
            approvedSellers: sellers.approved,
            rejectedSellers: sellers.rejected,
            requestChangeSellers: sellers.requestChange,
            totalBuyers: buyers.total,
            approvedBuyers: buyers.approved,
            rejectedBuyers: buyers.rejected,
            requestChangeBuyers: buyers.requestChange,
            totalRequired: requiredSigners.length,
            totalApproved: sellers.approved + buyers.approved,
            hasVetoed: rejections.length > 0
        };
    }

    private async syncPropertyFulfillmentStatus(propertyId: number): Promise<void> {
        const versions = await this.propertyPurchaseContractRepository.listByPropertyId(propertyId);
        const stakeholders = await this.propertyStakeholderRepository.listByPropertyId(propertyId);
        
        let status = 'Agent Upload';
        const hasVersions = versions.length > 0;
        
        if (hasVersions) {
            const latest = versions[0];
            const decisions = await this.propertyPurchaseContractDecisionRepository.listByContractId(latest.id);
            const stats = this.calculateConsensusStats(stakeholders, decisions);
            
            const buyersApproved = stats.totalBuyers > 0 && stats.approvedBuyers > (stats.rejectedBuyers + stats.requestChangeBuyers);
            const sellersApproved = stats.totalSellers > 0 && stats.approvedSellers > (stats.rejectedSellers + stats.requestChangeSellers);
            const allApproved = buyersApproved && sellersApproved;
            
            if (allApproved) {
                status = 'Deal Executed';
            } else if (buyersApproved) {
                status = 'Seller Review';
            } else {
                status = 'Buyer Review';
            }
        }
        
        await this.propertyRepository.updateFulfillmentStatus(propertyId, status);

        const allVersions = await this.listContractVersions(propertyId);
        this.contractGateway.emitContractUpdate(propertyId, 'versionsListUpdated', allVersions);
    }

    private async evaluateContractConsensus(propertyId: number, contractId: number): Promise<void> {
        const stakeholders = await this.propertyStakeholderRepository.listByPropertyId(propertyId);
        const decisions = await this.propertyPurchaseContractDecisionRepository.listByContractId(contractId);
        
        const stats = this.calculateConsensusStats(stakeholders, decisions);

        // Notify all stakeholders in real-time about the progress
        this.contractGateway.emitContractUpdate(propertyId, 'consensusUpdate', {
            versionId: contractId,
            stats
        });
        
        // Consensus reached if both seller group and buyer group have "majority" approval
        const buyersApproved = stats.totalBuyers > 0 && stats.approvedBuyers > (stats.rejectedBuyers + stats.requestChangeBuyers);
        const sellersApproved = stats.totalSellers > 0 && stats.approvedSellers > (stats.rejectedSellers + stats.requestChangeSellers);
        const allApproved = buyersApproved && sellersApproved;
        
        if (allApproved) {
            await this.propertyPurchaseContractRepository.updateVersion(contractId, { status: PropertyPurchaseContractStatus.APPROVED });
            // Set property status to COMPLETED when consensus is reached
            await this.propertyRepository.updateStatus(propertyId, PropertyStatus.COMPLETED);
            
            await this.propertyActivityRepository.logActivity({
                property_id: propertyId,
                actor_id: 0, // System
                event: 'Consensus Reached',
                description: 'The required groups have met the threshold to approve the purchase contract.',
                metadata: { version: contractId }
            });

            // Re-emit status update as it's now officially APPROVED
            this.contractGateway.emitContractUpdate(propertyId, 'decisionSubmitted', {
                versionId: contractId,
                versionStatus: PropertyPurchaseContractStatus.APPROVED
            });
        }
    }

  async inviteStakeholder(
    agentUserId: number,
    propertyId: number,
    body: InvitePropertyStakeholderDto,
  ): Promise<{
    id: number;
    property_id: number;
    user_id: number;
    email: string;
    invite_status: 'pending' | 'completed';
    isExistingUser: boolean;
  }> {
    this.assertValidAgent(agentUserId);
    const property = await this.propertyRepository.findByIdAndAgent(
      propertyId,
      agentUserId,
    );
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const normalizedEmail = this.normalizeEmail(body.email);
    const normalizedName = body.name?.trim();
    if (!normalizedName) {
      throw new BadRequestException('name is required');
    }

    const subscription = await this.pricingService.getUserCurrentSubscription(agentUserId);
    const pkg = subscription?.package;

    // Enforcement: Dynamic stakeholder limits
    if (pkg) {
      if (body.userTypeId === UserTypes.BUYER || body.userTypeId === UserTypes.SELLER) {
        const count = await this.propertyStakeholderRepository.countStakeholdersByPropertyAndRole(
          propertyId,
          body.userTypeId,
        );
        const roleName = body.userTypeId === UserTypes.BUYER ? 'Buyer' : 'Seller';
        const limit = pkg.stakeholderLimit || 1;
        
        if (count >= limit) {
          throw new ForbiddenException(
            `Limit reached. Your plan allows only ${limit} ${roleName} invitation${limit > 1 ? 's' : ''} per property.`,
          );
        }
      }
    }

    const existingStakeholder =
      await this.propertyStakeholderRepository.findByPropertyAndEmail(
        propertyId,
        normalizedEmail,
      );
    if (existingStakeholder) {
      throw new ConflictException(
        'Stakeholder already invited for this property',
      );
    }

    const existingUser =
      await this.userAccountService.findByEmail(normalizedEmail);
    const isExistingUser = Boolean(existingUser);
    let userId = existingUser?.id;
    let tempPassword: string | null = null;
    let inviteStatus: 'pending' | 'completed' = 'completed';

    if (!existingUser) {
      tempPassword = this.generateTempPassword();
      const createdUser = await this.userAccountService.createUser({
        name: normalizedName,
        email: normalizedEmail,
        passwordHash: this.hashPassword(tempPassword),
        tempPassword,
        invitedBy: agentUserId,
        userTypeId: body.userTypeId,
      });
      userId = createdUser.id;
      inviteStatus = 'pending';
    }

    const stakeholder =
      await this.propertyStakeholderRepository.createStakeholder({
        propertyId,
        userId: userId as number,
        invitedBy: agentUserId,
        name: normalizedName,
        email: normalizedEmail,
        userTypeId: body.userTypeId,
        userType: body.userType,
        inviteStatus,
      });

    await this.propertyStakeholderRepository.updateInviteTimestamp(stakeholder.id);

    await this.propertyRepository.activatePropertyIfDraft(propertyId);
    await this.syncPropertyFulfillmentStatus(propertyId);

    await this.propertyActivityRepository.logActivity({
      property_id: propertyId,
      actor_id: agentUserId,
      event: 'Stakeholder Invited',
      description: `${normalizedName} was invited as ${body.userTypeId === 2 ? 'Seller' : body.userTypeId === 3 ? 'Buyer' : body.userType}.`,
      metadata: { name: normalizedName, email: normalizedEmail, role: body.userType },
    });

    await this.notificationService.createNotification(userId as number, {
        type: 'PROPERTY_INVITE',
        title: 'Property Invitation',
        message: `You have been invited to participate in the property: ${property.property_title}`,
        metadata: { propertyId, agentId: agentUserId }
    });

    await this.nodeMailerService.sendEmail(
      normalizedEmail,
      'stakeholder-invite',
      'Property Invitation',
      {
        recipientName: normalizedName,
        recipientEmail: normalizedEmail,
        propertyId,
        propertyTitle: property.property_title,
        tempPassword,
        isExistingUser,
        role: body.userTypeId === 2 ? 'Seller' : body.userTypeId === 3 ? 'Buyer' : (body.userType || 'Stakeholder'),
        loginUrl: `${process.env.BASE_URL_FRONTEND}/auth/login`,
        propertyPublicUrl: `${process.env.BASE_URL_FRONTEND}/publicView/property/${propertyId}`
      },
    );

    return {
      id: stakeholder.id,
      property_id: stakeholder.property_id,
      user_id: stakeholder.user_id,
      email: stakeholder.email,
      invite_status: stakeholder.invite_status as 'pending' | 'completed',
      isExistingUser,
    };
  }

  async resendStakeholderInvite(
    agentUserId: number,
    propertyId: number,
    stakeholderId: number,
  ): Promise<{ message: string }> {
    this.assertValidAgent(agentUserId);
    const stakeholder = await this.propertyStakeholderRepository.findById(stakeholderId);
    if (!stakeholder || stakeholder.property_id !== propertyId) {
      throw new NotFoundException('Stakeholder not found for this property');
    }

    if (stakeholder.invite_status !== 'pending') {
      throw new BadRequestException('Invitation can only be resent if status is pending');
    }

    if (stakeholder.last_invite_sent_at) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (stakeholder.last_invite_sent_at > oneHourAgo) {
        const diffMinutes = Math.ceil((stakeholder.last_invite_sent_at.getTime() - oneHourAgo.getTime()) / 60000);
        throw new BadRequestException(`Please wait ${diffMinutes} minutes before resending the invite`);
      }
    }
    
    await this.nodeMailerService.sendEmail(
      stakeholder.email,
      'stakeholder-invite',
      'Property Invitation (Resend)',
      {
        recipientName: stakeholder.name,
        propertyId,
        tempPassword: null,
        isExistingUser: true,
      },
    );

    await this.propertyStakeholderRepository.updateInviteTimestamp(stakeholder.id);

    await this.propertyActivityRepository.logActivity({
      property_id: propertyId,
      actor_id: agentUserId,
      event: 'Invite Resent',
      description: `Invitation was resent to ${stakeholder.name}.`,
      metadata: { name: stakeholder.name, email: stakeholder.email },
    });

    return { message: 'Invitation resent successfully' };
  }

  private async uploadOriginalToS3(
    propertyId: number,
    file: Express.Multer.File,
  ): Promise<PropertyMediaKeys> {
    const timestamp = Date.now();
    const uid = randomUUID();
    const extension = this.resolveExtension(file.mimetype);
    const basePath = `uploads/images/property/${propertyId}`;
    const originalKey = `${basePath}/original-${timestamp}-${uid}.${extension}`;

    await this.appwriteService.uploadFile(file, originalKey);

    return { originalKey };
  }

  private async signMediaItem(
    keys: PropertyMediaKeys,
  ): Promise<PropertyMediaWithSignedUrls> {
    return {
      originalKey: keys.originalKey,
      signedUrl: await this.appwriteService.getSignedURL(keys.originalKey),
    };
  }

  private async mapMediaWithSignedUrls(
    property: PropertyEntity,
  ): Promise<PropertyMediaWithSignedUrls[]> {
    const list = Array.isArray(property.property_media)
      ? property.property_media
      : [];
    const items = list
      .map((item) => this.extractOriginalKey(item))
      .filter((key): key is string => Boolean(key));
    return Promise.all(
      items.map((originalKey) => this.signMediaItem({ originalKey })),
    );
  }

  private extractOriginalKey(item: unknown): string | null {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const o = item as Record<string, unknown>;
    const key = o.originalKey;
    return typeof key === 'string' && key.trim() !== '' ? key.trim() : null;
  }

  private assertValidAgent(agentUserId: number): void {
    if (!agentUserId || Number.isNaN(agentUserId)) {
      throw new BadRequestException('Invalid agent user id in token');
    }
  }

  private validateImageFile(file: Express.Multer.File): void {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image uploads are allowed');
    }
    if (file.size > this.maxImageSizeBytes) {
      throw new BadRequestException('Image exceeds max size of 10MB');
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Allowed types: JPG, PNG, WEBP');
    }
  }

  private normalizeListingHighlights(raw: string[] | undefined): string[] {
    if (!raw?.length) {
      return [];
    }
    return raw
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter((h) => h.length > 0);
  }

  private resolveExtension(mimeType: string): string {
    if (mimeType === 'image/png') {
      return 'png';
    }
    if (mimeType === 'image/webp') {
      return 'webp';
    }
    return 'jpg';
  }

  private validatePdfFile(file: Express.Multer.File): void {
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }
    if (file.size <= 0) {
      throw new BadRequestException('Uploaded PDF file is empty');
    }
  }

  private normalizeEmail(email: string): string {
    const value = email?.trim().toLowerCase();
    if (!value) {
      throw new BadRequestException('email is required');
    }
    return value;
  }

  private generateTempPassword(): string {
    return randomBytes(9).toString('base64url');
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private buildPurchaseContractKey(propertyId: number): string {
    return `uploads/documents/property/${propertyId}/purchase-contract-${Date.now()}-${randomUUID()}.pdf`;
  }

  private async convertHtmlToPdfBuffer(html: string): Promise<Buffer> {
    if (!html.trim()) {
      throw new BadRequestException('htmlContent is empty');
    }
    try {
      return await this.generatePdfWithPuppeteer(html);
    } catch {
      const text = this.htmlToText(html);
      return this.generateSimplePdfBuffer(text);
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\s*\/p\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private generateSimplePdfBuffer(content: string): Buffer {
    const lines = content.split('\n');
    const maxLinesPerPage = 45;
    const pages: string[] = [];

    for (let i = 0; i < lines.length; i += maxLinesPerPage) {
      const pageLines = lines.slice(i, i + maxLinesPerPage);
      const pageContent = pageLines
        .map((line, idx) => {
          const escaped = line
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)');
          const y = 800 - idx * 16;
          return `BT /F1 11 Tf 50 ${y} Td (${escaped}) Tj ET`;
        })
        .join('\n');
      pages.push(pageContent || 'BT /F1 11 Tf 50 800 Td ( ) Tj ET');
    }

    const objects: string[] = [];
    objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');

    const pageObjectNumbers = pages.map((_, index) => 4 + index * 2);
    const kids = pageObjectNumbers.map((num) => `${num} 0 R`).join(' ');
    objects.push(
      `2 0 obj << /Type /Pages /Kids [${kids}] /Count ${pages.length} >> endobj`,
    );

    objects.push(
      '3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    );

    pages.forEach((pageContent, index) => {
      const pageObjectNumber = 4 + index * 2;
      const contentObjectNumber = 5 + index * 2;
      const contentBytes = Buffer.byteLength(pageContent, 'utf8');

      objects.push(
        `${pageObjectNumber} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >> endobj`,
      );
      objects.push(
        `${contentObjectNumber} 0 obj << /Length ${contentBytes} >> stream\n${pageContent}\nendstream endobj`,
      );
    });

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];
    for (const object of objects) {
      offsets.push(Buffer.byteLength(pdf, 'utf8'));
      pdf += `${object}\n`;
    }

    const xrefOffset = Buffer.byteLength(pdf, 'utf8');
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= objects.length; i += 1) {
      pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(pdf, 'utf8');
  }

  private async generatePdfWithPuppeteer(html: string): Promise<Buffer> {
    const puppeteer = (await import('puppeteer-core')) as {
      launch: (options: Record<string, unknown>) => Promise<{
        newPage: () => Promise<{
          setContent: (
            content: string,
            options: Record<string, unknown>,
          ) => Promise<void>;
          pdf: (options: Record<string, unknown>) => Promise<Uint8Array>;
          close: () => Promise<void>;
        }>;
        close: () => Promise<void>;
      }>;
    };
    const executablePath = this.resolveChromiumExecutablePath();

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      try {
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBytes = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '16mm', right: '12mm', bottom: '16mm', left: '12mm' },
        });
        return Buffer.from(pdfBytes);
      } finally {
        await page.close();
      }
    } finally {
      await browser.close();
    }
  }

  private resolveChromiumExecutablePath(): string | undefined {
    const configuredPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (configuredPath?.trim()) {
      return configuredPath;
    }
    const candidates = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome-stable',
    ];
    return candidates.find((path) => existsSync(path));
  }

  async recordQrScan(propertyId: number, ip: string): Promise<void> {
    try {
      const geo = geoip.lookup(ip);
      
      const latitude = geo?.ll?.[0] || 37.7749;
      const longitude = geo?.ll?.[1] || -122.4194;
      const city = geo?.city || 'San Francisco (Mock)';
      const country = geo?.country || 'US';

      await this.propertyQrScanRepository.createScan({
        property_id: propertyId,
        latitude,
        longitude,
        city,
        country,
        ip_address: ip,
      });

      this.logger.log(`Recorded QR scan for property ${propertyId} from ${ip} (${city})`);
    } catch (error) {
      this.logger.error(`Failed to record QR scan: ${(error as any).message}`);
    }
  }

  async getQrScanStats(propertyId: number): Promise<{ totalScans: number; latestScans: any[] }> {
    const [total, latest] = await Promise.all([
      this.propertyQrScanRepository.countByProperty(propertyId),
      this.propertyQrScanRepository.listLatestScans(propertyId, 5),
    ]);

    return {
      totalScans: total,
      latestScans: latest,
    };
  }

  async getPublicPropertyById(propertyId: number): Promise<any> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const agent = await this.userAccountService.findById(property.agent_user_id);

    const mediaWithUrls = await Promise.all(
      (property.property_media || []).map(async (item: any) => ({
        ...item,
        signedUrl: await this.appwriteService.getSignedURL(item.originalKey),
      })),
    );

    return {
      id: property.id,
      property_title: property.property_title,
      property_description: property.property_description,
      property_type: property.property_type,
      asking_price_monthly: property.asking_price_monthly,
      beds: property.beds,
      baths: property.baths,
      total_sqft: property.total_sqft,
      street_address: property.street_address,
      city: property.city,
      zip_code: property.zip_code,
      listing_highlights: property.listing_highlights,
      property_media: mediaWithUrls,
      status: property.status,
      agent: agent ? {
        name: agent.name,
        email: agent.email,
        phone_number: agent.phoneNumber || '-',
        calendly_url: agent.calendlyUrl,
      } : null,
    };
  }

  async submitInquiry(propertyId: number, input: any): Promise<{ message: string }> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const saved = await this.propertyInquiryRepository.createInquiry({
      propertyId,
      firstName: input.first_name,
      lastName: input.last_name,
      email: input.email,
      message: input.message,
    });

    this.inquiryEvents.next({
      ...saved,
      agent_user_id: property.agent_user_id,
      property_title: property.property_title
    });

    await this.propertyActivityRepository.logActivity({
      property_id: propertyId,
      actor_id: property.agent_user_id,
      event: 'New Inquiry',
      description: `New lead captured from ${input.first_name} ${input.last_name}.`,
      metadata: { 
        name: `${input.first_name} ${input.last_name}`,
        email: input.email 
      },
    });

    await this.notificationService.createNotification(property.agent_user_id, {
        type: 'NEW_INQUIRY',
        title: 'New Lead Captured',
        message: `You received a new inquiry from ${input.first_name} for ${property.property_title}.`,
        metadata: { propertyId, inquiryId: saved.id }
    });

    return { message: 'Inquiry submitted successfully' };
  }

  async listInquiriesForAgent(agentId: number, options: { page?: number; limit?: number; search?: string }) {
    return this.propertyInquiryRepository.listByAgent(agentId, options);
  }

  async markInquiryAsRead(id: number, agentId: number) {
    const success = await this.propertyInquiryRepository.markAsRead(id, agentId);
    if (!success) {
      throw new NotFoundException('Inquiry not found or access denied');
    }
    return { success: true };
  }

  getInquiryStream(agentId: number): Observable<MessageEvent> {
    return this.inquiryEvents.asObservable().pipe(
      filter(event => event.agent_user_id === agentId),
      map(event => ({ data: event } as MessageEvent))
    );
  }

  async getDashboardAnalytics(userId: number, roleId?: number) {
    const user = await this.userAccountService.findById(userId);
    return this.propertyRepository.getDashboardAnalytics(userId, roleId, user?.organizationId ?? undefined);
  }

  async generatePropertyVideo(agentUserId: number, propertyId: number): Promise<{ originalKey: string; signedUrl: string }> {
    const property = await this.propertyRepository.findByIdAndAgent(propertyId, agentUserId);
    if (!property) {
      throw new NotFoundException('Property not found or you are not the owner');
    }

    if (!property.property_media || property.property_media.length === 0) {
      throw new BadRequestException('No images available for this property to generate a video');
    }

    // 1. Get signed URLs for all images
    const signedUrls = await Promise.all(
      property.property_media.map((media) => this.appwriteService.getSignedURL(media.originalKey))
    );

    const validSignedUrls = signedUrls.filter((url): url is string => url !== null);

    if (validSignedUrls.length === 0) {
      throw new InternalServerErrorException('Failed to generate signed URLs for images');
    }

    // 2. Generate video
    const videoKey = await this.videoProcessingService.createVideoFromImages(validSignedUrls, propertyId);

    // 3. Attach video to property media
    await this.propertyRepository.appendPropertyMedia(propertyId, agentUserId, [
      {
        originalKey: videoKey
      }
    ]);

    // 4. Return signed URL for the new video
    const signedUrl = await this.appwriteService.getSignedURL(videoKey);

    return {
      originalKey: videoKey,
      signedUrl: signedUrl || '',
    };
  }
}
