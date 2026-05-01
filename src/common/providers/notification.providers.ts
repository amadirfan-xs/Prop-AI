import { DataSource } from 'typeorm';
import { NotificationEntity } from '@/api/modules/notification/entities/notification.entity';
import { DATA_SOURCE, NOTIFICATION_REPOSITORY } from '@/common/enums/repositories';

export const notificationProviders = [
  {
    provide: NOTIFICATION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(NotificationEntity),
    inject: [DATA_SOURCE],
  },
];
