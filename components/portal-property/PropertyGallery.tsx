import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Property } from '@/types/properties';
import ImageCarousel from './ImageCarousel';

export default function PropertyGallery({ property }: { property: Property }) {
    const images = property.property_media || [];
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Fallback images if property has none
    const defaultImages = [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556911223-e153e9691fe2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?q=80&w=1200&auto=format&fit=crop"
    ];

    // Better image selection: Use real images if they exist, otherwise fallback
    const realImages = images.map(img => img.signedUrl).filter(url => typeof url === 'string' && url.length > 0) as string[];
    
    // If no images available, DON'T show the section at all
    if (realImages.length === 0) return null;

    const openCarousel = (index: number) => {
        setActiveIndex(index);
        setIsCarouselOpen(true);
    };

    const renderImage = (index: number, className: string, isWide: boolean = false) => {
        const url = realImages[index];
        if (!url) return null;

        return (
            <motion.div
                key={index}
                whileHover={{ scale: 1.005 }}
                onClick={() => openCarousel(index)}
                transition={{ duration: 0.5 }}
                className={`${className} rounded-3xl md:rounded-4xl overflow-hidden group border border-gray-100/50 shadow-sm relative cursor-zoom-in`}
            >
                <Image
                    src={url}
                    alt={`${property.property_title} - Gallery ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                {isWide && realImages.length > 4 && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-6 py-2 bg-white text-[#3525CD] text-[12px] font-black rounded-full uppercase tracking-widest shadow-xl">
                            View All {realImages.length} Photos
                        </span>
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <section id="gallery" className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 lg:py-24 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                {/* Dynamic Grid Layouts */}
                {realImages.length === 1 && (
                    <div className="h-100 md:h-150 lg:h-200">
                        {renderImage(0, "h-full w-full")}
                    </div>
                )}

                {realImages.length === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-auto md:h-125 lg:h-150">
                        {renderImage(0, "min-h-[300px] md:h-full")}
                        {renderImage(1, "min-h-[300px] md:h-full")}
                    </div>
                )}

                {realImages.length === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 h-auto lg:h-150">
                        <div className="lg:col-span-2 h-100 lg:h-full">
                            {renderImage(0, "h-full")}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:gap-8 h-full">
                            {renderImage(1, "h-[250px] lg:h-full")}
                            {renderImage(2, "h-[250px] lg:h-full")}
                        </div>
                    </div>
                )}

                {realImages.length >= 4 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 h-auto lg:h-200">
                        {renderImage(0, "min-h-100 lg:h-full")}

                        {/* Right: Stacked Images */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            {renderImage(1, "min-h-[250px]")}
                            {renderImage(2, "min-h-[250px]")}
                            <div className="sm:col-span-2 relative">
                                {renderImage(3, "min-h-[250px] md:min-h-[510px]", true)}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <ImageCarousel 
                isOpen={isCarouselOpen}
                onClose={() => setIsCarouselOpen(false)}
                images={realImages}
                currentIndex={activeIndex}
                onIndexChange={setActiveIndex}
            />
        </section>
    );
}
