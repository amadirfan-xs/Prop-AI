"use client";

import UpgradeOrgPlanContainer from '@/components/pricing/onboarding/UpgradeOrgPlanContainer';
import { useRouter } from 'next/navigation';
import apiClient from '@/networking/apiClient';
import { toastService } from '@/utils/toastService';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { UpgradeHeader } from '@/components/upgrade/UpgradeHeader';

export default function StandaloneUpgradeRequestPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            toastService.error('Please log in to submit an upgrade request.');
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const handleOrgUpgradeSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true);
            await apiClient.post('/api/organization/upgrade', {
                ...formData,
                plan: 'ORGANIZATIONAL'
            });
            
            toastService.success('Upgrade Request Submitted! Our team will contact you soon.');
            
            setTimeout(() => {
                if (window.opener) {
                    window.close(); 
                } else {
                    router.push('/pricing');
                }
            }, 2500);
        } catch (error: any) {
            console.error('Failed to submit upgrade request', error);
            const message = error?.response?.data?.message || 'Failed to submit request. Please try again.';
            toastService.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <FullPageLoader message="Validating account status..." />;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            <UpgradeHeader user={user} />

            <div className="py-12">
                <UpgradeOrgPlanContainer
                    onCancel={() => window.close()}
                    onSubmit={handleOrgUpgradeSubmit}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}
