"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';
import { agentInitialValues, agentSchema } from '@/lib/validations/org.schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function InviteAgentForm() {
    const router = useRouter();
    const { callApi, loading: isSubmitting } = useApi();

    const formik = useFormik({
        initialValues: agentInitialValues,
        validationSchema: agentSchema,
        onSubmit: async (values) => {
            const apiData = {
                name: values.fullName,
                email: values.email
                // Other fields can be sent if backend supports them later
            };
            const result = await callApi(OrganizationDashboardService.inviteAgent(apiData));
            if (result) {
                toast.success('Agent invited successfully!');
                router.push('/org/agents');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm shadow-indigo-100/20">
            <div className="space-y-2 text-center mb-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <span className="material-symbols-outlined text-[32px]">person_add</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Enlist New Elite Agent</h2>
                <p className="text-gray-400 font-medium">Invited agents will receive access to your organization's infrastructure.</p>
            </div>

            <div className="space-y-6">
                <Input
                    label="Agent Full Name"
                    name="fullName"
                    placeholder="e.g. Johnathan Sterling"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fullName}
                    error={formik.touched.fullName && formik.errors.fullName ? String(formik.errors.fullName) : undefined}
                    className="h-14! rounded-2xl! border-gray-100!"
                />
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="agent@brokerage.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email ? String(formik.errors.email) : undefined}
                    className="h-14! rounded-2xl! border-gray-100!"
                />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => router.back()}
                    className="h-14 px-8 rounded-2xl font-bold text-gray-400 border-none hover:bg-gray-50 bg-transparent!"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="h-14 px-10 rounded-2xl font-black shadow-lg shadow-indigo-200/50"
                >
                    Send Invitation
                </Button>
            </div>
        </form>
    );
}
