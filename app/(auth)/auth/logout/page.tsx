'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import AuthService from '@/services/auth.service';

export default function LogoutPage() {
    const router = useRouter();
    const { callApi } = useApi();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await callApi(AuthService.logout());
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                // Clear any potential local state/storage here if needed
                localStorage.removeItem('user_info');
                // Redirect to login page
                router.push('/auth/login');
                router.refresh();
            }
        };

        performLogout();
    }, [callApi, router]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[15px] font-black text-gray-900 tracking-tight">Signing you out...</p>
        </div>
    );
}
