"use client";

import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import PropertyTable from '@/components/dashboard/PropertyTable';
import MarketTrendsChart from '@/components/dashboard/MarketTrendsChart';
import WorkflowPromotionCard from '@/components/dashboard/WorkflowPromotionCard';
import { GridIcon, BuildingIcon, ClipboardIcon, UsersIcon } from '@/constants/icons/DashboardIcons';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { DashboardService } from '@/services/dashboard.service';
import { getPermissions } from '@/lib/config/permissions';

interface DashboardStats {
    stats: {
        TOTAL: number;
        ACTIVE: number;
        PENDING: number;
        COMPLETED: number;
    };
    trends: Array<{
        month: string;
        value: number;
    }>;
}

export default function PortfolioOverview() {
    const router = useRouter();
    const { primaryRole } = useAuth();
    const permissions = getPermissions(primaryRole || 0);

    const { callApi, data: dashboardData, loading } = useApi<DashboardStats>();

    React.useEffect(() => {
        if (primaryRole) {
            callApi(DashboardService.getStats(primaryRole));
        }
    }, [callApi, primaryRole]);

    const stats = dashboardData?.stats || {
        TOTAL: 0,
        ACTIVE: 0,
        PENDING: 0,
        COMPLETED: 0,
    };

    return (
        <div className="flex flex-col gap-6 lg:gap-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] lg:text-[32px] font-extrabold text-gray-900 tracking-tight leading-tight">
                        Portfolio Overview
                    </h1>
                    <p className="text-[14px] lg:text-[15px] font-medium text-gray-400">
                        Welcome back. Here is what's happening with your properties today.
                    </p>
                </div>
                {permissions.canCreateProperty && (
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={() => router.push('/properties/new')}
                        >
                            <span className="text-xl leading-none">+</span>
                            <span>Add Property</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <StatCard
                    title="Total Properties"
                    value={loading ? "..." : stats.TOTAL.toString()}
                    trendLabel="Live portfolio"
                    trendType="neutral"
                    icon={BuildingIcon}
                    iconBgColor="#EEF2FF"
                    iconColor="#4F46E5"
                />
                <StatCard
                    title="Active Deals"
                    value={loading ? "..." : stats.ACTIVE.toString()}
                    trendLabel="Real-time status"
                    trendType="neutral"
                    icon={GridIcon}
                    iconBgColor="#FFFBEB"
                    iconColor="#D97706"
                />
                <StatCard
                    title="Completed Deals"
                    value={loading ? "..." : stats.COMPLETED.toString()}
                    trendLabel="Lifetime total"
                    trendType="neutral"
                    icon={UsersIcon}
                    iconBgColor="#F0FDF4"
                    iconColor="#16A34A"
                />
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8">
                <PropertyTable />
            </div>

            {/* Bottom Row - only for agents */}
            {!loading && permissions.canCreateProperty && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    <div className="xl:col-span-2">
                        <MarketTrendsChart data={dashboardData?.trends} loading={loading} />
                    </div>
                    <div className="xl:col-span-1">
                        <WorkflowPromotionCard />
                    </div>
                </div>
            )}
        </div>
    );
}
