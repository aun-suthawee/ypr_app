"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Settings,
  ChevronDown,
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
          <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-slate-200">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                YPR Dashboard
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer p-1.5 sm:p-2 flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1.5 sm:space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-medium transition-all duration-200 cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg font-semibold"
                      : "text-slate-800 hover:text-slate-900 hover:bg-blue-50 hover:border-blue-200"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto flex-shrink-0" />}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-200 space-y-2 sm:space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-left font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300 cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base"
              onClick={() => handleNavigation("/")}
            >
              <Home className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="truncate">กลับหน้าแรก</span>
            </Button>
            <div className="text-xs sm:text-sm text-slate-500 text-center px-2">
              Strategic Planning System
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            {/* Left section */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer p-1.5 sm:p-2 flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 truncate">
                  {navigation.find((item) => item.id === activeTab)?.name ||
                    "Dashboard"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 hidden md:block truncate">
                  จัดการและติดตามความก้าวหน้าของโครงการ
                </p>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0">
              {/* User dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 hover:bg-slate-100 cursor-pointer rounded-lg"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">
                        {currentUser?.first_name?.charAt(0) || "U"}
                      </span>
                    </div>
                    {/* Desktop: Full name and role */}
                    <div className="hidden lg:block min-w-0 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[120px] xl:max-w-[140px]">
                        {currentUser
                          ? `${currentUser.first_name} ${currentUser.last_name}`
                          : "ผู้ใช้"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {isAdmin ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                      </p>
                    </div>
                    {/* Tablet: First name only */}
                    <div className="hidden sm:block lg:hidden min-w-0 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[70px]">
                        {currentUser?.first_name || "ผู้ใช้"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {isAdmin ? "Admin" : "User"}
                      </p>
                    </div>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        {currentUser
                          ? `${currentUser.first_name} ${currentUser.last_name}`
                          : "ผู้ใช้"}
                      </p>
                      <p className="text-xs text-slate-600">
                        {isAdmin ? "ผู้ดูแลระบบ" : "ผู้ใช้งาน"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
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
