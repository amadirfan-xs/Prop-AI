import React from 'react';
import { useRouter } from 'next/navigation';
import { formatTimeAgo } from '@/utils/formatter';

interface ActivityLog {
    id: number;
    event: string;
    description: string;
    timestamp: string;
    actorName: string;
    propertyName: string;
}

interface RecentActivityTimelineProps {
    activities?: ActivityLog[];
}

export default function RecentActivityTimeline({ activities = [] }: RecentActivityTimelineProps) {
    const router = useRouter();
    return (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Recent Activity</h3>
                <span className="material-symbols-outlined text-gray-400">history</span>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="relative pl-10 group">
                            <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-white border-2 border-indigo-600 shadow-sm z-10 group-hover:scale-125 transition-transform" />
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[15px] font-bold text-gray-900 leading-tight">
                                        {activity.actorName} <span className="font-medium text-gray-400">performed</span> {activity.event}
                                    </p>
                                    <span className="text-[11px] font-black text-gray-300 uppercase whitespace-nowrap">
                                        {formatTimeAgo(activity.timestamp)}
                                    </span>
                                </div>
                                <p className="text-[13px] font-medium text-gray-400 leading-relaxed">
                                    {activity.description} on <span className="text-gray-900 font-bold">{activity.propertyName}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center">
                        <p className="text-[14px] font-medium text-gray-400">No recent activity noted.</p>
                    </div>
                )}
            </div>

            <button 
                onClick={() => router.push('/org/activities')}
                className="w-full py-4 text-[14px] font-black text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest border-t border-gray-50"
            >
                View All Activity
            </button>
        </div>
    );
}
