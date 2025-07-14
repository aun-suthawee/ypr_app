"use client";

import { useState, useEffect } from 'react';
import { 
  getStrategies, 
  createStrategy, 
  updateStrategy, 
  deleteStrategy,
  getStrategyStats 
} from '@/lib/strategies';
import { publicService } from '@/services/publicService';
import { isAuthenticated } from '@/lib/auth';
import type { 
  Strategy, 
  CreateStrategyData, 
  UpdateStrategyData,
  StrategyStats
} from '@/types/strategies';

export function useStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [stats, setStats] = useState<StrategyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStrategies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use public service if not authenticated
      if (isAuthenticated()) {
        // Load strategies and stats in parallel
        const [strategiesResponse, statsResponse] = await Promise.all([
          getStrategies(),
          getStrategyStats()
        ]);
        
        setStrategies(strategiesResponse.data.strategies);
        setStats(statsResponse.data.stats);
      } else {
        // Load public data
        const [strategiesResponse, statsResponse] = await Promise.all([
          publicService.getStrategies(),
          publicService.getStrategyStats()
        ]);
        
        setStrategies(strategiesResponse.data.strategies);
        setStats(statsResponse.data.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrategies();
  }, []);

  const retry = () => {
    loadStrategies();
  };

  const create = async (data: CreateStrategyData) => {
    try {
      await createStrategy(data);
      await loadStrategies(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  const update = async (id: string, data: UpdateStrategyData) => {
    try {
      await updateStrategy(id, data);
      await loadStrategies(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteStrategy(id);
      await loadStrategies(); // Reload data
    } catch (err) {
      throw err;
    }
  };

  return {
    strategies,
    stats,
    loading,
    error,
    retry,
    create,
    update,
    remove,
    refresh: loadStrategies
  };
}
