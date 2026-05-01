import React from 'react';

export default function InquirySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[220px] bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 animate-pulse rounded-2xl" />
                        <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-100 animate-pulse rounded" />
                            <div className="w-48 h-3 bg-gray-50 animate-pulse rounded" />
                        </div>
                    </div>
                    <div className="w-full h-16 bg-gray-50 animate-pulse rounded-2xl" />
                    <div className="flex justify-between">
                        <div className="w-24 h-6 bg-gray-100 animate-pulse rounded-full" />
                        <div className="w-20 h-6 bg-gray-100 animate-pulse rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
