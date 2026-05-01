import { AxiosRequestConfig } from 'axios';

export class NotificationService {
    static getMyNotifications(page = 1, limit = 20): AxiosRequestConfig {
        return {
            url: '/api/notifications',
            method: 'GET',
            params: { page, limit },
        };
    }

    static markAsRead(id: number): AxiosRequestConfig {
        return {
            url: `/api/notifications/${id}/read`,
            method: 'PATCH',
        };
    }

    static markAllAsRead(): AxiosRequestConfig {
        return {
            url: '/api/notifications/read-all',
            method: 'PATCH',
        };
    }
}
