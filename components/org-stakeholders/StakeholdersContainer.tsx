"use client";

import { useEffect, useState } from 'react';
import StakeholdersStatsGrid from '@/components/org-stakeholders/StakeholdersStatsGrid';
import StakeholdersTable from '@/components/org-stakeholders/StakeholdersTable';
import StakeholderSpotlight from '@/components/org-stakeholders/StakeholderSpotlight';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';

export default function StakeholdersContainer() {
    const { callApi } = useApi();
    const [viewType, setViewType] = useState<'All' | 'Buyer' | 'Seller'>('All');
    const [stats, setStats] = useState<any>(null);
    const [stakeholders, setStakeholders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [spotlight, setSpotlight] = useState<any>(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStats = async () => {
        const result = await callApi(OrganizationDashboardService.getStakeholderStats()) as any;
        if (result) {
            setStats(result);
        }
    };
    const fetchData = async (page = 1, search = searchQuery, type = viewType, limit = pagination.limit) => {
        setLoading(true);
        const result = await callApi(OrganizationDashboardService.getStakeholders({
            page,
            limit,
            search,
            type: type === 'All' ? undefined : type
        })) as any;
        
        if (result) {
            setStakeholders(result.items);
            setPagination({
                page: result.meta.currentPage,
                limit: result.meta.itemsPerPage,
                total: result.meta.totalItems
            });
        }
        setLoading(false);
    };

    const fetchSpotlight = async () => {
        const result = await callApi(OrganizationDashboardService.getStakeholderSpotlight()) as any;
        if (result) {
            setSpotlight(result);
        }
    };


    useEffect(() => {
        fetchStats();
        fetchData(1);
        fetchSpotlight();
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchData(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        fetchData(1, searchQuery, viewType, newLimit);
    };

    const handleTypeChange = (type: 'All' | 'Buyer' | 'Seller') => {
        setViewType(type);
        fetchData(1, searchQuery, type);
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-2">Stakeholders</h1>
                    <p className="text-[15px] font-medium text-gray-500 max-w-[600px] leading-relaxed">
                        Manage your pipeline of buyers and sellers across the portfolio.
                    </p>
                </div>

                {/* Segmented Toggle */}
                <div className="bg-gray-200 p-1.5 rounded-2xl border border-gray-100 flex items-center w-fit">
                    {['All', 'Buyer', 'Seller'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type as any)}
                            className={`px-8 py-2.5 rounded-[12px] text-[14px] font-black transition-all ${viewType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <StakeholdersStatsGrid stats={stats} />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1  gap-8 items-start">
                <div className="space-y-8">
                    <StakeholdersTable 
                        data={stakeholders} 
                        isLoading={loading}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 items-start">
                <div className='col-span-1'>
                    <StakeholderSpotlight data={spotlight} />
                </div>
            </div>
        </div>
    );
}

