'use client';

import React from 'react';

export default function AccessControlCard() {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-4">
                <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-1">Access Controls</h3>
                <div>
                    <p className="text-[14px] font-black text-gray-900 mb-2">Public Access Link</p>
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="flex-1 h-14 bg-gray-50 border border-gray-100 rounded-xl px-6 flex items-center justify-between group">
                            <span className="text-[13px] font-bold text-gray-500 truncate">prop-arch.io/access/azure-penthouse-442</span>
                            <button className="text-[#3525CD] hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                            </button>w flex
                        </div>
                        <button className="w-full md:w-auto h-14 px-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center gap-3 text-[13px] font-black text-gray-900 hover:bg-gray-50 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">share</span>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
