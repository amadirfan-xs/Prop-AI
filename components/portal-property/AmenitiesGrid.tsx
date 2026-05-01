'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/types/properties';

export default function AmenitiesGrid({ property }: { property: Property }) {
    const highlights = property.listing_highlights || [];
    
    // Simple icon mapping helper
    const getIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('pool')) return 'pool';
        if (lower.includes('gym') || lower.includes('fitness')) return 'fitness_center';
        if (lower.includes('garage') || lower.includes('parking')) return 'garage';
        if (lower.includes('theater') || lower.includes('cinema')) return 'theater_comedy';
        if (lower.includes('wine')) return 'wine_bar';
        if (lower.includes('smart') || lower.includes('home')) return 'home';
        if (lower.includes('view')) return 'visibility';
        if (lower.includes('garden') || lower.includes('deck')) return 'deck';
        return 'star'; // Default icon
    };

    return (
        <section id="amenities" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 lg:py-32 bg-gray-50/10">
            <div className="grid grid-cols-1 gap-12 md:gap-20">
                {/* Architectural Narrative */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-6 md:space-y-8"
                >
                    <h2 className="text-[28px] md:text-[32px] font-black text-gray-900 tracking-tight">Architectural Narrative</h2>
                    <div className="space-y-6 max-w-full">
                        <p className="text-[16px] md:text-[18px] font-medium text-gray-600 leading-relaxed italic whitespace-pre-line">
                            {property.property_description || 'An extraordinary achievement in contemporary design, representing the pinnacle of luxury living.'}
                        </p>
                    </div>
                </motion.div>

                {/* Amenities & Features */}
                {highlights.length > 0 && (
                    <div className="space-y-10 md:space-y-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-[28px] md:text-[32px] font-black text-gray-900 tracking-tight"
                        >
                            Amenities & Features
                        </motion.h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                            {highlights.map((highlight: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="flex items-center gap-5 md:gap-6 p-6 md:p-10 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 rounded-xl md:rounded-2xl flex items-center justify-center text-[#3525CD]">
                                        <span className="material-symbols-outlined text-[24px] md:text-[28px]">{getIcon(highlight)}</span>
                                    </div>
                                    <span className="text-[12px] md:text-[14px] font-black text-gray-900 uppercase tracking-widest">{highlight}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
