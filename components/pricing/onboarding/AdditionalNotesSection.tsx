import React from 'react';

export default function AdditionalNotesSection({ formik }: { formik: any }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#3525CD]">
                <span className="material-symbols-outlined text-[24px]">notes</span>
                <h2 className="text-[16px] font-black tracking-tight text-gray-900">Additional Notes</h2>
            </div>

            <div className="space-y-2">
                <textarea
                    name="additionalNotes"
                    placeholder="Tell us about your requirements or custom needs..."
                    rows={4}
                    value={formik.values.additionalNotes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full bg-[#F3F4F7] border-none rounded-xl px-5 py-4 text-[14px] font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#3525CD]/20 transition-all outline-none resize-none"
                />
                {formik.touched.additionalNotes && formik.errors.additionalNotes ? (
                    <p className="text-xs text-red-500 font-bold">{formik.errors.additionalNotes}</p>
                ) : null}
            </div>
        </div>
    );
}
