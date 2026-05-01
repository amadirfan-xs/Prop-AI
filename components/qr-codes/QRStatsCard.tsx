"use client";

import React from "react";

interface QRStatsCardProps {
  label: string;
  value: string;
  trend?: string;
  limit?: string;
}

export default function QRStatsCard({
  label,
  value,
  trend,
  limit,
}: QRStatsCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between min-h-[160px]">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#3525CD] rounded-full"></div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">
            {label}
          </p>
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-[32px] md:text-sm font-black text-gray-900 leading-none tracking-tight">
            {value}
          </p>
          {/* {trend && (
                        <span className="text-[13px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {trend}
                        </span>
                    )} */}
        </div>
      </div>

      {limit && (
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Storage Capacity
          </p>
          <p className="text-[12px] font-black text-gray-900">{limit}%</p>
        </div>
      )}
    </div>
  );
}
