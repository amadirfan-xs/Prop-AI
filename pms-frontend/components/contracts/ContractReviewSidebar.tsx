"use client";

import React from 'react';
import { Button } from '@/components/common/Button';

import { UserPermissions } from '@/lib/config/permissions';
import { ContractVersion } from '@/types/properties';

import ConsensusProgressCard from './ConsensusProgressCard';

interface ContractReviewSidebarProps {
    onRequestChanges: () => void;
    permissions?: UserPermissions;
    property?: any;
    latestVersion?: ContractVersion | null;
    consensusStats?: any;
}

export default function ContractReviewSidebar({ 
    onRequestChanges, 
    permissions, 
    property, 
    latestVersion,
    consensusStats
}: ContractReviewSidebarProps) {
    return (
        <div className="space-y-6">
          
            <ConsensusProgressCard stats={consensusStats} />

            {/* Document Details Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="text-start border-b border-gray-50 pb-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">DOCUMENT DETAILS</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-400">Version</span>
                        <span className="text-[13px] font-bold text-gray-900">v{latestVersion?.id || '1.0'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-400">Document ID</span>
                        <span className="text-[13px] font-bold text-gray-900">#GP-2024-{property?.id || '...'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-400">Status</span>
                        <span className="text-[13px] font-bold text-[#4F46E5] uppercase tracking-tighter">{property?.fulfillment_status || 'Under Review'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-400">Security</span>
                        <div className="flex items-center gap-1.5 text-[#16A34A]">
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            <span className="text-[13px] font-bold">End-to-End Encrypted 🔥</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <span className="text-[13px] font-medium text-gray-400">Created Date</span>
                        <span className="text-[13px] font-bold text-gray-900">
                            {latestVersion ? new Date(latestVersion.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Legal Info Box - ONLY for Stakeholders */}
            {permissions?.canDecideContracts && (
                <div className="bg-[#F5F3FF] rounded-[24px] p-6 flex gap-4 text-start">
                    <div className="text-[#3525CD] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">info</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#3525CD]/80 leading-relaxed">
                        By clicking <span className="font-bold text-[#3525CD]">Approve & Sign</span>, you are agreeing to the terms laid out in the document and your electronic signature will be legally binding.
                    </p>
                </div>
            )}
        </div>
    );
}
