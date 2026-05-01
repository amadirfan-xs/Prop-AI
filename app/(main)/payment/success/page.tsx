'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowForwardIcon } from '@/constants/icons/DashboardIcons';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-2xl mx-auto">
            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-8">
                <CheckCircleIcon size={48} color="#10B981" />
            </div>
            
            <h1 className="text-[42px] font-black text-gray-900 mb-4 tracking-tight leading-tight">
                Payment Received!
            </h1>
            
            <p className="text-[18px] font-bold text-gray-500 mb-10 leading-relaxed">
                Thank you for upgrading to the Premium Plan. Your account features are being updated automatically. 
                This may take a minute to reflect in your dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                    onClick={() => router.push('/billing')}
                    className="bg-[#3525CD] text-white py-4 px-10 rounded-2xl font-black text-[16px] hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    View Billing
                </button>
                
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-white text-gray-900 border-2 border-gray-100 py-4 px-10 rounded-2xl font-black text-[16px] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    Go to Dashboard
                    <ArrowForwardIcon size={20} />
                </button>
            </div>

            {sessionId && (
                <p className="mt-12 text-[12px] font-bold text-gray-300 uppercase tracking-widest">
                    Reference: {sessionId.slice(0, 16)}...
                </p>
            )}
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3525CD]"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
