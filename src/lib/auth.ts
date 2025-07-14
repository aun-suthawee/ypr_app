// Authentication utilities for YPR Dashboard

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'department';
  title_prefix: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  permissions: {
    strategic_issues: string[];
    strategies: string[];
    projects: string[];
    users: string[];
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expires_in: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }>;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('ypr_token') !== null;
};

// Get stored user data
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('ypr_user');
  return userData ? JSON.parse(userData) : null;
};

// Get stored token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ypr_token');
};

// Clear auth data (logout)
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ypr_token');
  localStorage.removeItem('ypr_user');
  localStorage.removeItem('ypr_remember');
};

// Check if user has specific permission
export const hasPermission = (
  user: User | null,
  resource: keyof User['permissions'],
  action: string
): boolean => {
  if (!user || !user.permissions) return false;
  return user.permissions[resource]?.includes(action) || false;
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Check if user is department user
export const isDepartmentUser = (user: User | null): boolean => {
  return user?.role === 'department';
};

// API call with authentication
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:5000${endpoint}`, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'include',
  });

  // If token is invalid, clear auth but don't auto-redirect
  // Let components handle 401 errors and decide whether to redirect
  if (response.status === 401) {
    clearAuth();
    // Don't auto-redirect to login - let components handle 401 errors
    // Components can decide whether to redirect or show limited data
    // if (typeof window !== 'undefined') {
    //   window.location.href = '/login';
    // }
  }

  return response;
};

// Login function
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  return data;
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      await apiCall('/api/auth/logout', { method: 'POST' });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

// Verify token validity
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await apiCall('/api/auth/verify');
    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};
