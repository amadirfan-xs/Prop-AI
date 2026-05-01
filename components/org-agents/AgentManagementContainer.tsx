"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentStatsGrid from '@/components/org-agents/AgentStatsGrid';
import OrganizationalRosterTable from '@/components/org-agents/OrganizationalRosterTable';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';

export default function AgentManagementContainer() {
    const router = useRouter();
    const { callApi } = useApi();
    const [stats, setStats] = useState<any>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchStats = async () => {
        setStatsLoading(true);
        const result = await callApi(OrganizationDashboardService.getAgentStats()) as any;
        if (result && result.data) {
            setStats(result.data);
        } else {
            setStats(result); // Fallback if not wrapped
        }
        setStatsLoading(false);
    };

    const fetchAgents = async (page: number) => {
        setAgentsLoading(true);
        const result = await callApi(OrganizationDashboardService.getAgents({ page, limit: 10 })) as any;
        const actualData = result?.data || result; // Handle both wrapped and unwrapped
        if (actualData && actualData.items) {
            setAgents(actualData.items);
            setPagination({ 
                page: actualData.meta.currentPage, 
                limit: actualData.meta.itemsPerPage, 
                total: actualData.meta.totalItems 
            });
        }
        setAgentsLoading(false);
    };

    useEffect(() => {
        fetchStats();
        fetchAgents(1);
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchAgents(newPage);
    };

    const agentStats = stats || { activeAgents: 0, totalAgents: 0, totalProperties: 0, listingsPerAgent: '0.0' };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-2">Agent Management</h1>
                    <p className="text-[15px] font-medium text-gray-500 max-w-[600px] leading-relaxed">
                        Manage roles, monitor performance, and oversee your brokerage's elite workforce.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => router.push('/org/agents/invitations')}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                            <span>Invite Agent</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <AgentStatsGrid stats={agentStats} isLoading={statsLoading} />

            {/* Main Content Area */}
            <OrganizationalRosterTable 
                agentsList={agents} 
                isLoading={agentsLoading} 
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
