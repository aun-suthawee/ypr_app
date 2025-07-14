import axios from 'axios';
import { 
  User, 
  UserFilters, 
  UsersResponse, 
  UserResponse, 
  UserStatsResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  ChangePasswordRequest
} from '@/types/user';

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
        // Don't auto-redirect to login - let components handle 401 errors
        // Components can decide whether to redirect or show limited data
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const userService = {
  // Get all users with filters
  async getUsers(filters?: UserFilters): Promise<UsersResponse> {
    try {
      const response = await api.get('/users', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<UserResponse> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Activate user
  async activateUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/users/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  // Deactivate user
  async deactivateUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/users/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(id: string, passwordData: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/users/${id}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Helper function to get full name
  getFullName(user: User): string {
    const prefix = user.title_prefix ? `${user.title_prefix} ` : '';
    return `${prefix}${user.first_name} ${user.last_name}`;
  },

  // Helper function to get role label
  getRoleLabel(role: string): string {
    const labels = {
      admin: 'ผู้ดูแลระบบ',
      department: 'เจ้าหน้าที่หน่วยงาน',
    };
    return labels[role as keyof typeof labels] || role;
  },

  // Helper function to get status color
  getStatusColor(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  },

  // Helper function to get status label
  getStatusLabel(isActive: boolean): string {
    return isActive ? 'ใช้งาน' : 'ปิดใช้งาน';
  },

  // Helper function to get role color
  getRoleColor(role: string): string {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      department: 'bg-blue-100 text-blue-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  },

  // Helper function to format Thai date
  formatThaiDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  },
};
