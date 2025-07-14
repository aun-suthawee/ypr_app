"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, isAuthenticated, getUser, verifyToken, clearAuth } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        const userData = getUser();
        if (userData) {
          // ตรวจสอบว่า token ยังใช้งานได้หรือไม่
          const isValid = await verifyToken();
          if (isValid) {
            setUser(userData);
          } else {
            // Token หมดอายุ ล้างข้อมูล
            clearAuth();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('ypr_token', token);
    localStorage.setItem('ypr_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
