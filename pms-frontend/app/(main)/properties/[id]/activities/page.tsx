"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/common/Button";
import { PropertyService } from "@/services/property.service";
import apiClient from "@/networking/apiClient";
import { PageHeader } from "@/components/common/PageHeader";
import { getPropertyBreadcrumbs } from "@/lib/utils/breadcrumbs";
import { TimelineItem } from "@/components/properties/TimelineItem";
import { getActivityStyles } from "@/utils/style-mappers";
import { formatDateTime } from "@/utils/formatter";

export default function PropertyActivitiesPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [propertyTitle, setPropertyTitle] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, activityRes] = await Promise.all([
          apiClient.request(PropertyService.getPropertyById(Number(propertyId))),
          apiClient.request(PropertyService.getActivities(Number(propertyId)))
        ]);
        
        setPropertyTitle(propRes.data?.data?.property_title || "");
        setActivities(activityRes.data?.data || []);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || "Property not found");
        console.error("Failed to fetch activity history", error);
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
        <p className="text-gray-500 font-medium">Loading activity history...</p>
      </div>
    );
  }

  if ((errorMessage || !propertyTitle) && !isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 shadow-inner">
            <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h3 className="text-[20px] font-bold text-gray-900 mb-4 max-w-sm">
          {errorMessage || "Property not found"}
        </h3>
        <Button onClick={() => router.back()} className="">
          Back to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <PageHeader 
        items={getPropertyBreadcrumbs(propertyId, propertyTitle, 'Activity')}
        title="Activity Timeline"
        description={`History for ${propertyTitle}`}
      />

      <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100 relative">
        <div className="absolute left-[59px] top-12 bottom-12 w-px bg-gray-100" />

        <div className="space-y-12">
          {activities.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-medium">
                No activities recorded yet.
              </p>
            </div>
          ) : (
            activities.map((item, idx) => {
              const styles = getActivityStyles(item.event);
              return (
                <TimelineItem
                  key={idx}
                  icon={styles.icon}
                  iconBgClass={styles.bg}
                  iconColorClass={styles.color}
                  title={item.event}
                  date={formatDateTime(item.created_at)}
                  description={item.description}
                  actorName={item.actor_name}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
