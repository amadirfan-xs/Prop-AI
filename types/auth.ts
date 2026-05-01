export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    message: string;
    error: string;
    details?: any;
}

export interface AuthResponse {
    accessToken: string;
    isTempPasswordUsed?: boolean;
}

export interface SignupResponse {
    accessToken: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    profilePictureUrl: string | null;
    primaryRole: number;
    roles: number[];
    phoneNumber?: string | null;
    address?: string | null;
    calendlyUrl?: string | null;
    currentSubscription?: {
        id: number;
        packageId: number;
        status: string;
        packageName: string;
        isCurrent: boolean;
        startDate?: string;
        endDate?: string;
        package: {
            id: number;
            name: string;
            priceDisplay: string;
            priceValue: string;
            features: any[];
        };
    } | null;
    organizationId?: number | null;
    organization?: {
        id: number;
        name: string;
        logoUrl: string | null;
        plan?: string;
        headquarters?: string;
        taxId?: string;
        websiteUrl?: string;
        contactEmail?: string;
        contactName?: string;
        contactPhone?: string;
    } | null;
    organizationSubscription?: {
        id: number;
        packageName: string;
        status: string;
    } | null;
    isOrgOwner?: boolean;
    isAuthorizedSigner?: boolean;
    isTempPasswordUsed?: boolean;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
}

export interface ForgotPasswordFormValues {
    email: string;
}

export interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

export interface VerifyPinFormValues {
    resetPIN: string;
}

export interface ChangeTempPasswordFormValues {
    newPassword: string;
    confirmPassword: string;
}
