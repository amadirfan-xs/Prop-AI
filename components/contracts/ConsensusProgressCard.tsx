"use client";

import React from "react";

interface ConsensusStats {
  totalSellers: number;
  approvedSellers: number;
  rejectedSellers: number;
  requestChangeSellers: number;
  totalBuyers: number;
  approvedBuyers: number;
  rejectedBuyers: number;
  requestChangeBuyers: number;
  totalRequired: number;
  totalApproved: number;
  hasVetoed: boolean;
}

interface ConsensusProgressCardProps {
  stats: ConsensusStats | null;
  loading?: boolean;
}

export default function ConsensusProgressCard({
  stats,
  loading,
}: ConsensusProgressCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 w-24 bg-gray-100 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-50 rounded-xl"></div>
          <div className="h-10 bg-gray-50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const sellerProgress =
    stats.totalSellers > 0
      ? (stats.approvedSellers / stats.totalSellers) * 100
      : 0;
  const buyerProgress =
    stats.totalBuyers > 0
      ? (stats.approvedBuyers / stats.totalBuyers) * 100
      : 0;

  const isSellerApproved = stats.totalSellers > 0 && stats.approvedSellers > (stats.rejectedSellers + stats.requestChangeSellers);
  const isBuyerApproved = stats.totalBuyers > 0 && stats.approvedBuyers > (stats.rejectedBuyers + stats.requestChangeBuyers);
  const isAllApproved = isSellerApproved && isBuyerApproved;

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 space-y-6 overflow-hidden relative">
      {stats.hasVetoed && (
        <div className="absolute top-0 right-0 bg-rose-500 text-white px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest">
          Vetoed
        </div>
      )}

      <div className="text-start">
        <p className="text-[14px] font-bold text-gray-900 tracking-tight">
          Required Signatures
        </p>
      </div>

      <div className="space-y-5">
        {/* Sellers Group */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
            <span className="text-gray-500">Sellers</span>
            <span className={isSellerApproved ? "text-emerald-500" : "text-[#4F46E5]"}>
              {stats.approvedSellers}/{stats.totalSellers}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full ${isSellerApproved ? "bg-emerald-500" : "bg-[#4F46E5]"}`}
              style={{ width: `${sellerProgress}%` }}
            />
          </div>
        </div>

        {/* Buyers Group */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
            <span className="text-gray-500">Buyers</span>
            <span className={isBuyerApproved ? "text-emerald-500" : "text-[#4F46E5]"}>
              {stats.approvedBuyers}/{stats.totalBuyers}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full ${isBuyerApproved ? "bg-emerald-500" : "bg-[#4F46E5]"}`}
              style={{ width: `${buyerProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex shrink-0 items-center justify-center
                    ${isAllApproved ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-[#4F46E5]"}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isAllApproved ? "verified" : "pending_actions"}
          </span>
        </div>
        <p className="text-[12px] font-medium text-gray-400">
          {isAllApproved
            ? "Consensus reached. This version is officially approved."
            : "Awaiting sufficient signatures to reach consensus threshold."}
        </p>
      </div>
    </div>
  );
}
