"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { PropertyCardProps } from '@/types';
import Image from 'next/image';

export default function PropertyCard({ property }: PropertyCardProps) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/properties/${property.id}`);
    };

    const statusColors: Record<string, string> = {
        Active: 'bg-white/90 text-[#3525CD] border-transparent',
        Pending: 'bg-white/90 text-amber-700 border-transparent',
        Archived: 'bg-white/90 text-gray-700 border-transparent'
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-16/11 overflow-hidden m-3 rounded-2xl">
                <Image
                    src={property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=120&h=120&auto=format&fit=crop'}
                    alt={property.property_title || 'Property'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${statusColors[property.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {property.status || '-'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-5 pb-6 pt-2 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-[#3525CD] transition-colors line-clamp-1">
                        {property.property_title || '-'}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 mb-6">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span className="text-[13px] font-medium line-clamp-1">{property.street_address || '-'}</span>
                </div>

                {/* Price & Badges Row */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[22px] font-black tracking-tight text-[#3525CD]">
                            {property.asking_price_monthly ? `$${property.asking_price_monthly}` : '-'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {property.beds !== undefined && (
                            <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[#3525CD] font-black text-[11px] border border-indigo-100/50">
                                {property.beds}B
                            </div>
                        )}
                        {property.total_sqft !== undefined && (
                            <div className="px-2 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[#3525CD] font-black text-[11px] border border-indigo-100/50">
                                {property.total_sqft} SF
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
