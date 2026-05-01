import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { PropertyPurchaseContractRepository } from '@/api/modules/property/repositories/property-purchase-contract.repository';
import { PropertyRepository } from '@/api/modules/property/repositories/property.repository';
import { PropertyStakeholderRepository } from '@/api/modules/property/repositories/property-stakeholder.repository';
import { PropertyService } from '@/api/modules/property/services/property.service';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { AwsService } from '@/common/services/aws/aws.service';

describe('PropertyService stakeholder invites', () => {
  let propertyRepository: jest.Mocked<PropertyRepository>;
  let propertyPurchaseContractRepository: jest.Mocked<PropertyPurchaseContractRepository>;
  let propertyStakeholderRepository: jest.Mocked<PropertyStakeholderRepository>;
  let userAccountService: jest.Mocked<UserAccountService>;
  let nodeMailerService: jest.Mocked<NodeMailerService>;
  let awsService: jest.Mocked<AwsService>;
  let service: PropertyService;

  beforeEach(() => {
    propertyRepository = {
      createProperty: jest.fn(),
      findByIdAndAgent: jest.fn(),
      findById: jest.fn(),
      listSummaryByAgent: jest.fn(),
      listSummaryByIds: jest.fn(),
      appendPropertyMedia: jest.fn(),
      removePropertyMediaByOriginalKey: jest.fn(),
    } as unknown as jest.Mocked<PropertyRepository>;

    propertyPurchaseContractRepository = {
      createLatestVersion: jest.fn(),
      findLatestByPropertyId: jest.fn(),
    } as unknown as jest.Mocked<PropertyPurchaseContractRepository>;

    propertyStakeholderRepository = {
      findByPropertyAndEmail: jest.fn(),
      findByPropertyAndUserId: jest.fn(),
      findDistinctPropertyIdsByUserId: jest.fn(),
      createStakeholder: jest.fn(),
    } as unknown as jest.Mocked<PropertyStakeholderRepository>;

    userAccountService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
      save: jest.fn(),
      updateResetPin: jest.fn(),
      updatePassword: jest.fn(),
    } as unknown as jest.Mocked<UserAccountService>;

    nodeMailerService = {
      sendEmail: jest.fn(),
      sendMail: jest.fn(),
      sendTemplateMail: jest.fn(),
    } as unknown as jest.Mocked<NodeMailerService>;

    awsService = {
      uploadFile: jest.fn(),
      uploadPDF: jest.fn(),
      deleteFile: jest.fn(),
      getSignedURL: jest.fn(),
    } as unknown as jest.Mocked<AwsService>;

    service = new PropertyService(
      propertyRepository,
      propertyPurchaseContractRepository,
      propertyStakeholderRepository,
      userAccountService,
      nodeMailerService,
      awsService,
    );
  });

  it('marks invite completed when user account exists', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue({ id: 8 } as never);
    propertyStakeholderRepository.findByPropertyAndEmail.mockResolvedValue(
      null,
    );
    userAccountService.findByEmail.mockResolvedValue({
      id: 22,
      email: 'existing@example.com',
      invitedBy: null,
    } as never);
    propertyStakeholderRepository.createStakeholder.mockResolvedValue({
      id: 70,
      property_id: 8,
      user_id: 22,
      invited_by: 5,
      email: 'existing@example.com',
      invite_status: 'completed',
    } as never);

    const result = await service.inviteStakeholder(5, 8, {
      name: 'Existing User',
      email: 'existing@example.com',
      userTypeId: 2,
      userType: 'individual',
    });

    expect(result.invite_status).toBe('completed');
    expect(result.isExistingUser).toBe(true);
    expect(userAccountService.createUser.mock.calls.length).toBe(0);
    expect(nodeMailerService.sendEmail.mock.calls.length).toBe(1);
    expect(
      propertyStakeholderRepository.createStakeholder.mock.calls[0]?.[0],
    ).toMatchObject({ invitedBy: 5 });
  });

  it('marks invite pending and creates account when user is new', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue({ id: 8 } as never);
    propertyStakeholderRepository.findByPropertyAndEmail.mockResolvedValue(
      null,
    );
    userAccountService.findByEmail.mockResolvedValue(null);
    userAccountService.createUser.mockResolvedValue({
      id: 30,
      email: 'new@example.com',
      invitedBy: 5,
    } as never);
    propertyStakeholderRepository.createStakeholder.mockResolvedValue({
      id: 71,
      property_id: 8,
      user_id: 30,
      invited_by: 5,
      email: 'new@example.com',
      invite_status: 'pending',
    } as never);

    const result = await service.inviteStakeholder(5, 8, {
      name: 'New User',
      email: 'new@example.com',
      userTypeId: 2,
      userType: 'LLC',
    });

    expect(result.invite_status).toBe('pending');
    expect(result.isExistingUser).toBe(false);
    expect(userAccountService.createUser.mock.calls.length).toBe(1);
    expect(nodeMailerService.sendEmail.mock.calls.length).toBe(1);
    expect(userAccountService.createUser.mock.calls[0]?.[0]).toMatchObject({
      invitedBy: 5,
    });
    expect(
      propertyStakeholderRepository.createStakeholder.mock.calls[0]?.[0],
    ).toMatchObject({ invitedBy: 5 });
  });

  it('throws conflict when stakeholder already exists for same property', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue({ id: 8 } as never);
    propertyStakeholderRepository.findByPropertyAndEmail.mockResolvedValue({
      id: 88,
    } as never);

    await expect(
      service.inviteStakeholder(5, 8, {
        name: 'Existing Stakeholder',
        email: 'stakeholder@example.com',
        userTypeId: 2,
        userType: 'individual',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows same email across different properties', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue({ id: 9 } as never);
    propertyStakeholderRepository.findByPropertyAndEmail.mockResolvedValue(
      null,
    );
    userAccountService.findByEmail.mockResolvedValue({
      id: 22,
      email: 'same@example.com',
      invitedBy: null,
    } as never);
    propertyStakeholderRepository.createStakeholder.mockResolvedValue({
      id: 72,
      property_id: 9,
      user_id: 22,
      invited_by: 5,
      email: 'same@example.com',
      invite_status: 'completed',
    } as never);

    const result = await service.inviteStakeholder(5, 9, {
      name: 'Same Email',
      email: 'same@example.com',
      userTypeId: 2,
      userType: 'individual',
    });

    expect(result.property_id).toBe(9);
    expect(result.invite_status).toBe('completed');
  });

  it('throws not found when property is not owned by requester', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue(null);

    await expect(
      service.inviteStakeholder(5, 999, {
        name: 'No Property',
        email: 'none@example.com',
        userTypeId: 2,
        userType: 'individual',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists seller stakeholder properties with same summary shape', async () => {
    userAccountService.findById.mockResolvedValue({
      id: 44,
      userTypeId: 2,
    } as never);
    propertyStakeholderRepository.findDistinctPropertyIdsByUserId.mockResolvedValue(
      [9, 5],
    );
    propertyRepository.listSummaryByIds.mockResolvedValue({
      items: [
        {
          id: 9,
          property_title: 'Seller Property',
          status: 'Draft',
          asking_price_monthly: '3000.00',
          street_address: 'Test St',
          city: 'Test City',
          zip_code: '11111',
          property_media: [],
        },
      ],
      total: 1,
    } as never);

    const result = await service.listPropertiesForSeller(44, {});

    expect(result).toEqual([
      {
        id: 9,
        property_title: 'Seller Property',
        status: 'Draft',
        asking_price_monthly: '3000.00',
        street_address: 'Test St',
        city: 'Test City',
        zip_code: '11111',
        property_media: [],
      },
    ]);
    expect(propertyRepository.listSummaryByIds.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        propertyIds: [9, 5],
      }),
    );
  });

  it('rejects seller properties endpoint for non-seller users', async () => {
    userAccountService.findById.mockResolvedValue({
      id: 50,
      userTypeId: 1,
    } as never);

    await expect(
      service.listPropertiesForSeller(50, {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns latest purchase contract with signed URL', async () => {
    propertyRepository.findById.mockResolvedValue({ id: 8 } as never);
    propertyPurchaseContractRepository.findLatestByPropertyId.mockResolvedValue(
      {
        property_id: 8,
        document_key: 'uploads/documents/property/8/latest.pdf',
        input_source: 'pdf',
        is_latest: true,
      } as never,
    );
    awsService.getSignedURL.mockResolvedValue('https://signed.url');

    const result = await service.getLatestPurchaseContract(8);

    expect(result).toEqual({
      property_id: 8,
      input_source: 'pdf',
      is_latest: true,
      signed_url: 'https://signed.url',
    });
  });

  it('throws not found when latest purchase contract does not exist', async () => {
    propertyRepository.findById.mockResolvedValue({ id: 8 } as never);
    propertyPurchaseContractRepository.findLatestByPropertyId.mockResolvedValue(
      null,
    );

    await expect(service.getLatestPurchaseContract(8)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns property details when requester is invited stakeholder', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue(null);
    propertyStakeholderRepository.findByPropertyAndUserId.mockResolvedValue({
      id: 1,
      property_id: 8,
      user_id: 55,
    } as never);
    propertyRepository.findById.mockResolvedValue({
      id: 8,
      agent_user_id: 5,
      property_title: 'Stakeholder Property',
      status: 'Draft',
      property_description: 'desc',
      property_type: 'Condo',
      asking_price_monthly: '3000.00',
      beds: 2,
      baths: 2,
      total_sqft: 1000,
      street_address: 'Street',
      city: 'City',
      zip_code: '10000',
      listing_highlights: [],
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-02'),
      property_media: [],
    } as never);

    const result = await service.getPropertyById(55, 8);
    expect(result.id).toBe(8);
    expect(result.property_title).toBe('Stakeholder Property');
  });

  it('rejects property details when user is neither owner nor stakeholder', async () => {
    propertyRepository.findByIdAndAgent.mockResolvedValue(null);
    propertyStakeholderRepository.findByPropertyAndUserId.mockResolvedValue(
      null,
    );

    await expect(service.getPropertyById(77, 8)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
