import React from "react";
import { getActivityStyles } from "@/utils/property.helpers";
import Link from "next/link";

interface RecentActivityProps {
  propertyId: string;
  activities?: Array<{
    event: string;
    description: string;
    created_at: string;
    actor_name: string;
  }>;
}

export default function RecentActivity({
  propertyId,
  activities,
}: RecentActivityProps) {
  const displayActivities = (activities || []).slice(0, 5);
  const hasActivities = displayActivities.length > 0;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold text-gray-900">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {!hasActivities ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">No recent activity logged.</p>
          </div>
        ) : (
          displayActivities.map((item, idx) => {
            const styles = getActivityStyles(item.event);
            return (
              <div key={idx} className="flex gap-5">
                <div
                  className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${styles.bg}`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${styles.color}`}
                  >
                    {styles.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center text-start">
                  <h4 className="text-[14px] font-black text-gray-800 leading-tight">
                    {item.event} by {item.actor_name}
                  </h4>
                  <p className="text-[12px] font-medium text-gray-500 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                  <p className="text-[12px] font-medium text-gray-400 mt-1.5">
                    {formatTime(item.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activities && activities.length >= 2 && (
        <Link
          href={`/properties/${propertyId}/activities`}
               className="w-full mt-6 py-3 bg-white border border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
     >
          View All Activity
        </Link>
      )}
    </section>
  );
}
