'use client';

import React from 'react';
import BillingContainer from '@/components/pricing/BillingContainer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
    const { activeRole, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3525CD]"></div>
            </div>
        );
    }

    if (activeRole !== 1) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
                <p className="text-gray-500 mt-2">Only Independent Agents can manage individual billing.</p>
                <button 
                    onClick={() => router.push('/')}
                    className="mt-6 text-[#3525CD] font-bold underline"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-[36px] font-black text-gray-900 tracking-tight">Billing & Payments</h1>
                <p className="text-[16px] font-bold text-gray-500">Manage your subscription and view transaction history.</p>
            </div>
            
            <BillingContainer />
        </div>
    );
}
