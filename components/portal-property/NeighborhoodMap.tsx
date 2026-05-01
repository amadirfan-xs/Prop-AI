'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/types/properties';

export default function NeighborhoodMap({ property }: { property: Property }) {
    const handleOpenMaps = () => {
        const query = encodeURIComponent(`${property.street_address}, ${property.city}, ${property.zip_code}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <section id="location" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 lg:py-32">
            <div className="space-y-8 md:space-y-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-[28px] md:text-[32px] font-black text-gray-900 tracking-tight"
                >
                    The Neighborhood
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Location Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4"
                    >
                        <div className="p-8 md:p-10 bg-[#1A1A1A] text-white rounded-[32px] md:rounded-[40px] space-y-8 md:space-y-10">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-3 md:mb-4">Location</h3>
                                <p className="text-[16px] md:text-[18px] font-bold">{property.city}, {property.zip_code}</p>
                            </div>

                            <div className="space-y-5 md:space-y-6">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-white/50 text-[13px] md:text-[14px] shrink-0">Primary Address</span>
                                    <span className="font-bold text-[11px] md:text-[12px] text-right">{property.street_address}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-[13px] md:text-[14px]">Status</span>
                                    <span className="font-bold text-[#3525CD]">{property.status}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-[13px] md:text-[14px]">Type</span>
                                    <span className="font-bold">{property.property_type || 'Residential'}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleOpenMaps}
                                className="w-full py-4 bg-white text-black text-[12px] md:text-[13px] font-black rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg shadow-black/20"
                            >
                                Open in Maps
                            </button>
                        </div>
                    </motion.div>

                    {/* Map Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:col-span-8 h-[350px] md:h-[500px] bg-gray-100 rounded-[32px] md:rounded-[48px] overflow-hidden relative group"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                            alt="Neighborhood Map"
                            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-14 h-14 md:w-16 md:h-16 bg-[#3525CD] rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white"
                            >
                                <span className="material-symbols-outlined text-[28px] md:text-[32px]">location_on</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
