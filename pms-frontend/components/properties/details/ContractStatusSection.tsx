"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

interface ContractStatusSectionProps {
  status?: {
    source: string;
    created_at: string;
  };
}

export default function ContractStatusSection({
  status,
}: ContractStatusSectionProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  if (!status) {
    return (
      <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 text-start">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[20px] font-bold text-gray-900">
            Contract Status
          </h3>
        </div>
        <div className="bg-[#F8F9FB] rounded-[24px] p-10 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">
            No active agreement found for this property.
          </p>
        </div>
      </section>
    );
  }

  const formattedDate = new Date(status.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 text-start">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[20px] font-bold text-gray-900">Contract Status</h3>
        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          {"file"}
        </span>
      </div>

      <div className="bg-[#F8F9FB] rounded-[24px] p-6 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-0">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#3525CD] shrink-0">
            <span className="material-symbols-outlined text-[30px]">
              description
            </span>
          </div>
          <div className="text-start">
            <h4 className="text-[18px] font-black text-gray-900 leading-tight mb-1">
              Sales Purchase Agreement
            </h4>
            <p className="text-[13px] font-bold text-gray-400">
              Last updated {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 border-t lg:border-t-0 border-gray-100 pt-6 lg:pt-0">
          <div className="sm:text-right text-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
              Status
            </span>
            <p className="text-[15px] font-black text-[#3525CD]">Active</p>
          </div>
          <button
            onClick={() => router.push(`/properties/${id}/contracts/latest`)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-[13px] hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
          >
            View Full Contract
          </button>
        </div>
      </div>
    </section>
  );
}
