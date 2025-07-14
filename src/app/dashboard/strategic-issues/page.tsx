"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StrategicIssuesLoadingSkeleton } from "@/components/loading-skeleton";
import { useStrategicIssues } from "@/hooks/useStrategicIssues";
import {
  Target,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import type {
  CreateStrategicIssueData,
  UpdateStrategicIssueData,
  StrategicIssue,
} from "@/types/strategicIssues";
import { getUser } from "@/lib/auth";

export default function StrategicIssuesPage() {
  const [mounted, setMounted] = useState(false);
  const {
    strategicIssues,
    stats,
    loading,
    error,
    retry,
    create,
    update,
    remove,
  } = useStrategicIssues();

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<StrategicIssue | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? getUser() : null;
  const isAdmin = mounted && currentUser?.role === "admin";

  // Helper functions for Buddhist Era (BE) conversion
  const currentYear = new Date().getFullYear();
  const toBuddhistYear = (gregorianYear: number) => gregorianYear + 543;
  const toGregorianYear = (buddhistYear: number) => buddhistYear - 543;

  // Function to group strategic issues by year period
  const groupStrategicIssuesByPeriod = (issues: StrategicIssue[]) => {
    const grouped: { [key: string]: StrategicIssue[] } = {};
    
    issues.forEach(issue => {
      const periodKey = `${issue.start_year}-${issue.end_year}`;
      if (!grouped[periodKey]) {
        grouped[periodKey] = [];
      }
      grouped[periodKey].push(issue);
    });

    // Sort each group by order
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    // Sort periods by start year
    const sortedPeriods = Object.keys(grouped).sort((a, b) => {
      const [startYearA] = a.split('-').map(Number);
      const [startYearB] = b.split('-').map(Number);
      return startYearA - startYearB;
    });

    return { grouped, sortedPeriods };
  };

  // Form state
  const [formData, setFormData] = useState<CreateStrategicIssueData>({
    title: "",
    description: "",
    start_year: currentYear,
    end_year: currentYear + 4,
    status: "active",
  });

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Convert Gregorian years to Buddhist years before sending to backend
      const createData = {
        ...formData,
        start_year: toBuddhistYear(formData.start_year),
        end_year: toBuddhistYear(formData.end_year)
      };
      await create(createData);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating strategic issue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      setIsSubmitting(true);
      // Convert Gregorian years to Buddhist years before sending to backend
      const updateData: UpdateStrategicIssueData = {
        title: formData.title,
        description: formData.description,
        start_year: toBuddhistYear(formData.start_year),
        end_year: toBuddhistYear(formData.end_year),
        status: formData.status,
      };
      await update(selectedIssue.id, updateData);
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error("Error updating strategic issue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบประเด็นยุทธศาสตร์นี้หรือไม่?")) {
      return;
    }

    try {
      await remove(id);
    } catch (err) {
      console.error("Error deleting strategic issue:", err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_year: currentYear,
      end_year: currentYear + 4,
      status: "active",
    });
    setSelectedIssue(null);
  };

  // Open edit modal
  const openEditModal = (issue: StrategicIssue) => {
    setSelectedIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      // If data from database is already in Buddhist Era, convert to Gregorian for internal state
      start_year: toGregorianYear(issue.start_year),
      end_year: toGregorianYear(issue.end_year),
      status: issue.status,
    });
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = (issue: StrategicIssue) => {
    setSelectedIssue(issue);
    setShowDetailModal(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "ดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
      case "inactive":
        return "ไม่ใช้งาน";
      default:
        return status;
    }
  };

  // Loading Component
  const LoadingState = () => (
    <div className="space-y-6">
      <StrategicIssuesLoadingSkeleton />
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          เกิดข้อผิดพลาด
        </h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button
          onClick={retry}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
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
        <div className="flex justify-end">
          {/* Only show add button for admin users */}
          {isAdmin && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มประเด็นใหม่
            </Button>
          )}
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState />}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">
                          ทั้งหมด
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {stats.total}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-500 rounded-full">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">
                          กำลังดำเนินการ
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {stats.active}
                        </p>
                      </div>
                      <div className="p-3 bg-green-500 rounded-full">
                        <TrendingUp className="h-6 w-6 text-white" />
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
                        <p className="text-2xl font-bold text-purple-900">
                          {stats.completed}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500 rounded-full">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          ไม่ใช้งาน
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {stats.inactive}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-500 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Strategic Issues Cards - Grouped by Period */}
            {strategicIssues.length > 0 && (() => {
              const { grouped, sortedPeriods } = groupStrategicIssuesByPeriod(strategicIssues);
              
              return (
                <div className="space-y-8">
                  {sortedPeriods.map((period) => (
                    <div key={period} className="space-y-4">
                      {/* Period Header */}
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-800">
                          แผนปีงบประมาณ {period}
                        </h2>
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-sm text-slate-500 font-medium">
                          {grouped[period].length} ประเด็น
                        </span>
                      </div>
                      
                      {/* Issues Grid for this period */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {grouped[period].map((issue) => (
                          <Card
                            key={issue.id}
                            className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                            onClick={() => openDetailModal(issue)}
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {issue.order || 1}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                      ประเด็นยุทธศาสตร์ที่ {issue.order || 1}
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                                      {issue.title}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className={getStatusColor(issue.status)}>
                                        {getStatusText(issue.status)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                {/* Only show edit/delete buttons for admin users */}
                                {isAdmin && (
                                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditModal(issue)}
                                      className="h-8 w-8 p-0 hover:bg-green-50 cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(issue.id)}
                                      className="h-8 w-8 p-0 hover:bg-red-50 cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                  {issue.description}
                                </p>

                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {issue.start_year} - {issue.end_year}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{issue.creator?.name || "ไม่ระบุ"}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Empty State */}
            {strategicIssues.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  ยังไม่มีประเด็นยุทธศาสตร์
                </h3>
                <p className="text-gray-500 mb-6">
                  เริ่มต้นสร้างประเด็นยุทธศาสตร์แรกของคุณ
                </p>
                {isAdmin && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มประเด็นยุทธศาสตร์
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Create Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>เพิ่มประเด็นยุทธศาสตร์ใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลประเด็นยุทธศาสตร์ที่ต้องการเพิ่ม
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อประเด็นยุทธศาสตร์</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="ระบุชื่อประเด็นยุทธศาสตร์"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="อธิบายรายละเอียดของประเด็นยุทธศาสตร์"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_year">ปีเริ่มต้น (พ.ศ.)</Label>
                  <Input
                    id="start_year"
                    type="number"
                    value={toBuddhistYear(formData.start_year)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        start_year:
                          toGregorianYear(parseInt(e.target.value)) || currentYear,
                      })
                    }
                    min={toBuddhistYear(2020)}
                    max={toBuddhistYear(2030)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_year">ปีสิ้นสุด (พ.ศ.)</Label>
                  <Input
                    id="end_year"
                    type="number"
                    value={toBuddhistYear(formData.end_year)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        end_year:
                          toGregorianYear(parseInt(e.target.value)) ||
                          currentYear + 4,
                      })
                    }
                    min={toBuddhistYear(2020)}
                    max={toBuddhistYear(2030)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">สถานะ</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "completed") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">ดำเนินการ</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มประเด็นยุทธศาสตร์
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>แก้ไขประเด็นยุทธศาสตร์</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลประเด็นยุทธศาสตร์
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">ชื่อประเด็นยุทธศาสตร์</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="ระบุชื่อประเด็นยุทธศาสตร์"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">รายละเอียด</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="อธิบายรายละเอียดของประเด็นยุทธศาสตร์"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start_year">ปีเริ่มต้น (พ.ศ.)</Label>
                  <Input
                    id="edit-start_year"
                    type="number"
                    value={toBuddhistYear(formData.start_year)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        start_year:
                          toGregorianYear(parseInt(e.target.value)) || currentYear,
                      })
                    }
                    min={toBuddhistYear(2020)}
                    max={toBuddhistYear(2030)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-end_year">ปีสิ้นสุด (พ.ศ.)</Label>
                  <Input
                    id="edit-end_year"
                    type="number"
                    value={toBuddhistYear(formData.end_year)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        end_year:
                          toGregorianYear(parseInt(e.target.value)) ||
                          currentYear + 4,
                      })
                    }
                    min={toBuddhistYear(2020)}
                    max={toBuddhistYear(2030)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">สถานะ</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "completed") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">ดำเนินการ</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      บันทึกการแก้ไข
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>รายละเอียดประเด็นยุทธศาสตร์</DialogTitle>
            </DialogHeader>
            {selectedIssue && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      ประเด็นยุทธศาสตร์ที่ {selectedIssue.order || 1}
                    </h3>
                    <p className="text-lg text-slate-700 mt-1">
                      {selectedIssue.title}
                    </p>
                  </div>
                  <Badge className={getStatusColor(selectedIssue.status)}>
                    {getStatusText(selectedIssue.status)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">
                      รายละเอียด
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedIssue.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ลำดับ
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Target className="h-4 w-4" />
                        <span>ประเด็นที่ {selectedIssue.order || 1}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ปีงบประมาณ
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {selectedIssue.start_year} - {selectedIssue.end_year}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ผู้สร้าง
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User className="h-4 w-4" />
                        <span>{selectedIssue.creator?.name || "ไม่ระบุ"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
