'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyInquiry } from '@/types/properties';
import InquiryCard from './InquiryCard';
import { MailIcon } from '@/constants/icons/DashboardIcons';

interface InquiryListProps {
    inquiries: PropertyInquiry[];
    onMarkAsRead: (id: number) => void;
    hasActiveFilters: boolean;
}

export default function InquiryList({ inquiries, onMarkAsRead, hasActiveFilters }: InquiryListProps) {
    if (inquiries.length === 0) {
        return (
            <div className="bg-white rounded-3xl sm:rounded-4xl border border-gray-100 p-8 sm:p-16 text-center shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailIcon size={32} className="sm:size-10 text-gray-300" />
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-2">No inquiries found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6 sm:mb-8 font-medium text-[14px] sm:text-[16px]">
                    {hasActiveFilters 
                        ? "We couldn't find any inquiries matching your current search." 
                        : "New property leads will appear here automatically as they arrive."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {inquiries.map((inquiry) => (
                    <InquiryCard 
                        key={inquiry.id} 
                        inquiry={inquiry} 
                        onMarkAsRead={onMarkAsRead} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
