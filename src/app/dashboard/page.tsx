"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardIndex from "@/components/dashboard-index";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsAuth(true);
        setIsLoading(false);
      } else {
        // Show redirect loading state
        setIsRedirecting(true);
        
        // Add small delay to show loading state
        setTimeout(() => {
          // Redirect to login with current path as redirect parameter
          router.push('/login?redirect=/dashboard');
        }, 800);
        return;
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading || isRedirecting) {
    // Show loading state during authentication check or redirect
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">
            {isRedirecting ? 'กำลังโหลด...' : 'กำลังตรวจสอบสิทธิ์...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null; // Will redirect to login
  }

  return (
    <DashboardLayout>
      <DashboardIndex />
    </DashboardLayout>
  );
}
