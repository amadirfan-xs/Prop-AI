import React from 'react';
import Image from 'next/image';

interface AgentPerformance {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    totalProperties: number;
    dealsClosed: number;
}

interface AgentPerformanceTableProps {
    agents?: AgentPerformance[];
}

export default function AgentPerformanceTable({ agents = [] }: AgentPerformanceTableProps) {
    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Agent Performance</h3>
                    <p className="text-[14px] font-medium text-gray-400">Activity and deal closure metrics.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 text-[11px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-8 py-4">Agent Name</th>
                            <th className="px-8 py-4">Total Listings</th>
                            <th className="px-8 py-4">Deals Closed</th>
                            <th className="px-8 py-4">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {agents.length > 0 ? (
                            agents.map((agent) => {
                                const total = Number(agent.totalProperties);
                                const deals = Number(agent.dealsClosed);
                                const performance = total > 0 ? Math.round((deals / total) * 100) : 0;

                                return (
                                    <tr key={agent.id} className="group hover:bg-gray-50/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-[40px] h-[40px] rounded-full bg-indigo-100 overflow-hidden relative border-2 border-white shadow-sm shrink-0">
                                                    {(() => {
                                                        const name = agent.name || 'Agent';
                                                        const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEF2FF&color=4F46E5`;
                                                        let src = agent.avatar || fallback;
                                                        
                                                        // Ensure src is a valid absolute URL for Next.js remote Image
                                                        if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
                                                            src = fallback;
                                                        }

                                                        return (
                                                            <Image
                                                                src={src}
                                                                alt={name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized={true} // Add unoptimized if we are using external non-configured domains frequently
                                                            />
                                                        );
                                                    })()}
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[150px]">
                                                        {agent.name}
                                                    </p>
                                                    <p className="text-[12px] font-medium text-gray-400 truncate max-w-[150px]">
                                                        {agent.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[15px] font-bold text-gray-900">{total}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[15px] font-bold text-gray-900">{deals}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 w-[80px] bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${performance >= 70 ? 'bg-green-500' :
                                                            performance >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${performance}%` }}
                                                    />
                                                </div>
                                                <span className="text-[13px] font-bold text-gray-900">{performance}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-10 text-center">
                                    <p className="text-[14px] font-medium text-gray-400">No agents found in this organization.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
