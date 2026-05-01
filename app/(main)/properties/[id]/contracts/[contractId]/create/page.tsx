import React, { Suspense } from "react";
import ContractEditorContainer from "@/components/contracts/ContractEditorContainer";

export default function ContractEditorPage() {
    return (
        <Suspense fallback={<div>Loading Editor...</div>}>
            <ContractEditorContainer />
        </Suspense>
    );
}
