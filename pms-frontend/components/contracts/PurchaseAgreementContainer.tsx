"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import PropertyService from "@/services/property.service";
import { useApi } from "@/hooks/useApi";
import ContractReviewSidebar from "@/components/contracts/ContractReviewSidebar";
import RevisionHistory from "@/components/contracts/RevisionHistory";
import RequestChangesModal from "@/components/contracts/modals/RequestChangesModal";
import dynamic from "next/dynamic";
import WorkflowStepper from "@/components/contracts/WorkflowStepper";
import ParticipantsSidebar from "@/components/contracts/ParticipantsSidebar";
import InviteParticipantModal from "@/components/contracts/modals/InviteParticipantModal";
import "react-quill-new/dist/quill.snow.css";
import { ContractVersion, Property } from "@/types/properties";
import { UserPermissions } from "@/lib/config/permissions";
import { PageHeader } from "@/components/common/PageHeader";
import { getPropertyBreadcrumbs } from "@/lib/utils/breadcrumbs";
import { toastService } from "@/utils/toastService";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { useCallback } from "react";
import apiClient from "@/networking/apiClient";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface PurchaseAgreementContainerProps {
  versions?: ContractVersion[];
  property?: Property | null;
  permissions?: UserPermissions;
  onRefresh?: () => void;
}

