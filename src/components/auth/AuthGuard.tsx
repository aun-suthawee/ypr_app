"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (requireAuth && !authenticated) {
        router.push(redirectTo);
        return;
      }

      if (!requireAuth && authenticated) {
        router.push('/');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// HOC สำหรับป้องกันหน้าที่ต้องการ authentication
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireAuth?: boolean; redirectTo?: string }
) => {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard 
        requireAuth={options?.requireAuth} 
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
