"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/networking/apiClient";
import { format } from "date-fns";
import { ReceiptIcon, CalendarIcon } from "@/constants/icons/DashboardIcons";
import { toastService } from "@/utils/toastService";

export default function BillingContainer() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slotQuantity, setSlotQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  const handleBuySlots = async () => {
    if (slotQuantity < 1) return;
    setIsBuying(true);
    let toastId = '';
    try {
        toastId = toastService.loading(`Preparing checkout for ${slotQuantity} slots...`);
        const response = await apiClient.post("/api/pricing/create-buy-slots-session", {
            quantity: slotQuantity
        });
        
        if (response.data?.data?.url) {
            window.location.href = response.data.data.url;
        } else {
            toastService.error("Failed to initiate payment. Please try again.");
            toastService.dismiss(toastId);
        }
    } catch (error: any) {
        toastService.error(error.response?.data?.message || "Something went wrong");
        toastService.dismiss(toastId);
    } finally {
        setIsBuying(false);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get("/api/pricing/payments");
        setPayments(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const subscription = user?.currentSubscription;

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-[14px] font-black uppercase tracking-widest text-[#4F46E5]">
              Current Plan
            </h2>
            <h1 className="text-[32px] font-black text-gray-900">
              {subscription?.package?.name || (subscription as any)?.packageName || "Free Plan"}
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-indigo-50 px-6 py-4 rounded-2xl flex items-center gap-4">
              <CalendarIcon size={24} color="#4F46E5" />
              <div>
                <p className="text-[12px] font-bold text-indigo-400 uppercase tracking-tight">Active Since</p>
                <p className="text-[15px] font-black text-indigo-900">
                  { (subscription?.startDate || (subscription as any)?.startDate) ? format(new Date(subscription?.startDate || (subscription as any)?.startDate), "MMM dd, yyyy") : "N/A"}
                </p>
              </div>
            </div>
            
            { (subscription?.endDate || (subscription as any)?.endDate) && (
              <div className="bg-amber-50 px-6 py-4 rounded-2xl flex items-center gap-4">
                <CalendarIcon size={24} color="#D97706" />
                <div>
                  <p className="text-[12px] font-bold text-amber-500 uppercase tracking-tight">Renew Date</p>
                  <p className="text-[15px] font-black text-amber-900">
                    {format(new Date(subscription?.endDate || (subscription as any)?.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boost Capacity Card */}
      <div className="bg-gradient-to-br from-[#4F46E5] to-[#3525CD] rounded-[32px] p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-widest">
              Limit Reached?
            </div>
            <h2 className="text-[28px] font-black tracking-tight">Boost Your Property Capacity</h2>
            <p className="text-white/70 font-bold max-w-md">
              Purchase additional one-time property slots for only <span className="text-white">$1.00 each</span>. These slots stay active for your current billing cycle.
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-[24px] backdrop-blur-md border border-white/10 flex flex-col gap-4 min-w-[240px]">
            <div className="space-y-2">
                <label htmlFor="slot-quantity" className="text-[12px] font-black uppercase tracking-widest text-white/50">Quantity</label>
                <input 
                    id="slot-quantity"
                    type="number" 
                    min="1" 
                    value={slotQuantity}
                    onChange={(e) => setSlotQuantity(parseInt(e.target.value) || 1)}
                    title="Number of extra property slots"
                    placeholder="Enter quantity"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[18px] font-black focus:outline-none focus:border-white/50 transition-colors"
                />
            </div>
            
            <button 
                onClick={handleBuySlots}
                disabled={isBuying}
                className="w-full bg-white text-[#3525CD] py-4 rounded-xl font-black text-[15px] hover:bg-opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
                {isBuying ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#3525CD] border-t-transparent"></div>
                ) : (
                    <>Buy {slotQuantity} Slot{slotQuantity > 1 ? 's' : ''} • ${slotQuantity}.00</>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <ReceiptIcon size={24} className="text-gray-400" />
                <h2 className="text-[20px] font-black text-gray-900">Payment History</h2>
            </div>
            <span className="text-[13px] font-bold text-gray-400">{payments.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[13px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                  <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold">
                          Loading transaction history...
                      </td>
                  </tr>
              ) : payments.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold">
                        No payments found.
                    </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-[15px] font-bold text-gray-900">
                      {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-black text-gray-900">
                            {payment.type === 'subscription' ? 'Plan Upgrade / Renewal' : 'Property Overage Buy'}
                        </span>
                        <span className="text-[12px] font-bold text-gray-400">ID: {payment.stripeSessionId?.slice(-8).toUpperCase() || 'MANUAL'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[15px] font-black text-gray-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-tight bg-green-50 text-green-600">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
