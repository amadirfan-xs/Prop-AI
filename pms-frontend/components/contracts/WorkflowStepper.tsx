"use client";

import React from 'react';

interface Step {
    id: number;
    label: string;
    status: 'completed' | 'active' | 'pending';
    date?: string;
    description?: string;
}

interface WorkflowStepperProps {
    hasVersions: boolean;
    stats?: {
        totalSellers: number;
        approvedSellers: number;
        rejectedSellers: number;
        requestChangeSellers: number;
        totalBuyers: number;
        approvedBuyers: number;
        rejectedBuyers: number;
        requestChangeBuyers: number;
        totalRequired: number;
        totalApproved: number;
        hasVetoed: boolean;
    } | null;
}

export default function WorkflowStepper({ hasVersions, stats }: WorkflowStepperProps) {
    const buyersApproved = stats && stats.totalBuyers > 0 && stats.approvedBuyers > (stats.rejectedBuyers + stats.requestChangeBuyers);
    const sellersApproved = stats && stats.totalSellers > 0 && stats.approvedSellers > (stats.rejectedSellers + stats.requestChangeSellers);
    const allApproved = buyersApproved && sellersApproved;

    const steps: Step[] = [
        { 
            id: 1, 
            label: 'Agent Upload', 
            status: hasVersions ? 'completed' : 'active',
            description: hasVersions ? 'Contract Drafted' : 'Drafting in progress'
        },
        { 
            id: 2, 
            label: 'Buyer Review', 
            status: buyersApproved ? 'completed' : (hasVersions ? 'active' : 'pending'),
            description: buyersApproved ? 'Approved by all Buyers' : (hasVersions ? 'Pending Buyer signatures' : 'Waiting for contract')
        },
        { 
            id: 3, 
            label: 'Seller Review', 
            status: sellersApproved ? 'completed' : (buyersApproved ? 'active' : 'pending'),
            description: sellersApproved ? 'Approved by all Sellers' : (buyersApproved ? 'Pending Seller signatures' : 'Waiting for Buyers')
        },
        { 
            id: 4, 
            label: 'Completed', 
            status: allApproved ? 'completed' : 'pending',
            description: allApproved ? 'Deal Executed' : 'Final Execution'
        },
    ];

    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-[#4F46E5] text-[24px]">account_tree</span>
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Workflow Status</h3>
            </div>

            <div className="space-y-0 relative">
                {steps.map((step, idx) => (
                    <div key={step.id} className="relative flex gap-5 pb-8 last:pb-0 group">
                        {/* Line */}
                        {idx !== steps.length - 1 && (
                            <div className="absolute left-[13px] top-[26px] bottom-0 w-[2px] bg-gray-100 group-last:hidden" />
                        )}

                        {/* Node */}
                        <div className="relative z-10">
                            {step.status === 'completed' ? (
                                <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white scale-110 shadow-lg shadow-indigo-100">
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                </div>
                            ) : step.status === 'active' ? (
                                <div className="w-7 h-7 rounded-full bg-white border-2 border-[#4F46E5] flex items-center justify-center relative">
                                    <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                                    <div className="absolute inset-0 rounded-full border-2 border-[#4F46E5] animate-ping opacity-20" />
                                </div>
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-50 border-2 border-gray-100" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="pt-0.5">
                            <h4 className={`text-[15px] font-black ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                                {step.label}
                            </h4>
                            <p className={`text-[12px] font-bold mt-1 ${step.status === 'active' ? 'text-[#4F46E5] uppercase tracking-wider' : 'text-gray-400'}`}>
                                {step.date || step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
