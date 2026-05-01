"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { EmailConfigSchema, INITIAL_EMAIL_CONFIG_VALUES, SETTINGS_LABELS, SETTINGS_PLACEHOLDERS } from '../constants/settings.constants';
import EmailConfigService from '@/services/email-config.service';
import { toastService } from '@/utils/toastService';
import { useApi } from '@/hooks/useApi';

export const EmailConfigTab: React.FC = () => {
    const { callApi: getConfigsApi, error: getConfigsError, reset: resetGetConfigsApi } = useApi();
    const { callApi: createConfigApi, error: createConfigError, reset: resetCreateConfigApi } = useApi();
    const { callApi: deleteConfigApi, error: deleteConfigError, reset: resetDeleteConfigApi } = useApi();
 
    useEffect(() => {
        if (getConfigsError) {
            toastService.error(getConfigsError);
        }
    }, [getConfigsError]);

    useEffect(() => {
        if (createConfigError) {
            toastService.error(createConfigError);
        }
    }, [createConfigError]);

    useEffect(() => {
        if (deleteConfigError) {
            toastService.error(deleteConfigError);
        }
    }, [deleteConfigError]);

    const [emailConfigs, setEmailConfigs] = useState<any[]>([]);
    const [showAddEmailModal, setShowAddEmailModal] = useState(false);
    const [showAppPassword, setShowAppPassword] = useState(false);

    const fetchEmailConfigs = async () => {
        try {
            resetGetConfigsApi();
            const data = await getConfigsApi(EmailConfigService.getConfigs());
            if (data) {
                setEmailConfigs(data as any[]);
            }
        } catch (error) {
            console.error("Failed to fetch email configs", error);
        }
    };

    useEffect(() => {
        fetchEmailConfigs();
    }, []);

    const formik = useFormik({
        initialValues: INITIAL_EMAIL_CONFIG_VALUES,
        validationSchema: EmailConfigSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                resetCreateConfigApi();
                const response = await createConfigApi(EmailConfigService.createConfig(values));
                if (response) {
                    setShowAddEmailModal(false);
                    resetForm();
                    fetchEmailConfigs();
                    toastService.success("Email configuration saved!");
                }
            } catch (error) {
                console.error("Failed to save email config", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleDeleteEmailConfig = async (id: number) => {
        if (!confirm("Are you sure you want to delete this email app?")) return;
        try {
            resetDeleteConfigApi();
            const response = await deleteConfigApi(EmailConfigService.deleteConfig(id));
            if (response) {
                fetchEmailConfigs();
                toastService.success("Email app removed.");
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-sm border border-gray-100 transition-all duration-300">
            <div className="text-start mb-10 flex items-center justify-between">
                <div>
                    <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{SETTINGS_LABELS.EMAIL.TITLE}</h2>
                    <p className="text-[14px] font-medium text-gray-400 mt-1">{SETTINGS_LABELS.EMAIL.SUBTITLE}</p>
                </div>
                {!showAddEmailModal && (
                    <Button 
                        onClick={() => setShowAddEmailModal(true)}
                        className="!bg-[#3323CC] !rounded-xl !py-2 !px-6 !text-[13px]"
                    >
                        Add New App
                    </Button>
                )}
            </div>

            {showAddEmailModal ? (
                <div className="bg-gray-50/50 p-8 rounded-[24px] border border-gray-100 mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-[17px] font-black text-gray-900 mb-8 uppercase tracking-wider">Configure New App</h3>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                            <Input
                                label={SETTINGS_LABELS.EMAIL.APP_LABEL}
                                name="appName"
                                value={formik.values.appName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.appName && formik.errors.appName}
                                placeholder={SETTINGS_PLACEHOLDERS.EMAIL_APP_NAME}
                            />
                            <Input
                                label={SETTINGS_LABELS.EMAIL.EMAIL_ADDR}
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && formik.errors.email}
                                placeholder={SETTINGS_PLACEHOLDERS.EMAIL}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label={SETTINGS_LABELS.EMAIL.APP_PWD}
                                    name="appPassword"
                                    type={showAppPassword ? "text" : "password"}
                                    value={formik.values.appPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.appPassword && formik.errors.appPassword}
                                    placeholder={SETTINGS_PLACEHOLDERS.EMAIL_APP_PWD}
                                    rightIcon={
                                        <button 
                                            type="button"
                                            onClick={() => setShowAppPassword(!showAppPassword)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showAppPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    }
                                />
                                <p className="text-[12px] text-gray-400 mt-3 flex items-center gap-1.5 font-medium">
                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                    Generate this in your Google Account settings under Security &gt; App Passwords.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-10 pt-8 border-t border-gray-100">
                            <Button 
                                type="submit"
                                isLoading={formik.isSubmitting}
                                className="!bg-[#3323CC] !rounded-xl !py-3 !px-10"
                            >
                                Save App
                            </Button>
                            <Button 
                                type="button"
                                onClick={() => setShowAddEmailModal(false)}
                                className="!bg-white !text-gray-500 !border !border-gray-200 !rounded-xl !py-3 !px-10 hover:!bg-gray-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {emailConfigs.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[24px] border border-dashed border-gray-200">
                            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4 block">alternate_email</span>
                            <p className="text-gray-400 font-bold tracking-tight">No email apps connected yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Connect your first Gmail app to start campaigns.</p>
                        </div>
                    ) : (
                        emailConfigs.map((config) => (
                            <div key={config.id} className="flex items-center justify-between p-6 bg-white rounded-[20px] border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#3323CC] group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[24px]">mail</span>
                                    </div>
                                    <div className="text-start">
                                        <h4 className="font-black text-gray-900 text-[15px]">{config.appName}</h4>
                                        <p className="text-[13px] font-bold text-gray-400">{config.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleDeleteEmailConfig(config.id)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
