import { http } from '@/lib/http';

export const publicService = {
  // Get strategic issues without authentication
  async getStrategicIssues(filters?: Record<string, unknown>) {
    try {
  const response = await http.get('/strategic-issues/public', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching public strategic issues:', error);
      throw error;
    }
  },

  // Get strategic issues stats without authentication
  async getStrategicIssueStats() {
    try {
  const response = await http.get('/strategic-issues/public/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching public strategic issues stats:', error);
      throw error;
    }
  },

  // Get strategies without authentication
  async getStrategies(filters?: Record<string, unknown>) {
    try {
  const response = await http.get('/strategies/public', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching public strategies:', error);
      throw error;
    }
  },

  // Get strategies stats without authentication
  async getStrategyStats() {
    try {
  const response = await http.get('/strategies/public/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching public strategies stats:', error);
      throw error;
    }
  },

  // Get projects without authentication
  async getProjects(filters?: Record<string, unknown>) {
    try {
  const response = await http.get('/projects/public', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching public projects:', error);
      throw error;
    }
  },

  // Get projects stats without authentication
  async getProjectStats() {
    try {
  const response = await http.get('/projects/public/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching public projects stats:', error);
      throw error;
    }
  },

  // Get user stats for public (returns mock data)
  async getUserStats() {
    return {
      success: true,
      message: 'Public user stats',
      data: {
        total: 0,
        active: 0,
        inactive: 0,
        admin: 0,
        department: 0,
        byDepartment: [],
        recentUsers: []
      }
    };
  },
};
