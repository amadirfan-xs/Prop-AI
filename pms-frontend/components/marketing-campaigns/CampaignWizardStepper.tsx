'use client';

import React from 'react';

interface StepperProps {
    currentStep: number;
    steps: string[];
}

export default function CampaignWizardStepper({ currentStep, steps }: StepperProps) {
    return (
        <div className="flex items-center justify-between max-w-[800px] mx-auto mb-16 px-4">
            {steps.map((step, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-3 relative group">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-black transition-all duration-500 shadow-lg ${isActive
                                        ? 'bg-[#3525CD] text-white scale-110 shadow-indigo-200 ring-4 ring-indigo-50'
                                        : isCompleted
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white border-2 border-gray-100 text-gray-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                ) : (
                                    stepNum
                                )}
                            </div>
                            <span className={`text-[12px] font-black uppercase tracking-widest ${isActive ? 'text-[#3525CD]' : 'text-gray-300'
                                }`}>
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-[2px] bg-gray-100 mx-4 -mt-8">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-700"
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                ></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
