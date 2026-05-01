import { AxiosRequestConfig } from 'axios';

export class DashboardService {
  static getStats(roleId?: number): AxiosRequestConfig {
    return {
      url: `/api/property/dashboard/stats${roleId ? `?roleId=${roleId}` : ''}`,
      method: 'GET',
    };
  }
}
