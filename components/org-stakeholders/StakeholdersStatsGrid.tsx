import React from 'react';

const stats = [
    {
        label: 'TOTAL STAKEHOLDERS',
        value: '1,284',
        trend: '+12%',
        trendType: 'positive'
    },
    {
        label: 'ACTIVE BUYERS',
        value: '842',
        tag: 'Hot Market',
        tagType: 'orange'
    },
    {
        label: 'PENDING APPROVALS',
        value: '24',
        tag: 'Action Required',
        tagType: 'rose'
    },
    {
        label: 'CONVERSION RATE',
        value: '18.4%',
        avatars: [
            'https://ui-avatars.com/api/?name=JD&background=111827&color=fff',
            'https://ui-avatars.com/api/?name=ER&background=111827&color=fff'
        ]
    }
];

export default function StakeholdersStatsGrid({ stats }: { stats: any }) {
    const data = [
        {
            label: 'TOTAL CLIENTS',
            value: stats?.totalStakeholders?.toLocaleString() || '0',
            trend: '+5%',
            trendType: 'positive'
        },
        {
            label: 'ACTIVE BUYERS',
            value: stats?.totalBuyers?.toLocaleString() || '0',
            tag: 'Pipeline',
            tagType: 'orange'
        },
        {
            label: 'ACTIVE SELLERS',
            value: stats?.totalSellers?.toLocaleString() || '0',
            tag: 'Inventory',
            tagType: 'rose'
        },
        {
            label: 'ACTIVE PROJECTS',
            value: stats?.activeProjects?.toLocaleString() || '0',
            avatars: [
                'https://ui-avatars.com/api/?name=JD&background=111827&color=fff',
                'https://ui-avatars.com/api/?name=ER&background=111827&color=fff'
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((stat, idx) => (
                <div key={idx} className="bg-white px-10 py-10 rounded-3xl border border-gray-100/50 shadow-sm shadow-indigo-100/10">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{stat.label}</p>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-black text-gray-900  leading-none">{stat.value}</h3>
                        </div>
                        {stat.trend && (
                            <span className="text-xs font-black px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600">
                                {stat.trend}
                            </span>
                        )}
                        {stat.tag && (
                            <span className={`text-xs font-black px-4 py-2 rounded-full ${stat.tagType === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-rose-50 text-rose-700'}`}>
                                {stat.tag}
                            </span>
                        )}
                        {stat.avatars && (
                            <div className="flex -space-x-3">
                                {stat.avatars.map((avatar, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
                                        <img src={avatar} alt="Agent" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
