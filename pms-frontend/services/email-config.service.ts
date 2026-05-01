import { AxiosRequestConfig } from 'axios';

export class EmailConfigService {
    static getConfigs(): AxiosRequestConfig {
        return {
            url: '/api/user-email-configs',
            method: 'GET',
        };
    }

    static createConfig(data: any): AxiosRequestConfig {
        return {
            url: '/api/user-email-configs',
            method: 'POST',
            data,
        };
    }

    static updateConfig(id: number, data: any): AxiosRequestConfig {
        return {
            url: `/api/user-email-configs/${id}`,
            method: 'PATCH',
            data,
        };
    }

    static deleteConfig(id: number): AxiosRequestConfig {
        return {
            url: `/api/user-email-configs/${id}`,
            method: 'DELETE',
        };
    }
}

export default EmailConfigService;
