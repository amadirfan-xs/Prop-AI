"use client";

import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { TextButton } from '@/components/common/TextButton';

interface RequestChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comment: string) => void;
}

export default function RequestChangesModal({ isOpen, onClose, onSubmit }: RequestChangesModalProps) {
    const [comment, setComment] = React.useState('');

    return (
        <Modal isOpen={isOpen} maxWidth='max-w-2xl' onClose={onClose} title="Request Changes">
            <div className="space-y-8 px-10 py-4">
                <p className="text-[14px] font-medium text-gray-500 text-start leading-relaxed">
                    Please describe the specific sections or terms you would like to modify.
                </p>

                {/* Active Document Context Box */}
                <div className="bg-[#F3F6F9] rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#3525CD] shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">description</span>
                    </div>
                    <div className="text-start">
                        <span className="text-[10px] font-black text-[#3525CD] uppercase tracking-widest">ACTIVE DOCUMENT</span>
                        <p className="text-[14px] font-bold text-gray-900 mt-0.5">Purchase Agreement - Current Version</p>
                    </div>
                </div>

                {/* Feedback Input */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block text-start">
                        REVISION FEEDBACK
                    </label>
                    <textarea
                        className="w-full bg-[#F3F6F9] border-none rounded-2xl p-5 text-[14px] font-medium text-gray-900 min-h-[160px] focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-gray-400"
                        placeholder="Enter your feedback or suggested revisions here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-6 pt-4 border-t border-gray-100">
                    <TextButton
                        onClick={onClose}
                        variant="secondary"
                        className="!text-[14px]"
                    >
                        Cancel
                    </TextButton>
                    <Button
                        onClick={() => {
                            onSubmit(comment);
                            onClose();
                            setComment('');
                        }}
                        disabled={!comment.trim()}
                    >
                        Submit Request
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
