"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StatusBadge, CustomBadge } from "@/components/custom-badges";
import { publicService } from "@/services/publicService";
import type { Project } from "@/types/project";
import { 
  Calendar, 
  ArrowLeft, 
  User, 
  MapPin, 
  DollarSign, 
  Target, 
  FileText, 
  Building2,
  Phone,
  Mail,
  Flag,
  Briefcase,
  ExternalLink
} from "lucide-react";

interface PublicProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProjectDetailPage({ params }: PublicProjectDetailPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resolvedParams = await params;
        const projectId = resolvedParams.id;
        
        setLoading(true);
        setError(null);
        // Try to fetch with id filter first (if backend supports it), else fallback to full list
        const response = await publicService.getProjects({ id: projectId } as Record<string, unknown>).catch(() => null);
        if (response && response.success) {
          const found = response.data.projects?.find((p: Project) => p.id === projectId) || null;
          setProject(found);
          setAllProjects(response.data.projects || []);
        } else {
          const listResp = await publicService.getProjects();
          const items = listResp.data.projects || [];
          setAllProjects(items);
          setProject(items.find((p: Project) => p.id === projectId) || null);
        }
      } catch (e) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err?.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดโครงการ");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const relatedProjects = useMemo(() => {
    if (!project || !allProjects?.length) return [] as Project[];
    const setIssues = new Set(project.strategic_issues || []);
    const setStrategies = new Set(project.strategies || []);
    const related = allProjects
      .filter(p => p.id !== project.id)
      .map(p => ({
        p,
        score:
          ((p.strategic_issues || []).some(i => setIssues.has(i)) ? 1 : 0) +
          ((p.strategies || []).some(s => setStrategies.has(s)) ? 1 : 0),
      }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(x => x.p);
    return related;
  }, [project, allProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 w-1/2 bg-slate-200 rounded" />
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-24 w-full bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg text-slate-900">ไม่พบโครงการ</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 space-y-4">
              <p className="text-slate-600">{error || "ไม่พบข้อมูลโครงการที่ต้องการ"}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/projects")} className="cursor-pointer">
                  กลับหน้าโครงการ
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="cursor-pointer">
                  หน้าหลัก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()} 
            className="cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> กลับ
          </Button>
        </div>
      </div>

      {/* Project Header Card */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 line-clamp-2 mb-2">
                  {project.name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(project.start_date).toLocaleDateString("th-TH")} - {new Date(project.end_date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">{project.budget.toLocaleString()} บาท</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="shrink-0 ml-4">
              <StatusBadge status={project.status} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Key Activities Section */}
        {project.key_activities && (
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                กิจกรรมหลัก
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {project.key_activities}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Expected Results Section */}
        {project.expected_results && (
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                ผลลัพธ์ที่คาดหวัง
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {project.expected_results}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Responsible Person Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                ผู้รับผิดชอบโครงการ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 space-y-3 sm:space-y-4">
              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900">
                  {project.responsible_title_prefix} {project.responsible_first_name} {project.responsible_last_name}
                </h4>
                <p className="text-slate-600 mt-1 text-sm">{project.responsible_position}</p>
              </div>
              
              {project.responsible_phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-sm">{project.responsible_phone}</span>
                </div>
              )}
              
              {project.responsible_email && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="break-all text-sm">{project.responsible_email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Information Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                ข้อมูลโครงการ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 space-y-3 sm:space-y-4">
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">ประเภท:</p>
                <CustomBadge color="blue" className="text-xs">
                  {project.project_type === 'continuous' ? 'โครงการต่อเนื่อง' : 'โครงการใหม่'}
                </CustomBadge>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">สถานะ:</p>
                <StatusBadge status={project.status} />
              </div>
                
                {project.budget && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      งบประมาণ
                    </span>
                    <span className="text-green-800 font-bold text-lg">
                      {project.budget.toLocaleString()} บาท
                    </span>
                  </div>
                )}
                
                {(project.districts && project.districts.length > 0) && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      พื้นที่ดำเนินการ:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.districts.map((district, idx) => (
                        <CustomBadge key={idx} color="purple" className="text-xs">
                          {district}
                        </CustomBadge>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.activity_location && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      สถานที่จัดกิจกรรม:
                    </p>
                    <p className="text-sm text-slate-700">
                      {project.activity_location}
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Document Links Section */}
        {project.document_links && project.document_links.length > 0 && (
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                เอกสารที่เกี่ยวข้อง
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.document_links.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-teal-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-all duration-200 group"
                  >
                    <span className="text-slate-700 font-medium group-hover:text-teal-700">
                      {doc.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-500" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strategic Issues & Strategies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {(project.strategic_issues_details?.length || project.strategic_issues?.length) && (
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  ประเด็นยุทธศาสตร์
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="flex flex-wrap gap-3">
                  {(project.strategic_issues_details?.length ? project.strategic_issues_details : (project.strategic_issues || [])).map((issue: { id: string; title: string } | string, idx: number) => {
                    const key = typeof issue === 'string' ? issue : issue.id;
                    const text = typeof issue === 'string' ? issue : issue.title;
                    return (
                      <CustomBadge key={key || idx} color="blue" className="whitespace-normal break-words text-sm px-3 py-2">
                        {text}
                      </CustomBadge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {(project.strategies_details?.length || project.strategies?.length) && (
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Flag className="w-4 h-4 text-white" />
                  </div>
                  กลยุทธ์
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="flex flex-wrap gap-3">
                  {(project.strategies_details?.length ? project.strategies_details : (project.strategies || [])).map((strategy: { id: string; name: string } | string, idx: number) => {
                    const key = typeof strategy === 'string' ? strategy : strategy.id;
                    const text = typeof strategy === 'string' ? strategy : strategy.name;
                    return (
                      <CustomBadge key={key || idx} color="green" className="whitespace-normal break-words text-sm px-3 py-2">
                        {text}
                      </CustomBadge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Related Projects Section */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-3 text-lg text-slate-900">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              โครงการที่เกี่ยวข้อง
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 sm:px-6">
            {relatedProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600">ไม่มีโครงการที่เกี่ยวข้อง</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {relatedProjects.map((rp) => (
                  <Card 
                    key={rp.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                    onClick={() => router.push(`/projects/${rp.id}`)}
                  >
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <CardTitle className="text-base font-semibold text-slate-900 break-words group-hover:text-blue-600 transition-colors line-clamp-2">
                          {rp.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 sm:px-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center text-xs sm:text-sm text-slate-500">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(rp.start_date).toLocaleDateString("th-TH")} - {new Date(rp.end_date).toLocaleDateString("th-TH")}
                        </span>
                      </div>
                      
                      {rp.budget && (
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-600">งบประมาณ</span>
                          <span className="font-semibold text-slate-900 text-right">
                            {rp.budget.toLocaleString()} บาท
                          </span>
                        </div>
                      )}
                      
                      {(rp.strategies_details?.length || rp.strategies?.length) && (
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <p className="text-xs text-slate-500 mb-1">กลยุทธ์:</p>
                          <div className="flex flex-wrap gap-1">
                            {(rp.strategies_details?.length ? rp.strategies_details : (rp.strategies || [])).slice(0, 2).map((s: { id: string; name: string } | string, i: number) => {
                              const key = typeof s === 'string' ? s : s.id;
                              const text = typeof s === 'string' ? s : s.name;
                              return (
                                <CustomBadge key={key || i} color="purple" className="text-xs">
                                  {text}
                                </CustomBadge>
                              );
                            })}
                            {(rp.strategies_details?.length || rp.strategies?.length || 0) > 2 && (
                              <CustomBadge color="gray" className="text-xs">
                                +{(rp.strategies_details?.length || rp.strategies?.length || 0) - 2} อื่นๆ
                              </CustomBadge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
