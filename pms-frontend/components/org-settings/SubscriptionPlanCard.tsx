"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SubscriptionPlanCard() {
    const { user, isLoading } = useAuth();
    
    // In our new flow, being linked to an organization record (organizationId) 
    // means they have submitted an upgrade request/lead.
    const hasOrgRequest = !!user?.organizationId;

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-10 border border-gray-100 animate-pulse h-full">
                <div className="h-full bg-gray-50 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-10 border border-gray-100/50 shadow-sm shadow-indigo-100/10 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-[14px] font-black text-indigo-600/80 uppercase tracking-widest mb-1">Subscription Plan</h3>
                    <div className="flex items-center gap-3">
                        <h2 className="text-[32px] font-black text-gray-900 tracking-tight capitalize">
                            {hasOrgRequest ? 'Organizational' : 'Personal'}
                        </h2>
                        <span className={`px-2.5 py-1 text-white text-[10px] font-black uppercase tracking-widest rounded-lg h-fit mt-1 ${hasOrgRequest ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                            {hasOrgRequest ? 'Pending' : 'Active'}
                        </span>
                    </div>
                    <p className="text-[14px] font-medium text-gray-400 mt-1">
                        {hasOrgRequest ? 'Lead request under review' : 'Upgrade for team features'}
                    </p>
                </div>
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/50">
                    <span className="material-symbols-outlined text-gray-300 text-[32px]">
                        {hasOrgRequest ? 'hourglass_empty' : 'person'}
                    </span>
                </div>
            </div>

            <div className="space-y-4 mb-10">
                <div className="flex justify-between items-end">
                    <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Agent Seats</span>
                    <span className="text-[13px] font-black text-gray-900">
                        {hasOrgRequest ? 'Requesting 10+' : '1 / 1'}
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full shadow-sm transition-all duration-1000 ${hasOrgRequest ? 'bg-amber-400' : 'bg-[#3525CD]'}`} 
                        style={{ width: hasOrgRequest ? '50%' : '100%' }}
                    ></div>
                </div>
                <p className="text-[11px] font-bold text-gray-400">
                    {hasOrgRequest 
                        ? "Our team is reviewing your brokerage capacity details." 
                        : "Personal plans are restricted to a single agent seat."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="py-4 rounded-xl border border-gray-100 text-[13px] font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-not-allowed">
                    {hasOrgRequest ? 'Pending' : 'Manage'}
                </button>
                {hasOrgRequest ? (
                    <div className="py-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 text-[13px] font-black text-center uppercase tracking-widest">
                        Submitted
                    </div>
                ) : (
                    <Link 
                        href="/upgrade-request"
                        className="py-4 rounded-xl bg-[#3525CD] text-white text-[13px] font-black transition-all shadow-lg shadow-indigo-100 hover:bg-[#2A1DB8] active:scale-[0.98] uppercase tracking-widest text-center"
                    >
                        Upgrade
                    </Link>
                )}
            </div>
        </div>
    );
}
