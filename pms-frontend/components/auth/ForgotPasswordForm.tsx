"use client";

import  { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { MailIcon, ArrowRightIcon, RefreshIcon, BadgeCheckIcon, KeyResetIcon } from '@/constants/icons/AuthIcons';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

import { useApi } from '@/hooks/useApi';
import { AuthService } from '@/services/auth.service';
import { toastService } from '@/utils/toastService';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/auth';

import { ForgotPasswordFormValues } from '@/types/auth';
import { forgotPasswordInitialValues, forgotPasswordSchema } from '@/lib/validations/auth.schema';

export default function ForgotPasswordForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const { callApi, error: apiError, loading } = useApi();
    const router = useRouter();

    useEffect(() => {
        if (apiError) {
            toastService.error(apiError);
        }
    }, [apiError]);

    const formik = useFormik<ForgotPasswordFormValues>({
        initialValues: forgotPasswordInitialValues,
        validationSchema: forgotPasswordSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const data = await callApi(AuthService.forgetPassword(values));
            if (data) {
                setEmail(values.email);
                setIsSubmitted(true);
                toastService.success('Reset PIN sent to your email!');
            }
            setSubmitting(false);
        },
    });

    const handleResend = async () => {
        const data = await callApi(AuthService.forgetPassword({ email }));
        if (data) {
            toastService.success('PIN resent successfully!');
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center text-center">
                <div className="w-[64px] h-[64px] bg-[#EEF2FF] text-[#4F46E5] rounded-[16px] flex items-center justify-center mb-8 shadow-sm">
                    <BadgeCheckIcon size={32} />
                </div>
                <h2 className="text-[2rem] font-bold text-gray-900 mb-3 tracking-tight">Check Your Email</h2>
                <p className="text-gray-600 font-medium text-[15px] mb-10 px-2 leading-relaxed">
                    A 4-digit reset PIN has been sent to <strong>{email}</strong>. Please enter the PIN to continue.
                </p>

                <Button
                    onClick={() => router.push(`${AUTH_ROUTES.VERIFY_PIN}?email=${encodeURIComponent(email)}`)}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-[12px] transition-colors flex items-center justify-center gap-2 text-[14.5px] mb-4 shadow-sm"
                >
                    Enter Reset PIN <ArrowRightIcon size={18} />
                </Button>

                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full bg-[#f2f4f6] hover:bg-[#e8ebf0] text-gray-900 font-bold py-3.5 rounded-[12px] transition-colors flex items-center justify-center gap-2 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 disabled:opacity-50"
                >
                    Resend PIN <RefreshIcon size={18} />
                </button>
                <p className="mt-5 text-[12.5px] text-gray-500 font-medium">
                    Didn't receive it? Check your spam folder.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-[64px] h-[64px] bg-[#e2dfff] text-[#3525cd] rounded-[16px] flex items-center justify-center mb-8 shadow-sm">
                <KeyResetIcon size={32} />
            </div>
            <h2 className="text-[2rem] font-bold text-gray-900 mb-3 tracking-tight">Forgot Password?</h2>
            <p className="text-gray-600 font-medium text-[15px] mb-10 leading-relaxed px-4">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={formik.handleSubmit} className="w-full text-left">
                <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    icon={<MailIcon size={18} />}
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                    className="mb-2"
                />

                <Button
                    type="submit"
                    isLoading={formik.isSubmitting}
                    disabled={!formik.values.email || !!formik.errors.email}
                    className="w-full py-4 mt-6 rounded-[12px] bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center gap-2 text-[15px] font-bold shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:bg-gray-300 disabled:shadow-none disabled:text-gray-500"
                >
                    Send Reset Link <ArrowRightIcon size={18} />
                </Button>
            </form>

            <div className="mt-10">
                <a href="/auth/login" className="text-[#4F46E5] font-bold text-[14px] tracking-wide flex items-center justify-center gap-2 hover:underline">
                    <span className="rotate-180"><ArrowRightIcon size={16} /></span> Back to Login
                </a>
            </div>
        </div>
    );
}
