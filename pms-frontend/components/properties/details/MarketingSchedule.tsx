import { useState } from "react";
import ScheduleSocialMediaModal from "@/components/properties/modals/ScheduleSocialMediaModal";
import {
  getPlatformIcon,
  getMarketingStatusStyles,
} from "@/utils/property.helpers";
import Link from "next/link";
import { getPermissions } from "@/lib/config/permissions";
import { useAuth } from "@/context/AuthContext";

interface MarketingScheduleProps {
  propertyId: string;
  propertyTitle?: string;
  propertyDescription?: string;
  schedule?: Array<{
    id: number;
    platform: string;
    scheduled_for: string | null;
    created_at: string;
    status: string;
  }>;
  propertyImages?: any[];
  onSuccess?: () => void;
  propertyStatus?: string;
}

export default function MarketingSchedule({
  propertyId,
  propertyTitle,
  propertyDescription,
  schedule,
  propertyImages,
  onSuccess,
  propertyStatus,
}: MarketingScheduleProps) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const sortedSchedule = [...(schedule || [])].sort((a, b) => b.id - a.id);
  const displaySchedule = sortedSchedule.slice(0, 3);
  const hasTasks = displaySchedule.length > 0;
  const { primaryRole } = useAuth();
  const permissions = getPermissions(primaryRole || 0);
  return (
    <>
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-bold text-gray-900">
            Marketing Schedule
          </h3>
          {permissions.canCreateMarketings && propertyStatus?.toLowerCase() !== 'completed' && (
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="w-8 h-8 bg-[#EEF2FF] text-[#3525CD] rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          )}
        </div>

        <div className="relative pl-3 space-y-6 flex-1 text-start">
          {/* Timeline Line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gray-100" />

          {!hasTasks ? (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">
                No marketing tasks scheduled yet.
              </p>
            </div>
          ) : (
            displaySchedule.map((task) => {
              const styles = getMarketingStatusStyles(task.status);
              const displayDate = task.scheduled_for || task.created_at;
              const formattedDate = displayDate
                ? new Date(displayDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not scheduled";

              return (
                <div key={task.id} className="relative flex items-start gap-5">
                  <div
                    className={`w-[20px] h-[20px] rounded-full border-4 border-white shadow-sm mt-2 shrink-0 z-10 ${styles.dot}`}
                  />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600 overflow-hidden">
                    {propertyImages && propertyImages.length > 0 ? (
                      <img 
                        src={(propertyImages[0] as any).signedUrl} 
                        alt="Property" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">
                        {getPlatformIcon(task.platform)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-900 mb-1 capitalize">
                      {task.platform} Post
                    </h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="material-symbols-outlined text-[14px]">
                          calendar_today
                        </span>
                        <span className="text-[11px] font-bold">
                          {formattedDate}
                        </span>
                      </div>
                      <span
                        className={`w-fit px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gray-50 ${styles.text}`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {schedule && schedule.length >= 2 && (
          <Link
            href={`/properties/${propertyId}/marketing`}
            className="w-full mt-6 py-3 bg-white border border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
          >
            View All Marketing
          </Link>
        )}

        {/* <button
          onClick={() => setIsPostModalOpen(true)}
          className="w-full mt-6 py-3 bg-white border border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
        >
          + Schedule New Post
        </button> */}
      </section>

      <ScheduleSocialMediaModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        propertyId={Number(propertyId)}
        propertyTitle={propertyTitle}
        propertyDescription={propertyDescription}
        propertyImages={propertyImages}
        onSuccess={onSuccess}
      />
    </>
  );
}
