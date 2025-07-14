"use client";

import { useState, useEffect } from 'react';
import { 
  getStrategicIssues, 
  createStrategicIssue, 
  updateStrategicIssue, 
  deleteStrategicIssue,
  getStrategicIssueStats 
} from '@/lib/strategicIssues';
import { publicService } from '@/services/publicService';
import { isAuthenticated } from '@/lib/auth';
import type { 
  StrategicIssue, 
  CreateStrategicIssueData, 
  UpdateStrategicIssueData,
  StrategicIssueStats
} from '@/types/strategicIssues';

export function useStrategicIssues() {
  const [strategicIssues, setStrategicIssues] = useState<StrategicIssue[]>([]);
  const [stats, setStats] = useState<StrategicIssueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStrategicIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use public service if not authenticated
      if (isAuthenticated()) {
        // Load issues and stats in parallel
        const [issuesResponse, statsResponse] = await Promise.all([
          getStrategicIssues(),
          getStrategicIssueStats()
        ]);
        
        setStrategicIssues(issuesResponse.data.issues);
        setStats(statsResponse.data.stats);
      } else {
        // Load public data
        const [issuesResponse, statsResponse] = await Promise.all([
          publicService.getStrategicIssues(),
          publicService.getStrategicIssueStats()
        ]);
        
        setStrategicIssues(issuesResponse.data.issues);
        setStats(statsResponse.data.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrategicIssues();
  }, []);

  const retry = () => {
    loadStrategicIssues();
  };

  const create = async (data: CreateStrategicIssueData) => {
    try {
      await createStrategicIssue(data);
      await loadStrategicIssues(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  const update = async (id: string, data: UpdateStrategicIssueData) => {
    try {
      await updateStrategicIssue(id, data);
      await loadStrategicIssues(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteStrategicIssue(id);
      await loadStrategicIssues(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  return {
    strategicIssues,
    stats,
    loading,
    error,
    retry,
    create,
    update,
    remove,
    refresh: loadStrategicIssues
  };
}
