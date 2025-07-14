"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { getUser, logout } from "@/lib/auth";
import { NavigationLoading } from "@/components/redirect-loading";
import {
  BarChart3,
  Target,
  FolderOpen,
  Users,
  Menu,
  X,
  ChevronRight,
  Home,
  LogOut,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    id: "home",
    name: "หน้าหลัก",
    icon: Home,
    href: "/dashboard",
  },
  {
    id: "strategic-issues",
    name: "ประเด็นยุทธศาสตร์",
    icon: Target,
    href: "/dashboard/strategic-issues",
  },
  {
    id: "strategies",
    name: "กลยุทธ์",
    icon: BarChart3,
    href: "/dashboard/strategies",
  },
  {
    id: "projects",
    name: "โครงการ",
    icon: FolderOpen,
    href: "/dashboard/projects",
  },
  {
    id: "users",
    name: "ผู้ใช้งาน",
    icon: Users,
    href: "/dashboard/users",
    adminOnly: true, // Only show for admin users
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? getUser() : null;
  const isAdmin = mounted && currentUser?.role === "admin";

  // Handle navigation with loading state
  const handleNavigation = (href: string) => {
    if (pathname === href) return; // Don't navigate to same page
    
    setIsNavigating(true);
    setSidebarOpen(false);
    
    // Navigate immediately without delay to show loading faster
    router.push(href);
  };

  // Reset loading state when navigation is complete
  useEffect(() => {
    // Reset loading when pathname changes (navigation complete)
    setIsNavigating(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      setIsNavigating(true);
      await logout();
    }
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    return true;
  });

  // Get current active tab based on pathname
  const getCurrentTab = () => {
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/dashboard/strategic-issues"))
      return "strategic-issues";
    if (pathname.startsWith("/dashboard/strategies")) return "strategies";
    if (pathname.startsWith("/dashboard/projects")) return "projects";
    if (pathname.startsWith("/dashboard/users")) return "users";
    return "home";
  };

  const activeTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[60]">
          <NavigationLoading />
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-slate-900">
                YPR Dashboard
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-left font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <Home className="w-4 h-4 mr-3" />
              กลับหน้าแรก
            </Button>
            <div className="text-sm text-slate-500 text-center">
              Strategic Planning System
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {navigation.find((item) => item.id === activeTab)?.name ||
                    "Dashboard"}
                </h2>
                <p className="text-sm text-slate-600">
                  จัดการและติดตามความก้าวหน้าของโครงการ
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {currentUser?.first_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">
                    {currentUser
                      ? `${currentUser.first_name} ${currentUser.last_name}`
                      : "ผู้ใช้"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {isAdmin ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-700 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
