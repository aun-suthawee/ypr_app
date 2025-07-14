import { apiCall } from './auth';
import type { 
  StrategicIssueFilters,
  CreateStrategicIssueData,
  UpdateStrategicIssueData 
} from '@/types/strategicIssues';

const STRATEGIC_ISSUES_ENDPOINT = '/api/strategic-issues';

// Get all strategic issues with filters
export const getStrategicIssues = async (filters?: StrategicIssueFilters) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  const response = await apiCall(
    `${STRATEGIC_ISSUES_ENDPOINT}${params.toString() ? '?' + params.toString() : ''}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategic issues');
  }
  
  return response.json();
};

// Get strategic issue by ID
export const getStrategicIssueById = async (id: string) => {
  const response = await apiCall(`${STRATEGIC_ISSUES_ENDPOINT}/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategic issue');
  }
  
  return response.json();
};

// Create new strategic issue
export const createStrategicIssue = async (data: CreateStrategicIssueData) => {
  const response = await apiCall(STRATEGIC_ISSUES_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create strategic issue');
  }
  
  return response.json();
};

// Update strategic issue
export const updateStrategicIssue = async (id: string, data: UpdateStrategicIssueData) => {
  const response = await apiCall(`${STRATEGIC_ISSUES_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update strategic issue');
  }
  
  return response.json();
};

// Delete strategic issue
export const deleteStrategicIssue = async (id: string) => {
  const response = await apiCall(`${STRATEGIC_ISSUES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete strategic issue');
  }
  
  return response.json();
};

// Get strategic issues stats
export const getStrategicIssueStats = async () => {
  const response = await apiCall(`${STRATEGIC_ISSUES_ENDPOINT}/stats`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch strategic issues stats');
  }
  
  return response.json();
};
