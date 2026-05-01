import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogoIcon } from "@/constants/icons/DashboardIcons";
import {
  NAV_ITEMS_BY_ROLE,
  DASHBOARD_BOTTOM_NAV_ITEMS,
} from "@/constants/navigation";
import { ReceiptIcon } from "@/constants/icons/DashboardIcons";
import { toastService } from "@/utils/toastService";
import { APP_ROUTES } from "@/constants/auth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, logout, user } = useAuth();

  const navItems = activeRole ? (NAV_ITEMS_BY_ROLE[activeRole] || []).filter(item => !item.viewOnlyFor || item.viewOnlyFor.includes(activeRole)) : [];
  
  let bottomItems = DASHBOARD_BOTTOM_NAV_ITEMS.filter(item => !item.viewOnlyFor || (activeRole && item.viewOnlyFor.includes(activeRole)));

  // Add Billing for all Independent Agents
  const isAgent = activeRole === 1;
  if (isAgent) {
    const billingItem = { name: 'Billing', icon: ReceiptIcon, href: APP_ROUTES.BILLING, viewOnlyFor: [1] };
    const settingsIndex = navItems.findIndex(item => item.name.toLowerCase() === 'settings');
    
    if (settingsIndex !== -1) {
        navItems.splice(settingsIndex + 1, 0, billingItem);
    } else {
        navItems.push(billingItem);
    }
  }

  const currentPlan = 
    user?.currentSubscription?.package?.name || 
    (user?.currentSubscription as any)?.packageName || 
    user?.organizationSubscription?.packageName ||
    'Free Plan';
  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error: any) {
      toastService.error(`Logout failed : ${error.message}`);
    }
  };


  return (
    <aside
      className={`w-[280px] min-h-screen bg-white border-r border-gray-100 flex flex-col pt-8 pb-10 fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo & Close Button */}
      <div className="px-8 flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          {user?.organization ? (
            <>
              {user.organization.logoUrl ? (
                <img src={user.organization.logoUrl} alt={user.organization.name} className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl object-contain bg-gray-50 p-1 shadow-sm" />
              ) : (
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  {user.organization.name.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="text-[16px] lg:text-[18px] font-black text-gray-900 leading-none truncate">
                  {user.organization.name}
                </span>
                <span className="text-[9px] font-black text-[#3525CD] uppercase tracking-[0.2em] mt-1">
                  Management
                </span>
              </div>
            </>
          ) : (
            <>
              <LogoIcon size={32} />
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-gray-900 leading-none">
                  Architect
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Property Management
                </span>
              </div>
            </>
          )}
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#EEF2FF] text-[#3525CD]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#3525CD] rounded-r" />
              )}
              <item.icon
                size={22}
                color={isActive ? "#3525CD" : "currentColor"}
                className="shrink-0 transition-colors"
              />
              <span className="text-[15px] font-medium  tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge */}
      {isAgent && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-linear-to-br from-[#EEF2FF] to-[#E0E7FF] border border-indigo-100/50">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#4F46E5] mb-1">Current Plan</p>
            <div className="flex items-center justify-between">
                <span className="text-[14px] font-black text-gray-900">{currentPlan}</span>
                {currentPlan === 'Premium Plan' && (
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                )}
            </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="px-4 pt-10 border-t border-gray-50 space-y-2">
        {bottomItems.map((item) => {
          const isLogout =
            item.name.toLowerCase().includes("logout") ||
            item.name.toLowerCase().includes("sign out");

          if (isLogout) {
            return (
              <button
                key={item.name}
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
              >
                <item.icon size={22} className="shrink-0" />
                <span className="text-[15px] font-semibold tracking-tight">
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <item.icon size={22} className="shrink-0" />
              <span className="text-[15px] font-semibold tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
