"use client";

import React from 'react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { useDebounce } from '@/hooks/useDebounce';

interface PropertyFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    type: string;
    setType: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
}

export default function PropertyFilters({
    search, setSearch,
    type, setType,
    status, setStatus
}: PropertyFiltersProps) {
    const handleSearchChange = (val: string) => {
        setSearch(val);
    };

    const handleTypeChange = (val: string) => {
        setType(val);
    };

    const handleStatusChange = (val: string) => {
        setStatus(val);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {/* Search */}
            <div className="md:col-span-1 xl:col-span-2">
                <Input
                    label="Search Properties"
                    placeholder="Search by title, address..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    icon={<span className="material-symbols-outlined text-[20px]">search</span>}
                />
            </div>

            {/* Type Filter */}
            <Select
                label="Property Type"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                options={[
                    { value: 'All', label: 'All Types' },
                    { value: 'Residential Apartment', label: 'Apartment' },
                    { value: 'Commercial Office', label: 'Office' },
                    { value: 'Luxury Villa', label: 'Luxury Villa' },
                    { value: 'Industrial', label: 'Industrial' },
                ]}
            />

            {/* Status Filter */}
            <Select
                label="Portfolio Status"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Completed', label: 'Completed' },
                ]}
            />
        </div>
    );
}
