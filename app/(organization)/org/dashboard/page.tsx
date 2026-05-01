"use client";

import React, { useEffect } from 'react';
import OrganizationDashboardContainer from "@/components/org-dashboard/OrganizationDashboardContainer";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function OrgDashboardPage() {
    const { activeRole, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && activeRole !== 4 && activeRole !== 5) {
            router.push('/');
        }
    }, [activeRole, isLoading, router]);

    if (isLoading || (activeRole !== 4 && activeRole !== 5)) {
        return null;
    }

    return <OrganizationDashboardContainer />;
}
