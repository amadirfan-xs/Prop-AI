import { Input } from '@/components/common/Input';
import React from 'react';

export default function PrimaryContactSection({ formik }: { formik: any }) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 text-[#3525CD]">
                <span className="material-symbols-outlined text-[24px]">person</span>
                <h2 className="text-[16px] font-black tracking-tight text-gray-900">Primary Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Full Name"
                    name="contactName"
                    placeholder="John Doe"
                    readOnly
                    value={formik.values.contactName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactName && formik.errors.contactName}
                    className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
                    required
                    />
                <Input
                    label="Email Address"
                    name="contactEmail"
                    type="email"
                    readOnly
                    placeholder="john@brokerage.com"
                    value={formik.values.contactEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactEmail && formik.errors.contactEmail}
                    className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Phone Number"
                    name="contactPhone"
                    type="tel"
                    readOnly
                    placeholder="+1 (555) 000-0000"
                    value={formik.values.contactPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactPhone && formik.errors.contactPhone}
                    className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
                    required
                    />
                <Input
                    label="Job Title / Role"
                    name="contactJobTitle"
                    placeholder="Principal Broker / CEO"
                    readOnly
                    value={formik.values.contactJobTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.contactJobTitle && formik.errors.contactJobTitle}
                    className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
                    required
                />
            </div>
        </div>
    );
}
