'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageCarouselProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
}

export default function ImageCarousel({ 
    isOpen, 
    onClose, 
    images, 
    currentIndex, 
    onIndexChange 
}: ImageCarouselProps) {
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % images.length);
            if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + images.length) % images.length);
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, images.length, onIndexChange, onClose]);

    // Prevent scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10"
                >
                    {/* Header Controls */}
                    <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-6 z-50">
                        <span className="text-white/60 font-bold text-[14px] tracking-widest uppercase">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all group"
                        >
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
                        </button>
                    </div>

                    <div className="relative w-full max-w-6xl aspect-4/3 md:aspect-16/10 flex items-center justify-center group">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
                            className="absolute left-0 -translate-x-1/2 md:translate-x-0 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined text-[32px]">chevron_left</span>
                        </button>

                        <button
                            onClick={() => onIndexChange((currentIndex + 1) % images.length)}
                            className="absolute right-0 translate-x-1/2 md:translate-x-0 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
                        >
                            <span className="material-symbols-outlined text-[32px]">chevron_right</span>
                        </button>

                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {images[currentIndex] ? (
                                <Image
                                    src={images[currentIndex]}
                                    alt={`Property Image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                                    <span className="material-symbols-outlined text-[64px]">image_not_supported</span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Thumbnails Strip */}
                    <div className="mt-10 md:mt-12 w-full max-w-4xl  no-scrollbar py-4">
                        <div className="flex items-center justify-center gap-3 md:gap-4 px-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onIndexChange(idx)}
                                    className={`relative w-16 h-12 md:w-24 md:h-16 rounded-lg md:rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                                        idx === currentIndex 
                                            ? 'border-white scale-110' 
                                            : 'border-transparent opacity-40 hover:opacity-100'
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
