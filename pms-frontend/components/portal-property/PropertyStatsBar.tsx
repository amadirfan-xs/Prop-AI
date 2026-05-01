'use client';

import React from 'react';
import { Property } from '@/types/properties';

export default function PropertyStatsBar({ property }: { property: Property }) {
    const stats = [
        { label: 'Beds', value: `${property.beds} Bedrooms`, icon: 'bed' },
        { label: 'Baths', value: `${property.baths} Bathrooms`, icon: 'bathtub' },
        { label: 'Area', value: `${property.total_sqft?.toLocaleString()} Sq Ft`, icon: 'straighten' },
        { label: 'Type', value: property.property_type || 'Residential', icon: 'home_work' }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 mb-12 md:mb-20">
            <div className="bg-gray-100/60 rounded-[24px] md:rounded-[32px] border border-gray-100/50 p-6 md:p-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col gap-2 md:gap-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="material-symbols-outlined text-[18px] md:text-[20px] text-[#3525CD]">{stat.icon}</span>
                                <span className="text-[15px] md:text-[18px] font-black text-gray-900 leading-none">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
