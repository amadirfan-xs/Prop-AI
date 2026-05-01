"use client";

import React from 'react';
import { Formik, Form, Field } from 'formik';
import { AgentInvitationFormValues } from '@/types/org';
import { agentInitialValues, agentSchema } from '@/lib/validations/org.schema';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { PhoneInputComponent } from '@/components/common/PhoneInput';

import { useApi } from '@/hooks/useApi';
import { OrganizationDashboardService } from '@/services/organization-dashboard.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Toggle = ({ checked, onChange, title, subtitle }: { checked: boolean; onChange: (v: boolean) => void; title: string; subtitle: string }) => (
    <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
        <div>
            <p className="text-[14px] font-black text-gray-900 leading-tight mb-1">{title}</p>
            <p className="text-[12px] font-medium text-gray-400 max-w-[240px]">{subtitle}</p>
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-11 h-6 rounded-full transition-all relative ${checked ? 'bg-[#3525CD]' : 'bg-gray-200'}`}
        >
            {''}    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

export default function AgentInvitationForm() {
    const router = useRouter();
    const { callApi, loading: isSubmitting } = useApi();

    return (
        <Formik<AgentInvitationFormValues>
            initialValues={agentInitialValues}
            validationSchema={agentSchema}
            onSubmit={async (values, { resetForm }) => {
                const apiData = {
                    name: values.fullName,
                    email: values.email,
                    phone: values.phone
                };
                
                try {
                    const result = await callApi(OrganizationDashboardService.inviteAgent(apiData)) as any;
                    if (result && result.success) {
                        toast.success(result.message || 'Agent invited successfully!');
                        resetForm();
                        router.back();
                    } else if (result && result.message) {
                        toast.error(result.message);
                    }
                } catch (error: any) {
                    const errorMsg = error?.response?.data?.message || 'Failed to send invitation. Please try again.';
                    toast.error(errorMsg);
                }
            }}
        >
            {(formik) => {
                const { errors, touched, values, setFieldValue } = formik;
                return (
                <Form className="space-y-10">
                    {/* Agent Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#3525CD]">
                                <span className="material-symbols-outlined text-[20px]">badge</span>
                            </div>
                            <h3 className="text-[16px] font-black text-gray-900">Agent Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                name="fullName"
                                label="Full Name"
                                placeholder="e.g. Sarah Jenkins"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.fullName}
                                error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                            />
                            <Input
                                name="email"
                                type="email"
                                label="Email Address"
                                placeholder="sarah.j@agency.com"
                                required
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={touched.email && errors.email ? errors.email : undefined}
                            />
                        </div>
                        <div className="space-y-2">
                            <PhoneInputComponent
                                name="phone"
                                label="Phone Number (Mobile)"
                                placeholder="+1 (555) 000-0000"
                            />
                            {/* Surfacing error immediately if phone is provided but invalid */}
                            {values.phone && errors.phone && !touched.phone && (
                                <p className="text-xs text-red-500 font-semibold pl-1">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Role & Permissions (Hidden per request) */}
                    {/* 
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            </div>
                            <h3 className="text-[16px] font-black text-gray-900">Role & Permissions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">Agent Role</label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="role"
                                        className="w-full bg-[#f7f8f9] border border-gray-200 rounded-[10px] py-3.5 px-4 text-[0.95rem] font-medium text-gray-800 outline-none appearance-none focus:ring-2 focus:ring-[#5b51e0] focus:border-[#5b51e0] transition-all"
                                    >
                                        <option>Senior Agent</option>
                                        <option>Junior Agent</option>
                                        <option>Principal Broker</option>
                                    </Field>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <Toggle
                                title="Admin Permissions"
                                subtitle="Grant access to manage team settings and billing."
                                checked={values.isAdmin}
                                onChange={(v) => setFieldValue('isAdmin', v)}
                            />
                        </div>
                    </div>
                    */}

                    {/* Office Assignment (Hidden per request) */}
                    {/* 
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <span className="material-symbols-outlined text-[20px]">location_on</span>
                            </div>
                            <h3 className="text-[16px] font-black text-gray-900">Office Assignment</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">Regional Office</label>
                            <div className="relative">
                                <Field
                                    as="select"
                                    name="office"
                                    className="w-full bg-[#f7f8f9] border border-gray-200 rounded-[10px] py-3.5 px-4 text-[0.95rem] font-medium text-gray-800 outline-none appearance-none focus:ring-2 focus:ring-[#5b51e0] focus:border-[#5b51e0] transition-all"
                                >
                                    <option>Manhattan Flagship - New York</option>
                                    <option>Brooklyn Regional - New York</option>
                                    <option>Miami Central - Florida</option>
                                </Field>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    */}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-6 pt-10 border-t border-gray-50">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-white text-gray-400! border-none! w-auto! px-8! hover:bg-gray-50! transition-all font-black"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Send Invitation
                        </Button>
                    </div>
                </Form>
                );
            }}
        </Formik>
    );
}
