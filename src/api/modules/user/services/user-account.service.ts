import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/api/modules/user/repositories/user.repository';
import { UserRoleRepository } from '@/api/modules/user/repositories/user-role.repository';
import type {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateResetPinInput,
} from '@/api/modules/user/types/user-account-service.types';
import { UserEntity } from '@/common/entities/user/user.entity';
import { UserTypes } from '@/common/enums/user-types';

@Injectable()
export class UserAccountService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) { }

  getUserRoles(userId: number) {
    return this.userRoleRepository.findByUserId(userId);
  }

  addUserRole(userId: number, userTypeId: number) {
    return this.userRoleRepository.addUserRole(userId, userTypeId);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  findById(userId: number): Promise<UserEntity | null> {
    return this.userRepository.findById(userId);
  }

  listByIds(userIds: number[]): Promise<UserEntity[]> {
    return this.userRepository.listByIds(userIds);
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const userToCreate = {
      ...input,
      userTypeId: input.userTypeId || UserTypes.AGENT,
      organizationId: input.organizationId || null,
    };
    const user = await this.userRepository.createUser(userToCreate);
    // Also ensure the role mapping exists
    await this.addUserRole(user.id, userToCreate.userTypeId);
    return user;
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  updateResetPin(input: UpdateResetPinInput): Promise<void> {
    return this.userRepository.updateResetPin(input);
  }

  updatePassword(input: UpdatePasswordInput): Promise<void> {
    return this.userRepository.updatePassword(input);
  }

  findUsersByRole(roleId: number): Promise<UserEntity[]> {
    return this.userRepository.findUsersByRole(roleId);
  }

  async findOrgAdmins(organizationId: number): Promise<UserEntity[]> {
    return this.userRepository.findUsersByOrgAndRole(
      organizationId,
      UserTypes.ORGANIZATION_OWNER,
    );
  }
}
