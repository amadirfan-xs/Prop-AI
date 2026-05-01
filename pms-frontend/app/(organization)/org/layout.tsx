import React from 'react';
import OrganizationLayout from '@/components/org-dashboard/OrganizationLayout';

export default function RootOrgLayout({ children }: { children: React.ReactNode }) {
    return <OrganizationLayout>{children}</OrganizationLayout>;
}
