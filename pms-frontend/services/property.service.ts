import { AxiosRequestConfig } from 'axios';
import { CreateSocialPostPayload, SocialDestination } from '@/types';

export class PropertyService {
    static listMyProperties(params?: any): AxiosRequestConfig {
        return {
            url: '/api/property/my-properties',
            method: 'GET',
            params,
        };
    }

    static getPropertyById(propertyId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}`,
            method: 'GET',
        };
    }

    static getActivities(propertyId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/activities`,
            method: 'GET',
        };
    }

    static getMarketingSchedule(propertyId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/marketing`,
            method: 'GET',
        };
    }

    static createProperty(data: any): AxiosRequestConfig {
        return {
            url: '/api/property',
            method: 'POST',
            data,
        };
    }

    static uploadMedia(propertyId: number, files: File[]): AxiosRequestConfig {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        return {
            url: `/api/property/${propertyId}/upload-media`,
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }
    
    static listSocialDestinations(): AxiosRequestConfig {
        return {
            url: '/api/property/social/destinations',
            method: 'GET',
        };
    }

    static createSocialPost(propertyId: number, data: CreateSocialPostPayload): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/social-post`,
            method: 'POST',
            data,
        };
    }

    static inviteStakeholder(propertyId: number, data: any): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/invite-stakeholder`,
            method: 'POST',
            data,
        };
    }

    static resendInvite(propertyId: number, stakeholderId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/stakeholders/${stakeholderId}/resend-invite`,
            method: 'POST',
        };
    }

    static listContractTemplates(): AxiosRequestConfig {
        return {
            url: '/api/property/contract-templates',
            method: 'GET',
        };
    }

    static getContractTemplate(templateId: number): AxiosRequestConfig {
        return {
            url: `/api/property/contract-templates/${templateId}`,
            method: 'GET',
        };
    }

    static uploadPurchaseContract(propertyId: number, data: { file?: File; htmlContent?: string; allowUpdateLatest?: boolean; generatePdf?: boolean }): AxiosRequestConfig {
        const formData = new FormData();
        if (data.file) {
            formData.append('file', data.file);
        }
        if (data.htmlContent) {
            formData.append('htmlContent', data.htmlContent);
        }
        if (data.allowUpdateLatest !== undefined) {
            formData.append('allowUpdateLatest', String(data.allowUpdateLatest));
        }
        if (data.generatePdf !== undefined) {
            formData.append('generatePdf', String(data.generatePdf));
        }

        return {
            url: `/api/property/${propertyId}/purchase-contract`,
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }

    static listContractVersions(propertyId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/purchase-contract/versions`,
            method: 'GET',
        };
    }

    static submitContractDecision(propertyId: number, data: { decision: string; comment?: string }): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/contract/decision`,
            method: 'POST',
            data,
        };
    }

    static getContractVersion(propertyId: number, versionId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/purchase-contract/versions/${versionId}`,
            method: 'GET',
        };
    }

    static generateContractPdf(propertyId: number, versionId: number): AxiosRequestConfig {
        return {
            url: `/api/property/${propertyId}/purchase-contract/versions/${versionId}/generate-pdf`,
            method: 'POST',
        };
    }
}

export default PropertyService;
