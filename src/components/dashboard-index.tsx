"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StatusBadge,
  CountBadge,
  CustomBadge,
} from "@/components/custom-badges";
import { 
  DashboardStatsSkeleton, 
  DashboardQuickActionsSkeleton, 
  ProjectsLoadingSkeleton 
} from "@/components/loading-skeleton";
import { NavigationLoading } from "@/components/redirect-loading";
import ProjectFilter, { ProjectFilters } from "@/components/project-filter";
import { useUserStats } from "@/hooks/useUsers";
import { useProjects, useProjectStats } from "@/hooks/useProjects";
import { useStrategicIssues } from "@/hooks/useStrategicIssues";
import { useStrategies } from "@/hooks/useStrategies";
import { getUser } from "@/lib/auth";
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  ArrowRight,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";
import { Project } from "@/types/project";
import { StrategicIssue } from "@/types/strategicIssues";
import { Strategy } from "@/types/strategies";

interface ProjectCardProps {
  project: Project;
  strategicIssues?: StrategicIssue[];
  strategies?: Strategy[];
  onNavigate?: (href: string) => void;
}

function ProjectCard({ project, strategicIssues = [], strategies = [], onNavigate }: ProjectCardProps) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(`/projects/${project.id}`);
    }
  };

  return (
    <div onClick={handleClick} className="block cursor-pointer">
  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-slate-700 font-medium mt-2">{project.key_activities}</p>
        </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(project.start_date).toLocaleDateString("th-TH")} -{" "}
            {new Date(project.end_date).toLocaleDateString("th-TH")}
          </div>

          {/* Use populated relationship data if available, otherwise fallback to lookup */}
          {((project.strategic_issues_details && project.strategic_issues_details.length > 0) || 
            (project.strategic_issues && project.strategic_issues.length > 0)) && (
            <div className="pt-2">
              <p className="text-sm text-slate-700 font-semibold mb-2">ประเด็นยุทธศาสตร์:</p>
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {project.strategic_issues_details && project.strategic_issues_details.length > 0 ? (
                  <>
                    {project.strategic_issues_details.slice(0, 2).map((issue, index) => (
                      <CustomBadge key={issue.id || index} color="blue" className="text-xs">
                        {issue.title}
                      </CustomBadge>
                    ))}
                    {project.strategic_issues_details.length > 2 && (
                      <CustomBadge color="blue" className="text-xs">
                        +{project.strategic_issues_details.length - 2} อื่นๆ
                      </CustomBadge>
                    )}
                  </>
                ) : project.strategic_issues && project.strategic_issues.length > 0 ? (
                  // Fallback: Check if we can find names in strategicIssues array
                  <>
                    {project.strategic_issues.slice(0, 2).map((issueId, index) => {
                      const issue = strategicIssues.find(si => si.id === issueId);
                      if (issue) {
                        return (
                          <CustomBadge key={issue.id} color="blue" className="text-xs">
                            {issue.title}
                          </CustomBadge>
                        );
                      }
                      // If issue not found (deleted), show placeholder
                      return (
                        <CustomBadge key={`deleted-${index}`} color="gray" className="text-xs">
                          ประเด็น (ลบแล้ว)
                        </CustomBadge>
                      );
                    })}
                    {project.strategic_issues.length > 2 && (
                      <CustomBadge color="blue" className="text-xs">
                        +{project.strategic_issues.length - 2} อื่นๆ
                      </CustomBadge>
                    )}
                  </>
                ) : (
                  <CustomBadge color="gray" className="text-xs">
                    ไม่มีข้อมูล
                  </CustomBadge>
                )}
              </div>
            </div>
          )}

          {((project.strategies_details && project.strategies_details.length > 0) || 
            (project.strategies && project.strategies.length > 0)) && (
            <div className="pt-2">
              <p className="text-sm text-slate-700 font-semibold mb-2">กลยุทธ์:</p>
              <div className="flex flex-wrap gap-1 overflow-hidden">
                {project.strategies_details && project.strategies_details.length > 0 ? (
                  <>
                    {project.strategies_details.slice(0, 2).map((strategy, index) => (
                      <CustomBadge key={strategy.id || index} color="green" className="text-xs">
                        {strategy.name}
                      </CustomBadge>
                    ))}
                    {project.strategies_details.length > 2 && (
                      <CustomBadge color="green" className="text-xs">
                        +{project.strategies_details.length - 2} อื่นๆ
                      </CustomBadge>
                    )}
                  </>
                ) : project.strategies && project.strategies.length > 0 ? (
                  // Fallback: Check if we can find names in strategies array
                  <>
                    {project.strategies.slice(0, 2).map((strategyId, index) => {
                      const strategy = strategies.find(s => s.id === strategyId);
                      if (strategy) {
                        return (
                          <CustomBadge key={strategy.id} color="green" className="text-xs">
                            {strategy.name}
                          </CustomBadge>
                        );
                      }
                      // If strategy not found (deleted), show placeholder
                      return (
                        <CustomBadge key={`deleted-${index}`} color="gray" className="text-xs">
                          กลยุทธ์ (ลบแล้ว)
                        </CustomBadge>
                      );
                    })}
                    {project.strategies.length > 2 && (
                      <CustomBadge color="green" className="text-xs">
                        +{project.strategies.length - 2} อื่นๆ
                      </CustomBadge>
                    )}
                  </>
                ) : (
                  <CustomBadge color="gray" className="text-xs">
                    ไม่มีข้อมูล
                  </CustomBadge>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-1">งบประมาณ:</p>
            <p className="text-sm font-semibold text-slate-900">
              {project.budget ? `${project.budget.toLocaleString()} บาท` : 'ไม่ระบุ'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default function DashboardIndex() {
  const [mounted, setMounted] = useState(false);
  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: '',
    minBudget: '',
    maxBudget: '',
    projectType: '',
    startDate: '',
    endDate: '',
    status: '',
    districts: [],
    strategicIssueIds: [],
    strategyIds: [],
  });
  const router = useRouter();
  
  // Use real API hooks instead of mock data (with error handling for public access)
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { stats: projectStats, loading: statsLoading } = useProjectStats();
  const { stats: userStats } = useUserStats();
  const { strategicIssues, loading: strategicIssuesLoading } = useStrategicIssues();
  const { strategies, loading: strategiesLoading } = useStrategies();
  
  // Handle client-side hydration and check if we're on dashboard page
  useEffect(() => {
    setMounted(true);
    // Check if current path is dashboard page
    setIsDashboardPage(window.location.pathname.startsWith('/dashboard'));
  }, []);

  // Handle navigation with loading state
  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    
    // Navigate immediately
    router.push(href);
  };

  // Reset loading state when navigation is complete
  useEffect(() => {
    // Reset loading when navigation complete (pathname change or component mount)
    setIsNavigating(false);
  }, [mounted]); // Reset when component mounts after navigation

  const currentUser = mounted ? getUser() : null;
  const isAdmin = mounted && currentUser?.role === 'admin';
  const isAuthenticated = mounted && currentUser !== null;

  // Filter projects based on filters
  const filterProjects = (projectsToFilter: Project[]): Project[] => {
    if (!projectsToFilter) return [];

    return projectsToFilter.filter((project) => {
      // Search filter (name, key_activities, responsible person)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          project.name,
          project.key_activities,
          `${project.responsible_first_name} ${project.responsible_last_name}`,
          project.responsible_position,
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm)) return false;
      }

      // Budget filter
      if (filters.minBudget && project.budget < parseFloat(filters.minBudget)) return false;
      if (filters.maxBudget && project.budget > parseFloat(filters.maxBudget)) return false;

      // Project type filter
      if (filters.projectType && project.project_type !== filters.projectType) return false;

      // Status filter
      if (filters.status && project.status !== filters.status) return false;

      // Date range filter
      if (filters.startDate && new Date(project.start_date) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(project.end_date) > new Date(filters.endDate)) return false;

      // Districts filter
      if (filters.districts.length > 0) {
        const hasMatchingDistrict = filters.districts.some(district => 
          project.districts?.includes(district)
        );
        if (!hasMatchingDistrict) return false;
      }

      // Strategic issues filter
      if (filters.strategicIssueIds.length > 0) {
        const hasMatchingIssue = filters.strategicIssueIds.some(issueId => 
          project.strategic_issues?.includes(issueId)
        );
        if (!hasMatchingIssue) return false;
      }

      // Strategies filter
      if (filters.strategyIds.length > 0) {
        const hasMatchingStrategy = filters.strategyIds.some(strategyId => 
          project.strategies?.includes(strategyId)
        );
        if (!hasMatchingStrategy) return false;
      }

      return true;
    });
  };

  // Check if filters are active
  const hasActiveFilters = filters.search || filters.minBudget || filters.maxBudget || 
                          filters.projectType || filters.startDate || filters.endDate || 
                          filters.status || filters.districts.length > 0 || 
                          filters.strategicIssueIds.length > 0 || filters.strategyIds.length > 0;

  // Apply filters to get filtered projects
  const filteredProjects = filterProjects(projects || []);

  // Show loading state during hydration or API loading
  if (!mounted || projectsLoading || statsLoading || strategicIssuesLoading || strategiesLoading) {
    return (
      <div className="space-y-8">
        <DashboardStatsSkeleton />
        <DashboardQuickActionsSkeleton />
        <div className="space-y-6">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-48"></div>
          <ProjectsLoadingSkeleton />
        </div>
      </div>
    );
  }

  // If there's an authentication error, show limited data
  if (projectsError && !isAuthenticated) {
    return (
      <div className="space-y-8">
        {/* Limited Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    โครงการทั้งหมด
                  </p>
                  <p className="text-3xl font-bold text-blue-900">-</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    ดำเนินการ
                  </p>
                  <p className="text-3xl font-bold text-green-900">-</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    เสร็จสิ้น
                  </p>
                  <p className="text-3xl font-bold text-purple-900">-</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">วางแผน</p>
                  <p className="text-3xl font-bold text-yellow-900">-</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Prompt */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              เข้าสู่ระบบเพื่อดูข้อมูลโครงการ
            </h3>
            <p className="text-slate-600 mb-6">
              เข้าสู่ระบบเพื่อดูข้อมูลโครงการ ประเด็นยุทธศาสตร์ และสถิติต่างๆ
              แบบละเอียด
            </p>
            <Button 
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => handleNavigation("/login")}
            >
              เข้าสู่ระบบ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats from real data
  const getStatsByStatus = (status: string) => {
    return projectStats?.byStatus?.find(s => s.status === status)?.count || 0;
  };

  // Calculate stats from filtered data when filters are active
  const getFilteredStatsByStatus = (status: string) => {
    return filteredProjects.filter(p => p.status === status).length;
  };

  const stats = hasActiveFilters ? {
    totalProjects: filteredProjects.length,
    activeProjects: getFilteredStatsByStatus('active'),
    completedProjects: getFilteredStatsByStatus('completed'),
    planningProjects: getFilteredStatsByStatus('planning'),
  } : {
    totalProjects: projectStats?.total || projects?.length || 0,
    activeProjects: getStatsByStatus('active') || projects?.filter((p) => p.status === "active").length || 0,
    completedProjects: getStatsByStatus('completed') || projects?.filter((p) => p.status === "completed").length || 0,
    planningProjects: getStatsByStatus('planning') || projects?.filter((p) => p.status === "planning").length || 0,
  };

  // Get display projects based on filters
  const displayProjects = hasActiveFilters ? filteredProjects : (projects?.slice(0, 6) || []);

  return (
    <div className="space-y-8 relative">
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[60]">
          <NavigationLoading />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  โครงการทั้งหมด{hasActiveFilters ? ' (ที่กรอง)' : ''}
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.totalProjects}
                </p>
                {hasActiveFilters && (
                  <p className="text-xs text-blue-600 mt-1">
                    จากทั้งหมด {projectStats?.total || projects?.length || 0} โครงการ
                  </p>
                )}
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">ดำเนินการ</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.activeProjects}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">เสร็จสิ้น</p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.completedProjects}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">วางแผน</p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.planningProjects}
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stats - Only show for admin and in dashboard page */}
      {isAdmin && userStats && isDashboardPage && (
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              สถิติผู้ใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    ผู้ใช้ทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {userStats.total}
                  </p>
                </div>
                <div className="p-2 bg-cyan-500 rounded-full">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    ผู้ใช้งาน
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {userStats.active}
                  </p>
                </div>
                <div className="p-2 bg-green-500 rounded-full">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    ผู้ดูแลระบบ
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {userStats.admin}
                  </p>
                </div>
                <div className="p-2 bg-purple-500 rounded-full">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="group cursor-pointer bg-white hover:bg-slate-100 transition-colors"
                onClick={() => handleNavigation("/dashboard/users")}
              >
                <span>จัดการผู้ใช้</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Filter - Visible to all users */}
      <ProjectFilter
        filters={filters}
        onFiltersChange={setFilters}
        strategicIssues={strategicIssues || []}
        strategies={strategies || []}
        isExpanded={isFilterExpanded}
        onToggleExpanded={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      {/* Projects Section */}
  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-900">
              {hasActiveFilters ? `ผลการค้นหา (${displayProjects.length} โครงการ)` : 'โครงการล่าสุด'}
            </CardTitle>
            {isAuthenticated && (
              <Button
                variant="outline"
                className="group cursor-pointer bg-white hover:bg-slate-100 transition-colors"
                onClick={() => handleNavigation("projects")}
              >
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {displayProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>{hasActiveFilters ? 'ไม่พบโครงการที่ตรงตามเงื่อนไข' : 'ไม่พบโครงการ'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project: Project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  strategicIssues={strategicIssues}
                  strategies={strategies}
                  onNavigate={handleNavigation}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategic Issues Projects */}
      {strategicIssues && strategicIssues.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            โครงการตามประเด็นยุทธศาสตร์
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(() => {
              // Get current year in Buddhist Era
              const currentYear = new Date().getFullYear() + 543;
              
              // Filter strategic issues for current year
              const currentYearIssues = strategicIssues.filter(issue => 
                issue.start_year <= currentYear && issue.end_year >= currentYear
              );
              
              // Show all current year issues, but if there are many, show top 6
              const issuesToShow = currentYearIssues.length > 6 
                ? currentYearIssues.slice(0, 6) 
                : currentYearIssues;
              
              if (issuesToShow.length === 0) {
                return (
                  <div className="col-span-full text-center py-8">
                    <p className="text-slate-500">ไม่มีประเด็นยุทธศาสตร์ในปีปัจจุบัน ({currentYear})</p>
                  </div>
                );
              }
              
              return issuesToShow.map((issue) => {
                // Filter projects by strategic issue ID (not title)
                const issueProjects =
                  projects?.filter((p) =>
                    p.strategic_issues.some((si) => si === issue.id)
                  ) || [];

                return (
                  <Card
                    key={issue.id}
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span>ประเด็นยุทธศาสตร์ที่ {issue.order || 1}</span>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {issue.start_year}-{issue.end_year}
                            </div>
                          </div>
                          <div className="text-sm font-normal text-slate-600 mt-1">
                            {issue.title}
                          </div>
                        </div>
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        {issue.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">จำนวนโครงการ</span>
                          <CountBadge
                            count={issueProjects.length}
                            label="โครงการ"
                            variant="info"
                          />
                        </div>
                        {issueProjects.length > 0 && (
                          <div className="space-y-2">
                            {issueProjects.slice(0, 2).map((project) => {
                              // Get strategy names for this project
                              const getStrategyNames = (
                                strategyIds: string[]
                              ) => {
                                return strategyIds.map((id) => {
                                  const strategy = strategies?.find(
                                    (s) => s.id === id
                                  );
                                  return strategy ? strategy.name : id;
                                });
                              };

                              const strategyNames = getStrategyNames(
                                project.strategies
                              );

                              return (
                                <div
                                  key={project.id}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-900 text-sm">
                                      {project.name}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                      {project.key_activities}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1 overflow-hidden">
                                      {strategyNames
                                        .slice(0, 2)
                                        .map((strategyName, index) => (
                                          <CustomBadge
                                            key={index}
                                            color="green"
                                            className="text-xs"
                                          >
                                            {strategyName}
                                          </CustomBadge>
                                        ))}
                                      {strategyNames.length > 2 && (
                                        <CustomBadge
                                          color="green"
                                          className="text-xs"
                                        >
                                          +{strategyNames.length - 2} อื่นๆ
                                        </CustomBadge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <StatusBadge
                                      status={project.status}
                                      showIcon={false}
                                      className="text-xs"
                                    />
                                    <span className="text-xs font-semibold text-slate-600">
                                      {project.budget
                                        ? `${(project.budget / 1000).toFixed(0)}K`
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {issueProjects.length > 2 && (
                          <Button variant="ghost" size="sm" className="w-full cursor-pointer">
                            ดูเพิ่มเติม ({issueProjects.length - 2} โครงการ)
                          </Button>
                        )}
                        {issueProjects.length === 0 && (
                          <p className="text-center text-slate-500 text-sm py-4">
                            ไม่มีโครงการในประเด็นนี้
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
