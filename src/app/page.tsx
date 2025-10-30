"use client";

import { useEffect, useState } from "react";
import DashboardIndex from "@/components/dashboard-index";
import GeometricBackground from "@/components/GeometricBackground";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Target, ArrowRight, LogOut, Settings, ChevronDown, Home as HomeIcon } from "lucide-react";
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
                ระบบจัดการด้านการศึกษาจังหวัดยะลา
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                // แสดงเมื่อเข้าสู่ระบบแล้ว - Dropdown Menu
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 p-2 hover:bg-slate-100 cursor-pointer rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-medium">
                            {user.first_name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">
                            {user.title_prefix}{user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                          </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-slate-900">
                            {user.title_prefix}{user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-slate-600">
                            {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => handleNavigation("/dashboard")}
                        className="cursor-pointer"
                      >
                        <HomeIcon className="mr-2 h-4 w-4" />
                        <span>หน้า Dashboard</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        onClick={() => handleNavigation("/settings")}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>ตั้งค่า</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>ออกจากระบบ</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
            ระบบจัดการด้านการศึกษาจังหวัดยะลา
          </h2>
          <p className="text-slate-600">
            ติดตามและจัดการโครงการ ประเด็นยุทธศาสตร์ และสถิติการศึกษาของจังหวัดยะลา
          </p>
        </div>

        <DashboardIndex />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center text-slate-600">
            <p>Copyright &copy; ypr.yalapeo.go.th ระบบจัดการด้านการศึกษาจังหวัดยะลา</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
