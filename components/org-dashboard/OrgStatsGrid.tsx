import React from 'react';

interface OrgStatsGridProps {
    stats?: {
        TOTAL_AGENTS: number;
        TOTAL_PROPERTIES: number;
        TOTAL_BUYERS: number;
        TOTAL_SELLERS: number;
        ACTIVE_LISTINGS: number;
        COMPLETED_DEALS: number;
    };
}

export default function OrgStatsGrid({ stats }: OrgStatsGridProps) {
    const statItems = [
        { label: 'Total Agents', value: stats?.TOTAL_AGENTS || 0, trend: 'Static', icon: 'groups', color: 'indigo' },
        { label: 'Total Properties', value: stats?.TOTAL_PROPERTIES || 0, trend: 'Static', icon: 'corporate_fare', color: 'blue' },
        { label: 'Total Buyers', value: stats?.TOTAL_BUYERS || 0, trend: 'Static', icon: 'person', color: 'purple' },
        { label: 'Total Sellers', value: stats?.TOTAL_SELLERS || 0, trend: 'Static', icon: 'storefront', color: 'indigo' },
        { label: 'Active Listings', value: stats?.ACTIVE_LISTINGS || 0, trend: 'Static', icon: 'list_alt', color: 'blue' },
        { label: 'Completed Deals', value: stats?.COMPLETED_DEALS || 0, trend: 'Static', icon: 'handshake', color: 'indigo' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {statItems.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4 transition-all hover:shadow-md">
                    <div className="w-full flex justify-between items-start">
                        <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
                        </div>
                        {/* <span className={`text-[11px] font-black px-2 py-1 rounded-full ${stat.trend === 'Static' ? 'bg-gray-100 text-gray-400' :
                            stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                            {stat.trend}
                        </span> */}
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                            {stat.label}
                        </p>
                        <p className="text-[28px] font-black text-gray-900 tracking-tight">
                            {stat.value.toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
