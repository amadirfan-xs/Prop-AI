"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Property } from "@/types";
import { PropertyService } from "@/services/property.service";
import { useApi } from "@/hooks/useApi";
import { getPermissions } from "@/lib/config/permissions";
import { useAuth } from "@/context/AuthContext";

interface ParticipantsSectionProps {
  property: Property;
  onAddParticipant?: () => void;
}

export default function ParticipantsSection({
  property,
  onAddParticipant,
}: ParticipantsSectionProps) {
  const stakeholders = property.stakeholders || [];
  const { callApi: resendInvite } = useApi();
  const [resendingId, setResendingId] = useState<number | null>(null);
  const { primaryRole } = useAuth();
  const permissions = getPermissions(primaryRole || undefined);
  const handleResendInvite = async (stakeholderId: number) => {
    setResendingId(stakeholderId);
    try {
      const result = await resendInvite(
        PropertyService.resendInvite(property.id, stakeholderId),
      );
      if (result) {
        toast.success("Invitation resent successfully!");
      }
    } finally {
      setResendingId(null);
    }
  };

  if (stakeholders.length === 0) {
    return (
      <section className="space-y-4 text-start">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-900">
            Key Participants
          </h3>
        {permissions.canInviteStakeholders && property.status?.toLowerCase() !== 'completed' && <button
            onClick={onAddParticipant}
            className="text-[13px] font-bold text-[#3525CD] hover:text-[#2A1DA8] flex items-center gap-1 transition-colors"
          >
            + Add Participant
          </button>}
        </div>
        <div className="bg-white rounded-[32px] p-12 border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 font-medium">
            No stakeholders assigned yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 text-start">
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] font-bold text-gray-900">
          Key Participants
        </h3>

        <>
          {permissions.canInviteStakeholders && property.status?.toLowerCase() !== 'completed' && (
            <button
              onClick={onAddParticipant}
              className="text-[13px] font-bold text-[#3525CD] hover:text-[#2A1DA8] flex items-center gap-1 transition-colors"
            >
              + Add Participant
            </button>
          )}
        </>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {stakeholders.map((stakeholder) => (
          <div
            key={stakeholder.id}
            className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[20px] overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                  <img
                    src={
                      stakeholder.user.profile_image_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(stakeholder.user.name)}&background=random`
                    }
                    alt={stakeholder.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-start">
                  <h4 className="text-[18px] font-bold text-gray-900 leading-tight">
                    {stakeholder.user.name}
                  </h4>
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mt-1">
                    {stakeholder.userType.name}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  stakeholder.status?.toUpperCase() === "ACTIVE" || stakeholder.status?.toUpperCase() === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-600"
                    : stakeholder.status?.toUpperCase() === "PENDING"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {stakeholder.status || "Active"}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-[20px] opacity-70">
                  mail
                </span>
                <span className="font-medium truncate">
                  {stakeholder.user.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-[20px] opacity-70">
                  phone
                </span>
                <span className="font-medium">
                  {stakeholder.user.phone_number || "-"}
                </span>
              </div>
            </div>

            {permissions.canInviteStakeholders && property.status?.toLowerCase() !== 'completed' && stakeholder.id !== 0 && (
              <button
                onClick={() => handleResendInvite(stakeholder.id)}
                disabled={resendingId === stakeholder.id}
                className="w-full py-3.5 rounded-2xl font-bold text-[13px] transition-all tracking-wide uppercase bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                {resendingId === stakeholder.id
                  ? "RESENDING..."
                  : "RESEND INVITE"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
