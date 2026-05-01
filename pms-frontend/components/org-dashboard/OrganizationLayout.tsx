"use client";

import React, { useState } from 'react';
import OrganizationSidebar from '@/components/org-dashboard/OrganizationSidebar';
import OrganizationHeader from '@/components/org-dashboard/OrganizationHeader';

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F7F9FB] font-sans">
            <OrganizationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-[280px]'}`}>
                <OrganizationHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-4 lg:p-10 max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
