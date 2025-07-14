export interface Project {
  id: string;
  name: string;
  key_activities: string;
  budget: number;
  expected_results: string;
  project_type: 'new' | 'continuous';
  start_date: string;
  end_date: string;
  responsible_title_prefix: string;
  responsible_first_name: string;
  responsible_last_name: string;
  responsible_position: string;
  responsible_phone: string;
  responsible_email: string;
  activity_location: string;
  districts: string[];
  province: string;
  strategic_issues: string[];
  strategies: string[];
  document_links: DocumentLink[];
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
    first_name: string;
    last_name: string;
    title_prefix: string;
  };
  // Additional fields populated by backend relationships
  strategic_issues_details?: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  strategies_details?: Array<{
    id: string;
    name: string;
    description?: string;
    strategic_issue_title?: string;
  }>;
}

export interface DocumentLink {
  name: string;
  url: string;
  type?: string;
}

export interface CreateProjectRequest {
  name: string;
  key_activities: string;
  budget?: number;
  expected_results: string;
  project_type: 'new' | 'continuous';
  start_date: string;
  end_date: string;
  responsible_title_prefix: string;
  responsible_first_name: string;
  responsible_last_name: string;
  responsible_position: string;
  responsible_phone: string;
  responsible_email: string;
  activity_location: string;
  districts: string[];
  province: string;
  strategic_issues: string[];
  strategies: string[];
  document_links: DocumentLink[];
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

export interface ProjectFilters {
  status?: string;
  project_type?: string;
  start_date?: string;
  end_date?: string;
  min_budget?: number;
  max_budget?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      pages: number;
    };
  };
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    project: Project;
  };
}

export interface ProjectStats {
  total: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byType: Array<{
    project_type: string;
    count: number;
  }>;
  budget: {
    total_projects: number;
    total_budget: number;
    avg_budget: number;
    min_budget: number;
    max_budget: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    budget: number;
    start_date: string;
  }>;
}

export interface ProjectStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: ProjectStats;
  };
}

// District options for Yala province
export const YALA_DISTRICTS = [
  'เมืองยะลา',
  'เบตง',
  'บันนังสตา',
  'ธารโต',
  'ยะหริ่ง',
  'รามัน',
  'กาบัง',
  'กรงปินัง'
];

// Project type options
export const PROJECT_TYPES = [
  { value: 'new', label: 'โครงการใหม่' },
  { value: 'continuous', label: 'โครงการต่อเนื่อง' }
];

// Project status options
export const PROJECT_STATUS = [
  { value: 'planning', label: 'กำลังวางแผน' },
  { value: 'active', label: 'ดำเนินการ' },
  { value: 'completed', label: 'เสร็จสมบูรณ์' },
  { value: 'cancelled', label: 'ยกเลิก' }
];

// Title prefix options
export const TITLE_PREFIXES = [
  'นาย',
  'นาง',
  'นางสาว'
];
