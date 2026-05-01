'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PropertyInquiry } from '@/types/properties';
import { MailIcon, BuildingIcon, CalendarIcon } from '@/constants/icons/DashboardIcons';

interface InquiryCardProps {
    inquiry: PropertyInquiry;
    onMarkAsRead: (id: number) => void;
}

export default function InquiryCard({ inquiry, onMarkAsRead }: InquiryCardProps) {
    const formattedDate = new Date(inquiry.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative p-6 rounded-3xl border transition-all duration-300 ${
                inquiry.is_read 
                    ? 'bg-white border-gray-100 shadow-sm' 
                    : 'bg-[#F8F9FF] border-indigo-100 shadow-md shadow-indigo-100/20'
            }`}
        >
            {!inquiry.is_read && (
                <div className="absolute top-6 right-6">
                    <span className="flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {/* Header: User Info */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <span className="text-[18px] font-black">
                                {inquiry.first_name?.[0] || '?'}{inquiry.last_name?.[0] || ''}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
                                {inquiry.first_name} {inquiry.last_name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400 mt-1">
                                <MailIcon size={14} />
                                <span className="text-[13px] font-medium">{inquiry.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Body */}
                <div className="bg-white/50 rounded-2xl p-4 border border-gray-50">
                    <p className="text-[15px] text-gray-600 leading-relaxed italic">
                        "{inquiry.message}"
                    </p>
                </div>

                {/* Footer: Property & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1.5 text-[#3525CD] bg-[#3525CD]/5 px-3 py-1.5 rounded-full shrink-0">
                            <BuildingIcon size={14} />
                            <span className="text-[12px] font-bold tracking-tight">{inquiry.property_title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                            <CalendarIcon size={14} />
                            <span className="text-[12px] font-medium">{formattedDate}</span>
                        </div>
                    </div>

                    {!inquiry.is_read && (
                        <button
                            onClick={() => onMarkAsRead(inquiry.id)}
                            className="text-[12px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                        >
                            Mark Read
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
