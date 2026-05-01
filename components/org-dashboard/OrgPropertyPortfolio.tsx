"use client";

import React, { useState } from 'react';
import PropertyGrid from '@/components/properties/PropertyGrid';
import { useRouter } from 'next/navigation';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';
import apiClient from '@/networking/apiClient';
import Pagination from '@/components/common/Pagination';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertySkeleton from '@/components/properties/PropertySkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import OrgPropertyTable from './OrgPropertyTable';

export default function OrgPropertyPortfolio() {
    const router = useRouter();
    
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [search, setSearch] = useState('');
    const [type, setType] = useState('All');
    const [status, setStatus] = useState('All');

    const debouncedSearch = useDebounce(search, 500);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit
            };

            if (debouncedSearch) params.search = debouncedSearch.trim();
            if (status !== 'All') params.status = status;
            if (type !== 'All') params.type = type;

            const response = await apiClient.request(OrganizationDashboardService.getProperties(params));
            const responseData = response.data?.data;
            setProperties(responseData?.items || []);
            setTotalItems(responseData?.meta?.totalItems || 0);
        } catch (error) {
            console.error('Failed to fetch organization properties', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, status, type]);

    React.useEffect(() => {
        fetchProperties();
    }, [currentPage, limit, debouncedSearch, status, type]);

    const handleClearFilters = () => {
        setSearch('');
        setType('All');
        setStatus('All');
        setCurrentPage(1);
    };

    const handleExport = () => {
        const headers = ["ID", "Title", "Type", "Status", "Price", "Created At"];
        const rows = properties.map(p => [
            p.id,
            `"${p.property_title}"`,
            p.property_type,
            p.status,
            `$${p.asking_price_monthly}`,
            p.created_at
        ]);
        
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `organization_properties_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasActiveFilters = search !== '' || type !== 'All' || status !== 'All';

    return (
        <div className="space-y-12 pb-20">
            {/* Page Header & Actions */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-[40px] font-black text-gray-900 tracking-tight leading-none">Property Portfolio</h1>
                    <p className="text-[17px] font-semibold text-gray-400">
                        Managing <span className="text-gray-900">{totalItems}</span> active listings across all regional offices.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 h-14 mr-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 h-full flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 h-full flex items-center justify-center rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <span className="material-symbols-outlined text-[22px]">grid_view</span>
                        </button>
                    </div>

                    {/* Filters Button */}
                    <button
                        onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                        className={`flex items-center gap-3 px-6 h-14 rounded-2xl border font-bold text-[15px] transition-all ${isFiltersVisible ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-100 text-gray-700 shadow-sm hover:border-gray-200'}`}
                    >
                        <span className="material-symbols-outlined text-[22px]">filter_list</span>
                        <span>Filters</span>
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-3 px-6 h-14 rounded-2xl border border-gray-100 bg-white text-gray-700 font-bold text-[15px] shadow-sm hover:border-gray-200 transition-all"
                    >
                        <span className="material-symbols-outlined text-[22px]">upload</span>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
        
            {/* Property List/Grid */}
            <div className="bg-white rounded-[48px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden min-h-[600px]">
                <div className={isFiltersVisible ? 'border-b border-gray-50' : 'hidden'}>
                    <div className="p-8 pb-2">
                        <PropertyFilters
                            search={search}
                            setSearch={setSearch}
                            type={type}
                            setType={setType}
                            status={status}
                            setStatus={setStatus}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12">
                        <PropertySkeleton viewMode={viewMode} count={limit} />
                    </div>
                ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40">
                         <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[48px] text-gray-200">apartment</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties here</h3>
                        <p className="text-gray-400 font-medium">Try clearing your filters to see more listings.</p>
                    </div>
                ) : (
                    <>
                        <div className="w-full">
                            {viewMode === 'list' ? (
                                <OrgPropertyTable properties={properties} />
                            ) : (
                                <div className="p-4 lg:p-4">
                                    <PropertyGrid properties={properties} />
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-50 bg-gray-50/30">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                itemsPerPage={limit}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
