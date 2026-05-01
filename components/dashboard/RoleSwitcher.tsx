"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { getRoleName } from "@/utils/roleMapping";

interface RoleSwitcherProps {
  className?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ className }) => {
  const { activeRole, roles, switchRole } = useAuth();

  if (roles.length <= 1) return null;

  return (
    <div className={`hidden md:flex items-center ${className || ""}`}>
      {roles.length === 2 ? (
        // Simple button if only 2 roles
        <button
          onClick={() => switchRole(roles.find((r) => r !== activeRole)!)}
          className="flex items-center gap-2 px-4 py-2 text-[#3525CD] rounded-md text-[13px] font-bold hover:bg-indigo-100 transition-all border border-indigo-100 group shadow-xs"
        >
          Switch to {getRoleName(roles.find((r) => r !== activeRole)!)}
        </button>
      ) : (
        // Dropdown for more than 2 roles
        <div className="relative group/dropdown">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold hover:bg-gray-100 transition-all border border-gray-100 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">cached</span>
            Switch Role
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50">
            {roles.map((roleId) => (
              <button
                key={roleId}
                onClick={() => switchRole(roleId)}
                className={`w-full flex items-center justify-between px-4 py-2 text-[13px] font-medium transition-colors ${
                  activeRole === roleId
                    ? "text-[#3525CD] bg-indigo-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {getRoleName(roleId)}
                {activeRole === roleId && (
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
