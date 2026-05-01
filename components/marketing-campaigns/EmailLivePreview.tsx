'use client';

import React from 'react';

interface PreviewProps {
    subject: string;
    content: string;
    propertyName: string;
}

export default function EmailLivePreview({ subject, content, propertyName }: PreviewProps) {
    return (
        <div className="bg-[#1A1A2E] rounded-2xl p-1 shadow-2xl overflow-hidden border border-white/10 group">
            <div className="bg-white rounded-2xl min-h-[500px] flex flex-col">
                {/* Browser Header Shadow */}

                {/* Email UI */}
                <div className="p-8 space-y-8 flex-1">
                    <div className="pb-6 border-b border-gray-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-[#3525CD]">drafts</span>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-black text-gray-900 leading-none">{subject || 'Enter Subject Line...'}</h4>
                                <p className="text-[11px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">To: (Step 2 Recipients)</p>
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed min-h-[350px] overflow-hidden break-words">
                        <div
                            dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-300 italic">Start typing your message to see a live preview...</p>' }}
                        />
                    </div>

                    {/* Footer Branding */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[12px] font-black text-gray-900">{propertyName}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exclusive Estate Agent</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-300">image</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
