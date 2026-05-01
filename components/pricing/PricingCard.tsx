"use client";

import React from 'react';

interface PricingFeature {
    text: string;
    icon?: string;
}

interface PricingCardProps {
    planName: string;
    price: string;
    priceSuffix?: string;
    description?: string;
    features: (string | PricingFeature)[];
    buttonText: string;
    onButtonClick?: () => void;
    isPremium?: boolean;
    isOrganizational?: boolean;
    isCurrentPlan?: boolean;
}

export default function PricingCard({
    planName,
    price,
    priceSuffix = "/mo",
    description,
    features,
    buttonText,
    onButtonClick,
    isPremium = false,
    isOrganizational = false,
    isCurrentPlan = false,
}: PricingCardProps) {
    return (
        <div className={`relative flex flex-col p-10 rounded-[32px] transition-all duration-300 ${isPremium
                ? 'bg-white border-2 border-[#4F46E5] shadow-2xl shadow-indigo-100 scale-105 z-10'
                : isOrganizational
                    ? 'bg-gray-400/40 border border-gray-100 shadow-lg shadow-gray-200/50'
                    : 'bg-white border border-gray-100 shadow-lg shadow-gray-200/50'
            }`}>
            {isPremium && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3525CD] text-white px-6 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest">
                    Most Popular
                </div>
            )}
            {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest">
                    Current Plan
                </div>
            )}

            <div className="text-start space-y-6 flex-grow">
                <div className="space-y-4">
                    <h3 className={`text-[13px] font-black uppercase tracking-[0.2em] ${isPremium ? 'text-[#4F46E5]' : 'text-gray-900'}`}>
                        {planName}
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[48px] font-black text-gray-900 tracking-tight">{price}</span>
                        {!isOrganizational && price !== 'Custom' && (
                            <span className="text-[16px] font-bold text-gray-400">{priceSuffix}</span>
                        )}
                    </div>
                    {description && (
                        <p className="text-[14px] font-medium text-gray-400 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                <div className="space-y-6 py-4">
                    {features.map((feature, index) => {
                        const featureText = typeof feature === 'string' ? feature : feature.text;
                        const featureIcon = typeof feature === 'string' ? (isOrganizational ? 'grid_view' : 'check') : feature.icon;

                        return (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`mt-0.5 w-6 h-6  flex items-center justify-center flex-shrink-0 ${isPremium ? 'bg-indigo-600 rounded-full text-white' : ' text-gray-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[14px] font-bold">
                                        {featureIcon}
                                    </span>
                                </div>
                                <span className={`text-[15px] font-bold leading-tight ${isPremium ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {featureText}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-10">
                <button
                    onClick={isCurrentPlan ? undefined : onButtonClick}
                    disabled={isCurrentPlan}
                    className={`w-full py-5 rounded-2xl text-[16px] font-black transition-all ${isCurrentPlan
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : isPremium
                                ? 'bg-[#3525CD] text-white shadow-xl shadow-indigo-200 hover:bg-[#2D1FBB] active:scale-[0.98] cursor-pointer'
                                : isOrganizational
                                    ? 'bg-[#191C1E] text-white hover:bg-black active:scale-[0.98] cursor-pointer'
                                    : 'bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-50 active:scale-[0.98] cursor-pointer'
                        }`}
                >
                    {isCurrentPlan ? 'Your Active Plan' : buttonText}
                </button>
            </div>
        </div>
    );
}
