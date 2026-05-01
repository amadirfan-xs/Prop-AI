import React from 'react';
import { SearchIcon } from '@/constants/icons/DashboardIcons';
import { Input } from '@/components/common/Input';
import { PageHeader } from '@/components/common/PageHeader';

interface InquiryHeaderProps {
    unreadCount: number;
    search: string;
    setSearch: (value: string) => void;
}

export default function InquiryHeader({ unreadCount, search, setSearch }: InquiryHeaderProps) {
    const breadcrumbItems = [
        { label: 'Dashboard', href: '/' },
        { label: 'Inquiries', isLast: true }
    ];

    const titleWithBadge = (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[24px] sm:text-[32px] font-black text-gray-900 tracking-tight leading-none">Lead Inquiries</span>
            {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-fit px-3 py-1 text-[10px] sm:text-[11px] font-black bg-[#3525CD] text-white rounded-full uppercase tracking-wider h-6">
                    {unreadCount} New
                </span>
            )}
        </div>
    );

    const searchAction = (
        <div className="w-full md:w-100">
            <Input
                label="Search Leads"
                hideLabel
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<SearchIcon size={18} />}
                className="bg-[#F7F9FB]  rounded-2xl"
            />
        </div>
    );

    return (
        <PageHeader
            items={breadcrumbItems}
            title={titleWithBadge}
            description="Manage and respond to property inquiries in real-time."
            showBackButton={false}
            action={searchAction}
        />
    );
}
