import { AxiosRequestConfig } from 'axios';

export class AuthService {
    static login<T>(data: T): AxiosRequestConfig {
        return {
            url: '/api/auth/login',
            method: 'POST',
            data,
        };
    }

    static signup(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/signup',
            method: 'POST',
            data,
        };
    }

    static changeTempPassword(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/change-temp-password',
            method: 'POST',
            data,
        };
    }

    static logout(): AxiosRequestConfig {
        return {
            url: '/api/auth/logout',
            method: 'POST',
        };
    }

    static forgetPassword(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/forget-password',
            method: 'POST',
            data,
        };
    }

    static verifyPin(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/verify-pin',
            method: 'POST',
            data,
        };
    }

    static resendPin(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/resend-pin',
            method: 'POST',
            data,
        };
    }

    static resetPassword(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/new-password',
            method: 'POST',
            data,
        };
    }

    static getMe(): AxiosRequestConfig {
        return {
            url: '/api/auth/me',
            method: 'POST',
        };
    }

    static updatePrimaryRole(userTypeId: number): AxiosRequestConfig {
        return {
            url: '/api/auth/profile/primary-role',
            method: 'PATCH',
            data: { userTypeId },
        };
    }

    static changePassword(data: any): AxiosRequestConfig {
        return {
            url: '/api/auth/change-password',
            method: 'POST',
            data,
        };
    }
}

export default AuthService;
