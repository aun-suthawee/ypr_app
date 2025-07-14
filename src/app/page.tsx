"use client";

import { useEffect, useState } from "react";
import DashboardIndex from "@/components/dashboard-index";
import GeometricBackground from "@/components/GeometricBackground";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, User, LogOut } from "lucide-react";
import {
  isAuthenticated,
  getUser,
  logout,
  type User as UserType,
} from "@/lib/auth";

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // ตรวจสอบการ authentication
    if (isAuthenticated()) {
      setUser(getUser());
    }

    // ตรวจสอบขนาดหน้าจอ
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // ตรวจสอบเมื่อโหลดครั้งแรก
    checkScreenSize();

    // ตรวจสอบเมื่อขนาดหน้าจอเปลี่ยน
    window.addEventListener("resize", checkScreenSize);

    setIsLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleLogout = async () => {
    setIsNavigating(true);
    await logout();
    setUser(null);
    setIsNavigating(false);
  };

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  if (isLoading || isNavigating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">
            {isNavigating ? 'กำลังโหลด...' : 'กำลังโหลด...'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Geometric Background */}
      <GeometricBackground density="heavy" isMobile={isMobile} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">
                YPR Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                // แสดงเมื่อเข้าสู่ระบบแล้ว
                <>
                  <div className="flex items-center space-x-2 text-slate-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user.title_prefix}
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handleNavigation('/dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <span>เข้าสู่ Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </Button>
                </>
              ) : (
                // แสดงเมื่อยังไม่ได้เข้าสู่ระบบ
                <>
                  <Button
                    onClick={() => handleNavigation('/login')}
                    variant="outline"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            ระบบจัดการยุทธศาสตร์
          </h2>
          <p className="text-slate-600">
            ติดตามและจัดการประเด็นยุทธศาสตร์ กลยุทธ์ และโครงการขององค์กร
          </p>
        </div>

        <DashboardIndex />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-slate-600">
            <p>Copyright &copy; ypr.yalapeo.go.th All right reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
