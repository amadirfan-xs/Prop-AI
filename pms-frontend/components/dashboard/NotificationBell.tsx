'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { BellIcon } from '@/constants/icons/DashboardIcons';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loadMore, hasMore, isLoading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            await markAsRead(notif.id);
        }

        // Navigation logic based on metadata
        if (notif.metadata?.propertyId) {
            router.push(`/properties/${notif.metadata.propertyId}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 lg:p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative"
            >
                <BellIcon size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-[5px] bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10 tracking-tighter">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 lg:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div 
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-tight ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BellIcon size={24} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {hasMore && (
                        <div className="p-3 border-t border-gray-50 bg-gray-50/30 text-center">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    loadMore();
                                }}
                                disabled={isLoading}
                                className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Load More Notifications'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
