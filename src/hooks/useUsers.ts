"use client";

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/services/userService';
import { publicService } from '@/services/publicService';
import { isAuthenticated, getUser } from '@/lib/auth';
import { 
  User, 
  UserFilters, 
  UserStatsResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  ChangePasswordRequest
} from '@/types/user';

export const useUsers = (initialFilters?: UserFilters, autoFetch: boolean = true) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const fetchUsers = useCallback(async (newFilters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if authenticated and user is admin
      if (!isAuthenticated()) {
        // For unauthenticated users, set empty data
        setUsers([]);
        setPagination({
          total: 0,
          limit: 10,
          offset: 0,
          pages: 0,
        });
        setLoading(false);
        return;
      }

      // Check if user is admin
      const user = getUser();
      if (!user || user.role !== 'admin') {
        // For non-admin users, set empty data and show error
        setUsers([]);
        setPagination({
          total: 0,
          limit: 10,
          offset: 0,
          pages: 0,
        });
        setError('จำเป็นต้องมีสิทธิ์ผู้ดูแลระบบ');
        setLoading(false);
        return;
      }
      
      const filtersToUse = newFilters || filters;
      const response = await userService.getUsers(filtersToUse);
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      }
    } catch (err: unknown) {
      // Only show error if user is authenticated
      if (isAuthenticated()) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createUser = async (userData: CreateUserRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.createUser(userData);
      
      if (response.success) {
        // Refresh users list
        await fetchUsers();
        return response.data.user;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการสร้างผู้ใช้');
        return null;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างผู้ใช้');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.updateUser(id, userData);
      
      if (response.success) {
        // Update user in current list
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id ? response.data.user : user
          )
        );
        return response.data.user;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
        return null;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.deleteUser(id);
      
      if (response.success) {
        // Remove user from current list
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        return true;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.activateUser(id);
      
      if (response.success) {
        // Update user status in current list
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id ? { ...user, is_active: true } : user
          )
        );
        return true;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการเปิดใช้งานผู้ใช้');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปิดใช้งานผู้ใช้');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.deactivateUser(id);
      
      if (response.success) {
        // Update user status in current list
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id ? { ...user, is_active: false } : user
          )
        );
        return true;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการปิดใช้งานผู้ใช้');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการปิดใช้งานผู้ใช้');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (id: string, passwordData: ChangePasswordRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.changePassword(id, passwordData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const clearError = () => setError(null);

  // Load users on mount
  useEffect(() => {
    // Only fetch if authenticated, autoFetch is enabled, and user is admin
    if (autoFetch && isAuthenticated()) {
      const user = getUser();
      if (user && user.role === 'admin') {
        fetchUsers();
      }
    }
  }, [fetchUsers, autoFetch]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    changePassword,
    updateFilters,
    clearError,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use appropriate service based on authentication
      let response;
      if (isAuthenticated()) {
        const user = getUser();
        // Only call protected endpoint if user is admin
        if (user && user.role === 'admin') {
          response = await userService.getUserStats();
        } else {
          // For authenticated non-admin users, use public service
          response = await publicService.getUserStats();
        }
      } else {
        response = await publicService.getUserStats();
      }
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการดึงสถิติผู้ใช้');
      }
    } catch (err: unknown) {
      // Only show error if user is authenticated
      if (isAuthenticated()) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงสถิติผู้ใช้');
      } else {
        // For unauthenticated users, just set empty stats (fallback)
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          admin: 0,
          department: 0,
          byDepartment: [],
          recentUsers: []
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};
