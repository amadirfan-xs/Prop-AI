import { Input } from "@/components/common/Input";
import React from "react";

export default function BrandingSection({ formik }: { formik: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-[#3525CD]">
        <span className="material-symbols-outlined text-[24px]">palette</span>
        <h2 className="text-[16px] font-black tracking-tight text-gray-900">
          Branding Requirements
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2 items-start">
        <div className="space-y-2 col-span-4">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">
            Logo URL
          </label>
          <Input
            label=""
            name="logoUrl"
            placeholder="https://example.com/logo.png"
            value={formik.values.logoUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
          />
          <p className="text-[10px] text-gray-400 font-medium">
            Link to your brokerage logo (SVG or PNG preferred)
          </p>
        </div>

        <div className="space-y-3 col-span-2">
          <label className="text-xs font-black uppercase tracking-wider text-gray-400">
            Brand Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="primaryColor"
              value={formik.values.primaryColor || "#3525CD"}
              onChange={formik.handleChange}
              className="w-full h-14 rounded-xl cursor-pointer shadow-md shadow-indigo-100 border border-black/5 p-1 bg-white"
            />
          </div>
        </div>
      </div>

      <Input
        label="Website URL"
        name="websiteUrl"
        type="url"
        placeholder="https://www.yourbrokerage.com"
        value={formik.values.websiteUrl}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.websiteUrl && formik.errors.websiteUrl}
        className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
      />
    </div>
  );
}
