'use client';

import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import QRStatsCard from '@/components/qr-codes/QRStatsCard';
import PropertySelector from '@/components/qr-codes/PropertySelector';
import PropertyPreviewCard from '@/components/qr-codes/PropertyPreviewCard';
import QRPreviewSidebar from '@/components/qr-codes/QRPreviewSidebar';
import useApi from '@/hooks/useApi';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { Property, PropertyQrStats } from '@/types/properties';

const validationSchema = Yup.object().shape({
    selectedPropertyId: Yup.number().required('Please select a property'),
});

interface QRFormValues {
    selectedPropertyId: number | null;
}

interface PaginatedProperties {
    items: Property[];
    total: number;
}

export default function QRManagerContainer() {
    // API for fetching my properties
    const { 
        data: propertiesData, 
        loading: propertiesLoading, 
        callApi: fetchProperties 
    } = useApi<PaginatedProperties>();

    // API for fetching QR stats
    const { 
        data: statsData, 
        callApi: fetchStats 
    } = useApi<PropertyQrStats>();

    useEffect(() => {
        fetchProperties({ method: 'GET', url: '/api/property/my-properties' });
    }, [fetchProperties]);

    // Extract items array from the paginated response structure
    const properties = propertiesData?.items || [];
    const stats: PropertyQrStats = statsData || { totalScans: 0, latestScans: [] };

    if (propertiesLoading) {
        return <FullPageLoader message="Loading Properties..." submessage="Preparing your QR management dashboard." />;
    }

    if (properties.length === 0) {
        return (
            <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 text-center">
                <h1 className="text-[28px] font-black text-gray-900 mb-4">No Properties Found</h1>
                <p className="text-gray-500">Please add a property first to generate QR codes.</p>
            </div>
        );
    }

    return (
        <Formik<QRFormValues>
            initialValues={{ selectedPropertyId: properties[0]?.id || null }}
            validationSchema={validationSchema}
            onSubmit={() => {}}
            enableReinitialize={true} // Allow initial values to update once properties load
        >
            {({ values }) => {
                // Effect to fetch stats when property selection changes
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    if (values.selectedPropertyId) {
                        fetchStats({ 
                            method: 'GET', 
                            url: `/api/property/${values.selectedPropertyId}/qr-stats` 
                        });
                    }
                }, [values.selectedPropertyId]);

                // properties is now guaranteed to be an array or empty array
                const selectedProperty = properties.find((p: Property) => p.id === values.selectedPropertyId) || null;

                return (
                    <Form className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
                        <div className="pb-10">
                            <h1 className="text-[28px] md:text-[40px] font-black text-gray-900 tracking-tight">Property QR Code</h1>
                            <p className="text-[14px] md:text-[16px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                                Generate and share QR codes for instant property access. Streamline visits with secure, automated entry tracking.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Main Content */}
                            <div className="flex-1 space-y-12">
                                <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-10">
                                    <PropertySelector
                                        properties={properties}
                                        name="selectedPropertyId"
                                    />
                                    <PropertyPreviewCard property={selectedProperty} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-8">
                                    <QRStatsCard
                                        label="Total Scans"
                                        value={stats.totalScans?.toLocaleString() || '0'}
                                        trend="+Real-time"
                                    />
                                    <QRStatsCard
                                        label="Latest Location"
                                        value={stats.latestScans && stats.latestScans[0]?.city ? stats.latestScans[0].city : 'No Data'}
                                        trend="Most Recent"
                                    />
                                </div>

                            </div>

                            {/* Sidebar Preview */}
                            <div className="w-full lg:w-[450px]">
                                <QRPreviewSidebar property={selectedProperty} />
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}
