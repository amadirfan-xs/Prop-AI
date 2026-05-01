import { AxiosRequestConfig } from 'axios';

export class OrganizationDashboardService {
  static getStats(): AxiosRequestConfig {
    return {
      url: '/api/organization/dashboard/stats',
      method: 'GET',
    };
  }

  static getActivities(params: any): AxiosRequestConfig {
    return {
      url: `/api/organization/activities`,
      method: 'GET',
      params,
    };
  }

  static getProperties(params: any): AxiosRequestConfig {
    return {
      url: `/api/organization/properties`,
      method: 'GET',
      params,
    };
  }

  static getAgentStats(): AxiosRequestConfig {
    return {
      url: '/api/organization/agent-stats',
      method: 'GET',
    };
  }

  static getAgents(params: { page: number; limit: number; search?: string }): AxiosRequestConfig {
    return {
      url: `/api/organization/agents`,
      method: 'GET',
      params,
    };
  }

  static getStakeholderStats(): AxiosRequestConfig {
    return {
      url: '/api/organization/stakeholder-stats',
      method: 'GET',
    };
  }

  static getStakeholders(params: { page: number; limit: number; search?: string; type?: string }): AxiosRequestConfig {
    return {
      url: '/api/organization/stakeholders',
      method: 'GET',
      params,
    };
  }

  static getStakeholderSpotlight(): AxiosRequestConfig {
    return {
      url: '/api/organization/stakeholders/spotlight',
      method: 'GET',
    };
  }

  static getStakeholderNeedsAttention(): AxiosRequestConfig {
    return {
      url: '/api/organization/stakeholders/needs-attention',
      method: 'GET',
    };
  }

  static inviteAgent(data: { name: string; email: string; phone?: string }): AxiosRequestConfig {
    return {
      url: '/api/organization/invite-agent',
      method: 'POST',
      data,
    };
  }

  static getMyOrganization(): AxiosRequestConfig {
    return {
      url: '/api/organization/me',
      method: 'GET',
    };
  }

  static updateMyOrganization(data: any): AxiosRequestConfig {
    return {
      url: '/api/organization/me',
      method: 'PATCH',
      data,
    };
  }
}
