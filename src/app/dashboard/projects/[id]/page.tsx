"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, CustomBadge } from "@/components/custom-badges";
import { useProject } from "@/hooks/useProjects";
import { isAuthenticated } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, ArrowLeft, Edit, Trash2 } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [authed, setAuthed] = useState<boolean>(false);
  const idToUse = authed ? id : "";
  const { project, loading, error } = useProject(idToUse);
  const { user } = useAuth();

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
    setAuthed(isAuthenticated());
  }, [params]);



  if (!authed) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              เข้าสู่ระบบเพื่อดูรายละเอียดโครงการ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">หน้านี้ต้องเข้าสู่ระบบก่อนจึงจะเข้าดูได้</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/login")} className="cursor-pointer">ไปที่หน้าเข้าสู่ระบบ</Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="cursor-pointer">กลับหน้า Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-1/2 bg-slate-200 rounded" />
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-24 w-full bg-slate-200 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle>ไม่พบโครงการ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{error || "ไม่พบข้อมูลโครงการที่ต้องการ"}</p>
            <Button variant="outline" onClick={() => router.push("/dashboard/projects")} className="cursor-pointer">
              กลับไปหน้ารายการโครงการ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || user?.id === project?.created_by;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
        </Button>
        
        {canEdit && project && (
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-1" /> แก้ไข
            </Button>
            {user?.role === 'admin' && (
              <Button 
                variant="destructive"
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?')) {
                    // TODO: Implement delete functionality
                    console.log('Delete project:', project.id);
                  }
                }}
                className="cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-1" /> ลบ
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-slate-900 break-words">
              {project.name}
            </CardTitle>
            <StatusBadge status={project.status} />
          </div>
          {project.key_activities && (
            <p className="text-slate-600 mt-2 whitespace-pre-wrap break-words">{project.key_activities}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(project.start_date).toLocaleDateString("th-TH")} - {new Date(project.end_date).toLocaleDateString("th-TH")}
          </div>

          {(project.strategic_issues?.length || 0) > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1">ประเด็นยุทธศาสตร์:</p>
              <div className="flex flex-wrap gap-1">
                {project.strategic_issues.map((issueId, idx) => (
                  <CustomBadge key={`${issueId}-${idx}`} color="blue" className="whitespace-normal break-words">
                    {issueId}
                  </CustomBadge>
                ))}
              </div>
            </div>
          )}

          {(project.strategies?.length || 0) > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-1">กลยุทธ์:</p>
              <div className="flex flex-wrap gap-1">
                {project.strategies.map((strategyId, idx) => (
                  <CustomBadge key={`${strategyId}-${idx}`} color="green" className="whitespace-normal break-words">
                    {strategyId}
                  </CustomBadge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
