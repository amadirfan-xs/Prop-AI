import React from 'react';
import PortalPropertyContainer from '@/components/portal-property/PortalPropertyContainer';

export const metadata = {
    title: 'PMS Portal',
    description: 'Explore this architectural masterpiece in Beverly Hills.',
};

export async function generateStaticParams() {
    return [{ id: '1' }];
}

export default function PortalPropertyPage() {
    return <PortalPropertyContainer />;
}
