"use client";

import React, { useState } from 'react';
import PropertyGrid from '@/components/properties/PropertyGrid';
import PropertyTable from '@/components/properties/PropertyTable';
import { useRouter } from 'next/navigation';
import { Property } from '@/types';
import { Button } from '@/components/common/Button';
import { PropertyService } from '@/services/property.service';
import apiClient from '@/networking/apiClient';
import Pagination from '@/components/common/Pagination';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertySkeleton from '@/components/properties/PropertySkeleton';
import { useDebounce } from '@/hooks/useDebounce';

import { useAuth } from '@/context/AuthContext';
import { getPermissions } from '@/lib/config/permissions';

export default function PropertyPortfolio() {
    const router = useRouter();
    const { primaryRole } = useAuth();
    const permissions = getPermissions(primaryRole || 0);

    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

            const response = await apiClient.request(PropertyService.listMyProperties(params));
            const data = response.data?.data;
            setProperties(data?.items || []);
            setTotalItems(data?.meta?.totalItems || 0);
        } catch (error) {
            console.error('Failed to fetch properties', error);
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

    const hasActiveFilters = search !== '' || type !== 'All' || status !== 'All';


    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Page Header & Actions */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Property Portfolio</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor your active real estate assets.</p>
                </div>

                <div className="flex self-end flex-wrap items-center gap-3">
                    {/* View Toggles */}
                    <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100 h-11">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 flex items-center justify-center cursor-pointer rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#3525CD]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 cursor-pointer flex items-center justify-center rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#3525CD]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        </button>
                    </div>

                    <Button
                        onClick={() => {
                            if (hasActiveFilters) {
                                handleClearFilters();
                            } else {
                                setIsFiltersVisible(!isFiltersVisible);
                            }
                        }}
                        className={`border font-semibold transition-all ${hasActiveFilters
                            ? 'bg-red-50 border-red-100 text-red-600! hover:bg-red-100'
                            : isFiltersVisible
                                ? 'bg-indigo-50 border-indigo-200 text-[#3525CD]! hover:bg-indigo-100'
                                : 'bg-white border-gray-200 text-gray-700! hover:bg-gray-50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {hasActiveFilters ? 'filter_list_off' : isFiltersVisible ? 'close' : 'filter_list'}
                        </span>
                        <span>
                            {hasActiveFilters ? 'Clear Filters' : isFiltersVisible ? 'Hide Filters' : 'Filter'}
                        </span>
                    </Button>
                    {permissions.canCreateProperty && (
                        <Button
                            onClick={() => router.push('/properties/new')}
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Add Property</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className={isFiltersVisible ? 'block' : 'hidden'}>
                <PropertyFilters
                    search={search}
                    setSearch={setSearch}
                    type={type}
                    setType={setType}
                    status={status}
                    setStatus={setStatus}
                />
            </div>

            {isLoading ? (
                <div className="py-2 scale-95 opacity-80 transition-all">
                    <PropertySkeleton viewMode={viewMode} count={limit} />
                </div>
            ) : properties.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-[40px] text-gray-300">other_houses</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        {hasActiveFilters
                            ? "We couldn't find any properties matching your current filters. Try adjusting them or clear all filters."
                            : "Your property portfolio is currently empty. Start by adding your first property asset."}
                    </p>
                    {hasActiveFilters && (
                        <Button
                            onClick={handleClearFilters}
                            className="bg-white border border-gray-200 text-gray-700! font-semibold hover:bg-gray-50 mx-auto"
                        >
                            Clear all filters
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <PropertyGrid properties={properties} />
                    ) : (
                        <PropertyTable properties={properties} />
                    )}

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
                </>
            )}
        </div>
    );
}
