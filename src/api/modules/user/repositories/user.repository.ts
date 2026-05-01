import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '@/common/entities/user/user.entity';
import { USER_REPOSITORY } from '@/common/enums/repositories';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  tempPassword?: string | null;
  invitedBy?: number | null;
  userTypeId: number;
  organizationId?: number | null;
  status?: string;
  verified?: boolean;
  phoneNumber?: string | null;
};

type UpdateResetPinInput = {
  userId: number;
  resetPIN: string | null;
  resetPINExpirationAt: Date | null;
  resendPasswordLimit?: number;
};

type UpdatePasswordInput = {
  userId: number;
  passwordHash: string;
};

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  findById(userId: number): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({ where: { id: userId } });
  }

  listByIds(userIds: number[]): Promise<UserEntity[]> {
    if (!userIds || userIds.length === 0) return Promise.resolve([]);
    return this.userEntityRepository.find({
      where: userIds.map((id) => ({ id })),
    });
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const exists = await this.findByEmail(input.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userEntityRepository.save({
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      tempPassword: input.tempPassword ?? null,
      verified: input.verified ?? true,
      status: input.status || 'ACTIVE',
      phoneNumber: input.phoneNumber || null,
      resetPIN: null,
      resetPINExpirationAt: null,
      resendPasswordLimit: 0,
      verificationCode: null,
      verificationCodeExpirationAt: null,
      resendEmailLimit: 0,
      profilePictureUrl: null,
      userTypeId: input.userTypeId,
      invitedBy: input.invitedBy ?? null,
      organizationId: input.organizationId ?? null,
    });
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.userEntityRepository.save(user);
  }

  async updateResetPin(input: UpdateResetPinInput): Promise<void> {
    const payload: Partial<UserEntity> = {
      resetPIN: input.resetPIN,
      resetPINExpirationAt: input.resetPINExpirationAt,
    };
    if (input.resendPasswordLimit !== undefined) {
      payload.resendPasswordLimit = input.resendPasswordLimit;
    }
    await this.userEntityRepository.update({ id: input.userId }, payload);
  }

  async updatePassword(input: UpdatePasswordInput): Promise<void> {
    await this.userEntityRepository.update(
      { id: input.userId },
      {
        passwordHash: input.passwordHash,
        tempPassword: null,
        verified: true,
        resetPIN: null,
        resetPINExpirationAt: null,
      },
    );
  }

  async findUsersByRole(roleId: number): Promise<UserEntity[]> {
    return this.userEntityRepository.find({
      where: { userTypeId: roleId },
    });
  }

  async findUsersByOrgAndRole(organizationId: number, roleId: number): Promise<UserEntity[]> {
    return this.userEntityRepository.find({
      where: { organizationId, userTypeId: roleId },
    });
  }
}
