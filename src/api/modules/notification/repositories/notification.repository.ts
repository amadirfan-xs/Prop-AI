import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NOTIFICATION_REPOSITORY } from '@/common/enums/repositories';

@Injectable()
export class NotificationRepository {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async create(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notification = this.repository.create(data);
    return this.repository.save(notification);
  }

  async listByUser(userId: number, limit = 20, offset = 0) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.repository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.repository.update({ id, userId }, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.repository.update({ userId, isRead: false }, { isRead: true });
  }
}
