import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Checkbox } from '@/components/common/Checkbox';
import React from 'react';

interface BrokerageInfoSectionProps {
    formik: any;
}

export default function BrokerageInfoSection({ formik }: BrokerageInfoSectionProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 text-[#3525CD]">
                <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                <h2 className="text-[16px] font-black tracking-tight text-gray-900">Brokerage Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Brokerage Name"
                    name="name"
                    placeholder="Enter formal business name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                />
                <Input
                    label="Registration Number / Tax ID"
                    name="taxId"
                    placeholder="Tax ID or Business License"
                    value={formik.values.taxId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.taxId && formik.errors.taxId}
                />
            </div>

            <TextArea
                label="Headquarters Address"
                name="headquarters"
                placeholder="Street address, Suite, City, Zip"
                rows={2}
                value={formik.values.headquarters}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.headquarters && formik.errors.headquarters}
            />

            <TextArea
                label="Company Description"
                name="companyDescription"
                placeholder="Briefly describe your brokerage..."
                rows={3}
                value={formik.values.companyDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyDescription && formik.errors.companyDescription}
            />

            <div className="grid grid-cols-1 gap-6">
                <Input
                    label="Privacy Policy URL or Content"
                    name="privacyPolicy"
                    placeholder="https://example.com/privacy"
                    className="!bg-[#F3F4F7] !border-none !rounded-xl !py-4"
                    value={formik.values.privacyPolicy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.privacyPolicy && formik.errors.privacyPolicy}
                />
            </div>

            <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50 mt-4">
                <Checkbox
                    label={<span className="font-bold text-gray-700">I am the authorized signer for this organization</span>}
                    name="isAuthorizedSigner"
                    checked={formik.values.isAuthorizedSigner}
                    onChange={(e) => formik.setFieldValue('isAuthorizedSigner', e.target.checked)}
                />
                <p className="text-[12px] text-gray-400 mt-2 ml-8 leading-relaxed">
                    By checking this, you certify that you have the legal authority to sign contracts on behalf of the brokerage.
                </p>
                {formik.touched.isAuthorizedSigner && formik.errors.isAuthorizedSigner && (
                    <p className="text-red-500 text-xs mt-1 ml-8">{formik.errors.isAuthorizedSigner}</p>
                )}
            </div>
        </div>
    );
}
