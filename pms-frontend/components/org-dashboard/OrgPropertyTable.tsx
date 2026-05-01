"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { getPropertyStatusStyles } from '@/utils/property.helpers';

interface OrgPropertyTableProps {
    properties: any[];
}

export default function OrgPropertyTable({ properties }: OrgPropertyTableProps) {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/org/properties/${id}`);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusText = (status: string) => status || 'PENDING';

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full pt-6 text-left min-w-[1100px] border-separate border-spacing-y-0">
                <thead>
                    <tr className="text-xs   font-bold text-gray-400 uppercase  border-b border-gray-50">
                        <th className="pb-2 pl-8 font-bold">Property Name</th>
                        <th className="pb-2 font-bold">Assigned Agent</th>
                        <th className="pb-2 font-bold">Type</th>
                        <th className="pb-2 font-bold">Status</th>
                        <th className="pb-2 font-bold">Fulfillment Status</th>
                        <th className="pb-2 font-bold">Price</th>
                        <th className="pb-2 font-bold">Created At</th>
                        <th className="pb-2 pr-8 text-right font-bold uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {properties.map((property) => (
                        <tr
                            key={property.id}
                            onClick={() => handleRowClick(property.id)}
                            className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                        >
                            <td className="py-6 pl-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-[56px] h-[56px] rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50 shadow-sm relative">
                                        <img
                                            src={property.property_media?.[0]?.signedUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=120&h=120&auto=format&fit=crop'}
                                            alt={property.property_title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                            {property.property_title || 'Untitled Property'}
                                        </span>
                                        <span className="text-[13px] font-medium text-gray-400">
                                            {property.street_address}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600">
                                        {property.agent?.name?.[0] || '-'}
                                    </div>
                                    <span className="text-[14px] font-bold text-gray-700">{property.agent?.name || '-'}</span>
                                </div>
                            </td>
                            <td className="py-6">
                                <span className="text-[13px] font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    {property.property_type || '-'}
                                </span>
                            </td>
                             <td className="py-6">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getPropertyStatusStyles(property.status)}`}>
                                    {getStatusText(property.status)}
                                </span>
                            </td>
                            <td className="py-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${property.fulfillment_status === 'Active' ? 'bg-green-500' : 'bg-orange-400'}`} />
                                    <span className="text-[14px] font-bold text-gray-600 italic">
                                        {property.fulfillment_status || '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="py-6">
                                <span className="text-[15px] font-black text-gray-900">
                                    ${Number(property.asking_price_monthly || 0).toLocaleString()}
                                </span>
                            </td>
                            <td className="py-6">
                                <span className="text-[14px] font-medium text-gray-500">
                                    {formatDate(property.created_at)}
                                </span>
                            </td>
                            <td className="py-6 pr-8 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRowClick(property.id); }}
                                        className="p-2 text-gray-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
