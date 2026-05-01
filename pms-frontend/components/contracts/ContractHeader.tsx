"use client";

import React from 'react';
import { Button } from '@/components/common/Button';

interface ContractHeaderProps {
    title: string;
    subtitle: string;
    status: string;
}

export default function ContractHeader({ title, subtitle, status }: ContractHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div className="space-y-1.5 text-start">
                <div className="flex items-center gap-3">
                    <h1 className="text-[42px] font-black text-gray-900 tracking-tight leading-tight">{title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-[18px] font-medium text-gray-400">{subtitle}</p>
                    <div className="px-3.5 flex items-center justify-center  bg-indigo-50 rounded-full border border-indigo-100/50">
                        <span className="text-[12px] self-center font-black tracking-widest text-[#4F46E5] uppercase">{status}</span>
                    </div>
                </div>

            </div>

            <div className="flex items-center gap-4">
                {/* <Button className="!w-auto !px-6 !py-3.5 !bg-white !border-gray-100 border !rounded-[20px] !text-[15px] !font-black !text-gray-400 hover:!text-gray-900 hover:!border-gray-200 border transition-all shadow-sm group">
                    <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-gray-900 transition-colors">share</span>
                    Share Access
                </Button> */}
                <Button>
                    {/* className="!w-auto !px-6 !py-3.5 !bg-[#4F46E5] !rounded-[20px] !shadow-lg !shadow-indigo-100 group"> */}
                    <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[20px] text-white/90">download</span>
                        Export PDF
                    </div>
                </Button>
            </div>
        </div>
    );
}
