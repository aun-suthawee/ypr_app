// User types and interfaces
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'department';
  title_prefix?: string;
  first_name: string;
  last_name: string;
  position?: string;
  department?: string;
  is_active: boolean;
  created_at: string;
  permissions?: UserPermissions;
}

export interface UserPermissions {
  strategic_issues: string[];
  strategies: string[];
  projects: string[];
  users: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role?: 'admin' | 'department';
  title_prefix?: string;
  first_name: string;
  last_name: string;
  position?: string;
  department?: string;
}

export interface UpdateUserRequest {
  email?: string;
  role?: 'admin' | 'department';
  title_prefix?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  department?: string;
}

export interface UserFilters {
  role?: 'admin' | 'department';
  department?: string;
  is_active?: boolean;
  search?: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      pages: number;
    };
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    inactive: number;
    admin: number;
    department: number;
    byDepartment: Array<{
      department: string;
      count: number;
    }>;
    recentUsers: Array<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      department: string;
      created_at: string;
    }>;
  };
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
}

// Thai department names
export const THAI_DEPARTMENTS = [
  'กองแผนงาน',
  'กองการเมือง',
  'กองพัฒนาชุมชน',
  'กองช่าง',
  'กองสาธารณสุข',
  'กองการศึกษา',
  'กองคลัง',
  'สำนักงานเลขานุการ',
  'กองสวัสดิการสังคม',
  'กองป้องกันและบรรเทาสาธารณภัย'
];

// User role options
export const USER_ROLES = [
  { value: 'admin', label: 'ผู้ดูแลระบบ' },
  { value: 'department', label: 'เจ้าหน้าที่หน่วยงาน' }
];

// Title prefixes
export const TITLE_PREFIXES = [
  'นาย',
  'นาง',
  'นางสาว',
  'ดร.',
  'ศาสตราจารย์',
  'รองศาสตราจารย์',
  'ผู้ช่วยศาสตราจารย์'
];
