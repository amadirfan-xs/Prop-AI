export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_TEMP_PASSWORD: '/auth/change-temp-password',
    VERIFY_PIN: '/auth/verify-pin',
} as const;

export const APP_ROUTES = {
    DASHBOARD: '/',
    ORG_DASHBOARD: '/org/dashboard',
    PRICING: '/pricing',
    SETTINGS: '/settings',
    BILLING: '/billing',
} as const;
