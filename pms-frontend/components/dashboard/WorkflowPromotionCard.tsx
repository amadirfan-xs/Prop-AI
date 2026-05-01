import React from 'react';
import { SparklesIcon } from '@/constants/icons/DashboardIcons';

export default function WorkflowPromotionCard() {
    return (
        <div className="bg-[#4F46E5] rounded-[24px] p-6 lg:p-8 text-white relative overflow-hidden flex flex-col h-full shadow-[0_20px_50px_rgba(79,70,229,0.2)]">
            {/* Background Decorations */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="w-[48px] h-[48px] lg:w-[60px] lg:h-[60px] bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 lg:mb-8 shadow-inner border border-white/10">
                    <SparklesIcon size={28} className="lg:size-32" />
                </div>

                <div className="flex flex-col gap-2 lg:gap-3 mb-8 lg:mb-10">
                    <h3 className="text-[22px] lg:text-[26px] font-bold leading-[1.1] tracking-tight">
                        Automate Your <br className="hidden lg:block" /> Workflow
                    </h3>
                    <p className="text-[14px] lg:text-[15px] text-indigo-100 leading-relaxed font-medium">
                        Connect legal documents to sign deals faster and reduce closing times by 40%.
                    </p>
                </div>

                <div className="mt-auto">
                    <button className="w-full bg-white text-[#4F46E5] font-bold py-3.5 lg:py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] tracking-tight text-[15px]">
                        Explore Integrations
                    </button>
                </div>
            </div>
        </div>
    );
}
