"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import PropertyService from "@/services/property.service";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { getPermissions } from "@/lib/config/permissions";
import "react-quill-new/dist/quill.snow.css";
import {
  ContractTemplate,
  ContractVersion,
  Property,
} from "@/types/properties";
import { PageHeader } from "@/components/common/PageHeader";
import { getContractsBreadcrumbs } from "@/lib/utils/breadcrumbs";
import { toastService } from "@/utils/toastService";
import { FullPageLoader } from "@/components/common/FullPageLoader";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function ContractEditorContainer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const templateId = searchParams.get("templateId");
  const contractId = searchParams.get("contractId");

  const { primaryRole } = useAuth();
  const [content, setContent] = useState("");
  const mode = searchParams.get("mode");
  const allowUpdateLatest = searchParams.get("allowUpdateLatest") === "true";
  const { loading: templateLoading, callApi: fetchTemplateApi } =
    useApi<ContractTemplate>();
  const { loading: saving, callApi: saveContractApi } =
    useApi<ContractVersion>();
  const { loading: downloading, callApi: downloadApi } = useApi<{
    signed_url: string;
  }>();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { data: property, callApi: fetchPropertyApi } = useApi<Property>();

  useEffect(() => {
    if (mode === "edit" && contractId) {
      fetchContractVersion();
    } else if (templateId) {
      fetchTemplate();
    }

    if (propertyId) {
      fetchPropertyApi(PropertyService.getPropertyById(Number(propertyId)));
    }
  }, [templateId, contractId, mode, propertyId]);

  const fetchContractVersion = async () => {
    if (!contractId) return;
    try {
      const response = await fetchTemplateApi(
        PropertyService.getContractVersion(
          Number(propertyId),
          Number(contractId),
        ),
      );
      if (response?.html_content) {
        setContent(response.html_content);
      }
    } catch (error) {
      console.error("Failed to fetch contract version:", error);
      toastService.error("Failed to load contract content.");
    }
  };

  const fetchTemplate = async () => {
    try {
      const data = await fetchTemplateApi(
        PropertyService.getContractTemplate(Number(templateId)),
      );
      if (data?.html_content) {
        setContent(data.html_content);
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toastService.error("Failed to load template.");
    }
  };

  const handleSave = async (
    shouldRedirect = true,
  ): Promise<ContractVersion | null> => {
    if (!content) return null;
    try {
      toastService.info("Saving changes...");
      const result = await saveContractApi(
        PropertyService.uploadPurchaseContract(Number(propertyId), {
          htmlContent: content,
          allowUpdateLatest: allowUpdateLatest,
        }),
      );

      setLastSaved(new Date());
      toastService.success("Contract saved successfully!");

      if (shouldRedirect) {
        router.replace(`/properties/${propertyId}/contracts`);
      }
      return result;
    } catch (error) {
      console.error("Failed to save contract:", error);
      toastService.error("Failed to save contract. Please try again.");
      return null;
    }
  };

  const handleDownloadPdf = async () => {
    if (!content) return;

    try {
      // 1. Save first to ensure the PDF has the latest content
      const savedVersion = await handleSave(false);
      if (!savedVersion) return;

      // 2. Generate and Download PDF
      toastService.info("Generating PDF, please wait...");
      const response = await downloadApi(
        PropertyService.generateContractPdf(
          Number(propertyId),
          savedVersion.id,
        ),
      );

      if (response?.signed_url) {
        window.open(response.signed_url, "_blank");
        toastService.success("PDF ready for download!");
      } else {
        toastService.error("PDF generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toastService.error("Error generating PDF.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  return (
    <div className="flex flex-col min-w-0 space-y-8 relative">
      {(saving || downloading) && (
        <FullPageLoader
          message={saving ? "Saving Changes..." : "Generating PDF..."}
          submessage={
            saving
              ? "We are updating the digital agreement."
              : "Your document is being prepared for download."
          }
        />
      )}
      <PageHeader
        items={getContractsBreadcrumbs(
          propertyId,
          property?.property_title || "Property",
          false,
        )}
        title={
          mode === "edit"
            ? "Edit Digital Agreement"
            : "Create Digital Agreement"
        }
        description={
          property?.property_title
            ? `Drafting agreement for ${property.property_title}`
            : "Preparing document..."
        }
      />

      <div className="flex flex-col lg:flex-row  gap-6 lg:gap-8 lg:-mx-0">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Header / Actions */}
          <div className="bg-white rounded-xl p-4 lg:px-8 lg:py-5 mb-8 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* <Button className="!w-auto !bg-white !border-gray-100 border !text-[#4F46E5] !rounded-xl !py-3 !px-6 !text-[13px] !font-black !shadow-sm hover:!bg-gray-50">
                            <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                            EDIT DRAFT
                        </Button>
                        <Button className="!w-auto !bg-white !border-gray-100 border !text-rose-500 !rounded-xl !py-3 !px-6 !text-[13px] !font-black !shadow-sm hover:!bg-rose-50">
                            <span className="material-symbols-outlined text-[18px] mr-2">delete</span>
                            DELETE
                        </Button> */}
            </div>
            <div className=" flex items-center gap-5 z-10">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[2px]">
                  {lastSaved
                    ? `Last saved ${lastSaved.toLocaleTimeString()}`
                    : "Not saved yet"}
                </span>
                <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#4F46E5] transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">
                    history
                  </span>
                </button>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={downloading || saving}
                className={`text-[13px] font-black uppercase tracking-widest px-4 transition-colors cursor-pointer flex items-center gap-2 ${downloading ? "text-indigo-400 animate-pulse" : "text-gray-400 hover:text-[#4F46E5]"}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {downloading ? "sync" : "picture_as_pdf"}
                </span>
                {downloading ? "Generating..." : "Download PDF"}
              </button>

              <div className="hidden xl:flex items-center gap-5 pl-8 border-l border-gray-100">
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className={`p-2 transition-all cursor-pointer rounded-xl flex items-center gap-2 px-6 py-2 ${saving ? "bg-gray-50 text-gray-200" : "bg-indigo-50 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"}`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${saving ? "animate-pulse" : ""}`}
                  >
                    save
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Save
                  </span>
                </button>
                <button className="p-2 text-gray-400 hover:text-[#4F46E5] transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Editor Surface */}
          <div className="bg-white rounded-xl p-6 lg:p-12 shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden relative">
            {!getPermissions(primaryRole || undefined).canManageContracts && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-10 text-center">
                <div className="max-w-md space-y-4">
                  <span className="material-symbols-outlined text-[64px] text-rose-500">
                    lock
                  </span>
                  <h2 className="text-[24px] font-black text-gray-900">
                    Access Restricted
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Only authorized agents can modify contract documents.
                  </p>
                  <Button onClick={() => router.back()}>Go Back</Button>
                </div>
              </div>
            )}
            {/* Status Bar */}

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="mx-auto max-w-[900px] w-full h-full flex flex-col">
                {templateLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-50 border-t-[#4F46E5] rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold">
                      Populating template...
                    </p>
                  </div>
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    className="quill-premium h-full flex flex-col"
                    placeholder="Start architecting your contract..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
                .quill-premium {
                    display: flex;
                    flex-direction: column;
                }
                .quill-premium .ql-toolbar.ql-snow {
                    border:none ;
                    border-bottom: 2px solid #F9FAFB;
                    padding: 0 0 32px 0;
                    margin-bottom: 48px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 12px;
                }
                .quill-premium .ql-container.ql-snow {
                    border: none;
                    font-family: inherit;
                    font-size: 16px;
                    flex: 1;
                    overflow: auto;
                }
                .quill-premium .ql-editor {
                    padding: 0;
                    color: #374151;
                    line-height: 1.8;
                    min-height: 100%;
                }
                .quill-premium .ql-editor p {
                    margin-bottom: 24px;
                    text-align: left;
                }
                .quill-premium .ql-editor blockquote {
                    background: #F9FAFB;
                    border-left: 4px solid #4F46E5;
                    padding: 24px;
                    margin: 32px 0;
                    border-radius: 0 16px 16px 0;
                }
                .quill-premium .ql-formats {
                    margin-right: 32px !important;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .quill-premium .ql-snow.ql-toolbar button {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-center;
                    border-radius: 12px;
                    transition: all 0.2s;
                    color: #9CA3AF;
                }
                .quill-premium .ql-snow.ql-toolbar button:hover {
                    background: #EEF2FF;
                    color: #4F46E5;
                }
                .quill-premium .ql-snow.ql-toolbar button:hover .ql-stroke {
                    stroke: #4F46E5;
                }
                .quill-premium .ql-snow.ql-toolbar button.ql-active {
                    background: #4F46E5;
                    color: white;
                }
                .quill-premium .ql-snow.ql-toolbar button.ql-active .ql-stroke {
                    stroke: white;
                }
                .quill-premium .ql-editor h1 {
                    font-size: 36px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.025em;
                    margin-bottom: 64px;
                    text-align: center;
                    color: #111827;
                }
                .quill-premium .ql-editor h3 {
                    font-size: 14px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 48px;
                    margin-bottom: 16px;
                    color: #111827;
                    text-align: left;
                }
            `}</style>
            
      </div>
    </div>
  );
}
