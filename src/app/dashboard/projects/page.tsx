"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Filter,
  Search,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { CustomBadge } from "@/components/custom-badges";
import { ProjectsLoadingSkeleton } from "@/components/loading-skeleton";
import { useProjects } from "@/hooks/useProjects";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { projectService } from "@/services/projectService";
import { CreateProjectRequest, UpdateProjectRequest, Project } from "@/types/project";
import { getUser } from "@/lib/auth";

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const { projects, loading, error, createProject, updateProject, deleteProject, refresh } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? getUser() : null;
  const isAuthenticated = mounted && currentUser !== null;
  const isAdmin = mounted && currentUser?.role === 'admin';

  // Check if user owns the project or is admin
  const canEditProject = (project: Project) => {
    if (!currentUser) return false;
    return isAdmin || project.created_by === currentUser.id;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.key_activities.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.responsible_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.responsible_last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    setIsFormLoading(true);
    try {
      await createProject(data as CreateProjectRequest);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleUpdateProject = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (!editingProject) return;
    
    setIsFormLoading(true);
    try {
      await updateProject(editingProject.id, data as UpdateProjectRequest);
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?')) {
      await deleteProject(projectId);
    }
  };

  const getStatusColor = (status: string) => {
    return projectService.getStatusColor(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "planning":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    return projectService.getStatusLabel(status);
  };

  const getTypeText = (type: string) => {
    return projectService.getTypeLabel(type);
  };

  // Loading Component
  const LoadingState = () => (
    <div className="space-y-6">
      <ProjectsLoadingSkeleton />
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          เกิดข้อผิดพลาด
        </h3>
        <p className="text-slate-700 font-medium mb-4">{error}</p>
        <Button
          onClick={refresh}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          ลองใหม่
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ค้นหาโครงการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 w-full sm:w-auto cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>กรอง</span>
            </Button>
          </div>
          {/* Show add button for authenticated users */}
          {isAuthenticated && (
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">เพิ่มโครงการใหม่</span>
                  <span className="sm:hidden">เพิ่มโครงการ</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
                <DialogHeader>
                  <DialogTitle>สร้างโครงการใหม่</DialogTitle>
                </DialogHeader>
                <ProjectForm
                  onSubmit={handleCreateProject}
                  onCancel={() => setIsCreateModalOpen(false)}
                  isLoading={isFormLoading}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <DialogHeader>
              <DialogTitle>แก้ไขโครงการ</DialogTitle>
            </DialogHeader>
            {editingProject && (
              <ProjectForm
                project={editingProject}
                onSubmit={handleUpdateProject}
                onCancel={() => setEditingProject(null)}
                isLoading={isFormLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState />}

        {!loading && !error && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
                  {searchTerm ? "ไม่พบโครงการที่ค้นหา" : "ยังไม่มีโครงการ"}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium mb-4">
                  {searchTerm
                    ? "ลองค้นหาด้วยคำอื่น"
                    : "เริ่มต้นด้วยการสร้างโครงการแรกของคุณ"}
                </p>
                {!searchTerm && isAuthenticated && (
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มโครงการใหม่
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {project.name}
                            </CardTitle>
                          </div>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            project.status
                          )} border flex items-center gap-1 flex-shrink-0 ml-2`}
                        >
                          <span className="hidden sm:flex">
                            {getStatusIcon(project.status)}
                          </span>
                          <span className="text-xs">
                            {getStatusText(project.status)}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 sm:px-6">
                      <div className="space-y-3 sm:space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {project.key_activities.substring(0, 100)}
                          {project.key_activities.length > 100 && "..."}
                        </p>

                        <div className="flex items-center text-xs sm:text-sm text-slate-500">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {projectService.formatThaiDate(project.start_date)}{" "}
                            - {projectService.formatThaiDate(project.end_date)}
                          </span>
                        </div>

                        {project.budget > 0 && (
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-slate-600">งบประมาณ</span>
                            <span className="font-semibold text-slate-900 text-right">
                              {projectService.formatCurrency(project.budget)}
                            </span>
                          </div>
                        )}

                        {/* Strategic Issues and Strategies */}
                        {((project.strategic_issues_details &&
                          project.strategic_issues_details.length > 0) ||
                          (project.strategies_details &&
                            project.strategies_details.length > 0) ||
                          (project.strategic_issues &&
                            project.strategic_issues.length > 0) ||
                          (project.strategies &&
                            project.strategies.length > 0)) && (
                          <div className="pt-2 border-t border-slate-200 space-y-2">
                            {/* Strategic Issues */}
                            {((project.strategic_issues_details &&
                              project.strategic_issues_details.length > 0) ||
                              (project.strategic_issues &&
                                project.strategic_issues.length > 0)) && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  ประเด็นยุทธศาสตร์:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {project.strategic_issues_details &&
                                  project.strategic_issues_details.length > 0
                                    ? // Show populated relationship data
                                      project.strategic_issues_details.map(
                                        (
                                          issue: {
                                            id: string;
                                            title: string;
                                            description?: string;
                                          },
                                          index: number
                                        ) => (
                                          <CustomBadge
                                            key={issue.id || index}
                                            color="blue"
                                            className="text-xs"
                                          >
                                            {issue.title}
                                          </CustomBadge>
                                        )
                                      )
                                    : project.strategic_issues &&
                                      project.strategic_issues.length > 0
                                    ? // Show fallback for deleted data
                                      project.strategic_issues.map(
                                        (issueId: string, index: number) => (
                                          <CustomBadge
                                            key={`deleted-issue-${index}`}
                                            color="gray"
                                            className="text-xs"
                                          >
                                            ประเด็น (ลบแล้ว)
                                          </CustomBadge>
                                        )
                                      )
                                    : null}
                                </div>
                              </div>
                            )}

                            {/* Strategies */}
                            {((project.strategies_details &&
                              project.strategies_details.length > 0) ||
                              (project.strategies &&
                                project.strategies.length > 0)) && (
                              <div>
                                <p className="text-xs text-slate-500 mb-1">
                                  กลยุทธ์:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {project.strategies_details &&
                                  project.strategies_details.length > 0
                                    ? // Show populated relationship data
                                      project.strategies_details.map(
                                        (
                                          strategy: {
                                            id: string;
                                            name: string;
                                            description?: string;
                                            strategic_issue_title?: string;
                                          },
                                          index: number
                                        ) => (
                                          <CustomBadge
                                            key={strategy.id || index}
                                            color="purple"
                                            className="text-xs"
                                          >
                                            {strategy.name}
                                          </CustomBadge>
                                        )
                                      )
                                    : project.strategies &&
                                      project.strategies.length > 0
                                    ? // Show fallback for deleted data
                                      project.strategies.map(
                                        (strategyId: string, index: number) => (
                                          <CustomBadge
                                            key={`deleted-strategy-${index}`}
                                            color="gray"
                                            className="text-xs"
                                          >
                                            กลยุทธ์ (ลบแล้ว)
                                          </CustomBadge>
                                        )
                                      )
                                    : null}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-500 mb-2">ประเภท:</p>
                          <CustomBadge color="blue" className="text-xs">
                            {getTypeText(project.project_type)}
                          </CustomBadge>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-xs text-slate-500 mb-2">
                            ผู้รับผิดชอบ:
                          </p>
                          <div className="text-xs sm:text-sm text-slate-600">
                            {project.responsible_title_prefix}{" "}
                            {project.responsible_first_name}{" "}
                            {project.responsible_last_name}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {project.responsible_position}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-slate-500">
                              อัปเดตล่าสุด
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-600">
                            {projectService.formatThaiDate(project.updated_at)}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-slate-200">
                          {/* Show edit/delete buttons for project owners or admin */}
                          {canEditProject(project) && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProject(project)}
                                className="cursor-pointer flex items-center justify-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>แก้ไข</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                className="cursor-pointer flex items-center justify-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm w-full sm:w-auto"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>ลบ</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
