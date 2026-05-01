import apiClient from '@/networking/apiClient';

class OrganizationService {
  async submitUpgradeRequest(data: any) {
    const response = await apiClient.post('/api/organization/upgrade', data);
    return response.data;
  }
}

export default new OrganizationService();
