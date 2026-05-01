'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ErrorIcon, RefreshIcon, HelpIcon } from '@/constants/icons/DashboardIcons';

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-2xl mx-auto">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                <ErrorIcon size={48} color="#EF4444" />
            </div>
            
            <h1 className="text-[42px] font-black text-gray-900 mb-4 tracking-tight leading-tight">
                Payment Cancelled
            </h1>
            
            <p className="text-[18px] font-bold text-gray-500 mb-10 leading-relaxed">
                Something went wrong or the payment process was cancelled. No charges were made to your card.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                    onClick={() => router.push('/pricing')}
                    className="bg-gray-900 text-white py-4 px-10 rounded-2xl font-black text-[16px] hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    Try Again
                    <RefreshIcon size={20} />
                </button>
                
                <button 
                    onClick={() => router.push('/billing')}
                    className="bg-white text-gray-900 border-2 border-gray-100 py-4 px-10 rounded-2xl font-black text-[16px] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    Back to Billing
                </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 font-bold">
                <HelpIcon size={18} />
                <p className="text-[14px]">Need assistance? Contact our support team.</p>
            </div>
        </div>
    );
}
