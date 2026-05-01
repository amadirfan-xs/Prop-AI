"use client";

import React, { useState } from 'react';
import PropertySummary from '@/components/properties/details/PropertySummary';
import ParticipantsSection from '@/components/properties/details/ParticipantsSection';
import ContractStatusSection from '@/components/properties/details/ContractStatusSection';
import MarketingSchedule from '@/components/properties/details/MarketingSchedule';
import RecentActivity from '@/components/properties/details/RecentActivity';
import { Button } from '@/components/common/Button';
import { useRouter, usePathname } from 'next/navigation';
import InviteParticipantModal from '@/components/contracts/modals/InviteParticipantModal';
import { PropertyService } from '@/services/property.service';
import apiClient from '@/networking/apiClient';
import { Property } from '@/types/properties';
import { useAuth } from '@/context/AuthContext';
import { getPermissions } from '@/lib/config/permissions';
import { PageHeader } from '@/components/common/PageHeader';
import { getPropertyBreadcrumbs } from '@/lib/utils/breadcrumbs';

interface PropertyDetailsContainerProps {
    propertyId: string;
}

export default function PropertyDetailsContainer({ propertyId }: PropertyDetailsContainerProps) {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [property, setProperty] = useState<Property | null>(null);
    const [versions, setVersions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const pathname = usePathname();
    const isOrg = pathname.startsWith('/org');

    const { primaryRole } = useAuth();
    const permissions = getPermissions(primaryRole || undefined);
    const fetchPropertyData = React.useCallback(async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }
        try {
            const [propertyRes, versionsRes] = await Promise.all([
                apiClient.request(PropertyService.getPropertyById(Number(propertyId))),
                apiClient.request(PropertyService.listContractVersions(Number(propertyId)))
            ]);
            setProperty(propertyRes.data?.data || null);
            setVersions(versionsRes.data?.data || []);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Property not found");
            console.error('Failed to fetch property details or versions', error);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    }, [propertyId]);

    React.useEffect(() => {
        fetchPropertyData();
    }, [fetchPropertyData]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
                <p className="text-gray-500 font-medium">Loading details...</p>
            </div>
        );
    }

    if (!property || errorMessage) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-[32px]">error</span>
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">{errorMessage || "Property not found"}</h3>
                <p className="text-gray-500 max-w-[300px]">The property you are looking for does not exist or you don&apos;t have access.</p>
                <Button className="mt-6 " onClick={() => router.push(isOrg ? '/org/properties' : '/properties')}>Back to Portfolio</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-8">
            <PageHeader 
                items={getPropertyBreadcrumbs(propertyId, property.property_title, undefined, isOrg)}
                title={property.property_title}
                description={`${property.street_address}, ${property.city} ${property.zip_code}`}
                action={
                    <div className="flex items-center gap-3">
                        {permissions.canManageContracts && property.status?.toLowerCase() !== 'completed' && (
                            <Button
                                className='bg-white! border-gray-100! border text-[#4F46E5]! font-black! hover:bg-gray-50!'
                                onClick={() => {
                                    router.push(`${isOrg ? '/org' : ''}/properties/${propertyId}/contracts/create`);
                                }}
                            >
                                <span className="material-symbols-outlined text-[20px]">description</span>
                                <span>Create Purchase Agreement</span>
                            </Button>
                        )}
                        
                        {permissions.canInviteStakeholders && property.status?.toLowerCase() !== 'completed' && (
                            <Button onClick={() => setIsInviteModalOpen(true)}>
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                <span>Add Participants</span>
                            </Button>
                        )}
                    </div>
                }
            />

            <PropertySummary property={property} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column (2/3 width on xl) */}
                <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                    <ParticipantsSection property={property} onAddParticipant={() => setIsInviteModalOpen(true)} />
                    <ContractStatusSection status={property.contract_status} />
                </div>
                {/* Right Column (1/3 width on xl) */}
                <div className="xl:col-span-1 space-y-6 lg:space-y-8">
                    <MarketingSchedule 
                        propertyId={propertyId} 
                        propertyTitle={property?.property_title || ""}
                        propertyDescription={property?.property_description || ""}
                        schedule={property?.marketing_schedule || []} 
                        propertyImages={property?.property_media || []}
                        propertyStatus={property.status}
                        onSuccess={() => fetchPropertyData(false)}
                    />
                    <RecentActivity propertyId={propertyId} activities={property.recent_activities} />
                </div>
            </div>

            <InviteParticipantModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                propertyId={Number(propertyId)}
                hasVersions={versions.length > 0}
                consensusStats={versions.length > 0 ? versions[0].consensusStats : null}
                onSuccess={() => fetchPropertyData(false)}
            />
        </div>
    );
}
