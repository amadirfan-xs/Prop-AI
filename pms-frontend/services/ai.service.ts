import { AxiosRequestConfig } from 'axios';

export class AiService {
    static generateDescription(data: {
        title: string;
        propertyType: string;
        beds: number;
        baths: number;
        sqft: number;
        price: string;
        city: string;
        highlights?: string[];
    }): AxiosRequestConfig {
        return {
            url: '/api/ai/generate-description',
            method: 'POST',
            data,
        };
    }
}

export default AiService;
