"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { ShieldIcon } from '@/constants/icons/AuthIcons';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';
import { AuthService } from '@/services/auth.service';
import { toastService } from '@/utils/toastService';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_ROUTES } from '@/constants/auth';

import { VerifyPinFormValues } from '@/types/auth';
import { verifyPinInitialValues, verifyPinSchema } from '@/lib/validations/auth.schema';
import { maskEmail } from '@/utils/auth.helpers';

export default function VerifyPinForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [timer, setTimer] = useState(30);
    const { callApi, error: apiError, loading } = useApi();

    const [pin, setPin] = useState(['', '', '', '']);
    const inputRefs = [
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
    ];

    useEffect(() => {
        if (apiError) {
            toastService.error(apiError);
            if (apiError.includes('Reset PIN has expired')) {
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        }
    }, [apiError, router]);

    useEffect(() => {
        if (!email) {
            router.push(AUTH_ROUTES.FORGOT_PASSWORD);
        }
    }, [email, router]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Sync with formik
        formik.setFieldValue('resetPIN', newPin.join(''));

        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const formik = useFormik<VerifyPinFormValues>({
        initialValues: verifyPinInitialValues,
        validationSchema: verifyPinSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            const finalPin = values.resetPIN;
            if (finalPin.length !== 4) {
                toastService.error('Please enter all 4 digits');
                setSubmitting(false);
                return;
            }

            const data = await callApi(AuthService.verifyPin({
                email,
                resetPIN: finalPin
            }));
            if (data) {
                toastService.success('PIN verified! Please set your new password.');
                router.push(`${AUTH_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&pin=${encodeURIComponent(finalPin)}`);
            }
            setSubmitting(false);
        },
    });

    const handleResend = async () => {
        if (timer > 0) return;
        const data = await callApi(AuthService.forgetPassword({ email }));
        if (data) {
            toastService.success('PIN resent successfully!');
            setTimer(30);
        }
    };

    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-[64px] h-[64px] bg-[#EEF2FF] text-[#4F46E5] rounded-full flex items-center justify-center mb-8 shadow-sm">
                <ShieldIcon size={32} />
            </div>

            <h2 className="text-[2rem] font-bold text-gray-900 mb-3 tracking-tight">Verify OTP</h2>
            <p className="text-gray-500 font-medium text-[16px] mb-10 leading-relaxed px-4 max-w-[380px]">
                Enter the 4-digit code sent to your email<br />
                <span className="text-gray-900 font-bold">({maskEmail(email)})</span>. Code expires in 5 minutes.
            </p>

            <form onSubmit={formik.handleSubmit} className="w-full max-w-[320px]">
                <div className="flex justify-between gap-3 mb-10">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            aria-label={`Digit ${index + 1}`}
                            onChange={(e) => handlePinChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-16 h-20 text-center text-3xl font-bold rounded-xl border-2 transition-all outline-none
                                ${pin[index] ? 'border-[#4F46E5] bg-white ring-4 ring-indigo-50' : 'border-gray-100 bg-gray-50'}`}
                        />
                    ))}
                </div>

                <Button
                    type="submit"
                    isLoading={formik.isSubmitting}
                    className="w-full py-5 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center text-[17px] font-bold shadow-[0_10px_25px_rgba(79,70,229,0.3)] transition-all duration-300 transform active:scale-[0.98]"
                >
                    Verify Code
                </Button>
            </form>

           <div className="mt-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-[14px]">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Resend in {timer}s
                </div>
                <button
                    onClick={handleResend}
                    disabled={timer > 0 || loading}
                    className={`font-extrabold text-[15px] transition-colors ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#4F46E5] hover:text-[#4338CA] hover:underline'
                        }`}
                >
                    Resend Code
                </button>
            </div>
        </div>
    );
}
