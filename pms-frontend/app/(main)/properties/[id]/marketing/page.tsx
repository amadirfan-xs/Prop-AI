"use client";

import  { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { PropertyService } from '@/services/property.service';
import apiClient from '@/networking/apiClient';
import { PageHeader } from '@/components/common/PageHeader';
import { getPropertyBreadcrumbs } from '@/lib/utils/breadcrumbs';
import { TimelineItem } from "@/components/properties/TimelineItem";
import { getPlatformIcon, getMarketingStatusStyles } from "@/utils/style-mappers";
import { formatDateTime } from "@/utils/formatter";

export default function MarketingSchedulePage() {
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id as string;
    
    const [property, setProperty] = useState<any>(null);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propRes, marketingRes] = await Promise.all([
                    apiClient.request(PropertyService.getPropertyById(Number(propertyId))),
                    apiClient.request(PropertyService.getMarketingSchedule(Number(propertyId)))
                ]);
                
                setProperty(propRes.data?.data || null);
                setSchedule(marketingRes.data?.data || []);
            } catch (error) {
                console.error('Failed to fetch marketing schedule', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [propertyId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
                <p className="text-gray-500 font-medium">Loading marketing schedule...</p>
            </div>
        );
    }

    if (!property && !isLoading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
                <h3 className="text-[20px] font-bold text-gray-900 mb-2">Property not found</h3>
                <Button onClick={() => router.push('/properties')}>Back to Portfolio</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <PageHeader 
                items={getPropertyBreadcrumbs(propertyId, property?.property_title || '', 'Marketing')}
                title="Marketing Schedule"
                description={`Full schedule for ${property?.property_title || ''}`}
            />

            <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100 relative">
                <div className="absolute left-[59px] top-12 bottom-12 w-px bg-gray-100" />

                <div className="space-y-12">
                    {schedule.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-medium">No marketing tasks scheduled yet.</p>
                        </div>
                    ) : (
                        [...schedule].sort((a, b) => b.id - a.id).map((item, idx) => {
                            const styles = getMarketingStatusStyles(item.status);
                            return (
                                <TimelineItem
                                    key={item.id || idx}
                                    icon={getPlatformIcon(item.platform)}
                                    iconBgClass={styles.bg}
                                    iconColorClass={styles.text}
                                    title={`${item.platform} Post`}
                                    date={formatDateTime(item.scheduled_for || item.created_at)}
                                    status={item.status}
                                    statusBgClass={styles.bg}
                                    statusTextClass={styles.text}
                                    image={property?.property_media?.[0]?.signedUrl}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
