"use client";

import React from 'react';
import { MailIcon, CheckCircleIcon, AlertCircleIcon } from '@/constants/icons/AuthIcons';
import { SparklesIcon } from '@/constants/icons/DashboardIcons';

// Use the same MaterialIcon wrapper pattern from the shared library for consistency
const PropertyIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{
            fontSize: size,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            userSelect: 'none'
        }}
    >
        {name}
    </span>
);

interface PropertyPreviewSidebarProps {
    data: any;
}

export default function PropertyPreviewSidebar({ data }: PropertyPreviewSidebarProps) {
    return (
        <div className="space-y-8">
            {/* Main Preview Card */}
            <div className="bg-white rounded-lg p-6 shadow-2xl shadow-gray-100 border border-gray-50 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[9px] font-black tracking-widest uppercase">
                        PREVIEW MODE
                    </span>
                </div>

                {/* Card Image Placeholder */}
                <div className="aspect-4/3 bg-[#F7F9FB] rounded-lg mb-6 flex flex-col items-center justify-center relative group overflow-hidden border border-gray-100 shadow-inner">
                    {data.files && data.files.length > 0 ? (
                        <img 
                            src={URL.createObjectURL(data.files[0])} 
                            alt="Property Preview" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onLoad={(e) => {
                                // Optional: Revoke URL to save memory if it's a long-lived component
                                // But since this is a preview that changes often, we'll let React handle it
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-200 gap-3">
                            <PropertyIcon name="image" size={64} />
                            <span className="text-[12px] font-bold text-gray-300">No images uploaded</span>
                        </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-gray-900/80 via-gray-900/40 to-transparent flex flex-col justify-end p-8 pt-20">
                        <h4 className="text-[22px] font-bold text-white tracking-tight">{data.title || 'Property Preview'}</h4>
                        <p className="text-[13px] font-medium text-white/80 mt-1 flex items-center gap-1.5">
                            <PropertyIcon name="location_on" size={16} className="text-white/60" />
                            {data.address ? `${data.address}, ${data.city}` : 'Address not yet set'}
                        </p>
                    </div>
                    <div className="absolute top-6 right-6 px-4 py-2 bg-[#3525CD] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-indigo-200">
                        ${data.price || '0'}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { label: 'BEDS', value: data.beds || '-', icon: 'bed' },
                        { label: 'BATHS', value: data.baths || '-', icon: 'bathtub' },
                        { label: 'SQ FT', value: data.sqft || '-', icon: 'square_foot' }
                    ].map((m) => (
                        <div key={m.label} className="bg-[#F7F9FB] rounded-[24px] p-4 flex flex-col items-center justify-center gap-1">
                            <PropertyIcon name={m.icon} size={20} className="text-[#3525CD]" />
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{m.label}</span>
                            <span className="text-[14px] font-black text-gray-900">{m.value}</span>
                        </div>
                    ))}
                </div>

                {/* Highlights */}
                <div className="space-y-4 mb-8">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Highlights</h5>
                    <div className="py-2 border-y border-dashed border-gray-100 min-h-[50px] flex flex-wrap gap-2 items-center">
                        {data.listingHighlights && data.listingHighlights.trim() ? (
                            data.listingHighlights.split(',').map((h: string, i: number) => (
                                <div key={i} className="bg-[#F7F9FB] rounded-full px-4 py-2 inline-flex items-center gap-2 border border-gray-100 shadow-sm transition-all hover:border-[#3525CD]/20">
                                    <PropertyIcon name="check_circle" size={12} className="text-[#3525CD]" />
                                    <p className="text-[11px] font-black text-[#3525CD] tracking-tight uppercase">{h.trim()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-[#F7F9FB] rounded-full px-4 py-2 inline-flex items-center gap-2">
                                <p className="text-[12px] font-bold text-gray-500 italic">Waiting for input...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tip Box */}
                <div className="bg-[#e6e3ff] rounded-lg p-6 relative overflow-hidden">
                    <div className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white shrink-0">
                            <PropertyIcon name="info" size={18} className='text-[#3525CD]' />
                        </div>
                        <div>
                            <h6 className="text-[14px] font-black text-[#3525CD] mb-1">Architect's Tip</h6>
                            <p className="text-[11px] font-medium text-[#3525CD]/70 leading-relaxed tracking-tight">
                                Listings with high-quality 3D tours see <span className="font-bold text-[#3525CD]">45% more engagement</span>. Don't forget to add yours in the Media step!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Microcopy */}
            <div className="px-10">
                <p className="text-[11px] font-medium text-gray-400 text-center leading-relaxed">
                    By creating this property, you agree to the <br />
                    <span className="text-[#3525CD] font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#3525CD] font-bold cursor-pointer hover:underline">Fair Housing Act</span>.
                </p>
            </div>
        </div>
    );
}
