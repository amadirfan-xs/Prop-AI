"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ORG_LABELS } from "./constants/org.constants";
import Link from "next/link";

export default function OrgProfileCard() {
  const { user } = useAuth();
  const hasUpgradeRequest = !!user?.organizationId;

  return (
    <div className="bg-white rounded-xl p-10 border border-gray-100/50 shadow-sm shadow-indigo-100/10 h-full flex flex-col">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight mb-2">
            {ORG_LABELS.PROFILE.TITLE}
          </h2>
          <p className="text-[14px] font-medium text-gray-500 max-w-[400px] leading-relaxed">
            {hasUpgradeRequest 
              ? "Your organizational upgrade request is currently under review." 
              : "Upgrade your account to access team management and custom branding."}
          </p>
        </div>
        <div className="flex flex-col items-end">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${hasUpgradeRequest ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                {hasUpgradeRequest ? 'Request Pending' : 'Individual Plan'}
            </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-10 flex-1">
        <div className="w-32 h-32 rounded-[32px] bg-[#111827] flex items-center justify-center p-6 shadow-xl shadow-indigo-100/30 flex-shrink-0">
          <div className="w-full h-full border-2 border-white/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[40px]">
              {hasUpgradeRequest ? 'verified_user' : 'corporate_fare'}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div>
            <h3 className="text-[22px] font-black text-gray-900 leading-tight">
              {hasUpgradeRequest ? 'Organizational Upgrade' : 'Standard Account'}
            </h3>
            <p className="text-[14px] font-bold text-gray-400 mt-2">
                {hasUpgradeRequest 
                  ? "We have captured your brokerage details. Our team will verify your information and activate your custom package shortly." 
                  : "You are currently on a standard individual plan. Organizations get access to listing syndication, team hierarchy, and premium support."}
            </p>
          </div>

          {!hasUpgradeRequest && (
            <Link 
                href="/upgrade-request" 
                className="inline-flex items-center gap-2 bg-[#3525CD] text-white px-8 py-3.5 rounded-2xl text-[14px] font-black shadow-lg shadow-indigo-100 transition-all hover:bg-[#2a1da6] hover:scale-[1.02]"
            >
                <span>Upgrade to Organizational</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}

          {hasUpgradeRequest && (
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-[14px]">
                  <span className="material-symbols-outlined font-black">schedule</span>
                  <span>Review in progress</span>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
