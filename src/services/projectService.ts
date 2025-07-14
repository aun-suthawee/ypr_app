import axios from 'axios';
import { 
  Project, 
  ProjectFilters, 
  ProjectsResponse, 
  ProjectResponse, 
  ProjectStatsResponse, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '@/types/project';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ypr_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ypr_token');
        localStorage.removeItem('ypr_user');
        // Don't auto-redirect, let components handle this
      }
    }
    return Promise.reject(error);
  }
);

export const projectService = {
  // Get all projects with filters
  async getProjects(filters?: ProjectFilters): Promise<ProjectsResponse> {
    try {
      const response = await api.get('/projects', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  async getProjectById(id: string): Promise<ProjectResponse> {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create new project
  async createProject(projectData: CreateProjectRequest): Promise<ProjectResponse> {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<ProjectResponse> {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Get project statistics
  async getProjectStats(): Promise<ProjectStatsResponse> {
    try {
      const response = await api.get('/projects/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  },

  // Public methods (no authentication required)
  // Get all projects without authentication
  async getPublicProjects(filters?: ProjectFilters): Promise<ProjectsResponse> {
    try {
      const response = await api.get('/projects/public', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching public projects:', error);
      throw error;
    }
  },

  // Get project statistics without authentication
  async getPublicProjectStats(): Promise<ProjectStatsResponse> {
    try {
      const response = await api.get('/projects/public/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching public project stats:', error);
      throw error;
    }
  },

  // Helper function to format project data for forms
  formatProjectForForm(project: Project) {
    return {
      ...project,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
      end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
    };
  },

  // Helper function to format Thai date display
  formatThaiDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  },

  // Helper function to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Helper function to get status color
  getStatusColor(status: string): string {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  },

  // Helper function to get type color
  getTypeColor(type: string): string {
    const colors = {
      new: 'bg-purple-100 text-purple-800',
      continuous: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  },

  // Helper function to get status label
  getStatusLabel(status: string): string {
    const labels = {
      planning: 'กำลังวางแผน',
      active: 'ดำเนินการ',
      completed: 'เสร็จสมบูรณ์',
      cancelled: 'ยกเลิก',
    };
    return labels[status as keyof typeof labels] || status;
  },

  // Helper function to get type label
  getTypeLabel(type: string): string {
    const labels = {
      new: 'โครงการใหม่',
      continuous: 'โครงการต่อเนื่อง',
    };
    return labels[type as keyof typeof labels] || type;
  },
};
