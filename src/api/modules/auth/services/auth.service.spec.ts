import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync } from 'crypto';
import { DataSource } from 'typeorm';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { ENVConfigService } from '@/common/config/env.config';
import { UserEntity } from '@/common/entities/user/user.entity';
import { AuthService } from '@/api/modules/auth/services/auth.service';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function buildUser(overrides: Partial<UserEntity> = {}): UserEntity {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: hashPassword('Password123!'),
    tempPassword: null,
    verified: true,
    resetPIN: null,
    resetPINExpirationAt: null,
    resendPasswordLimit: 0,
    verificationCode: null,
    verificationCodeExpirationAt: null,
    resendEmailLimit: 0,
    profilePictureUrl: null,
    userTypeId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('AuthService forgot-password flow', () => {
  let userAccountService: jest.Mocked<UserAccountService>;
  let nodeMailerService: jest.Mocked<NodeMailerService>;
  let dataSource: jest.Mocked<DataSource>;
  let service: AuthService;

  beforeEach(() => {
    userAccountService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
      save: jest.fn(),
      updateResetPin: jest.fn(),
      updatePassword: jest.fn(),
    } as unknown as jest.Mocked<UserAccountService>;

    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('access-token'),
    } as unknown as JwtService;

    const envConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'a_secure_secret_key_123456789';
        if (key === 'EXPIRE_TIME') return '10';
        if (key === 'RESEND_PASSWORD_PIN_LIMIT') return '3';
        return '';
      }),
    } as unknown as ENVConfigService;

    nodeMailerService = {
      sendEmail: jest.fn(),
      sendMail: jest.fn(),
      sendTemplateMail: jest.fn(),
    } as unknown as jest.Mocked<NodeMailerService>;

    dataSource = {
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as jest.Mocked<DataSource>;

    service = new AuthService(
      userAccountService,
      jwtService,
      envConfigService,
      nodeMailerService,
      dataSource,
    );
  });

  it('login returns isTempPasswordUsed true and clears temp password', async () => {
    const user = buildUser({
      email: 'temp@example.com',
      passwordHash: hashPassword('TempPass123!'),
      tempPassword: 'TempPass123!',
    });
    userAccountService.findByEmail.mockResolvedValue(user);
    userAccountService.save.mockResolvedValue(user);

    const response = await service.login({
      email: 'temp@example.com',
      password: 'TempPass123!',
    });

    expect(response.isTempPasswordUsed).toBe(true);
    expect(userAccountService.save.mock.calls.length).toBe(1);
    expect(user.tempPassword).toBeNull();
  });

  it('change-temp-password updates password and marks stakeholder completed', async () => {
    userAccountService.findById.mockResolvedValue(
      buildUser({
        id: 15,
        passwordHash: hashPassword('TempPass123!'),
        tempPassword: null,
        invitedBy: 7,
      }),
    );
    userAccountService.updatePassword.mockResolvedValue(undefined);

    const response = await service.changeTempPassword(15, {
      previousPassword: 'TempPass123!',
      newPassword: 'NewPass123!',
    });

    expect(response.success).toBe(true);
    expect(userAccountService.updatePassword.mock.calls.length).toBe(1);
    expect(dataSource.createQueryBuilder.mock.calls.length).toBe(1);
  });

  it('change-temp-password rejects non-invited users', async () => {
    userAccountService.findById.mockResolvedValue(
      buildUser({
        id: 16,
        passwordHash: hashPassword('TempPass123!'),
        invitedBy: null,
      }),
    );

    await expect(
      service.changeTempPassword(16, {
        previousPassword: 'TempPass123!',
        newPassword: 'NewPass123!',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('change-password updates password without stakeholder update', async () => {
    userAccountService.findById.mockResolvedValue(
      buildUser({
        id: 20,
        passwordHash: hashPassword('CurrentPass123!'),
      }),
    );
    userAccountService.updatePassword.mockResolvedValue(undefined);

    const response = await service.changePassword(20, {
      previousPassword: 'CurrentPass123!',
      newPassword: 'AnotherPass123!',
    });

    expect(response.success).toBe(true);
    expect(userAccountService.updatePassword.mock.calls.length).toBe(1);
    expect(dataSource.createQueryBuilder.mock.calls.length).toBe(0);
  });

  it('forget-password throws when email not found', async () => {
    userAccountService.findByEmail.mockResolvedValue(null);

    await expect(
      service.forgetPassword({ email: 'missing@example.com' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('forget-password generates PIN and sends mail when PIN expired', async () => {
    const user = buildUser({
      resetPIN: '1234',
      resetPINExpirationAt: new Date(Date.now() - 60_000),
    });
    userAccountService.findByEmail.mockResolvedValue(user);
    userAccountService.save.mockResolvedValue(user);

    const response = await service.forgetPassword({ email: user.email });

    expect(response.success).toBe(true);
    expect(userAccountService.save.mock.calls.length).toBeGreaterThan(0);
    expect(nodeMailerService.sendEmail.mock.calls.length).toBe(1);
    const sendEmailCall = nodeMailerService.sendEmail.mock.calls[0];
    expect(sendEmailCall?.[0]).toBe(user.email);
    expect(sendEmailCall?.[1]).toBe('forget-password');
    expect(sendEmailCall?.[2]).toBe('Forget Password PIN');
    const emailContext = sendEmailCall?.[3];
    if (!emailContext || typeof emailContext !== 'object') {
      throw new Error('Expected email context object');
    }
    expect(emailContext).toHaveProperty('pin');
  });

  it('verify-pin fails on wrong PIN', async () => {
    userAccountService.findByEmail.mockResolvedValue(
      buildUser({
        resetPIN: '1234',
        resetPINExpirationAt: new Date(Date.now() + 60_000),
      }),
    );

    await expect(
      service.verifyPIN({ email: 'john@example.com', resetPIN: '4321' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('verify-pin fails on expired PIN', async () => {
    userAccountService.findByEmail.mockResolvedValue(
      buildUser({
        resetPIN: '1234',
        resetPINExpirationAt: new Date(Date.now() - 60_000),
      }),
    );

    await expect(
      service.verifyPIN({ email: 'john@example.com', resetPIN: '1234' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('new-password fails if same as old password', async () => {
    const currentPassword = 'Password123!';
    userAccountService.findByEmail.mockResolvedValue(
      buildUser({
        passwordHash: hashPassword(currentPassword),
        resetPIN: '1234',
        resetPINExpirationAt: new Date(Date.now() + 60_000),
      }),
    );

    await expect(
      service.newPassword({
        email: 'john@example.com',
        resetPIN: '1234',
        password: currentPassword,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('new-password success clears reset PIN fields', async () => {
    userAccountService.findByEmail.mockResolvedValue(
      buildUser({
        resetPIN: '1234',
        resetPINExpirationAt: new Date(Date.now() + 60_000),
      }),
    );
    userAccountService.updatePassword.mockResolvedValue(undefined);
    userAccountService.updateResetPin.mockResolvedValue(undefined);

    const response = await service.newPassword({
      email: 'john@example.com',
      resetPIN: '1234',
      password: 'NewPassword123!',
    });

    expect(response.success).toBe(true);
    expect(userAccountService.updatePassword.mock.calls.length).toBe(1);
    expect(userAccountService.updateResetPin.mock.calls.length).toBe(1);
    const clearResetPinCall =
      userAccountService.updateResetPin.mock.calls[0]?.[0];
    expect(clearResetPinCall).toMatchObject({
      resetPIN: null,
      resetPINExpirationAt: null,
    });
  });

  it('resend-pin enforces RESEND_PASSWORD_PIN_LIMIT', async () => {
    userAccountService.findByEmail.mockResolvedValue(
      buildUser({
        resendPasswordLimit: 3,
        resetPIN: '1234',
        resetPINExpirationAt: new Date(Date.now() - 60_000),
      }),
    );

    await expect(
      service.resendPIN(null, { type: 'password', email: 'john@example.com' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
