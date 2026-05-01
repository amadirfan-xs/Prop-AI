"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import {
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
} from "@/constants/icons/AuthIcons";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";
import { useApi } from "@/hooks/useApi";
import { APP_ROUTES } from "@/constants/auth";
import { useAuth } from "@/context/AuthContext";

import { ChangeTempPasswordFormValues } from "@/types/auth";
import {
  changeTempPasswordInitialValues,
  changeTempPasswordSchema,
} from "@/lib/validations/auth.schema";

export default function ChangeTempPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { callApi, loading, error: apiError } = useApi();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);

  const formik = useFormik<ChangeTempPasswordFormValues>({
    initialValues: changeTempPasswordInitialValues,
    validationSchema: changeTempPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = await callApi(
        AuthService.changeTempPassword({
          newPassword: values.newPassword,
        }),
      );

      if (data) {
        toast.success("Password changed successfully!");
        await refreshUser();
        router.push(APP_ROUTES.DASHBOARD);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Set New Password
        </h2>
        <p className="text-gray-500 font-medium text-lg">
          Your temporary password must be changed.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          label="New Password"
          id="newPassword"
          name="newPassword"
          type={showNewPassword ? "text" : "password"}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="*************"
          icon={<LockIcon />}
          className={
            !showNewPassword
              ? "font-bold text-gray-600 tracking-widest"
              : "font-bold text-gray-600"
          }
          inputStyle={!showNewPassword ? { letterSpacing: "0.2em" } : {}}
          rightIcon={
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          }
          error={
            (formik.touched.newPassword && formik.errors.newPassword) ||
            formik.values.newPassword === "invalid-password" ? (
              <>
                <AlertCircleIcon size={14} />
                Password must be more then 8 characters and must contain at
                least one uppercase letter, one lowercase letter, and one number
              </>
            ) : undefined
          }
        />

        <Input
          label="Confirm New Password"
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="*************"
          icon={<LockIcon />}
          className={
            !showConfirmPassword
              ? "font-bold text-gray-600 tracking-widest"
              : "font-bold text-gray-600"
          }
          inputStyle={!showConfirmPassword ? { letterSpacing: "0.2em" } : {}}
          rightIcon={
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          }
          error={
            (formik.touched.confirmPassword && formik.errors.confirmPassword) ||
            formik.values.confirmPassword === "invalid-password" ? (
              <>
                <AlertCircleIcon size={14} />
                confirmPassword and newPassword must be same
              </>
            ) : undefined
          }
        />

        <Button className="w-full" type="submit" isLoading={loading}>
          Update Password
        </Button>
      </form>
    </div>
  );
}
