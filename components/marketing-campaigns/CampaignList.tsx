'use client';

import React from 'react';
import { Button } from '@/components/common/Button';

interface CampaignListProps {
  campaigns: any[];
  onNewCampaign: () => void;
}

export default function CampaignList({ campaigns, onNewCampaign }: CampaignListProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <CampaignHeader onNewCampaign={onNewCampaign} />
      <CampaignTable campaigns={campaigns} />
    </div>
  );
}

// --- Sub-components ---

function CampaignHeader({ onNewCampaign }: { onNewCampaign: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-[24px] font-black text-gray-900">Marketing Campaigns</h2>
                <p className="text-[14px] font-medium text-gray-400">Manage and track your email broadcasts.</p>
            </div>
            <Button
                onClick={onNewCampaign}
                className="!h-14 !px-8 !bg-[#3525CD] !text-white !text-[13px] !font-black !uppercase !tracking-widest !rounded-2xl hover:!bg-[#2A1DA6] shadow-xl shadow-indigo-100"
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    <span>Create New Campaign</span>
                </div>
            </Button>
        </div>
    );
}

function CampaignTable({ campaigns }: { campaigns: any[] }) {
    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden text-black">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-50">
                        <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Campaign Name</th>
                        <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Property</th>
                        <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Recipients</th>
                        <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.length === 0 ? (
                        <EmptyState />
                    ) : (
                        campaigns.map((c) => <CampaignRow key={c.id} campaign={c} />)
                    )}
                </tbody>
            </table>
        </div>
    );
}

function CampaignRow({ campaign }: { campaign: any }) {
    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td className="px-8 py-6">
                <p className="text-[15px] font-black text-gray-900">{campaign.name}</p>
                <p className="text-[12px] font-medium text-gray-400 line-clamp-1">{campaign.subject}</p>
            </td>
            <td className="px-8 py-6">
                <p className="text-[14px] font-bold text-gray-700">{campaign.property?.property_title || 'N/A'}</p>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-50 text-[#3525CD] text-[12px] font-black rounded-lg">
                        {campaign.recipients?.length || 0}
                    </span>
                </div>
            </td>
            <td className="px-8 py-6">
                <StatusBadge status={campaign.status} />
            </td>
            <td className="px-8 py-6">
                <p className="text-[13px] font-bold text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
            </td>
        </tr>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        sent: 'bg-emerald-50 text-emerald-600',
        failed: 'bg-red-50 text-red-600',
        sending: 'bg-blue-50 text-blue-600',
        default: 'bg-amber-50 text-amber-600'
    };

    const style = styles[status] || styles.default;

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${style}`}>
            {status}
        </span>
    );
}

function EmptyState() {
    return (
        <tr>
            <td colSpan={5} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <span className="material-symbols-outlined text-[48px]">campaign</span>
                    <p className="text-[14px] font-medium">No campaigns found. Start your first one!</p>
                </div>
            </td>
        </tr>
    );
}
