'use client';

import React, { useState, useRef } from 'react';
import { toastService } from '@/utils/toastService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface RecipientManagerProps {
    onAdd: (emails: string[]) => void;
}

export default function RecipientManager({ onAdd }: RecipientManagerProps) {
    return (
        <div className="space-y-8">
            <CSVUploader onAdd={onAdd} />
            <ManualEntry onAdd={onAdd} />
        </div>
    );
}

// --- Sub-components ---

function CSVUploader({ onAdd }: { onAdd: (emails: string[]) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const foundEmails = text.match(emailRegex) || [];
            
            if (foundEmails.length > 0) {
                const uniqueEmails = Array.from(new Set(foundEmails));
                onAdd(uniqueEmails);
                toastService.success(`Imported ${uniqueEmails.length} unique emails successfully!`);
            } else {
                toastService.error("No valid email addresses found in the file.");
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.onerror = () => toastService.error("Failed to read file.");
        reader.readAsText(file);
    };

    return (
        <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Recipient Management</h3>
            <input 
                type="file" 
                accept=".csv,.txt" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleCsvUpload}
            />
            <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="!h-9 !px-4 !bg-indigo-50 !text-[#3525CD] !text-[12px] !font-black !rounded-lg hover:!bg-indigo-100 shadow-none border-none"
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    <span>UPLOAD CSV</span>
                </div>
            </Button>
        </div>
    );
}

function ManualEntry({ onAdd }: { onAdd: (emails: string[]) => void }) {
    const [singleEmail, setSingleEmail] = useState('');
    const [bulkEmails, setBulkEmails] = useState('');

    const handleAddSingle = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (singleEmail && emailRegex.test(singleEmail)) {
            onAdd([singleEmail]);
            setSingleEmail('');
        } else {
            toastService.error("Please enter a valid email address");
        }
    };

    const handleAddBulk = () => {
        const emails = bulkEmails.split(/[\s,]+/).filter(e => e.includes('@'));
        if (emails.length > 0) {
            onAdd(emails);
            setBulkEmails('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-end gap-3">
                <Input
                    label=""
                    placeholder="Add single email..."
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    containerClassName="flex-1"
                />
                <Button
                    onClick={handleAddSingle}
                    className="!w-14 !h-14 !bg-[#3525CD] !text-white !rounded-xl flex !items-center !justify-center hover:!bg-[#2A1DA6] shadow-lg shadow-indigo-100"
                >
                    <span className="material-symbols-outlined">add</span>
                </Button>
            </div>

            <div className="relative">
                <textarea
                    placeholder="Paste bulk emails here (comma separated)..."
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    className="w-full h-32 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl p-6 text-[15px] font-medium text-gray-900 shadow-sm resize-none transition-all outline-none"
                ></textarea>
                {bulkEmails && (
                    <Button
                        variant="secondary"
                        onClick={handleAddBulk}
                        className="absolute bottom-4 right-4 !h-9 !px-4 !bg-indigo-50 !text-[#3525CD] !text-[12px] !font-black !rounded-lg hover:!bg-indigo-100 shadow-none border-none"
                    >
                        ADD BULK
                    </Button>
                )}
            </div>
        </div>
    );
}
