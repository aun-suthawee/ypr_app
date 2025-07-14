// Types สำหรับ Strategic Issues

export interface StrategicIssue {
  id: string;
  title: string;
  description: string;
  start_year: number;
  end_year: number;
  start_year_display?: number; // Buddhist Era year for display
  end_year_display?: number; // Buddhist Era year for display
  order: number; // ลำดับของประเด็นยุทธศาสตร์
  status: 'active' | 'inactive' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
    first_name: string;
    last_name: string;
    title_prefix: string;
  };
}

export interface StrategicIssueStats {
  total: number;
  active: number;
  completed: number;
  inactive: number;
  earliest_year: number;
  latest_year: number;
}

export interface StrategicIssueFilters {
  status?: 'active' | 'inactive' | 'completed';
  year?: number;
  start_year?: number;
  end_year?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface CreateStrategicIssueData {
  title: string;
  description: string;
  start_year: number;
  end_year: number;
  order?: number;
  status?: 'active' | 'inactive' | 'completed';
}

export interface UpdateStrategicIssueData {
  title?: string;
  description?: string;
  start_year?: number;
  end_year?: number;
  order?: number;
  status?: 'active' | 'inactive' | 'completed';
}
