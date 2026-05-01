"use client";

import React from 'react';
import { Button } from '@/components/common/Button';
import { HTMLPreview } from '@/components/common/HTMLPreview';
import { ContractTemplate } from '@/types/properties';

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: ContractTemplate | null;
    onSelect: (id: number) => void;
}

export function TemplatePreviewModal({ isOpen, onClose, template, onSelect }: TemplatePreviewModalProps) {
    if (!isOpen || !template) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-10">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3525CD] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[28px]">description</span>
                        </div>
                        <div>
                            <h2 className="text-[20px] font-black text-gray-900 leading-tight">{template.name}</h2>
                            <p className="text-gray-400 text-[13px] font-bold uppercase tracking-widest">{template.type}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Preview Body */}
                <div className="flex-1 bg-gray-50 flex justify-center overflow-hidden">
                    <div className="w-full max-w-4xl h-full shadow-inner bg-white">
                        <HTMLPreview html={template.html_content} />
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="hidden sm:block">
                        <p className="text-gray-400 text-[14px]">Verify the terms before generating the final document.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Button 
                            onClick={onClose}
                            className="flex-1 sm:flex-none bg-white! text-gray-500! border-gray-100! border! px-8! hover:bg-gray-50!"
                        >
                            Back
                        </Button>
                        <Button 
                            onClick={() => {
                                onSelect(template.id);
                                onClose();
                            }}
                            className="flex-1 sm:flex-none bg-[#3525CD]! text-white! px-10! shadow-lg! shadow-indigo-100"
                        >
                            Use This Template
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
