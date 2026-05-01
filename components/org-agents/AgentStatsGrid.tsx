import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle?: string;
    badge?: string;
    isPrimary?: boolean;
}

const StatsCard = ({ title, value, subtitle, badge, isPrimary }: StatsCardProps) => (
    <div className={`p-8 rounded-[32px] overflow-hidden relative ${isPrimary ? 'bg-[#3525CD] text-white' : 'bg-white border border-gray-100/50 shadow-sm shadow-indigo-100/20'}`}>
        {isPrimary && (
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">group</span>
            </div>
        )}
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <p className={`text-xs font-black uppercase tracking-widest ${isPrimary ? 'text-indigo-100' : 'text-gray-400'}`}>
                    {title}
                </p>
                {badge && (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
                        {badge}
                    </span>
                )}
                {!isPrimary && !badge && (
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <span className="material-symbols-outlined text-[20px]">trending_up</span>
                    </div>
                )}
            </div>
            <h3 className={`text-[48px] font-black leading-tight mb-2 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </h3>
            {subtitle && (
                <p className={`text-[14px] font-medium ${isPrimary ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

export default function AgentStatsGrid({ stats, isLoading = false }: { stats?: any; isLoading?: boolean }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[200px] bg-gray-100 rounded-[32px] animate-pulse" />
                ))}
            </div>
        );
    }

    const activeAgents = stats?.activeAgents || 0;
    const totalProperties = stats?.totalProperties || 0;
    const listingsPerAgent = stats?.listingsPerAgent || '0.0';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatsCard
                title="Total Active Force"
                value={activeAgents.toString()}
                subtitle="Currently onboarded agents"
                isPrimary
            />
            <StatsCard
                title="Total Properties"
                value={totalProperties.toString()}
                badge="Inventory"
            />
            <StatsCard
                title="Listings Per Agent"
                value={listingsPerAgent}
            />
        </div>
    );
}
