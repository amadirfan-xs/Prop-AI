"use client";

import React, { useState } from 'react';
import Pagination from '@/components/common/Pagination';

export default function StakeholdersTable({ 
    data = [], 
    isLoading = false,
    pagination = { page: 1, limit: 10, total: 0 },
    onPageChange,
    onLimitChange
}: { 
    data?: any[]; 
    isLoading?: boolean; 
    pagination?: { page: number; limit: number; total: number };
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}) {
    const mappedStakeholders = data.map(item => ({
        id: item.stakeholderId,
        name: item.name,
        email: item.email,
        initials: item.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??',
        type: item.typeId === 3 ? 'Buyer' : 'Seller',
        property: item.propertyName,
        propertyId: item.propertyId,
        agent: item.agentName || 'Unassigned',
        date: new Date(item.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        avatar: item.avatar
    }));

    return (
        <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm shadow-indigo-100/10 overflow-hidden">
            {/* Table Header / Filters placeholder */}
            <div className="px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Enterprise Client Roster</h3>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[13px] font-medium text-gray-400">
                        {isLoading ? 'Synchronizing...' : `Total: ${pagination.total} individuals`}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3525CD]"></div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pl-12 pr-4 py-6 text-xs  text-gray-400 uppercase ">Client Identity</th>
                                <th className="px-4 py-6 text-xs  text-gray-400 uppercase ">Role</th>
                                <th className="px-4 py-6 text-xs  text-gray-400 uppercase ">Portfolio Context</th>
                                <th className="px-4 py-6 text-xs  text-gray-400 uppercase ">Project Lead</th>
                                <th className="pl-4 pr-12 py-6 text-xs  text-gray-400 uppercase text-right">Registration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedStakeholders.length > 0 ? mappedStakeholders.map((person, idx) => (
                                <tr key={person.id || idx} className="group hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-none">
                                    <td className="pl-12 pr-4 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[15px] font-black shadow-sm overflow-hidden">
                                                {person.avatar ? (
                                                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                                                ) : person.initials}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-black text-gray-900 leading-tight mb-1">{person.name}</span>
                                                <span className="text-[13px] font-medium text-gray-500">{person.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${person.type === 'Buyer' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {person.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-black text-gray-900 leading-tight mb-1 truncate max-w-[200px]">{person.property}</span>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-600">Active Engagement</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-white shadow-sm flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">person</span>
                                            </div>
                                            <span className={`text-[13px] font-black tracking-tight ${person.agent === 'Unassigned' ? 'text-gray-400 font-medium' : 'text-gray-900'}`}>{person.agent}</span>
                                        </div>
                                    </td>
                                    <td className="pl-4 pr-12 py-6 text-[13px] font-medium text-right text-gray-400">{person.date}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">
                                        No project stakeholders found matching current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                currentPage={pagination.page}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={onPageChange || (() => {})}
                onItemsPerPageChange={onLimitChange || (() => {})}
            />
        </div>
    );
}
