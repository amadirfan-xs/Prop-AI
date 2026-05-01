"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileTab } from '@/components/settings/tabs/ProfileTab';
import { SecurityTab } from '@/components/settings/tabs/SecurityTab';
import BrokerageTab from '@/components/org-settings/tabs/BrokerageTab';

import { ORG_SETTINGS_TABS } from '@/components/org-settings/utils/settings.utils';

export default function SettingsContainer() {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('Personal Profile');

    const tabs = ORG_SETTINGS_TABS;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tabs Navigation */}
            <div className="flex space-x-1 overflow-x-auto border-b border-gray-200 pb-px hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap px-6 py-4 text-[14px] font-black transition-all duration-200 relative ${
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

            {/* Tab Content */}
            <div className="transition-all duration-300">
                {activeTab === 'Personal Profile' && (
                    <ProfileTab user={user} refreshUser={refreshUser} />
                )}
                {activeTab === 'Brokerage Details' && (
                    <BrokerageTab />
                )}
                {activeTab === 'Security' && (
                    <SecurityTab />
                )}
            </div>
        </div>
    );
}

