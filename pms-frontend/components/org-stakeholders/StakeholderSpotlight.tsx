import React from 'react';

export default function StakeholderSpotlight({ data }: { data?: any }) {
    const spotlight = data || {
        name: "Brokerage Roster",
        managedStakeholders: 0,
        avgClosureTime: "N/A",
        successRate: "N/A",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
    };

    return (
        <div className="relative overflow-hidden bg-[#3525CD] rounded-3xl p-10 text-white min-h-[380px] flex flex-col justify-between group shadow-xl shadow-indigo-200/50">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">trending_up</span>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">stars</span>
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-widest text-indigo-100">Brokerage Spotlight</span>
                </div>

                <div className="flex items-center gap-6 mb-10">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl">
                        <img
                            src={spotlight.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"}
                            alt={spotlight.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-[32px] font-black tracking-tight leading-none mb-2">{spotlight.name}</h2>
                        <p className="text-[16px] font-medium text-indigo-100">Managing {spotlight.managedStakeholders} stakeholders this month</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#A599FF] mb-1">Avg. Closure</p>
                    <p className="text-[24px] font-black">{spotlight.avgClosureTime}</p>
                </div>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#A599FF] mb-1">Success Rate</p>
                    <p className="text-[24px] font-black">{spotlight.successRate}</p>
                </div>
            </div>
        </div>
    );
}
