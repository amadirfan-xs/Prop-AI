"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from '@/components/common/Breadcrumbs';

interface PageHeaderProps {
    items: BreadcrumbItem[];
    title?: React.ReactNode;
    description?: React.ReactNode;
    showBackButton?: boolean;
    action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
    items, 
    title, 
    description, 
    showBackButton = true,
    action 
}) => {
    const router = useRouter();

    return (
        <div className="space-y-6 mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <button 
                                onClick={() => router.back()}
                                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:border-indigo-100 shadow-sm transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            </button>
                        )}
                        <Breadcrumbs items={items} />
                    </div>

                    {(title || description) && (
                        <div className="space-y-1">
                            {title && (
                                <h1 className="text-[28px] lg:text-[42px] font-black text-gray-900 tracking-tight leading-tight">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <div className="text-[15px] font-medium text-gray-500">
                                    {description}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {action && (
                    <div className="shrink-0">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
};
