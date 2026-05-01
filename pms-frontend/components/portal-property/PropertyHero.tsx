'use client';

import React from 'react';
import Image from 'next/image';
import { Property } from '@/types/properties';

export default function PropertyHero({ property }: { property: Property }) {
    const mainImage = property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop';

    return (
        <section id="hero" className="relative h-[80vh] md:h-[100vh] min-h-[500px] md:min-h-[600px] w-full overflow-hidden mt-20">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={mainImage}
                    alt={property.property_title}
                    fill
                    priority
                    className="object-cover"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12 md:pb-16 lg:pb-24">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 md:gap-10">
                    <div className="space-y-4">
                        <span className="inline-block px-3 py-1 bg-[#3525CD] text-white text-[10px] font-black uppercase tracking-widest rounded-md">{property.status === 'Active' ? 'Live Listing' : 'Premium Listing'}</span>
                        <h1 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-black text-white leading-[1.1] tracking-tight">
                            {property.property_title}
                        </h1>
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                            <span className="text-[13px] md:text-[14px] font-medium tracking-wide">
                                {property.street_address}, {property.city}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-6">
                        <div className="text-start lg:text-right">
                            <p className="text-[28px] sm:text-[32px] md:text-[48px] font-black text-white leading-none">
                                ${Number(property.asking_price_monthly).toLocaleString()}
                            </p>
                            <p className="text-white/60 text-[11px] md:text-[12px] font-bold uppercase tracking-widest mt-2">{property.property_type || 'Monthly Rental'}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex-1 sm:flex-none px-8 md:px-10 py-4 bg-white text-[#3525CD] text-[12px] md:text-[13px] font-black rounded-lg hover:bg-gray-100 transition-all shadow-xl shadow-black/10 uppercase tracking-widest whitespace-nowrap"
                            >
                                Inquire Now
                            </button>
                            <button className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-lg flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
