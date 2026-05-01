'use client';

import React from 'react';
import { useFormikContext } from 'formik';
import RecipientManager from '@/components/marketing-campaigns/RecipientManager';
import RecipientList from '@/components/marketing-campaigns/RecipientList';

interface Step2Props {
    onAdd: (emails: string[]) => void;
    onRemove: (email: string) => void;
    onClear: () => void;
}

export default function StepRecipientManager({ onAdd, onRemove, onClear }: Step2Props) {
    const { values } = useFormikContext<any>();
    const recipients = values.recipients || [];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            {/* Left: Input */}
            <div className="space-y-12 h-fit">
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
                    <RecipientManager onAdd={onAdd} />
                </div>

                <div className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#3525CD]">info</span>
                        </div>
                        <h4 className="text-[14px] font-black text-gray-900 leading-none">Pro-Tip: CSV Bulk Upload</h4>
                    </div>
                    <p className="text-[12px] font-medium text-gray-500 leading-relaxed">
                        For campaigns larger than 100 recipients, we recommend uploading a CSV file to ensure data integrity and automatic duplicate removal.
                    </p>
                </div>
            </div>

            {/* Right: List */}
            <div className="space-y-8 min-h-[500px]">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Verification List</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black text-[#3525CD]">{recipients.length}</span>
                        <span className="text-[11px] font-bold text-gray-400">Emails Ready</span>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm min-h-[400px]">
                    <RecipientList
                        recipients={recipients}
                        onRemove={onRemove}
                        onClear={onClear}
                    />
                    {recipients.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20 px-8">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-gray-300 text-[32px]">group_add</span>
                            </div>
                            <h4 className="text-[16px] font-black text-gray-900 mb-2">No recipients added yet</h4>
                            <p className="text-[12px] font-medium text-gray-400">Use the form on the left to start building your audience list.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
