"use client";

import React, { useEffect, useState } from 'react';
import AgentInvitationForm from '@/components/org-invitations/AgentInvitationForm';
import { InvitationTipsCard, UsageStatsCard, RecentlyInvitedCard } from '@/components/org-invitations/InvitationSidebar';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';

const Tab = ({ label, active }: { label: string; active?: boolean }) => (
    <div className={`px-2 py-4 cursor-pointer relative transition-all duration-300 ${active ? 'text-[#3525CD]' : 'text-gray-400 hover:text-gray-900'}`}>
        <span className="text-[15px] font-black tracking-tight">{label}</span>
        {active && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3525CD] rounded-t-full shadow-sm shadow-indigo-100" />
        )}
    </div>
);

export default function InviteAgentsContainer() {
    const { callApi } = useApi();
    const [stats, setStats] = useState<any>(null);
    const [agents, setAgents] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            const result = await callApi(OrganizationDashboardService.getAgentStats()) as any;
            if (result && result.data) {
                setStats(result.data);
            }
        };

        const fetchRecentAgents = async () => {
            const result = await callApi(OrganizationDashboardService.getAgents({ page: 1, limit: 10 })) as any;
            const actualData = result?.data || result;
            if (actualData && actualData.items) {
                setAgents(actualData.items);
            }
        };

        fetchStats();
        fetchRecentAgents();
    }, []);

    const recentAgents = agents || [];
    const agentStats = stats || { activeAgents: 0, totalAgents: 50 };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Page Title & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-2">Invite New Agents</h1>
                    <p className="text-[15px] font-medium text-gray-500 max-w-[500px]">
                        Expand your team by sending secure invitations to licensed agents.
                    </p>
                </div>


            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Form Column */}
                <div className="xl:col-span-8 md:p-10 ">
                    <div className="cursor-pointer flex items-center gap-4 bg-gray-50/50 py-2 rounded-[20px] border border-gray-100/50 w-fit">
                        <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#3525CD] text-white rounded-lg text-[13px] font-black shadow-sm shadow-indigo-100 transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            <span>Individual Invite</span>
                        </button>
                    </div>
                    <div className="xl:col-span-8 bg-white p-10 rounded-lg border border-gray-100/50 shadow-sm shadow-indigo-100/20">
                        <AgentInvitationForm />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="xl:col-span-4 space-y-8">
                    <RecentlyInvitedCard agents={recentAgents.slice(0, 3)} />
                    <InvitationTipsCard />
                    <UsageStatsCard usage={agentStats.activeAgents} total={agentStats.totalAgents || 50} />
                </div>
            </div>
        </div>
    );
}
