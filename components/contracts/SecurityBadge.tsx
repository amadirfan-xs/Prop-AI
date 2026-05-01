"use client";

import React from 'react';

export default function SecurityBadge() {
    return (
        <div className="bg-[#F0FDF4] rounded-[24px] p-5 border border-[#DCFCE7] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#22C55E] shrink-0 shadow-sm border border-[#DCFCE7]/50">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
                <h4 className="text-[12px] font-black text-[#166534] uppercase tracking-wider mb-1">End-to-End Encrypted</h4>
                <p className="text-[11px] font-bold text-[#166534]/70 leading-normal">
                    This document is protected by bank-level security and restricted access.
                </p>
            </div>
        </div>
    );
}
