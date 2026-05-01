"use client";

import { useState, useEffect } from 'react';
import PricingCard from '@/components/pricing/PricingCard';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/networking/apiClient';
import { toastService } from '@/utils/toastService';

export default function PricingContainer() {
    const { user, activeRole } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await apiClient.get('/api/pricing/packages');
                const rawPackages = response.data?.data || [];
                
                // Define the desired sort order
                const sortOrder = ['Free Plan', 'Premium Plan', 'Organizational Plan'];
                const sortedPackages = rawPackages.sort((a: any, b: any) => {
                    const indexA = sortOrder.indexOf(a.name);
                    const indexB = sortOrder.indexOf(b.name);
                    // Use a large number if not found to push to the end
                    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                });
                
                setPackages(sortedPackages);
            } catch (error) {
                console.error('Failed to fetch pricing packages', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleSubscribe = async (pkg: any) => {
        if (pkg.isOrganizational) {
            window.open('/upgrade-request', '_blank');
            return;
        }

        if (activeRole !== 1 && pkg.name !== 'Free Plan') {
            toastService.error('Only Independent Agents can subscribe to individual plans.');
            return;
        }

        let toastId = '';
        try {
            if (pkg.priceValue === 0 || pkg.name === 'Free Plan') {
                toastId = toastService.loading('Activating Free Plan...');
                await apiClient.post('/api/pricing/subscribe-free', {
                    packageId: pkg.id
                });
                toastService.success('Free Plan activated successfully!');
                toastService.dismiss(toastId);
                // Redirect or refresh
                window.location.reload(); 
                return;
            }

            toastId = toastService.loading('Redirecting to secure payment...');
            const response = await apiClient.post('/api/pricing/create-checkout-session', {
                packageId: pkg.id
            });
            
            const session = response.data?.data;
            if (session?.url) {
                window.location.href = session.url;
            } else {
                toastService.error('Failed to create payment session');
                toastService.dismiss(toastId);
            }
        } catch (error: any) {
            toastService.dismiss(toastId);
            toastService.error(error.response?.data?.message || 'Failed to initiate subscription');
        }
    };

    const userPackageId = user?.currentSubscription?.packageId;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-sans mb-[-20px]">
            <main className="grow mx-auto px-6 lg:px-10 py-16 lg:py-24 text-center">
                <div className="max-w-full mx-auto space-y-8 mb-20 lg:mb-28">
                    <h1 className="text-[48px] lg:text-[72px] font-black text-gray-900 tracking-tight leading-[1.05]">
                        Simple plans for smart properties
                    </h1>
                    <p className="text-[18px] lg:text-[22px] font-bold text-gray-500/70 leading-relaxed px-4 max-w-175 mx-auto font-medium">
                        Scale your property portfolio with the Architect platform. Choose a plan that matches your current management needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 items-stretch max-w-full mx-auto pb-20">
                    {packages.map((pkg, index) => (
                        <PricingCard 
                            key={index} 
                            planName={pkg.name}
                            price={pkg.priceDisplay}
                            description={pkg.description}
                            features={pkg.features}
                            buttonText={pkg.buttonText}
                            isPremium={pkg.isPremium}
                            isOrganizational={pkg.isOrganizational}
                            isCurrentPlan={pkg.id === userPackageId}
                            onButtonClick={() => handleSubscribe(pkg)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
