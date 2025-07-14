"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { StrategiesLoadingSkeleton } from "@/components/loading-skeleton";
import { useStrategies } from "@/hooks/useStrategies";
import { useStrategicIssues } from "@/hooks/useStrategicIssues";
import { getUser } from "@/lib/auth";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  AlertTriangle, 
  RefreshCw,
  Loader2,
  Users
} from "lucide-react";
import type { CreateStrategyData, UpdateStrategyData, Strategy } from "@/types/strategies";

export default function StrategiesPage() {
  const [mounted, setMounted] = useState(false);
  const { strategies, loading, error, retry, create, update, remove } = useStrategies();
  const { strategicIssues } = useStrategicIssues();
  
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateStrategyData>({
    strategic_issue_id: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? getUser() : null;
  const isAdmin = mounted && currentUser?.role === 'admin';

  // Function to group strategies by strategic issue
  const groupStrategiesByIssue = (strategies: Strategy[]) => {
    const grouped: { [key: string]: Strategy[] } = {};
    const ungrouped: Strategy[] = [];
    
    strategies.forEach(strategy => {
      if (strategy.strategic_issue_id && strategy.strategic_issue) {
        if (!grouped[strategy.strategic_issue_id]) {
          grouped[strategy.strategic_issue_id] = [];
        }
        grouped[strategy.strategic_issue_id].push(strategy);
      } else {
        ungrouped.push(strategy);
      }
    });

    // Sort each group by order
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    // Sort ungrouped strategies by order
    ungrouped.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Sort strategic issues by their order and start year
    const sortedIssueIds = Object.keys(grouped).sort((a, b) => {
      const issueA = grouped[a][0]?.strategic_issue;
      const issueB = grouped[b][0]?.strategic_issue;
      
      if (!issueA || !issueB) return 0;
      
      // Sort by start year first, then by strategic issue order
      if (issueA.start_year !== issueB.start_year) {
        return (issueA.start_year || 0) - (issueB.start_year || 0);
      }
      return (issueA.order || 0) - (issueB.order || 0);
    });

    return { grouped, ungrouped, sortedIssueIds };
  };

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await create(formData);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating strategy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStrategy) return;
    
    try {
      setIsSubmitting(true);
      const updateData: UpdateStrategyData = {
        strategic_issue_id: formData.strategic_issue_id,
        name: formData.name,
        description: formData.description
      };
      await update(selectedStrategy.id, updateData);
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error('Error updating strategy:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบกลยุทธ์นี้หรือไม่?')) {
      return;
    }
    
    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting strategy:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      strategic_issue_id: '',
      name: '',
      description: ''
    });
    setSelectedStrategy(null);
  };

  // Open edit modal
  const openEditModal = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setFormData({
      strategic_issue_id: strategy.strategic_issue_id,
      name: strategy.name,
      description: strategy.description
    });
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setShowDetailModal(true);
  };

  // Loading Component
  const LoadingState = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-20 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-white/95 backdrop-blur-sm border border-slate-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-20"></div>
                  <div className="h-8 bg-slate-100 rounded animate-pulse w-12"></div>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <StrategiesLoadingSkeleton />
    </div>
  );

  // Error Component
  const ErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h3 className="text-lg font-semibold text-slate-900">เกิดข้อผิดพลาด</h3>
        <p className="text-slate-600 max-w-md">{error}</p>
        <Button
          onClick={retry}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>ค้นหา</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>กรอง</span>
            </Button>
            {/* Only show add button for admin users */}
            {isAdmin && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มกลยุทธ์ใหม่
              </Button>
            )}
          </div>
        </div>

        {loading && <LoadingState />}
        {error && !loading && <ErrorState />}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        กลยุทธ์ทั้งหมด
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {strategies.length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        กลยุทธ์ที่เชื่อมโยง
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {strategies.filter((s) => s.strategic_issue_id).length}
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
                      <p className="text-sm font-medium text-purple-700">
                        ผู้สร้าง
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {new Set(strategies.map((s) => s.created_by)).size}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">
                        ประเด็นยุทธศาสตร์
                      </p>
                      <p className="text-3xl font-bold text-orange-900">
                        {strategicIssues.length}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategies Grid - Grouped by Strategic Issue */}
            {strategies.length > 0 && (() => {
              const { grouped, ungrouped, sortedIssueIds } = groupStrategiesByIssue(strategies);
              
              return (
                <div className="space-y-8">
                  {/* Grouped Strategies */}
                  {sortedIssueIds.map((issueId) => {
                    const issueStrategies = grouped[issueId];
                    const strategicIssue = issueStrategies[0]?.strategic_issue;
                    
                    return (
                      <div key={issueId} className="space-y-4">
                        {/* Strategic Issue Header */}
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-800">
                              ประเด็นยุทธศาสตร์ที่ {strategicIssue?.order || 1}
                            </h2>
                            <p className="text-sm text-slate-600">
                              {strategicIssue?.title}
                            </p>
                          </div>
                          <div className="flex-1 h-px bg-slate-200"></div>
                          <span className="text-sm text-slate-500 font-medium">
                            {issueStrategies.length} กลยุทธ์
                          </span>
                        </div>
                        
                        {/* Strategies Grid for this issue */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {issueStrategies.map((strategy) => (
                            <Card
                              key={strategy.id}
                              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                              onClick={() => openDetailModal(strategy)}
                            >
                              <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                      <span className="text-white font-bold text-sm">
                                        {strategy.order || 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        กลยุทธ์ที่ {strategy.order || 1}
                                      </CardTitle>
                                      <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                                        {strategy.name}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Only show edit/delete buttons for admin users */}
                                  {isAdmin && (
                                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditModal(strategy)}
                                        className="h-8 w-8 p-0 hover:bg-green-50 cursor-pointer"
                                      >
                                        <Edit className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(strategy.id)}
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
                                    {strategy.description}
                                  </p>

                                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-4 w-4" />
                                      <span>{strategy.creator?.name || "ไม่ระบุ"}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Ungrouped Strategies */}
                  {ungrouped.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-800">
                          กลยุทธ์ที่ไม่ได้เชื่อมโยงกับประเด็นยุทธศาสตร์
                        </h2>
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-sm text-slate-500 font-medium">
                          {ungrouped.length} กลยุทธ์
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {ungrouped.map((strategy) => (
                          <Card
                            key={strategy.id}
                            className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer"
                            onClick={() => openDetailModal(strategy)}
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                      {strategy.name}
                                    </CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">
                                      ไม่ได้เชื่อมโยงกับประเด็นยุทธศาสตร์
                                    </p>
                                  </div>
                                </div>
                                {/* Only show edit/delete buttons for admin users */}
                                {isAdmin && (
                                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openEditModal(strategy)}
                                      className="h-8 w-8 p-0 hover:bg-green-50 cursor-pointer"
                                    >
                                      <Edit className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(strategy.id)}
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
                                  {strategy.description}
                                </p>

                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4" />
                                    <span>{strategy.creator?.name || "ไม่ระบุ"}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Empty State */}
            {strategies.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  ยังไม่มีกลยุทธ์
                </h3>
                <p className="text-gray-500 mb-6">
                  เริ่มต้นสร้างกลยุทธ์แรกของคุณ
                </p>
                {isAdmin && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มกลยุทธ์
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
              <DialogTitle>เพิ่มกลยุทธ์ใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลกลยุทธ์ที่ต้องการเพิ่ม
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategic_issue_id">ประเด็นยุทธศาสตร์</Label>
                <Select
                  value={formData.strategic_issue_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, strategic_issue_id: value })
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 text-slate-900">
                    <SelectValue placeholder="เลือกประเด็นยุทธศาสตร์" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-xl z-50">
                    {strategicIssues.map((issue) => (
                      <SelectItem
                        key={issue.id}
                        value={issue.id}
                        className="hover:bg-slate-50 focus:bg-slate-50 text-slate-900"
                      >
                        {issue.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">ชื่อกลยุทธ์</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ระบุชื่อกลยุทธ์"
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
                  placeholder="อธิบายรายละเอียดของกลยุทธ์"
                  rows={4}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => setShowCreateModal(false)}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer hover:bg-blue-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มกลยุทธ์
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
              <DialogTitle>แก้ไขกลยุทธ์</DialogTitle>
              <DialogDescription>แก้ไขข้อมูลกลยุทธ์</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-strategic_issue_id">
                  ประเด็นยุทธศาสตร์
                </Label>
                <Select
                  value={formData.strategic_issue_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, strategic_issue_id: value })
                  }
                >
                  <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 text-slate-900">
                    <SelectValue placeholder="เลือกประเด็นยุทธศาสตร์" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-xl z-50">
                    {strategicIssues.map((issue) => (
                      <SelectItem
                        key={issue.id}
                        value={issue.id}
                        className="hover:bg-slate-50 focus:bg-slate-50 text-slate-900"
                      >
                        {issue.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">ชื่อกลยุทธ์</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ระบุชื่อกลยุทธ์"
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
                  placeholder="อธิบายรายละเอียดของกลยุทธ์"
                  rows={4}
                  required
                />
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
              <DialogTitle>รายละเอียดกลยุทธ์</DialogTitle>
            </DialogHeader>
            {selectedStrategy && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      กลยุทธ์ที่ {selectedStrategy.order || 1}
                    </h3>
                    <p className="text-lg text-slate-700 mt-1">
                      {selectedStrategy.name}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">กลยุทธ์</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">
                      รายละเอียด
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedStrategy.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ลำดับ
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <BarChart3 className="h-4 w-4" />
                        <span>กลยุทธ์ที่ {selectedStrategy.order || 1}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ประเด็นยุทธศาสตร์
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Target className="h-4 w-4" />
                        <span>
                          {selectedStrategy.strategic_issue?.title || "ไม่ระบุ"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">
                        ผู้สร้าง
                      </h4>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {selectedStrategy.creator?.name || "ไม่ระบุ"}
                        </span>
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
