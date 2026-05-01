'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/auth';
import { AuthService } from '@/services/auth.service';
import apiClient from '@/networking/apiClient';
import { AUTH_ROUTES } from '@/constants/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    activeRole: number | null;
    primaryRole: number | null;
    roles: number[];
    switchRole: (roleId: number) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeRole, setActiveRole] = useState<number | null>(null);
    const [primaryRole, setPrimaryRole] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        try {
            const response = await apiClient.request(AuthService.getMe());
            const userData = response.data?.data;

            if (!userData) throw new Error('Invalid user data');

            setUser(userData);
            const userPrimaryRole = userData.primaryRole || null;
            setPrimaryRole(userPrimaryRole);

            const savedRole = localStorage.getItem('activeRole');
            if (savedRole && userData.roles?.includes(Number(savedRole))) {
                setActiveRole(Number(savedRole));
            } else if (userPrimaryRole && userData.roles?.includes(userPrimaryRole)) {
                setActiveRole(userPrimaryRole);
                localStorage.setItem('activeRole', userPrimaryRole.toString());
            } else if (userData.roles?.length > 0) {
                setActiveRole(userData.roles[0]);
                localStorage.setItem('activeRole', userData.roles[0].toString());
            }
            if (userData.isTempPasswordUsed && pathname !== AUTH_ROUTES.CHANGE_TEMP_PASSWORD) {
                router.push(AUTH_ROUTES.CHANGE_TEMP_PASSWORD);
            }

            return userData;
        } catch (error) {
            setUser(null);
            if (pathname.includes('/dashboard') || pathname === '/') {
                router.push(AUTH_ROUTES.LOGIN);
            }
        } finally {
            setIsLoading(false);
        }
        return null;
    }, [pathname, router]);

    useEffect(() => {
        const isAuthRoute = Object.values(AUTH_ROUTES).some(route => pathname === route);
        if (isAuthRoute) {
            setIsLoading(false);
            return;
        }
        fetchUser();
    }, [fetchUser, pathname]);

    const switchRole = async (roleId: number) => {
        if (user?.roles.includes(roleId)) {
            try {
                // Update primary role on backend
                await apiClient.request(AuthService.updatePrimaryRole(roleId));
                
                // Update local state
                setActiveRole(roleId);
                setPrimaryRole(roleId);
                localStorage.setItem('activeRole', roleId.toString());
                
                // Redirect based on role
                if (roleId === 4) {
                    router.push('/org/dashboard');
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Failed to switch primary role:', error);
            }
        }
    };

    const logout = async () => {
        try {
            await apiClient.request(AuthService.logout());
        } finally {
            setUser(null);
            setActiveRole(null);
            localStorage.removeItem('activeRole');
            router.push(AUTH_ROUTES.LOGIN);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        activeRole,
        primaryRole,
        roles: user?.roles || [],
        switchRole,
        logout,
        refreshUser: fetchUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
