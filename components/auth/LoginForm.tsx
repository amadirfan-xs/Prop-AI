"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
} from "@/constants/icons/AuthIcons";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import apiClient from "@/networking/apiClient";
import AuthService from "@/services/auth.service";
import { useApi } from "@/hooks/useApi";
import { AUTH_ROUTES, APP_ROUTES } from "@/constants/auth";
import { LoginFormValues, AuthResponse } from "@/types/auth";
import { loginInitialValues, loginSchema } from "@/lib/validations/auth.schema";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { callApi, error: apiError } = useApi<AuthResponse>();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);

  const formik = useFormik<LoginFormValues>({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const tempData = {
        email: values.email.trim(),
        password: values.password.trim(),
      };

      const data = await callApi(AuthService.login(tempData));

      if (data) {
        toast.success("Login successful!");
        const userData = await refreshUser();
        if (data.isTempPasswordUsed) {
          router.replace(AUTH_ROUTES.CHANGE_TEMP_PASSWORD);
        } else {
          const role = userData?.primaryRole;
          if (role === 4) {
            router.replace(APP_ROUTES.ORG_DASHBOARD);
          } else {
            router.replace(APP_ROUTES.DASHBOARD);
          }
        }
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {apiError && (
        <div className="mb-14 flex items-start gap-3 bg-[#fceceb] border border-[#f5dbdb] text-[#d32f2f] p-4 rounded-lg shadow-sm">
          <div className="mt-0.5">
            <AlertCircleIcon size={18} />
          </div>
          <p className="text-sm font-semibold">{apiError}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          Welcome back
        </h2>
        <p className="text-gray-500 font-medium text-lg">
          Access your portfolio dashboard
        </p>
      </div>

      <form   method="POST" onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          id="email"
          name="email"
          placeholder="abc@gmail.com"
          type="text"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<MailIcon />}
          error={
            (formik.touched.email && formik.errors.email) ||
            formik.values.email === "invalid-email" ? (
              <>
                <AlertCircleIcon size={14} />
                Invalid email format
              </>
            ) : undefined
          }
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          placeholder="**********"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          icon={<LockIcon />}
          className={
            !showPassword
              ? "font-bold text-gray-600 tracking-widest"
              : "font-bold text-gray-600"
          }
          inputStyle={!showPassword ? { letterSpacing: "0.2em" } : {}}
          labelRight={
            <a
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="text-xs font-bold text-[#5b51e0] hover:text-[#493ebf] select-none bg-transparent m-0 p-0 block"
            >
              Forgot Password?
            </a>
          }
          rightIcon={
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          }
          error={
            (formik.touched.password && formik.errors.password) ||
            formik.values.password === "invalid-password" ? (
              <>
                <AlertCircleIcon size={14} />
                password must be 8 characters long
              </>
            ) : undefined
          }
        />

        <Button
          className="w-full"
          type="submit"
          isLoading={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing In..." : "Login"}
        </Button>
      </form>

      <div className="mt-8 text-center text-[13px]">
        <span className="text-gray-500 font-semibold">
          New to the platform?{" "}
        </span>
        <a
          href={AUTH_ROUTES.REGISTER}
          className="font-bold text-[#5b51e0] hover:text-[#493ebf] bg-transparent"
        >
          Create Account
        </a>
      </div>
    </div>
  );
}
