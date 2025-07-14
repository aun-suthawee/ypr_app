// Types สำหรับ Strategies

export interface Strategy {
  id: string;
  strategic_issue_id: string;
  name: string;
  description: string;
  order: number; // ลำดับของกลยุทธ์
  created_by: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
    first_name: string;
    last_name: string;
    title_prefix: string;
  };
  strategic_issue: {
    id: string;
    title: string;
    order?: number;
    start_year?: number;
    end_year?: number;
  };
}

export interface StrategyStats {
  total: number;
  by_strategic_issue: {
    [key: string]: number;
  };
}

export interface StrategyFilters {
  strategic_issue_id?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface CreateStrategyData {
  strategic_issue_id: string;
  name: string;
  description: string;
  order?: number;
}

export interface UpdateStrategyData {
  strategic_issue_id?: string;
  name?: string;
  description?: string;
  order?: number;
}
