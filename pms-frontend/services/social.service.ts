import { AxiosRequestConfig } from "axios";

export interface SocialDestination {
    id: number;
    platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok';
    destinationId: string;
    destinationName: string;
    isDefault: boolean;
}

export interface StartConnectResponse {
    requestId: number;
    authorizationUrl: string;
}

class SocialService {
    listDestinations(): AxiosRequestConfig {
        return {
            url: '/api/property/social/destinations',
            method: 'GET'
        };
    }

    disconnectPlatform(platform: string) {
        return {
            url: `/api/property/social/connect/${platform}`,
            method: 'DELETE'
        };
    }

    startConnect(platform: 'facebook' | 'instagram' | 'linkedin' | 'tiktok'): AxiosRequestConfig {
        return {
            url: '/api/property/social/connect/start',
            method: 'POST',
            data: { platform }
        };
    }

    disconnect(destinationId: number): AxiosRequestConfig {
        return {
            url: `/api/property/social/destinations/${destinationId}`,
            method: 'DELETE'
        };
    }
}

export default new SocialService();
