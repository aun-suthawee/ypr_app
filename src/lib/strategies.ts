import { apiCall } from './auth';
import type { 
  StrategyFilters,
  CreateStrategyData,
  UpdateStrategyData 
} from '@/types/strategies';

const STRATEGIES_ENDPOINT = '/api/strategies';

// Get all strategies with filters
export const getStrategies = async (filters?: StrategyFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await apiCall(
    `${STRATEGIES_ENDPOINT}${params.toString() ? '?' + params.toString() : ''}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategies');
  }
  
  return response.json();
};

// Get strategy by ID
export const getStrategyById = async (id: string) => {
  const response = await apiCall(`${STRATEGIES_ENDPOINT}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategy');
  }
  
  return response.json();
};

// Create new strategy
export const createStrategy = async (data: CreateStrategyData) => {
  const response = await apiCall(STRATEGIES_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create strategy');
  }
  
  return response.json();
};

// Update strategy
export const updateStrategy = async (id: string, data: UpdateStrategyData) => {
  const response = await apiCall(`${STRATEGIES_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update strategy');
  }
  
  return response.json();
};

// Delete strategy
export const deleteStrategy = async (id: string) => {
  const response = await apiCall(`${STRATEGIES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete strategy');
  }
  
  return response.json();
};

// Get strategies stats
export const getStrategyStats = async () => {
  const response = await apiCall(`${STRATEGIES_ENDPOINT}/stats`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategy stats');
  }
  
  return response.json();
};
