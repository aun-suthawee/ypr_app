"use client";

import { useState, useEffect, useCallback } from 'react';
import { projectService } from '@/services/projectService';
import { publicService } from '@/services/publicService';
import { isAuthenticated } from '@/lib/auth';
import { notifications } from '@/lib/notifications';
import { 
  Project, 
  ProjectFilters, 
  ProjectStats, 
  CreateProjectRequest, 
  UpdateProjectRequest 
} from '@/types/project';

export const useProjects = (initialFilters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters || {});

  const fetchProjects = useCallback(async (newFilters?: ProjectFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      
      // Use public service if not authenticated
      let response;
      if (isAuthenticated()) {
        response = await projectService.getProjects(filtersToUse);
      } else {
        response = await publicService.getProjects(filtersToUse as Record<string, unknown>);
      }
      
      if (response.success) {
        setProjects(response.data.projects);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProject = async (projectData: CreateProjectRequest): Promise<Project | null> => {
    const loadingToast = notifications.loading('กำลังสร้างโครงการ...');
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.createProject(projectData);
      
      if (response.success) {
        notifications.dismiss(loadingToast);
        notifications.success('สร้างโครงการเรียบร้อย!');
        // Refresh projects list
        await fetchProjects();
        return response.data.project;
      } else {
        notifications.dismiss(loadingToast);
        notifications.error(response.message || 'เกิดข้อผิดพลาดในการสร้างโครงการ');
        setError(response.message || 'เกิดข้อผิดพลาดในการสร้างโครงการ');
        return null;
      }
    } catch (err: unknown) {
      notifications.dismiss(loadingToast);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างโครงการ';
      notifications.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: UpdateProjectRequest): Promise<Project | null> => {
    const loadingToast = notifications.loading('กำลังอัปเดตโครงการ...');
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.updateProject(id, projectData);
      
      if (response.success) {
        notifications.dismiss(loadingToast);
        notifications.success('อัปเดตโครงการเรียบร้อย!');
        // Update local state
        setProjects(prev => prev.map(project => 
          project.id === id ? response.data.project : project
        ));
        return response.data.project;
      } else {
        notifications.dismiss(loadingToast);
        notifications.error(response.message || 'เกิดข้อผิดพลาดในการอัปเดตโครงการ');
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตโครงการ');
        return null;
      }
    } catch (err: unknown) {
      notifications.dismiss(loadingToast);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโครงการ';
      notifications.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const loadingToast = notifications.loading('กำลังลบโครงการ...');
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.deleteProject(id);
      
      if (response.success) {
        notifications.dismiss(loadingToast);
        notifications.success('ลบโครงการเรียบร้อย!');
        // Remove from local state
        setProjects(prev => prev.filter(project => project.id !== id));
        return true;
      } else {
        notifications.dismiss(loadingToast);
        notifications.error(response.message || 'เกิดข้อผิดพลาดในการลบโครงการ');
        setError(response.message || 'เกิดข้อผิดพลาดในการลบโครงการ');
        return false;
      }
    } catch (err: unknown) {
      notifications.dismiss(loadingToast);
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบโครงการ';
      notifications.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<ProjectFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchProjects(updatedFilters);
  };

  const resetFilters = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    fetchProjects(resetFilters);
  };

  const refresh = () => {
    fetchProjects();
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    pagination,
    filters,
    createProject,
    updateProject,
    deleteProject,
    updateFilters,
    resetFilters,
    refresh,
  };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.getProjectById(id);
      
      if (response.success) {
        setProject(response.data.project);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refresh: fetchProject,
  };
};

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use public service if not authenticated
      let response;
      if (isAuthenticated()) {
        response = await projectService.getProjectStats();
      } else {
        response = await publicService.getProjectStats();
      }
      
      if (response.success) {
        setStats(response.data.stats);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการดึงสถิติโครงการ');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงสถิติโครงการ');
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
    refresh: fetchStats,
  };
};
