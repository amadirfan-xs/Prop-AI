"use client";

import React, { useState, useEffect } from "react";
import CampaignWizardStepper from "@/components/marketing-campaigns/CampaignWizardStepper";
import StepTemplateEditor from "@/components/marketing-campaigns/StepTemplateEditor";
import StepRecipientManager from "@/components/marketing-campaigns/StepRecipientManager";
import StepLaunchSchedule from "@/components/marketing-campaigns/StepLaunchSchedule";
import CampaignList from "@/components/marketing-campaigns/CampaignList";
import { useApi } from "@/hooks/useApi";
import { PropertyService } from "@/services/property.service";
import { EmailConfigService } from "@/services/email-config.service";
import { MarketingCampaignService } from "@/services/MarketingCampaignService";
import { toastService } from "@/utils/toastService";
import { useRouter } from "next/navigation";

const STEPS = ["Design Template", "Target Audience", "Finalize & Launch"];

import { useFormik, FormikProvider } from "formik";
import { CampaignSchema, INITIAL_CAMPAIGN_VALUES } from "./constants/campaign.constants";

export default function CampaignContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [view, setView] = useState<'list' | 'wizard'>('list');
  
  // API Hooks
  const { data: properties, callApi: fetchProperties } = useApi<any>();
  const { data: emailConfigs, callApi: fetchEmailConfigs } = useApi<any[]>();
  const { data: campaigns, callApi: fetchCampaigns } = useApi<any[]>();
  const { data: templates, callApi: fetchTemplates } = useApi<any[]>();
  const { loading: isLaunching, callApi: launchCampaign } = useApi();

  const formik = useFormik({
    initialValues: INITIAL_CAMPAIGN_VALUES,
    validationSchema: CampaignSchema,
    onSubmit: async (values) => {
        if (!values.emailConfigId) {
            toastService.error("Please select an email app to send from");
            return;
        }

        // Validation for scheduled campaigns
        if (values.scheduleType === 'later' && !values.scheduledAt) {
            toastService.error("Please select a date and time for your scheduled campaign");
            return;
        }

        if (values.scheduledAt && isNaN(Date.parse(values.scheduledAt))) {
            toastService.error("Please provide a valid date and time for scheduling");
            return;
        }

        if (values.recipients.length === 0) {
            toastService.error("Please add at least one recipient");
            return;
        }

        const result = await launchCampaign(MarketingCampaignService.createCampaign(values));
        if (result) {
            toastService.success("Campaign launched successfully!");
            fetchCampaigns(MarketingCampaignService.getCampaigns());
            setView('list');
            formik.resetForm();
            setCurrentStep(1);
        }
    }
  });

  useEffect(() => {
    fetchProperties(PropertyService.listMyProperties());
    fetchEmailConfigs(EmailConfigService.getConfigs());
    fetchCampaigns(MarketingCampaignService.getCampaigns());
    fetchTemplates(MarketingCampaignService.getTemplates());
  }, []);

  const handleAddRecipients = (newEmails: string[]) => {
    const uniqueNew = newEmails.filter((email) => !formik.values.recipients.includes(email));
    formik.setFieldValue('recipients', [...formik.values.recipients, ...uniqueNew]);
  };

  const handleRemoveRecipient = (email: string) => {
    formik.setFieldValue('recipients', formik.values.recipients.filter((r) => r !== email));
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all recipients?")) {
      formik.setFieldValue('recipients', []);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formik.values.propertyId) {
        toastService.error("Please select a property first");
        return;
      }
      if (!formik.values.name) {
        toastService.error("Please enter a campaign name");
        return;
      }
    }
    if (currentStep === 2 && formik.values.recipients.length === 0) {
      toastService.error("Please add at least one recipient");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFinalLaunch = () => {
      formik.handleSubmit();
  };

  const noEmailApps = emailConfigs && Array.isArray(emailConfigs) && emailConfigs.length === 0;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12 space-y-12">
        {noEmailApps && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-red-600 text-[32px]">warning</span>
            </div>
            <div>
              <h3 className="text-[16px] font-black text-gray-900">No Email Configuration Found</h3>
              <p className="text-[13px] font-medium text-gray-500">You need to set up an email app in Settings before you can launch campaigns.</p>
            </div>
            <button 
              onClick={() => router.push("/settings")}
              className="ml-auto px-6 h-12 bg-gray-900 text-white text-[12px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
            >
              Go to Settings
            </button>
          </div>
        )}

        {view === 'list' ? (
          <CampaignList 
            campaigns={campaigns || []} 
            onNewCampaign={() => setView('wizard')} 
          />
        ) : (
          <FormikProvider value={formik}>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setView('list')}
                className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
               >
                 <span className="material-symbols-outlined">arrow_back</span>
               </button>
               <h2 className="text-[20px] font-black text-gray-900">New Campaign Wizard</h2>
            </div>
            
            <CampaignWizardStepper currentStep={currentStep} steps={STEPS} />

            {/* Step Content */}
            <div className="animate-in fade-in duration-700">
              {currentStep === 1 && (
                <StepTemplateEditor
                  properties={properties?.items || []}
                  templates={templates || []}
                />
              )}
              {currentStep === 2 && (
                <StepRecipientManager
                  onAdd={handleAddRecipients}
                  onRemove={handleRemoveRecipient}
                  onClear={handleClearAll}
                />
              )}
              {currentStep === 3 && (
                <StepLaunchSchedule
                  recipientsCount={formik.values.recipients.length}
                  emailConfigs={emailConfigs || []}
                  onLaunch={handleFinalLaunch}
                  isLaunching={isLaunching}
                />
              )}
            </div>

            <div className="h-10"></div>

            <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-50 rounded-b-2xl">
              <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 sm:px-8 h-12 text-[12px] sm:text-[13px] font-black uppercase tracking-widest transition-all ${
                    currentStep === 1
                      ? "text-gray-200 cursor-not-allowed"
                      : "text-gray-900 hover:text-[#3525CD]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_back
                  </span>
                  <span className="hidden xs:inline">Previous Step</span>
                  <span className="xs:hidden">Back</span>
                </button>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[11px] sm:text-[12px] font-bold text-gray-400">
                    Step {currentStep} of {STEPS.length}
                  </span>
                  {currentStep < STEPS.length && (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-8 sm:px-10 h-14 bg-[#3525CD] text-white text-[12px] sm:text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#2A1DA6] transition-all shadow-xl shadow-indigo-100"
                    >
                      Continue
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </FormikProvider>
        )}
      </div>
    </div>

  );
}

