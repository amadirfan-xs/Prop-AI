"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { EyeIcon, EyeOffIcon, CheckCircleIcon, BadgeCheckIcon } from '@/constants/icons/AuthIcons';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';
import { AuthService } from '@/services/auth.service';
import { toastService } from '@/utils/toastService';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/auth';

import { ResetPasswordFormValues } from '@/types/auth';
import { resetPasswordInitialValues, resetPasswordSchema } from '@/lib/validations/auth.schema';
import { checkPasswordRequirements } from '@/utils/auth.helpers';

const RequirementItem = ({ text, isValid }: { text: string, isValid: boolean }) => (
    <div className="flex items-center gap-3 text-[13.5px] font-medium transition-colors duration-300">
        {isValid ? (
            <CheckCircleIcon size={16} className="text-[#4F46E5]" />
        ) : (
            <div className="w-4 h-4 rounded-full bg-gray-300 shrink-0" />
        )}
        <span className={isValid ? "text-gray-900" : "text-gray-500"}>{text}</span>
    </div>
);

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const resetPIN = searchParams.get('pin') || '';
    const { callApi, error: apiError } = useApi();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!email || !resetPIN) {
            router.push(AUTH_ROUTES.FORGOT_PASSWORD);
        }
    }, [email, resetPIN, router]);

    const formik = useFormik<ResetPasswordFormValues>({
        initialValues: resetPasswordInitialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const data = await callApi(AuthService.resetPassword({
                email,
                resetPIN,
                password: values.password,
            }));

            if (data) {
                setIsSubmitted(true);
                toastService.success('Password updated successfully!');
            }
            setSubmitting(false);
        },
    });

    useEffect(() => {
        if (apiError) {
            toastService.error(apiError);
            // if (apiError.includes('Reset PIN has expired')) {
            //     setTimeout(() => {
            //         router.push('/auth/login');
            //     }, 2000);
            // }
        }
    }, [apiError, router]);

    const { isLengthValid, isUppercaseValid, isNumberSymbolValid } = checkPasswordRequirements(formik.values.password);

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center text-center w-full relative">
                <div className="absolute top-[-48px] left-[-40px] right-[-40px] h-1.5 bg-[#4F46E5]" />
                <div className="w-[64px] h-[64px] bg-[#EEF2FF] text-[#4F46E5] rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <BadgeCheckIcon size={32} />
                </div>
                <h2 className="text-[2rem] font-bold text-gray-900 mb-3 tracking-tight">Password Updated</h2>
                <p className="text-gray-600 font-medium text-[15px] mb-10 px-2 leading-relaxed">
                    Your password has been updated successfully. You can now use your new password to sign in.
                </p>

                <a
                    href="/auth/login"
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 font-bold py-[14px] rounded-[12px] transition-colors flex items-center justify-center gap-2 text-[14.5px] shadow-sm select-none"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col text-left">
            <h2 className="text-[2rem] font-bold text-gray-900 mb-2 tracking-tight">Create new password</h2>
            <p className="text-gray-500 font-medium text-[14.5px] mb-10 leading-relaxed">
                Your new password must be unique and follow the security requirements below.
            </p>

            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-5">
                <Input
                    label="NEW PASSWORD"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    }
                />

                <Input
                    label="CONFIRM PASSWORD"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                        </button>
                    }
                />

                <div className="bg-[#f9fafb] rounded-[12px] p-5 flex flex-col gap-[14px] mt-1 border border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider mb-0.5">SECURITY REQUIREMENTS</div>
                    <RequirementItem text="Minimum 8 characters" isValid={isLengthValid} />
                    <RequirementItem text="At least one uppercase letter" isValid={isUppercaseValid} />
                    <RequirementItem text="At least one number or symbol" isValid={isNumberSymbolValid} />
                </div>

                <Button
                    type="submit"
                    isLoading={formik.isSubmitting}
                    disabled={!isLengthValid || !isUppercaseValid || !isNumberSymbolValid || !formik.values.confirmPassword || formik.values.password !== formik.values.confirmPassword}
                    className="w-full py-4 mt-2 rounded-[12px] bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center text-[15px] font-bold shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-60 disabled:shadow-none transition-all duration-300"
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
}
