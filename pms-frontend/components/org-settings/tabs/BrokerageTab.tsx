"use client";

import React, { useEffect, useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import { useApi } from '@/hooks/useApi';
import { toastService } from '@/utils/toastService';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';
import { OrganizationSchema, INITIAL_ORG_VALUES } from '../constants/org.constants';
import BrokerageInfoSection from '@/components/pricing/onboarding/BrokerageInfoSection';
import PrimaryContactSection from '@/components/pricing/onboarding/PrimaryContactSection';
import OrgSizeSection from '@/components/pricing/onboarding/OrgSizeSection';
import BrandingSection from '@/components/pricing/onboarding/BrandingSection';
import AdditionalNotesSection from '@/components/pricing/onboarding/AdditionalNotesSection';
import { Button } from '@/components/common/Button';

export default function BrokerageTab() {
    const { callApi: fetchOrgApi, loading: isFetching } = useApi<any>();
    const { callApi: updateOrgApi, loading: isUpdating } = useApi<any>();
    const [initialValues, setInitialValues] = useState(INITIAL_ORG_VALUES);

    const fetchOrgData = async () => {
        try {
            const data = await fetchOrgApi(OrganizationDashboardService.getMyOrganization());
            if (data) {
                setInitialValues({
                    ...INITIAL_ORG_VALUES,
                    ...data
                });
            }
        } catch (error) {
            console.error("Failed to fetch organization data", error);
        }
    };

    useEffect(() => {
        fetchOrgData();
    }, []);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: OrganizationSchema,
        onSubmit: async (values) => {
            if (!formik.dirty) {
                toastService.info("No changes detected.");
                return;
            }
            try {
                const response = await updateOrgApi(OrganizationDashboardService.updateMyOrganization(values));
                if (response) {
                    toastService.success("Brokerage details updated successfully!");
                }
            } catch (error) {
                console.error("Update failed", error);
                toastService.error("Failed to update brokerage details.");
            }
        },
    });

    if (isFetching) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3525CD]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-12 shadow-sm border border-gray-100 transition-all duration-300">
            <div className="text-start mb-12">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Brokerage Details</h2>
                <p className="text-[14px] font-medium text-gray-400 mt-1">Manage your organization's public profile, branding, and contact information.</p>
            </div>

            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} className="space-y-16">
                    <BrokerageInfoSection formik={formik} />

                    <div className="h-px bg-gray-50" />

                    <PrimaryContactSection formik={formik} />

                    <div className="h-px bg-gray-50" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <OrgSizeSection formik={formik} />
                        <BrandingSection formik={formik} />
                    </div>

                    <div className="h-px bg-gray-50" />

                    <AdditionalNotesSection formik={formik} />

                    <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-10 border-t border-gray-100 mt-10">
                        <Button 
                            type="submit"
                            isLoading={isUpdating}
                            className="w-full! sm:w-auto! bg-[#3323CC]! py-5! px-24! text-[15px]! font-black! rounded-[18px]! shadow-xl! shadow-indigo-100! group"
                        >
                            Update Brokerage
                        </Button>
                    </div>
                </form>
            </FormikProvider>
        </div>
    );
}
