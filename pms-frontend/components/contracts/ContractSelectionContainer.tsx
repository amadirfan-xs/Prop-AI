"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import PropertyService from '@/services/property.service';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';
import { getPermissions } from '@/lib/config/permissions';
import { ContractTemplate, Property } from '@/types/properties';
import { PageHeader } from '@/components/common/PageHeader';
import { getContractsBreadcrumbs } from '@/lib/utils/breadcrumbs';
import { useParams } from 'next/navigation';
import { toastService } from '@/utils/toastService';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { HTMLPreview } from '@/components/common/HTMLPreview';
import { TemplatePreviewModal } from './modals/TemplatePreviewModal';

interface ContractSelectionContainerProps {
    propertyId: string;
}

export default function ContractSelectionContainer({ propertyId }: ContractSelectionContainerProps) {
    const router = useRouter();
    const { primaryRole } = useAuth();
    const [step, setStep] = useState<'type' | 'template'>('type');
    const [previewTemplate, setPreviewTemplate] = useState<ContractTemplate | null>(null);
    const { 
        data: templates, 
        loading: templatesLoading, 
        callApi: fetchTemplatesApi 
    } = useApi<ContractTemplate[]>();

    const {
        data: property,
        callApi: fetchPropertyApi
    } = useApi<Property>();

    const {
        loading: uploading,
        callApi: uploadApi
    } = useApi<any>();

    useEffect(() => {
        if (propertyId) {
            fetchPropertyApi(PropertyService.getPropertyById(Number(propertyId)));
        }
        if (step === 'template') {
            fetchTemplates();
        }
    }, [step, propertyId]);

    const loading = templatesLoading;

    const fetchTemplates = async () => {
        try {
            await fetchTemplatesApi(PropertyService.listContractTemplates());
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            toastService.success('Uploading contract...');
            await uploadApi(PropertyService.uploadPurchaseContract(Number(propertyId), { 
                file,
                generatePdf: false // Already a PDF
            }));
            
            toastService.success('Contract uploaded successfully!');
            router.push(`/properties/${propertyId}/contracts`);
        } catch (error) {
            console.error('Upload failed:', error);
            toastService.error('Failed to upload contract. Please try again.');
        }
    };

    const handleSelectTemplate = (templateId: number) => {
        router.push(`/properties/${propertyId}/contracts/create?templateId=${templateId}`);
    };

    return (
        <div className="max-w-[1200px] mx-auto py-10 lg:py-16 px-6 relative">
            {uploading && <FullPageLoader message="Uploading Contract..." submessage="We are securing your document into the property hub." />}
            <PageHeader 
                items={getContractsBreadcrumbs(propertyId, property?.property_title || 'Property', true)}
                title={step === 'type' ? "Choose Contract Method" : "Select a Template"}
                description={step === 'type' 
                    ? "Select how you want to prepare the Purchase Agreement for this property."
                    : `Pick a verified template for ${property?.property_title || 'this property'}`
                }
                showBackButton={step === 'template'}
                // Override back button behavior for the step transition
                action={step === 'template' ? (
                    <Button 
                        onClick={() => setStep('type')}
                        className="bg-white! text-gray-500! border-gray-100! border! px-6! py-3! hover:bg-gray-50!"
                    >
                        Change Method
                    </Button>
                ) : null}
            />

            {!getPermissions(primaryRole || undefined).canManageContracts && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center p-10 text-center">
                    <div className="max-w-md space-y-4">
                        <span className="material-symbols-outlined text-[64px] text-rose-500">lock</span>
                        <h2 className="text-[24px] font-black text-gray-900">Access Restricted</h2>
                        <p className="text-gray-500 font-medium">Only authorized agents can initiate contract creation.</p>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </div>
                </div>
            )}

            {step === 'type' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Option 1: Digital Builder */}
                        <div 
                            onClick={() => setStep('template')}
                            className="group relative bg-white rounded-[32px] p-10 border-2 border-transparent hover:border-[#4F46E5] shadow-xl shadow-gray-200/50 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-[120px]">edit_note</span>
                            </div>
                            
                            <div className="w-16 h-16 rounded-[20px] bg-indigo-50 text-[#4F46E5] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
                            </div>

                            <h3 className="text-[24px] font-black text-gray-900 mb-4">Smart Builder</h3>
                            <p className="text-gray-500 leading-relaxed mb-10">
                                Create a legally-binding digital contract using our verified templates. Fully editable and mobile-ready.
                            </p>

                            <div className="flex items-center gap-2 text-[#4F46E5] font-black text-[15px] uppercase tracking-widest">
                                Get Started
                                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </div>
                        </div>
 
                        {/* Option 2: PDF Upload */}
                        <label className="group relative bg-white rounded-[32px] p-10 border-2 border-transparent hover:border-gray-900 shadow-xl shadow-gray-200/50 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 block">
                            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
                            
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-[120px]">upload_file</span>
                            </div>

                            <div className="w-16 h-16 rounded-[20px] bg-gray-50 text-gray-900 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-[32px]">upload</span>
                            </div>

                            <h3 className="text-[24px] font-black text-gray-900 mb-4">Upload PDF</h3>
                            <p className="text-gray-500 leading-relaxed mb-10">
                                Already have a signed agreement? Upload the PDF version directly for stakeholder review.
                            </p>

                            <div className="flex items-center gap-2 text-gray-900 font-black text-[15px] uppercase tracking-widest">
                                Upload File
                                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">attach_file</span>
                            </div>
                        </label>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-700">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-50 border-t-[#4F46E5] rounded-full animate-spin"></div>
                            <p className="text-gray-400 font-bold animate-pulse">Loading templates...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(templates || []).map((template) => (
                                <div 
                                    key={template.id}
                                    className="group bg-white rounded-[24px] border border-gray-100 p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col"
                                >
                                    <div 
                                        className="aspect-[3/4] rounded-xl bg-gray-50 mb-6 overflow-hidden relative border border-gray-100 cursor-pointer"
                                        onClick={() => setPreviewTemplate(template)}
                                    >
                                        <HTMLPreview 
                                            html={template.html_content} 
                                            thumbnail 
                                            className="opacity-40 group-hover:opacity-60 transition-opacity" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                                            <Button 
                                                onClick={() => handleSelectTemplate(template.id)}
                                                className="!w-auto !px-6 !py-3 !text-[12px] !font-black !shadow-lg"
                                            >
                                                SELECT
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <h4 className="text-[17px] font-black text-gray-900 mb-2 truncate">{template.name}</h4>
                                    <p className="text-[13px] text-gray-500 leading-relaxed mb-6 line-clamp-2">
                                        {template.description || "Standard industry-approved template."}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{template.type}</span>
                                        <div 
                                            className="flex items-center gap-1 text-gray-400 hover:text-[#3525CD] cursor-pointer transition-colors"
                                            onClick={() => setPreviewTemplate(template)}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            <span className="text-[11px] font-black">Preview</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            <TemplatePreviewModal 
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
                template={previewTemplate}
                onSelect={handleSelectTemplate}
            />
        </div>
    );
}