export default function PurchaseAgreementContainer({
  versions: initialVersions = [],
  property,
  permissions,
  onRefresh,
}: PurchaseAgreementContainerProps) {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [localVersions, setLocalVersions] = useState<ContractVersion[]>(initialVersions);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    setLocalVersions(initialVersions);
  }, [initialVersions]);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] =
    useState<ContractVersion | null>(localVersions[0] || null);
  const [compareVersionIds, setCompareVersionIds] = useState<number[]>([]);
  const { user } = useAuth();
  const { on, off, isConnected, emit } = useSocket({ namespace: 'contracts' });

  useEffect(() => {
    if (isConnected && propertyId) {
      emit('joinProperty', { propertyId: Number(propertyId) });
    }
  }, [isConnected, propertyId, emit]);

  const { loading, callApi: submitDecisionApi } = useApi<{ message: string }>();
  const { callApi: downloadApi } = useApi<{ signed_url: string }>();
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchVersions = useCallback(async () => {
    try {
        const config = PropertyService.listContractVersions(Number(propertyId));
        const res = await apiClient.request(config);
        if (res.data && res.data.data) {
           setLocalVersions(res.data.data);
        }
        router.refresh(); 
    } catch (error) {
        console.error("Failed to refresh versions:", error);
    }
  }, [propertyId, router]);

  useEffect(() => {
    if (isConnected) {
        const handleVersionUpdated = (data: any) => {
            if (data.actorId && data.actorId !== user?.id) {
                toastService.info(`New contract version created! (Ver ${data.versionId})`);
            }
            onRefresh?.();
        };

        const handleDecisionSubmitted = (data: any) => {
            if (data.userId !== user?.id) {
                toastService.info(`${data.userName} marked the contract as ${data.decision}`);
            }
            onRefresh?.();
        };

        const handleVersionsListUpdated = (versions: ContractVersion[]) => {
            setLocalVersions(versions);
            onRefresh?.();
            router.refresh();
        };

        const handleConsensusUpdate = (data: { versionId: number; stats: any }) => {
            setLocalVersions(prev => prev.map(v => 
              v.id === data.versionId 
                ? { ...v, consensusStats: data.stats } 
                : v
            ));
            onRefresh?.();
        };

        on('versionUpdated', handleVersionUpdated);
        on('decisionSubmitted', handleDecisionSubmitted);
        on('versionsListUpdated', handleVersionsListUpdated);
        on('consensusUpdate', handleConsensusUpdate);

        return () => {
            off('versionUpdated');
            off('decisionSubmitted');
            off('versionsListUpdated');
            off('consensusUpdate');
        };
    }
  }, [isConnected, on, off, user?.id, router, onRefresh]);

  useEffect(() => {
    if (localVersions.length > 0) {
      if (!selectedVersion) {
        setSelectedVersion(localVersions[0]);
      } else {
        const updated = localVersions.find(v => v.id === selectedVersion.id);
        if (updated) {
          setSelectedVersion(updated);
        }
      }
    }
  }, [localVersions]);

  const handleDecision = async (
    decision: "Approve" | "Reject" | "Request Change",
    comment?: string,
  ) => {
    try {
      await submitDecisionApi(
        PropertyService.submitContractDecision(Number(propertyId), {
          decision,
          comment,
        }),
      );
      toastService.success(`Succesfully submitted: ${decision}`);
      await fetchVersions();
      onRefresh?.();
    } catch (error) {
      console.error("Failed to submit decision:", error);
      toastService.error("Failed to submit decision. Please try again.");
    }
  };
  const handleToggleVersion = (version: ContractVersion) => {
    setCompareVersionIds((prev) => {
      if (prev.includes(version.id)) {
        return prev.filter((id) => id !== version.id);
      }
      if (prev.length >= 2) {
        return [prev[1], version.id];
      }
      return [...prev, version.id];
    });
    setSelectedVersion(version);
  };

  const handleDownload = async () => {
    if (!selectedVersion) return;

    setIsDownloading(true);
    try {
      if (selectedVersion.signed_url) {
        window.open(selectedVersion.signed_url, "_blank");
        toastService.success("Downloading contract...");
      } else {
        toastService.info("Generating PDF, please wait...");
        const response = await downloadApi(
          PropertyService.generateContractPdf(
            Number(propertyId),
            selectedVersion.id,
          ),
        );

        if (response?.signed_url) {
          window.open(response.signed_url, "_blank");
          toastService.success("PDF generated successfully!");
        } else {
          toastService.error("PDF generation pending. Please try again in a moment.");
        }
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toastService.error("Error generating PDF. Please contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  const isComparing = compareVersionIds.length === 2;
  const version2 =
    localVersions.find(
      (v) =>
        v.id === compareVersionIds.find((id) => id !== selectedVersion?.id),
    ) || null;
  const isLatestSelected = selectedVersion?.id === localVersions[0]?.id;
  const latestHasHtml = localVersions.some(
    (v) => v.input_source?.toUpperCase() === "HTML",
  );
  return (
    <div className="min-h-screen bg-[#F7F9FB] -m-6 lg:-m-10 p-6 lg:p-10">
      <div className="max-w-400 mx-auto">
        {/* Header / Breadcrumbs */}
        <PageHeader
          items={getPropertyBreadcrumbs(
            propertyId,
            property?.property_title || "Property",
            "Contract Hub",
          )}
          title="Purchase Agreement"
          description={
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="text-[15px] font-medium text-gray-500">
                {property?.property_title || "Loading property..."} — ID:{" "}
                {property?.id ? `GP-2024-${property.id}` : "..."}
              </span>
              <span className="bg-[#E2DFFF] text-[#3323CC] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {property?.fulfillment_status || "UNDER REVIEW"}
              </span>
            </div>
          }
          action={
            <div className="flex flex-wrap items-center gap-3">
              {permissions?.canDecideContracts && (
                <>
                  {(() => {
                    const isLatest = selectedVersion?.is_latest;
                    const myDecision = selectedVersion?.decisions?.find(
                        (d: any) => d.user_id === user?.id
                    );
                    const hasRejected = myDecision?.decision === "Reject";
                    const isRejectedByAnyone = selectedVersion?.status === "REJECTED";

                    if (!isLatest) {
                      return (
                        <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-xl border border-amber-100">
                           <span className="material-symbols-outlined text-amber-500 text-[20px]">info</span>
                           <span className="text-amber-800 text-[12px] font-bold">You are viewing an older version. Switch to latest to submit a decision.</span>
                        </div>
                      );
                    }

                    if (myDecision) {
                        return (
                          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border shadow-sm
                            ${myDecision.decision === 'Approve' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                              myDecision.decision === 'Reject' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                              'bg-amber-50 border-amber-100 text-amber-700'}`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                                {myDecision.decision === 'Approve' ? 'check_circle' : 
                                 myDecision.decision === 'Reject' ? 'cancel' : 'edit_notifications'}
                            </span>
                            <div className="flex flex-col text-start">
                                <span className="text-[12px] font-black uppercase tracking-widest leading-none">Your Decision: {myDecision.decision}</span>
                                <span className="text-[10px] font-bold opacity-70 mt-1">Submitted on {new Date(myDecision.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                    }

                    if (property?.status?.toLowerCase() === 'completed') {
                        return (
                          <div className="flex items-center gap-2 px-6 py-3 bg-indigo-50 rounded-xl border border-indigo-100">
                             <span className="material-symbols-outlined text-indigo-500 text-[20px]">verified_user</span>
                             <span className="text-indigo-800 text-[12px] font-bold">This property deal is COMPLETED. No further decisions required.</span>
                          </div>
                        );
                    }

                    return (
                      <>
                        <Button
                          onClick={() => handleDecision("Reject")}
                          disabled={loading}
                          className="bg-white! text-rose-600! border-rose-200! border! shadow-sm! px-10! py-4! hover:bg-rose-50! disabled:opacity-50"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => setIsRequestModalOpen(true)}
                          disabled={loading}
                          className="bg-white! text-gray-600! border-gray-200! border! shadow-sm! px-10! py-4! hover:bg-gray-50! disabled:opacity-50"
                        >
                          Request Changes
                        </Button>
                        <Button
                          onClick={() => handleDecision("Approve")}
                          disabled={loading}
                          className="bg-[#3525CD]! text-white! px-10! py-4! shadow-lg! shadow-indigo-100! flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            check_circle
                          </span>
                          Approve
                        </Button>
                      </>
                    );
                  })()}
                </>
              )}

               {permissions?.canManageContracts && property?.status?.toLowerCase() !== 'completed' && (
                <>
                  {isLatestSelected && (
                        <Button
                          onClick={() =>
                            router.push(
                              `/properties/${propertyId}/contracts/create`,
                            )
                          }
                          className="bg-[#3525CD]! text-white! px-8! py-4! shadow-lg! flex items-center gap-2"
                        >
                      <span className="material-symbols-outlined text-[20px]">
                        add_circle
                      </span>
                      Build Digital Version
                    </Button>
                  )}
                </>
              )}
            </div>
          }
        />

        {/* Main Content Grid */}
        <div
          className={`grid grid-cols-1 ${isComparing ? "xl:grid-cols-1" : "xl:grid-cols-[1fr_400px]"} gap-10 items-start text-start`}
        >
          {/* Left Column: Document Viewer Area */}
          <div className="space-y-8">
            <div
              className={`grid grid-cols-1 ${isComparing ? "lg:grid-cols-2" : ""} gap-6`}
            >
              {/* Viewer 1 (Selected/Main) */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Viewer Header */}
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                      <span className="material-symbols-outlined text-[24px]">
                        description
                      </span>
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[15px] font-bold text-gray-900">
                        {selectedVersion?.input_source?.toUpperCase() === "PDF"
                          ? selectedVersion.document_key.split("/").pop()
                          : "Digital_Agreement.html"}
                      </span>
                      <span className="text-[12px] font-medium text-gray-400">
                        {selectedVersion
                          ? `Viewing Version ${selectedVersion.id}`
                          : "Select a version"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Download Button (All Roles) */}
                    {permissions?.canExportContract && (
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="p-2.5 text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-xl transition-all  hover:border-indigo-100 cursor-pointer"
                        title={
                          isDownloading ? "Generating PDF..." : "Download PDF"
                        }
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${isDownloading ? "animate-spin" : ""}`}
                        >
                          {isDownloading ? "sync" : "download"}
                        </span>
                      </button>
                    )}

                    {/* Agent Edit Action */}
                    {permissions?.canManageContracts && (
                      <>
                        {isLatestSelected &&
                          selectedVersion?.input_source?.toUpperCase() ===
                            "HTML" && (
                            <></>
                              // <button
                            //   onClick={() =>
                            //     router.push(
                            //       `/properties/${propertyId}/contracts/create?contractId=${selectedVersion.id}&mode=edit&allowUpdateLatest=true`,
                            //     )
                            //   }
                            //   className="p-2.5 text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-xl transition-all hover:border-indigo-100 cursor-pointer"
                            //   title="Edit Document"
                            // >
                            //   <span className="material-symbols-outlined text-[20px]">
                            //     edit
                            //   </span>
                            // </button>
                          )}
                      </>
                    )}

                    {/* Version Selector */}
                    <div className="hidden sm:flex flex-col items-end relative group mr-0 border-l border-gray-100 pl-4">
                      <div className="flex items-center gap-1.5 cursor-pointer">
                         <select
                         title="Switch Version"
                          value={selectedVersion?.id}
                          onChange={(e) => {
                            const ver = localVersions.find(
                              (v) => v.id === Number(e.target.value),
                            );
                            if (ver) setSelectedVersion(ver);
                          }}
                          className="appearance-none bg-transparent border-none text-[13px] font-black text-gray-900 cursor-pointer focus:ring-0 outline-none pr-8 py-0 leading-tight text-right uppercase tracking-wider"
                        >
                          {localVersions.map((item, idx) => (
                            <option key={item.id} value={item.id}>
                              Version {localVersions.length - idx}{" "}
                              {item.id === localVersions[0]?.id ? "(Latest)" : ""}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined text-[18px] text-gray-400 absolute right-0 top-0.5 pointer-events-none transition-colors">
                          unfold_more
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 mr-8">
                        Switch Ver
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                      <button
                        onClick={() => setIsFullScreenOpen(true)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        title="Full Screen View"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          fullscreen
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Viewer Area */}
                <div className="bg-[#F7F9FB] p-4 lg:p-8 min-h-200 flex justify-center border-b border-gray-50">
                  {selectedVersion ? (
                    selectedVersion.input_source?.toUpperCase() === "PDF" ? (
                      <div className="w-full h-full min-h-200 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        {selectedVersion.signed_url ? (
                          <iframe
                            src={selectedVersion.signed_url}
                            className="w-full h-full min-h-200"
                            title="Contract PDF"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <span className="material-symbols-outlined text-[64px] text-gray-300">picture_as_pdf</span>
                            <div className="space-y-2">
                              <h3 className="text-xl font-black text-gray-900">PDF Preview Unavailable</h3>
                              <p className="text-gray-500 max-w-sm">This version is stored as a PDF, but the preview link could not be generated.</p>
                            </div>
                             <Button
                              onClick={handleDownload}
                              disabled={isDownloading}
                              className="bg-indigo-50! text-[#4F46E5]! hover:bg-[#4F46E5]! hover:text-white! "
                            >
                              <span className="material-symbols-outlined text-[20px] mr-2">download</span>
                              Try Regenerating Link
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white w-full shadow-2xl shadow-gray-400/10 p-8 lg:p-12 flex flex-col border border-gray-50">
                        <div className="quill-preview">
                          <ReactQuill
                            value={selectedVersion.html_content || ""}
                            readOnly={true}
                            theme="bubble"
                          />
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                      <span className="material-symbols-outlined text-[64px] mb-4">
                        description
                      </span>
                      <p className="text-[18px] font-bold">
                        Select a version from history to preview
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Viewer 2 (Comparison) */}
              {isComparing && version2 && (
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-right duration-500">
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500">
                        <span className="material-symbols-outlined text-[24px]">
                          history
                        </span>
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[15px] font-bold text-gray-900">
                          Comparison: Version {version2.id}
                        </span>
                        <span className="text-[12px] font-medium text-gray-400">
                          {new Date(version2.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setCompareVersionIds(
                          [selectedVersion?.id].filter(Boolean) as number[],
                        )
                      }
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>

                   <div className="bg-[#F7F9FB] p-4 lg:p-8 min-h-200 flex justify-center border-b border-gray-50">
                    {version2.input_source === "PDF" ? (
                      <div className="w-full h-full min-h-200 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                        <iframe
                          src={version2.signed_url}
                          className="w-full h-full min-h-200"
                          title="Contract PDF Comparison"
                        />
                      </div>
                    ) : (
                      <div className="bg-white w-full shadow-2xl shadow-gray-400/10 p-8 lg:p-12 flex flex-col border border-gray-50">
                        <div className="quill-preview">
                          <ReactQuill
                            value={version2.html_content || ""}
                            readOnly={true}
                            theme="bubble"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Security Footer */}
            <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-3xl p-5 flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[#16A34A] text-[20px]">
                verified_user
              </span>
              <p className="text-[14px] font-bold text-[#166534]">
                END-TO-END ENCRYPTED{" "}
                <span className="font-medium text-[#166534]/70 ml-1">
                  This conversation and document are protected by bank-level
                  security.
                </span>
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div
            className={`${isComparing ? "hidden" : "xl:sticky xl:top-10"} space-y-8`}
          >
            <WorkflowStepper 
              hasVersions={localVersions.length > 0} 
              stats={localVersions[0]?.consensusStats} 
            />
            <RevisionHistory
              propertyId={propertyId}
              onVersionSelect={setSelectedVersion}
              onToggleVersion={handleToggleVersion}
              currentVersionId={selectedVersion?.id}
              selectedIds={compareVersionIds}
              revisions={localVersions}
            />
            <ContractReviewSidebar
              onRequestChanges={() => setIsRequestModalOpen(true)}
              permissions={permissions}
              property={property}
              latestVersion={selectedVersion}
              consensusStats={selectedVersion?.consensusStats}
            />
            <ParticipantsSidebar 
                onInvite={() => setIsInviteModalOpen(true)} 
                showInviteButton={permissions?.canInviteStakeholders}
                stakeholders={property?.stakeholders || []}
                propertyStatus={property?.status}
            />
          </div>
        </div>

        {/* Modals */}
        <InviteParticipantModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            propertyId={Number(propertyId)}
            hasVersions={localVersions.length > 0}
            consensusStats={localVersions[0]?.consensusStats}
            onSuccess={onRefresh}
        />
        <RequestChangesModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={(comment: string) => handleDecision("Request Change", comment)}
        />

        {/* Full Screen Document Modal */}
        {isFullScreenOpen && selectedVersion && (
          <div className="fixed inset-0 z-100 bg-white flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-black text-gray-900 tracking-tight">
                    {selectedVersion.input_source?.toUpperCase() === "PDF"
                      ? selectedVersion.document_key?.split("/").pop()
                      : "Digital Agreement"}
                  </h2>
                  <p className="text-[12px] font-medium text-gray-400 uppercase tracking-widest">
                    Version {selectedVersion.id} •{" "}
                    {new Date(selectedVersion.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFullScreenOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-500 transition-all text-gray-400"
              >
                <span className="material-symbols-outlined text-[24px]">
                  close
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#F7F9FB] p-6 lg:p-12 flex justify-center">
              {selectedVersion.input_source?.toUpperCase() === "PDF" ? (
                <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 max-w-300">
                  <iframe
                    src={selectedVersion.signed_url}
                    className="w-full h-full"
                    title="Full Screen PDF"
                  />
                </div>
              ) : (
                <div className="bg-white w-full max-w-225 shadow-2xl p-10 lg:p-20 border border-gray-100 flex flex-col h-fit mb-20">
                  <div className="quill-preview">
                    <ReactQuill
                      value={selectedVersion.html_content || ""}
                      readOnly={true}
                      theme="bubble"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Footer Action */}
            <div className="lg:hidden p-6 bg-white border-t border-gray-100">
              <Button
                onClick={() => setIsFullScreenOpen(false)}
                className="w-full py-4! bg-[#3525CD]! text-white! "
              >
                Close Viewer
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .quill-preview .ql-editor {
          padding: 0;
          color: #374151;
          line-height: 1.8;
          font-size: 16px;
        }
        .quill-preview .ql-editor h1 {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 48px;
          text-align: center;
          color: #111827;
        }
        .quill-preview .ql-editor h3 {
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          margin-top: 32px;
          margin-bottom: 12px;
          color: #111827;
        }
      `}</style>
    </div>
  );
}
