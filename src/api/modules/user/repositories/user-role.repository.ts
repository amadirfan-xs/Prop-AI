import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoleEntity } from '@/common/entities/user-role/user-role.entity';
import { USER_ROLE_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class UserRoleRepository {
    constructor(
        @Inject(USER_ROLE_REPOSITORY)
        private readonly userRoleEntityRepository: Repository<UserRoleEntity>,
    ) { }

    async findByUserId(userId: number): Promise<UserRoleEntity[]> {
        return this.userRoleEntityRepository.find({
            where: { userId },
        });
    }

    async addUserRole(userId: number, userTypeId: number): Promise<UserRoleEntity> {
        const existing = await this.userRoleEntityRepository.findOne({
            where: { userId, userTypeId },
        });
        if (existing) return existing;

        return this.userRoleEntityRepository.save({
            userId,
            userTypeId,
        });
    }

    async removeUserRole(userId: number, userTypeId: number): Promise<void> {
        await this.userRoleEntityRepository.delete({ userId, userTypeId });
    }

    async clearUserRoles(userId: number): Promise<void> {
        await this.userRoleEntityRepository.delete({ userId });
    }
}
