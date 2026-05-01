import React from "react";
import { SearchIcon, BellIcon } from "@/constants/icons/DashboardIcons";
import { useAuth } from "@/context/AuthContext";
import { getRoleName } from "@/utils/roleMapping";
import { getInitials } from "@/utils/stringUtils";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

export default function OrganizationHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { user, activeRole } = useAuth();

  return (
    <header className="h-[88px] bg-white sticky top-0 z-40 px-10 flex items-center justify-between border-b border-gray-100/50">
      <div className="flex items-center gap-6 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500">
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="hidden md:flex flex-1 max-w-2xl items-center gap-4">
          <div className="relative flex-grow group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              placeholder="Search properties, addresses, or agents..."
              className="w-full bg-[#F3F4F7]/60 border-none rounded-2xl py-3 pl-12 pr-4 text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
       
        {/* <button className="p-1 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-xl transition-all relative"> */}
          {/* <BellIcon size={24} /> */}
          {/* <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span> */}
        {/* </button> */}

        {/* <div className="h-8 w-px bg-gray-100 mx-2" /> */}
 <RoleSwitcher />

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[14px] font-black text-gray-900 tracking-tight leading-tight">
              {user?.name || "Loading..."}
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {getRoleName(activeRole)}
            </span>
          </div>
          {user?.profilePictureUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F7] flex items-center justify-center text-indigo-600 font-black text-sm">
              {getInitials(user?.name)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
