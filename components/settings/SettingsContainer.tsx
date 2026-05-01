"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileTab } from './tabs/ProfileTab';
import { SecurityTab } from './tabs/SecurityTab';
import { SocialMediaTab } from './tabs/SocialMediaTab';
import { EmailConfigTab } from './tabs/EmailConfigTab';
import { OrganizationTab } from './tabs/OrganizationTab';

export default function SettingsContainer() {
    const { user, activeRole, refreshUser } = useAuth();
    
    // Tabs dynamically generated based on role
    const getTabs = () => {
        const baseTabs = ['Profile'];
        if (user?.organization) {
            baseTabs.push('Organization');
        }
        baseTabs.push('Security');
        
        if (activeRole === 1 || activeRole === 5) {
            return [baseTabs[0], ...baseTabs.slice(1, baseTabs.length - 1), 'Social Media', 'Email Configuration', baseTabs[baseTabs.length - 1]];
        }
        return baseTabs;
    };

    const tabs = getTabs();
    const [activeTab, setActiveTab] = useState('Profile');

    // Ensure activeTab is valid when role changes
    useEffect(() => {
        if (!tabs.includes(activeTab)) {
            setActiveTab('Profile');
        }
    }, [activeRole, tabs, activeTab]);

    return (
        <div className="space-y-6 lg:space-y-10">
            {/* Header / Tabs Section */}
            <div className="flex space-x-1 overflow-x-auto border-b border-gray-200 pb-px hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap px-6 py-4 text-[14px] font-bold transition-all duration-200 relative ${
                            activeTab === tab 
                            ? "text-[#3525CD]" 
                            : "text-gray-400 hover:text-gray-700 hover:bg-gray-50/50 rounded-t-xl"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3525CD] rounded-t-full shadow-[0_-2px_10px_rgba(53,37,205,0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="transition-all duration-300">
                {activeTab === 'Profile' && (
                    <ProfileTab user={user} refreshUser={refreshUser} />
                )}
                {activeTab === 'Security' && (
                    <SecurityTab />
                )}
                {activeTab === 'Organization' && (
                    <OrganizationTab user={user} />
                )}
                {activeTab === 'Social Media' && (activeRole === 1 || activeRole === 5) && (
                    <SocialMediaTab />
                )}
                {activeTab === 'Email Configuration' && (activeRole === 1 || activeRole === 5) && (
                    <EmailConfigTab />
                )}
            </div>
        </div>
    );
}
