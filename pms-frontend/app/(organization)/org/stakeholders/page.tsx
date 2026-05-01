import React from 'react';
import StakeholdersContainer from '@/components/org-stakeholders/StakeholdersContainer';

export const metadata = {
    title: 'Stakeholders - Indigo Brokerage Admin Console',
    description: 'Manage your pipeline of buyers and sellers across the portfolio.',
};

export default function StakeholdersPage() {
    return <StakeholdersContainer />;
}
