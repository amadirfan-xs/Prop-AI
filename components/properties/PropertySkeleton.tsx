"use client";

import React from 'react';

interface PropertySkeletonProps {
    viewMode: 'grid' | 'list';
    count?: number;
}

export default function PropertySkeleton({ viewMode, count = 6 }: PropertySkeletonProps) {
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                        <div className="aspect-16/11 bg-gray-200 m-3 rounded-2xl" />
                        <div className="px-5 pb-6 pt-2">
                            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
                            <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-6" />
                            <div className="flex justify-between items-center mt-auto">
                                <div className="h-8 bg-gray-200 rounded-lg w-24" />
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                                    <div className="w-16 h-8 rounded-full bg-gray-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
                <div className="grid grid-cols-5 gap-4 px-4 py-4 border-b border-gray-50 mb-4">
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-24 ml-auto" />
                </div>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl mb-3 flex items-center p-4 shadow-sm animate-pulse">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                            <div className="flex flex-col gap-2">
                                <div className="h-5 bg-gray-200 rounded w-40" />
                                <div className="h-4 bg-gray-100 rounded w-32" />
                            </div>
                        </div>
                        <div className="flex-1 px-4">
                            <div className="h-6 bg-gray-100 rounded-lg w-20" />
                        </div>
                        <div className="flex-1 px-4">
                            <div className="h-5 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="flex-1 px-4">
                            <div className="h-6 bg-gray-100 rounded w-24" />
                        </div>
                        <div className="flex items-center gap-2 px-4 ml-auto">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
