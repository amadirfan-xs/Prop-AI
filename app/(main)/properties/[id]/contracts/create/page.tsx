import React, { Suspense } from "react";
import ContractSelectionContainer from "@/components/contracts/ContractSelectionContainer";
import ContractEditorContainer from "@/components/contracts/ContractEditorContainer";

export default async function CreateContractPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id } = await params;
    const { mode, templateId, contractId } = await searchParams;

    const isEditing = mode === 'edit' || !!templateId || !!contractId;
    
    return (
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-10 lg:py-20 min-h-[80vh] flex flex-col justify-center">
            {isEditing ? (
                <Suspense fallback={<div>Loading Editor...</div>}>
                    <ContractEditorContainer />
                </Suspense>
            ) : (
                <ContractSelectionContainer propertyId={id} />
            )}
        </div>
    );
}
