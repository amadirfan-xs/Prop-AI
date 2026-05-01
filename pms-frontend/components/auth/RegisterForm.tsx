"use client";

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon, GoogleIcon, LinkedInIcon } from '@/constants/icons/AuthIcons';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth.service';
import { useApi } from '@/hooks/useApi';
import { RegisterFormValues, SignupResponse } from '@/types/auth';
import { registerInitialValues, registerSchema } from '@/lib/validations/auth.schema';
import { getPasswordStrength } from '@/utils/auth.helpers';
import { AUTH_ROUTES } from '@/constants/auth';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const { callApi, loading, error: apiError } = useApi<SignupResponse>();

    useEffect(() => {
        if (apiError) {
            toast.error(apiError);
        }
    }, [apiError]);

    const formik = useFormik<RegisterFormValues>({
        initialValues: registerInitialValues,
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const data = await callApi(AuthService.signup({
                name: values.fullName,
                email: values.email,
                password: values.password,
            }));

            if (data) {
                toast.success('Registration successful! Welcome aboard.');
                router.push(AUTH_ROUTES.LOGIN);
            }
            setSubmitting(false);
        },
    });

    const strength = getPasswordStrength(formik.values.password);

    return (
        <>
            <div className="mb-8 mt-12 lg:mt-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create your Agent Account</h2>
                <p className="text-gray-500 font-medium text-[15px]">
                    Already have an account? <a href={AUTH_ROUTES.LOGIN} className="text-[#5b51e0] font-bold hover:underline">Sign In</a>
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
                <Input
                    label="Full Name"
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Alexander Sterling"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : undefined}
                    success={!formik.errors.fullName && formik.values.fullName.length > 2 ? 'Name looks great!' : undefined}
                />

                <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="alex.sterling@architect.io"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                    success={!formik.errors.email && formik.values.email.length > 5 ? 'Email is valid.' : undefined}
                />

                <div>
                    <Input
                        label="Password"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                        className={!showPassword ? 'font-bold text-gray-600 tracking-widest' : 'font-bold text-gray-600'}
                        inputStyle={!showPassword ? { letterSpacing: "0.2em" } : {}}
                        labelRight={
                            strength === 4 ? <span className="text-[10px] font-bold text-[#10b981] tracking-widest uppercase">STRONG</span> :
                                strength === 3 ? <span className="text-[10px] font-bold text-[#10b981] tracking-widest uppercase">GOOD</span> :
                                    strength > 0 ? <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase">FAIR</span> : <></>
                        }
                        rightIcon={
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600 bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        }
                    />
                    {formik.values.password.length > 0 && !formik.errors.password && (
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full ${strength >= level ? 'bg-[#10b981]' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Input
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                    success={!formik.errors.confirmPassword && formik.values.confirmPassword.length > 0 ? 'Passwords match.' : undefined}
                    className={!showConfirmPassword ? 'font-bold text-gray-600 tracking-widest' : 'font-bold text-gray-600'}
                    inputStyle={!showConfirmPassword ? { letterSpacing: "0.2em" } : {}}
                    rightIcon={
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    }
                />

                <div className="pt-2 pb-1">
                    <Checkbox
                        id="acceptedTerms"
                        name="acceptedTerms"
                        checked={formik.values.acceptedTerms}
                        onChange={formik.handleChange}
                        label={
                            <>I agree to the <a href="#" className="text-[#5b51e0] hover:underline">Terms of Service</a> and <a href="#" className="text-[#5b51e0] hover:underline">Privacy Policy</a>.</>
                        }
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={formik.isSubmitting}
                    disabled={!formik.values.acceptedTerms}
                    className={`mt-2 w-full ${!formik.values.acceptedTerms || !formik.isValid ? 'bg-[#a3a3a3] hover:bg-[#a3a3a3] cursor-not-allowed text-white shadow-none' : ''}`}
                >
                    Create Account
                </Button>


            </form>
        </>
    );
}
