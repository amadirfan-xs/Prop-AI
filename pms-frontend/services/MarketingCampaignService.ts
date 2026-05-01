import { AxiosRequestConfig } from 'axios';

export const MarketingCampaignService = {
  getCampaigns: (): AxiosRequestConfig => ({
    url: '/api/marketing-campaigns',
    method: 'GET',
  }),

  getTemplates: (): AxiosRequestConfig => ({
    url: '/api/marketing-templates',
    method: 'GET',
  }),

  getCampaignById: (id: number): AxiosRequestConfig => ({
    url: `/api/marketing-campaigns/${id}`,
    method: 'GET',
  }),

  createCampaign: (data: any): AxiosRequestConfig => ({
    url: '/api/marketing-campaigns',
    method: 'POST',
    data,
  }),
};
