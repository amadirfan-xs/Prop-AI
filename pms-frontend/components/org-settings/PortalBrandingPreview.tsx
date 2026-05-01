import React from 'react';

export default function PortalBrandingPreview() {
    return (
        <div className="bg-white rounded-xl p-10 border border-gray-100/50 shadow-sm shadow-indigo-100/10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[20px] font-black text-gray-900 tracking-tight mb-2">Portal Branding</h2>
                </div>
                <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3525CD]">Preview Mode</span>
                </div>
            </div>

            {/* Browser Mockup */}
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Browser Top Bar */}
                <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                </div>

                {/* Mockup Content */}
                <div className="p-10 space-y-10">
                    {/* Hero Section Mockup */}
                    <div className="relative h-64 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                        <span className="relative z-10 text-[11px] font-black uppercase tracking-widest text-indigo-400">Hero Banner Preview</span>
                    </div>

                    {/* Content Blocks Mockup */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="h-32 bg-gray-100/50 border border-gray-200/50 rounded-2xl"></div>
                        <div className="h-32 bg-gray-100/50 border border-gray-200/50 rounded-2xl"></div>
                        <div className="h-32 bg-gray-100/50 border border-gray-200/50 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            <p className="text-center text-[13px] font-medium text-gray-400 italic">
                Changes reflect instantly on your public-facing listing portals.
            </p>
        </div>
    );
}
