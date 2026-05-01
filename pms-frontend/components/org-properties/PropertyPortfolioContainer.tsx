import React from 'react';
import PropertyStatsGrid from '@/components/org-properties/PropertyStatsGrid';
import PropertyPortfolioTable from '@/components/org-properties/PropertyPortfolioTable';
import { Button } from '@/components/common/Button';

export default function PropertyPortfolioContainer() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-black text-gray-900 tracking-tight mb-2">Property Portfolio</h1>
                    <p className="text-[15px] font-medium text-gray-500 max-w-[600px] leading-relaxed">
                        Managing active listings across all regional offices.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button className="flex items-center gap-2 bg-white border border-gray-100 text-[14px] font-black !text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        <span>Filters</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-white border border-gray-100 text-[14px] font-black !text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">sort</span>
                        <span>Latest First</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-white border border-gray-100 text-[14px] font-black !text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <PropertyStatsGrid />

            {/* Property Table */}
            <PropertyPortfolioTable />
        </div>
    );
}
