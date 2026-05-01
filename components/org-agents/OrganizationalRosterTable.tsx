import React from 'react';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';

interface Agent {
    id: string;
    name: string;
    email: string;
    status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
    properties?: number | string;
    buyers?: number | string;
    sellers?: number | string;
    performance?: number | string;
    avatar?: string;
    createdAt?: string;
}

const StatusBadge = ({ status }: { status: Agent['status'] }) => {
    const styles = {
        ACTIVE: 'bg-indigo-50 text-indigo-600',
        INVITED: 'bg-orange-50 text-orange-600',
        SUSPENDED: 'bg-rose-50 text-rose-600',
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${styles[status] || styles.ACTIVE}`}>
            {status}
        </span>
    );
};

const PerformanceBar = ({ value }: { value: number | string | undefined }) => {
    if (value === undefined || typeof value === 'string' && value === '—') {
        return <span className="text-[11px] font-black text-gray-400 uppercase">Pending</span>;
    }

    if (typeof value === 'string') {
        return <span className="text-[11px] font-black text-gray-400 uppercase">{value}</span>;
    }

    return (
        <div className="flex items-center gap-3 w-full max-w-[120px]">
            <span className="text-[11px] font-black text-indigo-600 w-8">{value}%</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

import Pagination from '@/components/common/Pagination';

export default function OrganizationalRosterTable({ 
    agentsList = [], 
    isLoading = false,
    pagination = { page: 1, limit: 10, total: 0 },
    onPageChange
}: { 
    agentsList?: any[]; 
    isLoading?: boolean;
    pagination?: { page: number; limit: number; total: number };
    onPageChange?: (page: number) => void;
}) {
    // Map backend raw many to Agent interface
    const agents: Agent[] = (agentsList || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status || (u.verified ? 'ACTIVE' : 'INVITED'),
        properties: Number(u.properties || 0),
        buyers: Number(u.buyers || 0),
        sellers: Number(u.sellers || 0),
        performance: Number(u.properties) > 0 
            ? Math.round((Number(u.dealsClosed || 0) / Number(u.properties)) * 100) 
            : (u.status === 'ACTIVE' || u.verified ? 0 : '—'),
        avatar: u.avatar,
        createdAt: u.createdAt
    }));

    return (
        <div className="bg-white rounded-[48px] border border-gray-100/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Enterprise Workforce</h3>
                <div className="flex items-center gap-4 text-gray-400">
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-2xl flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">groups</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">{pagination.total} Total Agents</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : agents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center p-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center mb-6 text-gray-300">
                            <span className="material-symbols-outlined text-[40px]">person_off</span>
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2">No Agents Found</h4>
                        <p className="text-gray-400 max-w-[280px]">Your workforce is currently empty. Start by inviting some agents.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-xs border-b border-gray-50">
                                <th className="pl-10 pr-4 uppercase text-gray-400 py-5 ">Agent Details</th>
                                <th className="px-4 py-5  uppercase text-gray-400 ">Work Status</th>
                                <th className="px-4 py-5  uppercase text-gray-400  text-center">Listings</th>
                                <th className="px-4 py-5  uppercase text-gray-400  text-center">Buyers</th>
                                <th className="px-4 py-5  uppercase text-gray-400  text-center">Sellers</th>
                                <th className="px-4 py-5  uppercase text-gray-400 ">Efficacy</th>
                                {/* <th className="px-10 py-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {agents.map((agent, index) => (
                                <tr key={agent.id || `agent-${index}`} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                                    <td className="pl-10 pr-4 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-[18px] bg-gray-100 shrink-0 overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                                <img
                                                    src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=EEF2FF&color=4F46E5&bold=true`}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-black text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                                    {agent.name}
                                                </p>
                                                <p className="text-[13px] font-medium text-gray-400">{agent.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <StatusBadge status={agent.status} />
                                    </td>
                                    <td className="px-4 py-6 text-center text-[15px] font-black text-gray-700">
                                        {agent.properties}
                                    </td>
                                    <td className="px-4 py-6 text-center text-[15px] font-black text-gray-700">
                                        {agent.buyers}
                                    </td>
                                    <td className="px-4 py-6 text-center text-[15px] font-black text-gray-700">
                                        {agent.sellers}
                                    </td>
                                    <td className="px-4 py-6">
                                        <PerformanceBar value={agent.performance} />
                                    </td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                currentPage={pagination.page}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={(p) => onPageChange?.(p)}
                onItemsPerPageChange={() => {}}
            />
        </div>
    );
}
