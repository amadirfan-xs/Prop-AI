import React from 'react';
import { Input } from '@/components/common/Input';
import { SearchIcon } from '@/constants/icons/DashboardIcons';

interface InquiryFiltersProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function InquiryFilters({ search, setSearch }: InquiryFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-full md:w-100 border-2 border-gray-200 rounded-2xl">
                <Input
                    label="Search Leads"
                    placeholder="Search by name, email or property..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    icon={<SearchIcon size={18} />}
                />
            </div>
        </div>
    );
}
