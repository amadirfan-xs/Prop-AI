"use client";

import React, { useEffect } from 'react';
import OrgStatsGrid from '@/components/org-dashboard/OrgStatsGrid';
import AgentPerformanceTable from '@/components/org-dashboard/AgentPerformanceTable';
import RecentActivityTimeline from '@/components/org-dashboard/RecentActivityTimeline';
import RecentPropertiesGrid from '@/components/org-dashboard/RecentPropertiesGrid';
import StakeholderTabs from '@/components/org-dashboard/StakeholderTabs';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';
import { FullPageLoader } from '@/components/common/FullPageLoader';

export default function OrganizationDashboardContainer() {
    const router = useRouter();
    const { callApi, data, loading, error } = useApi<any>();

    useEffect(() => {
        callApi(OrganizationDashboardService.getStats());
    }, [callApi]);

    if (loading) return <FullPageLoader message="Analyzing organizational data..." />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[32px] border border-gray-100 shadow-sm p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-500 text-[40px]">lock</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-[24px] font-black text-gray-900 tracking-tight">Access Restricted</h2>
                    <p className="text-[15px] font-medium text-gray-400 max-w-md mx-auto">
                        {error === 'Permission denied' 
                            ? "You don't have the necessary administrative privileges to view the Organization Dashboard." 
                            : error}
                    </p>
                </div>
                <div className="pt-4">
                    <Button onClick={() => router.push('/')} className="px-8! py-3! rounded-xl! font-bold!">
                        Return to Personal Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const stats = data?.stats;
    const agents = data?.agents || [];
    const activities = data?.activities || [];
    const properties = data?.properties || [];

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Title Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight">
                        Organization Dashboard
                    </h1>
                    <p className="text-[15px] font-medium text-gray-400">
                        Real-time performance metrics and entity management.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                   
                    <Button onClick={() => router.push('/org/agents/invitations')}>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined ">person_add</span>
                            <span>Invite Agent</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <OrgStatsGrid stats={stats} />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
                <div className="space-y-8">
                    <AgentPerformanceTable agents={agents} />
                    <RecentPropertiesGrid properties={properties} />
                </div>

                <div className="space-y-8">
                    <RecentActivityTimeline activities={activities} />
                    {/* <StakeholderTabs /> */}
                </div>
            </div>
        </div>
    );
}
