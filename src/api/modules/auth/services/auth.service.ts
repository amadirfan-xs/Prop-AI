import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { DataSource } from 'typeorm';
import { NodeMailerService } from '@/api/modules/infrastructure/services/node-mailer.service';
import type {
  ChangePasswordInput,
  ChangeTempPasswordInput,
  ForgetPasswordInput,
  LoginInput,
  NewPasswordInput,
  ResendPINInput,
  SignUpInput,
  VerifyPINInput,
} from '@/api/modules/auth/types/auth-service.types';
import { UserAccountService } from '@/api/modules/user/services/user-account.service';
import { ENVConfigService } from '@/common/config/env.config';
import { DATA_SOURCE } from '@/common/enums/repositories';
import { UserTypes } from '@/common/enums/user-types';
import { PricingService } from '@/api/modules/pricing/pricing.service';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAccountService: UserAccountService,
    private readonly jwtService: JwtService,
    private readonly envConfigService: ENVConfigService,
    private readonly nodeMailerService: NodeMailerService,
    private readonly pricingService: PricingService,
    private readonly appwriteService: AppwriteService,
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
  ) { }

  async signUp(input: SignUpInput): Promise<{ success: true }> {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    this.validateCredentials(email, input.password, name);
    const passwordHash = this.hashPassword(input.password);
    const user = await this.userAccountService.createUser({
      name,
      email,
      passwordHash,
      userTypeId: UserTypes.AGENT, // Initial role for direct signup
    });

    await this.userAccountService.addUserRole(user.id, UserTypes.AGENT);

    // If not invited, subscribe to Free Plan
    if (user.invitedBy == null) {
      await this.pricingService.subscribeUserToDefaultPlan(user.id);
    }

    return { success: true };
  }

  async login(
    input: LoginInput,
  ): Promise<{ accessToken: string; isTempPasswordUsed: boolean }> {
    const email = input.email?.trim().toLowerCase();
    this.validateCredentials(email, input.password);
    const user = await this.userAccountService.findByEmail(email);
    if (!user || !this.verifyPassword(input.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Aggregating roles for the user
    const userRoles = await this.userAccountService.getUserRoles(user.id);
    const roles = userRoles.map((ur) => ur.userTypeId);

    // If no roles found in mapping, fallback to legacy userTypeId if present
    if (roles.length === 0 && user.userTypeId) {
      roles.push(user.userTypeId);
      // Automatically migrate to new mapping
      await this.userAccountService.addUserRole(user.id, user.userTypeId);
    }

    const payload = {
      id: user.id,
      name: user.name,
      profilePictureUrl: await this.appwriteService.getSignedURL(user.profilePictureUrl),
      primaryRole: user.userTypeId,
      status: user.status,
      roles,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.envConfigService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    const isTempPasswordUsed = Boolean(user.tempPassword);

    return { accessToken, isTempPasswordUsed };
  }

  async getMe(userId: number) {
    const user = await this.userAccountService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userRoles = await this.userAccountService.getUserRoles(user.id);
    const roles = userRoles.map((ur) => ur.userTypeId);

    // Legacy fallback/migration
    if (roles.length === 0 && user.userTypeId) {
      roles.push(user.userTypeId);
      await this.userAccountService.addUserRole(user.id, user.userTypeId);
    }

    const role = user.userTypeId;
    let currentSubscription: any = null;
    let organization: any = null;
    let organizationSubscription: any = null;

    // 1. Fetch Personal Subscription (only for Agents, Org Owners, and Org Agents)
    if ([UserTypes.AGENT, UserTypes.ORGANIZATION_OWNER, UserTypes.ORG_AGENT].includes(role as any)) {
      const sub = await this.pricingService.getUserCurrentSubscription(user.id);
      if (sub) {
        currentSubscription = {
          id: sub.id,
          packageName: sub.package?.name,
          status: sub.status,
          startDate: sub.startDate,
          endDate: sub.endDate,
        };
      }
    }

    // 2. Fetch Organization Data (only for Org Owners and Org Agents)
    if ([UserTypes.ORGANIZATION_OWNER, UserTypes.ORG_AGENT].includes(role as any) && user.organizationId) {
      const orgRepo = this.dataSource.getRepository('organization');
      const orgData = await orgRepo.findOneBy({ id: user.organizationId }) as any;

      if (orgData) {
        organization = {
          id: orgData.id,
          name: orgData.name,
          plan: orgData.plan,
          headquarters: orgData.headquarters,
          taxId: orgData.taxId,
          websiteUrl: orgData.websiteUrl,
          logoUrl: orgData.logoUrl ? await this.appwriteService.getSignedURL(orgData.logoUrl) : null,
          contactEmail: orgData.contactEmail,
          contactName: orgData.contactName,
          contactPhone: orgData.contactPhone,
        };

        if (orgData.submittedByAgentId) {
          const orgSub = await this.pricingService.getUserCurrentSubscription(orgData.submittedByAgentId);
          if (orgSub) {
            organizationSubscription = {
              id: orgSub.id,
              packageName: orgSub.package?.name,
              status: orgSub.status,
              startDate: orgSub.startDate,
              endDate: orgSub.endDate,
            };
          }
        }
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl
        ? await this.appwriteService.getSignedURL(user.profilePictureUrl)
        : null,
      primaryRole: role,
      roles,
      phoneNumber: user.phoneNumber,
      address: user.address,
      calendlyUrl: user.calendlyUrl,
      currentSubscription,
      organization,
      organizationSubscription,
      isTempPasswordUsed: Boolean(user.tempPassword),
    };
  }

  async updatePrimaryRole(userId: number, userTypeId: number): Promise<{ success: true }> {
    const user = await this.userAccountService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const userRoles = await this.userAccountService.getUserRoles(userId);
    const validRoles = userRoles.map(r => r.userTypeId);

    if (!validRoles.includes(userTypeId)) {
      throw new BadRequestException('User does not have this role assigned');
    }

    user.userTypeId = userTypeId;
    await this.userAccountService.save(user);

    return { success: true };
  }

  async forgetPassword(
    input: ForgetPasswordInput,
  ): Promise<{ success: true; expirationDate: Date }> {
    const email = input.email?.trim().toLowerCase();
    this.validateEmail(email);
    const user = await this.userAccountService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    let pin = user.resetPIN;
    let expirationDate = user.resetPINExpirationAt;

    if (!pin || !expirationDate || expirationDate <= now) {
      pin = this.generateResetPIN();
      expirationDate = this.getPINExpirationDate();
      user.resetPIN = pin;
      user.resetPINExpirationAt = expirationDate;
      user.resendPasswordLimit = 0;
      await this.userAccountService.save(user);
    }

    await this.nodeMailerService.sendEmail(
      user.email,
      'forget-password',
      'Forget Password PIN',
      { 
        pin,
        currentYear: new Date().getFullYear(),
      },
    );

    return { success: true, expirationDate };
  }

  async verifyPIN(input: VerifyPINInput): Promise<{ success: true }> {
    const email = input.email?.trim().toLowerCase();
    const resetPIN = input.resetPIN?.trim();
    this.validateEmail(email);
    this.validatePIN(resetPIN);

    const user = await this.userAccountService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.assertValidPIN(user.resetPIN, user.resetPINExpirationAt, resetPIN);

    return { success: true };
  }

  async newPassword(input: NewPasswordInput): Promise<{ success: true }> {
    const email = input.email?.trim().toLowerCase();
    const resetPIN = input.resetPIN?.trim();
    const password = input.password;
    this.validateEmail(email);
    this.validatePIN(resetPIN);
    this.validatePassword(password);

    const user = await this.userAccountService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.assertValidPIN(user.resetPIN, user.resetPINExpirationAt, resetPIN);

    if (this.verifyPassword(password, user.passwordHash)) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const passwordHash = this.hashPassword(password);
    await this.userAccountService.updatePassword({
      userId: user.id,
      passwordHash,
    });
    await this.userAccountService.updateResetPin({
      userId: user.id,
      resetPIN: null,
      resetPINExpirationAt: null,
      resendPasswordLimit: 0,
    });

    return { success: true };
  }

  async resendPIN(
    _token: string | null,
    input: ResendPINInput,
  ): Promise<{ success: true; expirationDate: Date }> {
    const email = input.email?.trim().toLowerCase();
    this.validateEmail(email);
    if (input.type !== 'password') {
      throw new BadRequestException(
        'Only password reset PIN resend is supported',
      );
    }

    const user = await this.userAccountService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const maxResendLimit = Number(
      this.envConfigService.get<string>('RESEND_PASSWORD_PIN_LIMIT'),
    );
    if (!Number.isFinite(maxResendLimit) || maxResendLimit < 0) {
      throw new InternalServerErrorException(
        'RESEND_PASSWORD_PIN_LIMIT is invalid',
      );
    }
    if (user.resendPasswordLimit >= maxResendLimit) {
      throw new ForbiddenException('Password PIN resend limit reached');
    }
    const now = new Date();
    let pin = user.resetPIN;
    let expirationDate = user.resetPINExpirationAt;

    if (!pin || !expirationDate || expirationDate <= now) {
      pin = this.generateResetPIN();
      expirationDate = this.getPINExpirationDate();
      
      await this.userAccountService.updateResetPin({
        userId: user.id,
        resetPIN: pin,
        resetPINExpirationAt: expirationDate,
        resendPasswordLimit: user.resendPasswordLimit + 1,
      });
    } else {
      // If PIN is still active, just increment resend limit for tracking but use same PIN
       await this.userAccountService.updateResetPin({
        userId: user.id,
        resetPIN: pin,
        resetPINExpirationAt: expirationDate,
        resendPasswordLimit: user.resendPasswordLimit + 1,
      });
    }

    await this.nodeMailerService.sendEmail(
      user.email,
      'forget-password',
      'Forget Password PIN',
      { 
        pin,
        currentYear: new Date().getFullYear()
      },
    );

    return { success: true, expirationDate };
  }

  async changeTempPassword(
    userId: number,
    input: ChangeTempPasswordInput,
  ): Promise<{ success: true }> {
    const user = await this.userAccountService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.tempPassword) {
      return { success: true };
    }

    return this.changePasswordInternal(
      userId,
      { newPassword: input.newPassword },
      true,
      false, // requireInvitedUser (set to false to unblock previously invited users)
      true, // skipVerification
    );
  }

  async changePassword(
    userId: number,
    input: ChangePasswordInput,
  ): Promise<{ success: true }> {
    return this.changePasswordInternal(userId, input, false, false);
  }

  private async changePasswordInternal(
    userId: number,
    input: { previousPassword?: string; newPassword: string },
    markStakeholderCompleted: boolean,
    requireInvitedUser: boolean,
    skipVerification: boolean = false,
  ): Promise<{ success: true }> {
    if (!userId || Number.isNaN(userId)) {
      throw new UnauthorizedException('Invalid user token payload');
    }

    const previousPassword = input.previousPassword?.trim();
    const newPassword = input.newPassword;

    if (!skipVerification) {
      if (!previousPassword) {
        throw new BadRequestException('Previous password is required');
      }
      this.validatePassword(previousPassword);
    }
    this.validatePassword(newPassword);

    const user = await this.userAccountService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (requireInvitedUser && user.invitedBy == null) {
      throw new ForbiddenException(
        'This endpoint is only available for invited users',
      );
    }

    if (!skipVerification) {
      if (!previousPassword) {
        throw new BadRequestException('Previous password is required');
      }
      this.validatePassword(previousPassword);
      if (!this.verifyPassword(previousPassword, user.passwordHash)) {
        throw new BadRequestException('Previous password is incorrect');
      }
      if (previousPassword === newPassword) {
        throw new BadRequestException(
          'New password must be different from previous password',
        );
      }
    }

    user.passwordHash = this.hashPassword(newPassword);
    user.status = 'ACTIVE';
    user.tempPassword = null;
    user.verified = true;
    user.resetPIN = null;
    user.resetPINExpirationAt = null;
    
    await this.userAccountService.save(user);

    if (markStakeholderCompleted) {
      await this.dataSource
        .createQueryBuilder()
        .update('property_stakeholders')
        .set({ invite_status: 'completed' })
        .where('user_id = :userId', { userId })
        .execute();
    }

    return { success: true };
  }

  private validateCredentials(
    email: string,
    password: string,
    name?: string,
  ): void {
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (password.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }
    if (password.length > 64) {
      throw new BadRequestException('password must not exceed 64 characters');
    }
    if (name !== undefined && name.trim().length < 2) {
      throw new BadRequestException('name must be at least 2 characters');
    }
    if (name !== undefined && name.trim().length > 150) {
      throw new BadRequestException('name must not exceed 150 characters');
    }
  }

  private validateEmail(email: string): void {
    if (!email) {
      throw new BadRequestException('email is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  private validatePassword(password: string): void {
    if (!password) {
      throw new BadRequestException('password is required');
    }
    if (password.length < 6) {
      throw new BadRequestException('password must be at least 6 characters');
    }
    if (password.length > 64) {
      throw new BadRequestException('password must not exceed 64 characters');
    }
  }

  private validatePIN(resetPIN: string): void {
    if (!resetPIN) {
      throw new BadRequestException('resetPIN is required');
    }
    if (!/^\d{4}$/.test(resetPIN)) {
      throw new BadRequestException('resetPIN must be exactly 4 digits');
    }
  }

  private assertValidPIN(
    storedPIN: string | null,
    expirationAt: Date | null,
    providedPIN: string,
  ): void {
    if (!storedPIN || !expirationAt) {
      throw new BadRequestException('Reset PIN is not generated');
    }
    if (expirationAt <= new Date()) {
      throw new BadRequestException('Reset PIN has expired');
    }
    if (storedPIN !== providedPIN) {
      throw new BadRequestException('Incorrect reset PIN');
    }
  }

  private generateResetPIN(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private getPINExpirationDate(): Date {
    const expireTimeMinutes = Number(
      this.envConfigService.get<string>('EXPIRE_TIME'),
    );
    if (!Number.isFinite(expireTimeMinutes) || expireTimeMinutes <= 0) {
      throw new InternalServerErrorException(
        'EXPIRE_TIME must be a positive number',
      );
    }
    return new Date(Date.now() + expireTimeMinutes * 60 * 1000);
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) {
      return false;
    }
    const derived = scryptSync(password, salt, 64);
    const hashBuffer = Buffer.from(hash, 'hex');
    if (derived.length !== hashBuffer.length) {
      return false;
    }
    return timingSafeEqual(derived, hashBuffer);
  }
}
