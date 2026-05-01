import { Input } from '@/components/common/Input';
import React from 'react';

export default function OrgSizeSection({ formik }: { formik: any }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#3525CD]">
                <span className="material-symbols-outlined text-[24px]">groups</span>
                <h2 className="text-[16px] font-black tracking-tight text-gray-900">Organization Size</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#F3F4F7] rounded-xl px-5 py-2 space-y-2">
                    <Input 
                        className="border-none p-0 m-0 bg-transparent text-[24px] font-black text-[#3525CD]" 
                        name="numAgents"
                        type="number"
                        value={formik.values.numAgents} 
                        onChange={formik.handleChange} 
                        label="Agents" 
                    />
                </div>
                <div className="bg-[#F3F4F7] rounded-xl px-5 py-2 space-y-2">
                    <Input 
                        className="border-none p-0 m-0 bg-transparent text-[24px] font-black text-[#3525CD]" 
                        name="numListings"
                        type="number"
                        value={formik.values.numListings} 
                        onChange={formik.handleChange} 
                        label="Listings" 
                    />
                </div>
            </div>
            {(formik.touched.numAgents && formik.errors.numAgents) || (formik.touched.numListings && formik.errors.numListings) ? (
                <p className="text-[12px] font-bold text-red-500">Please provide valid organization capacity numbers.</p>
            ) : null}
        </div>
    );
}
