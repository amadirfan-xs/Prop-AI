"use client";

import React from "react";

interface TimelineItemProps {
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  date: string;
  status?: string;
  statusBgClass?: string;
  statusTextClass?: string;
  description?: string;
  actorName?: string;
  image?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  icon,
  iconBgClass,
  iconColorClass,
  title,
  date,
  status,
  statusBgClass,
  statusTextClass,
  description,
  actorName,
  image,
}) => {
  return (
    <div className="relative flex gap-8">
      {/* Icon with white border to break timeline */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm ${iconBgClass}`}
      >
        <span className={`material-symbols-outlined text-[24px] ${iconColorClass}`}>
          {icon}
        </span>
      </div>

      <div className="flex-1 pt-1 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h4 className="text-[16px] font-black text-gray-900 capitalize">
            {title}
          </h4>
          <span className="text-[13px] font-bold text-gray-400">{date}</span>
        </div>

        {description && (
          <p className="text-[15px] font-medium text-gray-600 leading-relaxed">
            {description}
          </p>
        )}

        {status && (
          <div className="flex items-center justify-between mt-1">
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusBgClass} ${statusTextClass}`}
            >
              {status}
            </span>
          </div>
        )}

        {image && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 aspect-video w-full max-w-[400px]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Task media" className="w-full h-full object-cover" />
          </div>
        )}

        {actorName && (
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-gray-400">
                person
              </span>
            </div>
            <span className="text-[13px] font-bold text-gray-500">
              {actorName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
