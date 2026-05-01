"use client";

import React from 'react';
import { Button } from '@/components/common/Button';

interface ContractUploadCardProps {
    isUploaded: boolean;
    onUpload: (status: boolean) => void;
}

export default function ContractUploadCard({ isUploaded, onUpload }: ContractUploadCardProps) {
    if (isUploaded) {
        return (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col min-h-[500px] md:min-h-[700px]">
                {/* File Header */}
                <div className="px-4 md:px-8 py-4 md:py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-50 flex-shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#4F46E5] text-[18px] md:text-[22px]">description</span>
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[14px] md:text-[16px] font-black text-gray-900 leading-tight truncate">Main_Contract_v1.2_GP.pdf</h4>
                            <p className="text-[10px] md:text-[12px] font-medium text-gray-400 truncate">Modified 2 hours ago by Jonathan Miller</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        <button className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">search</span>
                        </button>
                        <button className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-900">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">open_in_full</span>
                        </button>
                    </div>
                </div>

                {/* Document Preview (Mock) */}
                <div className="flex-1 bg-gray-50 p-3 md:p-12 overflow-y-auto">
                    <div className="bg-white shadow-xl mx-auto max-w-[800px] min-h-[800px] md:min-h-[1000px] p-6 md:p-20 text-start">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-16">
                            <div>
                                <h1 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tight mb-2">Purchase<br />Agreement</h1>
                                <div className="w-10 md:w-12 h-0.5 md:h-1 bg-[#4F46E5]" />
                            </div>
                            <div className="sm:text-right">
                                <p className="text-[11px] md:text-[12px] font-black text-[#4F46E5] uppercase tracking-widest">Confidential</p>
                                <p className="text-[10px] md:text-[11px] font-medium text-gray-400 mt-1">Ref: GP-104-X</p>
                            </div>
                        </div>

                        <div className="space-y-8 md:space-y-12">
                            <section>
                                <h3 className="text-[13px] md:text-[15px] font-black text-gray-900 uppercase tracking-widest mb-3 md:mb-4">1. Parties</h3>
                                <p className="text-[13px] md:text-[14px] leading-[1.8] text-gray-600 font-medium text-pretty">
                                    This Purchase Agreement ("Agreement") is entered into as of October 24, 2023, by and between the Buyer, Jonathan Miller, and the Seller, Sarah Jenkins, regarding the property known as "The Glass Pavilion" located at 44 Skyline Drive.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-[13px] md:text-[15px] font-black text-gray-900 uppercase tracking-widest mb-3 md:mb-4">2. Purchase Price</h3>
                                <p className="text-[13px] md:text-[14px] leading-[1.8] text-gray-600 font-medium text-pretty">
                                    The total purchase price for the property shall be $4,250,000 USD, payable in accordance with the terms set forth in Section 4 of this agreement.
                                </p>
                            </section>

                            <section className="bg-indigo-50/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-indigo-100/30">
                                <h3 className="text-[13px] md:text-[15px] font-black text-gray-900 uppercase tracking-widest mb-3 md:mb-4">3. Closing Date</h3>
                                <p className="text-[13px] md:text-[14px] leading-[1.8] text-gray-600 font-medium italic text-pretty">
                                    The closing of the transaction contemplated by this Agreement shall take place on or before December 15, 2023, unless extended by mutual written consent of both parties.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Background dashed border effect */}
            <div className="bg-white absolute inset-0 border-2 border-dashed border-gray-200 rounded-xl transition-colors group-hover:border-indigo-200" />

            <div className="relative bg-white/60 backdrop-blur-sm rounded-[32px] p-10 md:p-20 flex flex-col items-center justify-center min-h-[500px] text-center">
                {/* Upload Icon */}
                <div
                    onClick={() => onUpload(true)}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-6 md:mb-8 cursor-pointer hover:scale-105 transition-transform shadow-sm group-hover:shadow-indigo-100 hover:shadow-lg"
                >
                    <span className="material-symbols-outlined text-[30px] md:text-[36px] text-[#4F46E5] font-light">cloud_upload</span>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-8 md:mb-10">
                    <h3 className="text-[24px] md:text-[28px] font-black text-gray-900 tracking-tight">Upload Purchase Agreement</h3>
                    <p className="text-[15px] md:text-[17px] font-medium text-gray-400 max-w-[340px] mx-auto leading-relaxed">
                        Drag and drop your PDF or DOCX file here, or click to browse
                    </p>
                </div>

                {/* Action Area */}
                <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
                    <Button
                        onClick={() => onUpload(true)}
                        className="!w-auto !px-8 md:!px-10 !py-4 md:!py-5 !bg-[#4F46E5] !rounded-[20px] shadow-[0_10px_30px_-5px_rgba(79,70,229,0.3)] hover:translate-y-[-2px] transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-white text-[18px] md:text-[20px]">description</span>
                            <span className="text-[14px] md:text-[16px] font-black tracking-widest uppercase text-white">Choose File</span>
                        </div>
                    </Button>

                    {/* Format Icons */}
                    <div className="flex items-center gap-4 md:gap-8 pt-4">
                        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px] text-gray-900 font-bold">picture_as_pdf</span>
                            <span className="text-[11px] md:text-[12px] font-black text-gray-600 uppercase tracking-widest leading-none">PDF</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px] text-gray-900 font-bold">description</span>
                            <span className="text-[11px] md:text-[12px] font-black text-gray-600 uppercase tracking-widest leading-none">DOCX</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-40">
                            <span className="material-symbols-outlined text-[18px] md:text-[20px] text-gray-900 font-medium">verified</span>
                            <span className="text-[11px] md:text-[12px] font-black text-gray-600 uppercase tracking-widest leading-none">Max 25MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
