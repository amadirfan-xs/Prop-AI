"use client";

import React from "react";
import { useFormik } from "formik";
import BrokerageInfoSection from "@/components/pricing/onboarding/BrokerageInfoSection";
import PrimaryContactSection from "@/components/pricing/onboarding/PrimaryContactSection";
import OrgSizeSection from "@/components/pricing/onboarding/OrgSizeSection";
import BrandingSection from "@/components/pricing/onboarding/BrandingSection";
import AdditionalNotesSection from "@/components/pricing/onboarding/AdditionalNotesSection";
import { Button } from "@/components/common/Button";
import {
  OrganizationSchema,
  INITIAL_ORG_VALUES,
} from "@/components/org-settings/constants/org.constants";

interface UpgradeOrgPlanContainerProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

import { ORG_UPGRADE_BADGES } from "@/constants/pricing";

export default function UpgradeOrgPlanContainer({
  onCancel,
  onSubmit,
  isLoading,
}: UpgradeOrgPlanContainerProps) {
  const badges = ORG_UPGRADE_BADGES;

  const formik = useFormik({
    initialValues: INITIAL_ORG_VALUES,
    validationSchema: OrganizationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-sans">
      {/* Minimal Header */}

      <main className="grow flex flex-col items-center py-12 lg:py-20 px-6">
        <div className="max-w-[800px] w-full text-center space-y-4 mb-16">
          <h1 className="text-[40px] lg:text-[48px] font-black text-gray-900 tracking-tight leading-[1.1]">
            Upgrade to Organizational Plan
          </h1>
          <p className="text-[16px] lg:text-[18px] font-bold text-gray-400">
            Tell us about your brokerage and we'll help you get started
          </p>
        </div>

        <div className="max-w-[900px] w-full bg-white rounded-xl shadow-xl shadow-gray-200 overflow-hidden">
          <form onSubmit={formik.handleSubmit}>
            <div className="p-8 lg:p-14 space-y-16">
              <BrokerageInfoSection formik={formik} />

              <div className="h-px bg-gray-100 -mx-14" />

              <PrimaryContactSection formik={formik} />

              <div className="h-px bg-gray-100 -mx-14" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <OrgSizeSection formik={formik} />
                <BrandingSection formik={formik} />
              </div>

              <div className="h-px bg-gray-100 -mx-14" />

              <AdditionalNotesSection formik={formik} />
            </div>

            {/* Action Bar */}
            <div className="bg-[#F9FAFC] px-8 lg:px-14 py-8 flex flex-col sm:flex-row items-center justify-end gap-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                className="text-[15px] font-black text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                isLoading={isLoading || formik.isSubmitting}
                className="!bg-[#3525CD] !text-white !px-12 !py-4 !rounded-2xl !text-[16px] !font-black !shadow-xl !shadow-indigo-100 w-full sm:w-auto"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>

        {/* Badges Footer */}
        <div className="mt-16 flex flex-wrap justify-center gap-10 opacity-50">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                {badge.icon}
              </span>
              <span className="text-[12px] font-black uppercase tracking-widest">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
