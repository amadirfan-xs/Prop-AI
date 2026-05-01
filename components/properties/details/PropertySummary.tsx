"use client";

import React from 'react';

import { Property } from '@/types';

interface PropertySummaryProps {
    property: Property;
}

export default function PropertySummary({ property }: PropertySummaryProps) {
    return (
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* Large Image */}
                <div className="lg:w-[45%] p-2">
                    <div className="relative aspect-16/12 rounded-[24px] overflow-hidden shadow-sm">
                        <img
                            src={property.property_media?.[0]?.signedUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"}
                            alt={property.property_title || "Property"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Property Info */}
                <div className="lg:w-[55%] p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-[32px] font-bold text-gray-900 leading-tight mb-2 tracking-tight">
                                    {property.property_title || '-'}
                                </h2>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                                    <span className="text-[15px] font-medium">
                                        {property.street_address || '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${property.status === 'Active' ? 'bg-[#EEF2FF] text-[#3525CD]' : 'bg-gray-100 text-gray-500'}`}>
                                    {property.status || '-'} Listing
                                </span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 mt-8">
                            <div className="bg-[#F8F9FB] rounded-[20px] p-5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Price</span>
                                <span className="text-[20px] font-black text-[#3525CD]">
                                    {property.asking_price_monthly ? `$${property.asking_price_monthly}` : '-'}
                                </span>
                            </div>
                            <div className="bg-[#F8F9FB] rounded-[20px] p-5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Beds</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[20px] font-black text-gray-900">
                                        {property.beds ?? '-'}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400">RMS</span>
                                </div>
                            </div>
                            <div className="bg-[#F8F9FB] rounded-[20px] p-5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Baths</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[20px] font-black text-gray-900">
                                        {property.baths ?? '-'}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400">BTH</span>
                                </div>
                            </div>
                            <div className="bg-[#F8F9FB] rounded-[20px] p-5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Sqft</span>
                                <span className="text-[20px] font-black text-gray-900">
                                    {property.total_sqft ? property.total_sqft.toLocaleString() : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-3">Property Description</span>
                        <p className="text-gray-500 leading-relaxed text-[15px] max-w-[580px]">
                            {property.property_description || 'No description available for this property.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
