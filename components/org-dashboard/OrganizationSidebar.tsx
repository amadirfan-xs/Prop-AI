import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/constants/icons/DashboardIcons';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/constants/navigation';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES } from '@/constants/auth';

export default function OrganizationSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const navItems = NAV_ITEMS;
    const bottomItems = BOTTOM_NAV_ITEMS;

    const handleLogoutClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        onClose?.();
        await logout();
    };

    return (
        <aside
            className={`w-[280px] min-h-screen bg-white border-r border-gray-100 flex flex-col pt-8 pb-10 fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* Enterprise Logo */}
            <div className="px-8 flex items-center justify-between mb-12">
                <Link href={APP_ROUTES.ORG_DASHBOARD} className="flex items-center gap-3">
                    {user?.organization ? (
                        <>
                            {user.organization.logoUrl ? (
                                <img src={user.organization.logoUrl} alt={user.organization.name} className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl object-contain bg-gray-50 p-1 shadow-sm" />
                            ) : (
                                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                                    {user.organization.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[16px] lg:text-[18px] font-black text-gray-900 leading-none truncate">
                                    {user.organization.name}
                                </span>
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">
                                    Admin Console
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <LogoIcon size={32} />
                            <div className="flex flex-col">
                                <span className="text-[17px] font-black text-gray-900 leading-none">Indigo Brokerage</span>
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Admin Console</span>
                            </div>
                        </>
                    )}
                </Link>
                <button onClick={onClose} className="lg:hidden p-2 text-gray-400">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-[#EEF2FF] text-[#3525CD]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon
                                size={22}
                                color={isActive ? "#3525CD" : "currentColor"}
                                className="shrink-0"
                            />
                            <span className="text-[15px] font-medium  tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-200" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Nav */}
            <div className="px-4 pt-10 border-t border-gray-50 space-y-1">
                {bottomItems.map((item) => {
                    const isLogout = item.name.toLowerCase().includes('logout');
                    
                    if (isLogout) {
                        return (
                            <button
                                key={item.name}
                                onClick={handleLogoutClick}
                                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all text-left"
                            >
                                <item.icon size={22} className="shrink-0" />
                                <span className="text-[15px] font-medium  tracking-tight">{item.name}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            <item.icon size={22} className="shrink-0" />
                            <span className="text-[14px] font-black tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
