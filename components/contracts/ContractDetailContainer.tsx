"use client";

import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import ContractHeader from "@/components/contracts/ContractHeader";
import ContractUploadCard from "@/components/contracts/ContractUploadCard";
import WorkflowStepper from "@/components/contracts/WorkflowStepper";
import ParticipantsSidebar from "@/components/contracts/ParticipantsSidebar";
import SecurityBadge from "@/components/contracts/SecurityBadge";
import PropertyService from "@/services/property.service";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { getPermissions } from "@/lib/config/permissions";
import PurchaseAgreementContainer from "@/components/contracts/PurchaseAgreementContainer";
import InviteParticipantModal from "@/components/contracts/modals/InviteParticipantModal";
import { useParams } from "next/navigation";
import { ContractVersion, Property } from "@/types/properties";

export default function ContractDetailContainer() {
  const params = useParams();
  const propertyId = params.id as string;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { primaryRole } = useAuth();

  const {
    data: versions,
    loading: versionsLoading,
    error: versionsError,
    callApi: fetchVersions,
  } = useApi<ContractVersion[]>();

  const {
    data: property,
    loading: propertyLoading,
    error: propertyError,
    callApi: fetchProperty,
  } = useApi<Property>();

  const refreshData = React.useCallback((showLoading = true) => {
    if (propertyId) {
      fetchVersions(PropertyService.listContractVersions(Number(propertyId)), { showLoading });
      fetchProperty(PropertyService.getPropertyById(Number(propertyId)), { showLoading });
    }
  }, [propertyId, fetchVersions, fetchProperty]);

  const handleRetry = () => {
    refreshData(true);
  };

  React.useEffect(() => {
    handleRetry();
  }, [propertyId]);

  const loading = versionsLoading || propertyLoading;
  const error = versionsError || propertyError;
  const permissions = getPermissions(primaryRole || undefined);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-150 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-50 border-t-[#4F46E5] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold animate-pulse">
          Checking contract status...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-400 mx-auto p-6 lg:p-10 flex flex-col items-center justify-center min-h-150 text-center">
        <div className="bg-white rounded-[40px] p-12 lg:p-20 shadow-2xl shadow-indigo-100/50 border border-gray-100 flex flex-col items-center space-y-8 max-w-2xl transform transition-all duration-500 hover:scale-[1.01]">
          <div className="w-24 h-24 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 animate-bounce-subtle">
            <span className="material-symbols-outlined text-[48px]">
              error_medley
            </span>
          </div>
          <div className="space-y-3">
            <h2 className="text-[32px] font-black text-gray-900 tracking-tight leading-tight">
              Something went wrong
            </h2>
            <p className="text-gray-500 font-medium text-[18px] leading-relaxed">
              We encountered an error while fetching the contract data. <br />
              Please try again later.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button
              onClick={handleRetry}
              className="bg-[#3525CD]! text-white! px-12! py-5! rounded-2xl! text-[16px]! hover:shadow-xl! hover:shadow-indigo-200! transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">
                refresh
              </span>
              Try Again
            </Button>
            <button className="text-[14px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest px-6 py-4 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasContract = versions && versions.length > 0;

  if (hasContract) {
    return (
      <PurchaseAgreementContainer
        versions={versions}
        property={property}
        permissions={permissions}
        onRefresh={() => refreshData(false)}
      />
    );
  }

  return (
    <div className="max-w-400 mx-auto p-6 lg:p-10">
      {/* Header section always full width */}
      <ContractHeader
        title="Purchase Agreement"
        status="DRAFT"
        subtitle={property?.property_title || "Property Contract Hub"}
      />
 
      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start text-start">
        {/* Left: Main Content Area */}
        <div className="space-y-8">
          {permissions.canManageContracts ? (
            <ContractUploadCard
              isUploaded={false}
              onUpload={() => {}} // Placeholder for now
            />
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-[#4F46E5]">
                <span className="material-symbols-outlined text-[40px]">
                  hourglass_empty
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-[24px] font-black text-gray-900">
                  Contract Pending
                </h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  The property agent is currently preparing the digital purchase
                  agreement. You will be notified once it is ready for review.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar Column */}
        <div className="space-y-8 lg:sticky lg:top-10">
          <WorkflowStepper
            hasVersions={!!(versions && versions.length > 0)}
            stats={
              versions && versions.length > 0
                ? versions[0].consensusStats
                : null
            }
          />
          <ParticipantsSidebar
            onInvite={() => setIsInviteModalOpen(true)}
            showInviteButton={permissions.canInviteStakeholders}
            stakeholders={property?.stakeholders || []}
          />
          <SecurityBadge />
        </div>
      </div>

      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        propertyId={Number(propertyId)}
        hasVersions={!!(versions && versions.length > 0)}
        consensusStats={
          versions && versions.length > 0 ? versions[0].consensusStats : null
        }
        onSuccess={() => refreshData(false)}
      />
    </div>
  );
}
