"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { SecuritySchema, INITIAL_SECURITY_VALUES, SETTINGS_LABELS, SETTINGS_PLACEHOLDERS } from '../constants/settings.constants';
import AuthService from '@/services/auth.service';
import { toastService } from '@/utils/toastService';
import { useApi } from '@/hooks/useApi';

export const SecurityTab: React.FC = () => {
    const { callApi: changePasswordApi, error: apiError, reset: resetApi } = useApi();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    
    useEffect(() => {
        if (apiError) {
            toastService.error(apiError);
        }
    }, [apiError]);

    const formik = useFormik({
        initialValues: INITIAL_SECURITY_VALUES,
        validationSchema: SecuritySchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (!formik.dirty) {
                toastService.info("No changes detected.");
                setSubmitting(false);
                return;
            }
            try {
                resetApi();
                const response = await changePasswordApi(AuthService.changePassword({
                    previousPassword: values.currentPassword,
                    newPassword: values.newPassword
                }));
                
                if (response) {
                    resetForm();
                    toastService.success("Password updated successfully!");
                }
            } catch (error) {
                console.error("Password update failed", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-sm border border-gray-100 transition-all duration-300">
            <div className="text-start mb-10">
                <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{SETTINGS_LABELS.SECURITY.TITLE}</h2>
                <p className="text-[14px] font-medium text-gray-400 mt-1">{SETTINGS_LABELS.SECURITY.SUBTITLE}</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                <Input
                    label={SETTINGS_LABELS.SECURITY.CURRENT}
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.currentPassword && formik.errors.currentPassword}
                    placeholder={SETTINGS_PLACEHOLDERS.PWD_CURRENT}
                    rightIcon={
                        <button 
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showCurrentPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    }
                />
                <div className="hidden md:block" />
                <Input
                    label={SETTINGS_LABELS.SECURITY.NEW}
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.newPassword && formik.errors.newPassword}
                    placeholder={SETTINGS_PLACEHOLDERS.PWD_NEW}
                    rightIcon={
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    }
                />
                <Input
                    label={SETTINGS_LABELS.SECURITY.CONFIRM}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    placeholder={SETTINGS_PLACEHOLDERS.PWD_CONFIRM}
                    rightIcon={
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showConfirmPassword ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    }
                />
                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-10 border-t border-gray-50 mt-10 md:col-span-2">
                    <Button 
                        type="submit"
                        isLoading={formik.isSubmitting}
                        className="!w-full sm:!w-auto !bg-[#3323CC] !py-5 !px-24 !text-[15px] !font-black !rounded-[18px] !shadow-xl !shadow-indigo-100 group"
                    >
                        Update Password
                    </Button>
                </div>
            </form>
        </div>
    );
};
