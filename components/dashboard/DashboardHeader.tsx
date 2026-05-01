"use client";

import React from 'react';
import { SearchIcon, SettingsIcon } from '@/constants/icons/DashboardIcons';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getRoleName } from '@/utils/roleMapping';
import { getInitials } from '@/utils/stringUtils';
import { RoleSwitcher } from '@/components/dashboard/RoleSwitcher';
import { NotificationBell } from '@/components/dashboard/NotificationBell';

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: HeaderProps) {
    const { user, activeRole } = useAuth();

    return (
        <header className="h-18 lg:h-22 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-10 flex items-center justify-between border-b border-gray-100/50">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Trigger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="hidden md:block flex-1 max-w-145">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                            <SearchIcon size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties, deals, or documents..."
                            className="w-full bg-[#F7F9FB] border-none rounded-2xl py-3 pl-12 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
                <div className="flex items-center gap-1 lg:gap-2">
                    <Link href="/settings" className="hidden lg:block p-2 lg:p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
                        <SettingsIcon size={22} />
                    </Link>
                    <NotificationBell />
                </div>
                <RoleSwitcher />
                <div className="flex items-center gap-2 lg:gap-3 pl-2 border-l border-gray-100 ml-1 lg:ml-2">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight tracking-tight whitespace-nowrap">{user?.name || "Loading..."}</span>
                            <span className="text-[10px] lg:text-[11px] font-medium text-gray-400">{getRoleName(activeRole)}</span>
                        </div>
                        {user?.profilePictureUrl ? (
                            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl overflow-hidden shadow-sm shrink-0">
                                <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 p-0.5 shadow-sm overflow-hidden flex items-center justify-center text-white font-bold text-sm lg:text-lg shrink-0">
                                {getInitials(user?.name)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
