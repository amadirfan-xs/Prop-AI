"use client";

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isLast?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
    return (
        <nav className={`flex items-center gap-2 text-[13px] font-medium text-gray-400 ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1 || item.isLast;
                
                return (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <span className="material-symbols-outlined text-[16px] shrink-0">chevron_right</span>
                        )}
                        
                        {item.href && !isLast ? (
                            <Link 
                                href={item.href} 
                                className="hover:text-[#3525CD] transition-colors line-clamp-1 max-w-[200px]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`line-clamp-1 max-w-[200px] ${isLast ? 'text-gray-900' : ''}`}>
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
