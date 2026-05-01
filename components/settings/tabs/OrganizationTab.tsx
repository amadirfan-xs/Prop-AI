"use client";

import React from 'react';
import { User } from '@/types/auth';
import { Input } from '@/components/common/Input';
import { BuildingIcon } from '@/constants/icons/DashboardIcons';

interface OrganizationTabProps {
    user: User | null;
}

export const OrganizationTab: React.FC<OrganizationTabProps> = ({ user }) => {
    const org = user?.organization;

    if (!org) {
        return (
            <div className="bg-white rounded-[20px] p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-gray-400">corporate_fare</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Organization Linked</h3>
                <p className="text-gray-500 mt-1">You are currently operating as an independent agent.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-sm border border-gray-100 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-50">
                <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-[24px] overflow-hidden shadow-md border-2 border-white bg-gray-50 flex items-center justify-center">
                            {org.logoUrl ? (
                                <img
                                    src={org.logoUrl}
                                    alt={org.name}
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-[32px] text-gray-300">corporate_fare</span>
                            )}
                        </div>
                    </div>
                    <div className="text-start">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[24px] font-black text-gray-900 tracking-tight leading-tight">{org.name}</h2>
                            <span className="px-3 py-1 bg-indigo-50 text-[#3525CD] text-[10px] font-black uppercase tracking-wider rounded-lg border border-indigo-100">
                                {org.plan || 'Active Organization'}
                            </span>
                        </div>
                        <p className="text-[14px] font-medium text-gray-400 mt-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            Verified Corporate Entity
                        </p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">info</span>
                    <p className="text-[12px] font-bold text-amber-700 leading-tight">
                        View-only mode. <br />
                        Contact your Org Admin to update.
                    </p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-8">
                    <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3525CD]"></span>
                        Corporate Identity
                    </h3>
                    <Input
                        label="Organization Name"
                        value={org.name}
                        disabled
                    />
                    <Input
                        label="Website"
                        value={org.websiteUrl || 'Not provided'}
                        disabled
                        icon={<span className="material-symbols-outlined text-[18px]">language</span>}
                    />
                    <Input
                        label="Tax Identification Number (TIN/VAT)"
                        value={org.taxId || 'Not provided'}
                        disabled
                        icon={<span className="material-symbols-outlined text-[18px]">badge</span>}
                    />
                </div>

                <div className="space-y-8">
                    <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3525CD]"></span>
                        Location & Contact
                    </h3>
                    <Input
                        label="Headquarters Address"
                        value={org.headquarters || 'Not provided'}
                        disabled
                        icon={<span className="material-symbols-outlined text-[18px]">location_on</span>}
                    />
                    <Input
                        label="Primary Contact Email"
                        value={org.contactEmail || 'Not provided'}
                        disabled
                        icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Contact Person"
                            value={org.contactName || 'Not provided'}
                            disabled
                        />
                        <Input
                            label="Contact Phone"
                            value={org.contactPhone || 'Not provided'}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
