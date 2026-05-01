'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NotificationService } from '@/services/notification.service';
import { useAuth } from './AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { useApi } from '@/hooks/useApi';
import { toastService } from '@/utils/toastService';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    hasMore: boolean;
    fetchNotifications: () => Promise<void>;
    loadMore: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { isAuthenticated } = useAuth();
    
    const { callApi: fetchApi, loading: isFetching } = useApi<any>();
    const { callApi: markReadApi } = useApi<any>();
    const { callApi: markAllReadApi } = useApi<any>();

    // Connect to notifications namespace
    const { on, isConnected } = useSocket({ 
        namespace: 'notifications',
        auth: { token: true }
    });

    const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
        if (!isAuthenticated) return;
        
        const limit = 10;
        const data = await fetchApi(NotificationService.getMyNotifications(pageNum, limit));
        
        if (data) {
            if (append) {
                setNotifications(prev => [...prev, ...(data.items || [])]);
            } else {
                setNotifications(data.items || []);
            }
            
            setUnreadCount(data.unreadCount || 0);
            setHasMore((data.items || []).length === limit);
            setPage(pageNum);
        } else {
            toastService.error('Failed to load notifications');
        }
    }, [isAuthenticated, fetchApi]);

    const loadMore = async () => {
        if (isFetching || !hasMore) return;
        await fetchNotifications(page + 1, true);
    };

    const markAsRead = async (id: number) => {
        const success = await markReadApi(NotificationService.markAsRead(id));
        if (success !== null) {
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } else {
            toastService.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        const success = await markAllReadApi(NotificationService.markAllAsRead());
        if (success !== null) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } else {
            toastService.error('Failed to mark all notifications as read');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications(1, false);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setPage(1);
        }
    }, [isAuthenticated, fetchNotifications]);

    useEffect(() => {
        if (isConnected) {
            const handleNewNotification = (newNotif: Notification) => {
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
            };

            on('newNotification', handleNewNotification);
        }
    }, [isConnected, on]);

    const value = {
        notifications,
        unreadCount,
        isLoading: isFetching,
        hasMore,
        fetchNotifications: () => fetchNotifications(1, false),
        loadMore,
        markAsRead,
        markAllAsRead
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
