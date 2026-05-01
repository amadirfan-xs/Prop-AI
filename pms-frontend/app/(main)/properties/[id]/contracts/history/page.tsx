"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import PropertyService from "@/services/property.service";
import { ContractVersion } from "@/types/properties";
import { PageHeader } from "@/components/common/PageHeader";
import { getPropertyBreadcrumbs } from "@/lib/utils/breadcrumbs";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { RevisionCard } from "@/components/properties/RevisionCard";

export default function ContractHistoryPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const {
    data: versions,
    loading,
    callApi: fetchVersions,
  } = useApi<ContractVersion[]>();

  useEffect(() => {
    if (propertyId) {
      fetchVersions(PropertyService.listContractVersions(Number(propertyId)));
    }
  }, [propertyId, fetchVersions]);

  if (loading) return <FullPageLoader message="Loading Audit Logs..." />;

  return (
    <div className="max-w-[1000px] mx-auto py-10 px-6">
      <PageHeader
        items={[
          ...getPropertyBreadcrumbs(propertyId, "Property"),
          { label: "Contracts", href: `/properties/${propertyId}/contracts` },
          { label: "Audit History", href: "#" },
        ]}
        title="Contract Audit History"
        description="Complete chronological log of all revisions and stakeholder decisions."
      />

      <div className="mt-12 relative flex flex-col space-y-12">
        <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-gray-100 hidden md:block" />

        {versions?.map((version, index) => (
          <RevisionCard 
            key={version.id} 
            version={version} 
            revNumber={versions.length - index} 
          />
        ))}
      </div>
    </div>
  );
}
