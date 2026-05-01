import React from 'react';
import Link from 'next/link';

export const InvitationTipsCard = () => (
    <div className="p-8 rounded-[32px] bg-[#3525CD] text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
            </div>
            <h4 className="text-[18px] font-black mb-6">Invitation Tips</h4>
            <ul className="space-y-5">
                {[
                    "Ensure emails are from corporate domains for better trust.",
                    "Pre-assigning offices speeds up the onboarding flow.",
                ].map((tip, i) => (
                    <li key={i} className="flex gap-4">
                        <span className="material-symbols-outlined text-[18px] text-indigo-200 mt-0.5">check_circle</span>
                        <p className="text-[14px] font-medium leading-relaxed text-indigo-50">{tip}</p>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export const UsageStatsCard: React.FC<{ usage?: number; total?: number }> = ({ usage = 0, total = 0 }) => {
    const percentage = total > 0 ? Math.round((usage / total) * 100) : 0;
    return (
    <div className="p-8 rounded-[32px] bg-white border border-gray-100/50 shadow-sm shadow-indigo-100/20">
        <div className="flex items-center justify-between mb-6">
            <h4 className="text-[14px] font-black uppercase tracking-widest text-gray-400">Active Licenses</h4>
            <span className="text-[11px] font-black text-gray-400 uppercase">Usage</span>
        </div>
        <div className="flex items-end justify-between mb-4">
            <span className="text-[32px] font-black text-gray-900">{usage}</span>
            <span className="text-[14px] font-black text-indigo-600">Agents</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3525CD] rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
        </div>
    </div>
    );
};

export const RecentlyInvitedCard: React.FC<{ agents?: any[] }> = ({ agents = [] }) => (
    <div className="p-8 rounded-[32px] bg-white border border-gray-100/50 shadow-sm shadow-indigo-100/20">
        <div className="flex items-center justify-between mb-8">
            <h4 className="text-[16px] font-black text-gray-900">Recently Invited</h4>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
            </button>
        </div>
        <div className="space-y-6 mb-8">
            {agents.length > 0 ? agents.map((actor, i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${actor.name}&background=F3F4F7&color=4F46E5`} alt="" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-gray-900 leading-none mb-1">{actor.name}</p>
                            <p className="text-[12px] font-medium text-gray-400">{actor.email}</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${actor.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                        {actor.status || 'PENDING'}
                    </span>
                </div>
            )) : (
                <p className="text-center text-gray-400 text-sm py-4">No recent invitations</p>
            )}
        </div>
        <Link href="/org/agents" className="block w-full py-4 text-[12px] text-center font-black uppercase tracking-widest text-[#3525CD] hover:bg-gray-50 rounded-2xl transition-all">
            View All Agents
        </Link>
    </div>
);
