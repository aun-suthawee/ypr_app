import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LucideIcon
} from "lucide-react";

export type ProjectStatus = 'active' | 'completed' | 'planning';

export interface StatusConfig {
  color: string;
  icon: LucideIcon;
  text: string;
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  active: {
    color: 'bg-blue-500 text-white border-blue-500',
    icon: Clock,
    text: 'ดำเนินการ'
  },
  completed: {
    color: 'bg-green-500 text-white border-green-500',
    icon: CheckCircle,
    text: 'เสร็จสิ้น'
  },
  planning: {
    color: 'bg-yellow-500 text-white border-yellow-500',
    icon: AlertCircle,
    text: 'วางแผน'
  }
};

export const getStatusConfig = (status: ProjectStatus): StatusConfig => {
  return PROJECT_STATUS_CONFIG[status];
};

export const getStatusColor = (status: ProjectStatus): string => {
  return PROJECT_STATUS_CONFIG[status]?.color || 'bg-gray-500 text-white border-gray-500';
};

export const getStatusIcon = (status: ProjectStatus): LucideIcon => {
  return PROJECT_STATUS_CONFIG[status]?.icon || Clock;
};

export const getStatusText = (status: ProjectStatus): string => {
  return PROJECT_STATUS_CONFIG[status]?.text || status;
};

// Helper to generate consistent "days ago" text
export const getDaysAgo = (projectId: string): number => {
  // Use project ID as seed for consistent random number
  const seed = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (seed % 7) + 1;
};
