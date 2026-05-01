'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import PortalHeader from '@/components/portal-property/PortalHeader';
import PropertyHero from '@/components/portal-property/PropertyHero';
import PropertyGallery from '@/components/portal-property/PropertyGallery';
import PropertyStatsBar from '@/components/portal-property/PropertyStatsBar';
import AmenitiesGrid from '@/components/portal-property/AmenitiesGrid';
import NeighborhoodMap from '@/components/portal-property/NeighborhoodMap';
import InquiryFormSection from '@/components/portal-property/InquiryFormSection';
import PortalFooter from '@/components/portal-property/PortalFooter';
import useApi from '@/hooks/useApi';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { Property } from '@/types/properties';

export default function PortalPropertyContainer() {
    const params = useParams();
    const propertyId = params.id;

    const { 
        data: property, 
        loading, 
        error, 
        callApi: fetchProperty 
    } = useApi<Property>();

    useEffect(() => {
        if (propertyId) {
            fetchProperty({ 
                method: 'GET', 
                url: `/api/public/property/${propertyId}` 
            });
        }
    }, [propertyId, fetchProperty]);

    if (loading) {
        return <FullPageLoader message="Loading Property..." submessage="Preparing your exclusive property tour." />;
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
                <div className="max-w-md text-center space-y-6">
                    <h1 className="text-4xl font-black text-gray-900">Oops!</h1>
                    <p className="text-gray-500 font-medium">We couldn't find the property you're looking for. It might have been taken off the market or the link might be incorrect.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-[#3525CD] text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#2A1DA6] transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen">
            <PortalHeader />
            <PropertyHero property={property} />
            <PropertyGallery property={property} />
            <PropertyStatsBar property={property} />
            <AmenitiesGrid property={property} />
            <NeighborhoodMap property={property} />
            <InquiryFormSection property={property} />
            <PortalFooter />
        </main>
    );
}
