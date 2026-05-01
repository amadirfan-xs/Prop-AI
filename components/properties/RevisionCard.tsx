"use client";

import React from "react";
import { ContractVersion } from "@/types/properties";
import { formatLongDate } from "@/utils/formatter";
import { getContractStatusStyles } from "@/utils/style-mappers";

interface RevisionCardProps {
  version: ContractVersion;
  revNumber: number;
}

export const RevisionCard: React.FC<RevisionCardProps> = ({
  version,
  revNumber,
}) => {
  const statusStyles = getContractStatusStyles(version.status);

  return (
    <div className="relative flex flex-col md:flex-row gap-8 items-start group">
      {/* Version Dot/Indicator */}
      <div
        className={`relative z-10 w-16 h-16 rounded-[22px] flex items-center justify-center border-4 border-white shadow-xl shrink-0 transition-all group-hover:scale-110
                ${
                  version.is_latest
                    ? "bg-[#3525CD] text-white"
                    : "bg-white text-gray-400 border-gray-50"
                }`}
      >
        <span className="text-[18px] font-black">v{revNumber}</span>
      </div>

      <div className="flex-1 w-full flex flex-col space-y-4">
        {/* Version Card */}
        <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 relative">
          {version.is_latest && (
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              Current Active
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-[24px] font-black text-gray-900 tracking-tight leading-none mb-2">
                Revision {revNumber}
              </h3>
              <p className="text-gray-400 font-medium text-[14px]">
                Created on {formatLongDate(version.created_at)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase border ${statusStyles}`}
            >
              {(version.status || "PENDING").replace("_", " ")}
            </div>
          </div>

          {/* Document Section */}
          <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-8">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-[24px] text-gray-400">
                {version.input_source.toUpperCase() === "PDF"
                  ? "picture_as_pdf"
                  : "terminal"}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">
                Source: {"Purchase Agreement"}
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                {version.document_key.split("/").pop()}
              </p>
            </div>
          </div>

          {/* Stakeholder Decisions */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest pl-1">
              Feedbacks
            </h4>
            {version.decisions && version.decisions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {version.decisions.map((decision) => (
                  <StakeholderDecision key={decision.id} decision={decision} />
                ))}
              </div>
            ) : (
              <div className="py-6 px-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold text-[13px]">
                  No decisions recorded for this version yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StakeholderDecision = ({ decision }: { decision: any }) => {
  const isApprove = decision.decision === "Approve";
  const isReject = decision.decision === "Reject";

  return (
    <div
      className={`p-6 rounded-2xl border flex flex-col space-y-3
                ${
                  isApprove
                    ? "bg-emerald-50/50 border-emerald-100"
                    : isReject
                    ? "bg-rose-50/50 border-rose-100"
                    : "bg-amber-50/50 border-amber-100"
                }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full 
                        ${
                          isApprove
                            ? "bg-emerald-500"
                            : isReject
                            ? "bg-rose-500"
                            : "bg-amber-500"
                        }`}
          />
          <span className="text-[15px] font-black text-gray-900">
            {decision.userName}
          </span>
        </div>
        <span className="text-[12px] text-black uppercase font-bold">
          {decision.decision}
        </span>
      </div>
      {decision.comment && (
        <p className="text-[14px] text-gray-600 font-medium leading-relaxed italic pl-5 border-l-2 border-gray-200/50">
          "{decision.comment}"
        </p>
      )}
    </div>
  );
};
