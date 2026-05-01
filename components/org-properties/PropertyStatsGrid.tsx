import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
    icon: string;
    iconBg: string;
    iconColor: string;
}

const StatsCard = ({ title, value, trend, icon, iconBg, iconColor }: StatsCardProps) => (
    <div className="p-8 rounded-[32px] bg-white border border-gray-100/50 shadow-sm shadow-indigo-100/20">
        <div className="flex items-center justify-between mb-8">
            <div className={`w-12 h-12 rounded-[18px] ${iconBg} flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            {trend && (
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${trend.type === 'up' ? 'bg-indigo-50 text-indigo-600' :
                        trend.type === 'down' ? 'bg-rose-50 text-rose-600' :
                            'bg-gray-50 text-gray-500'
                    }`}>
                    {trend.value}
                </span>
            )}
        </div>
        <p className="text-[13px] font-black uppercase tracking-widest text-gray-400 mb-2">{title}</p>
        <h3 className="text-[32px] font-black text-gray-900 leading-tight">{value}</h3>
    </div>
);

export default function PropertyStatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard
                title="Total Active"
                value="842"
                trend={{ value: '+12%', type: 'up' }}
                icon="home_work"
                iconBg="bg-indigo-50"
                iconColor="text-[#3525CD]"
            />
            <StatsCard
                title="Pending Closures"
                value="156"
                trend={{ value: 'Steady', type: 'neutral' }}
                icon="pending_actions"
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
            />
            <StatsCard
                title="Brokerage GMV"
                value="$14.2M"
                trend={{ value: '+5.4%', type: 'up' }}
                icon="payments"
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
            />
            <StatsCard
                title="Avg. Days to Sell"
                value="24 Days"
                trend={{ value: '-2 days', type: 'down' }}
                icon="speed"
                iconBg="bg-gray-50"
                iconColor="text-gray-900"
            />
        </div>
    );
}
