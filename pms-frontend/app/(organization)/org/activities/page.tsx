"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { OrganizationDashboardService } from "@/services/organization-dashboard.service";
import { PageHeader } from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { formatDateTime } from "@/utils/formatter";
import { TimelineItem } from "@/components/properties/TimelineItem";
import { getActivityStyles } from "@/utils/style-mappers";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/common/Input";

export default function GlobalOrgActivitiesPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { callApi, data, loading, error } = useApi<any>();

    useEffect(() => {
        callApi(OrganizationDashboardService.getActivities({ page, limit, search: debouncedSearch }));
    }, [callApi, page, limit, debouncedSearch]);

    if (loading && page === 1) return <FullPageLoader message="Fetching organizational event logs..." />;

    const activities = data?.items || [];
    const total = data?.meta?.totalItems || 0;

    const breadcrumbs = [
        { label: 'Dashboard', href: '/org/dashboard' },
        { label: 'Organization Activity', href: '/org/activities' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <PageHeader 
                items={breadcrumbs}
                title="Global Activity Stream"
                description="Consolidated history across all organizational assets and team members."
            />

            <div className="bg-white rounded-[40px] p-8 lg:p-14 shadow-sm border border-gray-100 relative min-h-[500px]">
                {/* Search Bar */}
                <div className="mb-10 max-w-md">
                    <Input 
                        label="Search Activities"
                        hideLabel={true}
                        placeholder="Search activities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<span className="material-symbols-outlined">search</span>}
                    />
                </div>

                {/* Vertical line connector */}
                <div className="absolute left-[59px] top-[140px] bottom-14 w-px bg-gray-50" />

                <div className="space-y-12">
                    {activities.length === 0 && !loading ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-gray-300 text-[32px]">history</span>
                            </div>
                            <p className="text-gray-400 font-medium">
                                No organizational activities recorded yet.
                            </p>
                        </div>
                    ) : (
                        activities.map((item: any, idx: number) => {
                            const styles = getActivityStyles(item.event);
                            const finalDescription = item.propertyName 
                                ? `${item.description} on ${item.propertyName}`
                                : item.description;

                            return (
                                <TimelineItem
                                    key={item.id || idx}
                                    icon={styles.icon}
                                    iconBgClass={styles.bg}
                                    iconColorClass={styles.color}
                                    title={item.event}
                                    date={formatDateTime(item.timestamp)}
                                    description={finalDescription}
                                    actorName={item.actorName}
                                />
                            );
                        })
                    )}
                </div>

                <div className="mt-16">
                    <Pagination 
                        currentPage={page}
                        totalItems={total}
                        itemsPerPage={limit}
                        onPageChange={setPage}
                        onItemsPerPageChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
