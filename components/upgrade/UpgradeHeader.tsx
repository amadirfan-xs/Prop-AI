"use client";

import React from "react";
import { User } from "@/types/auth";
import { getInitials } from "@/utils/stringUtils";

interface UpgradeHeaderProps {
  user: User;
}

export const UpgradeHeader: React.FC<UpgradeHeaderProps> = ({ user }) => {
  return (
    <div className="w-full py-6 px-10 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]">
            architecture
          </span>
        </div>
        <span className="text-[18px] font-black tracking-tighter text-gray-900 uppercase">
          Architect
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Requester
          </p>
          <p className="text-[13px] font-black text-gray-900">{user.name}</p>
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(user.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
