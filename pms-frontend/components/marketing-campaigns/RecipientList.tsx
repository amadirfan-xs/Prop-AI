'use client';

import React from 'react';

interface RecipientListProps {
    recipients: string[];
    onRemove: (email: string) => void;
    onClear: () => void;
}

export default function RecipientList({ recipients, onRemove, onClear }: RecipientListProps) {
    if (recipients.length === 0) return null;

    return (
        <div className="space-y-6">
            <ListHeader count={recipients.length} onClear={onClear} />
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {recipients.map((email) => (
                    <RecipientItem 
                        key={email} 
                        email={email} 
                        onRemove={() => onRemove(email)} 
                    />
                ))}
            </div>
        </div>
    );
}

// --- Sub-components ---

function ListHeader({ count, onClear }: { count: number, onClear: () => void }) {
    return (
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Added Recipients ({count})
            </h3>
            <button
                onClick={onClear}
                className="text-[11px] font-black text-[#3525CD] uppercase hover:underline"
            >
                Clear All
            </button>
        </div>
    );
}

function RecipientItem({ email, onRemove }: { email: string, onRemove: () => void }) {
    return (
        <div className="flex items-center justify-between h-14 bg-white border border-gray-100 rounded-xl px-6 group hover:border-indigo-100 transition-all shadow-sm">
            <span className="text-[14px] font-bold text-gray-700">{email}</span>
            <button
                onClick={onRemove}
                className="text-gray-300 hover:text-rose-500 transition-colors"
            >
                <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
        </div>
    );
}
