import React, { useState } from 'react';

const stakeholders = {
    buyers: [
        { name: 'Alice Smith', status: 'Active Search', initial: 'AS' },
        { name: 'Bob Thompson', status: 'Under Review', initial: 'BT' },
    ],
    sellers: [
        { name: 'Charlie Davis', status: 'Listed', initial: 'CD' },
        { name: 'Diana Prince', status: 'Closed', initial: 'DP' },
    ]
};

export default function StakeholderTabs() {
    const [activeTab, setActiveTab] = useState<'buyers' | 'sellers'>('buyers');

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('buyers')}
                    className={`flex-1 py-5 text-[14px] font-black transition-all ${activeTab === 'buyers' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-gray-400 hover:text-gray-900'
                        }`}
                >
                    Buyers
                </button>
                <button
                    onClick={() => setActiveTab('sellers')}
                    className={`flex-1 py-5 text-[14px] font-black transition-all ${activeTab === 'sellers' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/10' : 'text-gray-400 hover:text-gray-900'
                        }`}
                >
                    Sellers
                </button>
            </div>

            <div className="p-8 space-y-6 flex-grow">
                {stakeholders[activeTab].map((person, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[13px] font-black text-gray-500 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-100">
                                {person.initial}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[14px] font-black text-gray-900 leading-none">{person.name}</span>
                                <span className="text-[11px] font-medium text-gray-400 mt-1 uppercase tracking-wider">{person.status}</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-gray-300 group-hover:text-indigo-600 transition-colors">
                            chevron_right
                        </span>
                    </div>
                ))}
            </div>

            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 text-center">
                <button className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
                    View Directory
                </button>
            </div>
        </div>
    );
}
