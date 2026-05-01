import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(userId: number, data: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.create({
      userId,
      ...data,
      isRead: false,
    });

    this.logger.log(`Created notification for user ${userId}: ${data.title}`);

    this.notificationGateway.sendNotificationToUser(userId, notification);

    return notification;
  }

  async getMyNotifications(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const items = await this.notificationRepository.listByUser(userId, limit, offset);
    const unreadCount = await this.notificationRepository.countUnread(userId);

    return {
      items,
      unreadCount,
    };
  }

  async markAsRead(id: number, userId: number) {
    return this.notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: number) {
    return this.notificationRepository.markAllAsRead(userId);
  }
}
