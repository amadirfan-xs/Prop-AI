'use client';

import React from 'react';

export default function CampaignHeader() {
    return (
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-8">
                <nav className="flex items-center gap-8">
                    <button className="text-[14px] font-bold text-gray-500 hover:text-gray-900 transition-colors">Templates</button>
                    <div className="relative">
                        <button className="text-[14px] font-black text-[#3525CD]">Campaigns</button>
                        <div className="absolute -bottom-[21px] left-0 right-0 h-1 bg-[#3525CD] rounded-t-full"></div>
                    </div>
                    <button className="text-[14px] font-bold text-gray-500 hover:text-gray-900 transition-colors">Automation</button>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <button className="px-6 h-11 text-[13px] font-black text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                    Save Draft
                </button>
                <button className="px-6 h-11 bg-[#3525CD] text-white text-[13px] font-black rounded-xl hover:bg-[#2A1DA6] transition-all shadow-lg shadow-indigo-100">
                    Send Campaign
                </button>
            </div>
        </div>
    );
}
