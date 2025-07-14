"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  TrendingUp,
  Calendar,
  Users,
  Target,
  Loader2
} from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  getStrategicIssues, 
  getStrategicIssueStats,
  createStrategicIssue,
  updateStrategicIssue,
  deleteStrategicIssue 
} from '@/lib/strategicIssues';
import type { StrategicIssue, StrategicIssueStats, CreateStrategicIssueData, UpdateStrategicIssueData } from '@/types/strategicIssues';

export default function StrategicIssuesPage() {
  const [issues, setIssues] = useState<StrategicIssue[]>([]);
  const [stats, setStats] = useState<StrategicIssueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<StrategicIssue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState<CreateStrategicIssueData>({
    title: '',
    description: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 4,
    status: 'active'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load issues and stats in parallel
      const [issuesResponse, statsResponse] = await Promise.all([
        getStrategicIssues(),
        getStrategicIssueStats()
      ]);
      
      setIssues(issuesResponse.data.issues);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Error loading strategic issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = !searchTerm || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || issue.status === statusFilter;
    
    const matchesYear = !yearFilter || 
      (parseInt(yearFilter) >= issue.start_year && parseInt(yearFilter) <= issue.end_year);
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  // Handle create issue
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await createStrategicIssue(formData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        start_year: new Date().getFullYear(),
        end_year: new Date().getFullYear() + 4,
        status: 'active'
      });
      setShowCreateModal(false);
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error creating strategic issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit issue
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingIssue) return;
    
    try {
      setIsSubmitting(true);
      const updateData: UpdateStrategicIssueData = {
        title: formData.title,
        description: formData.description,
        start_year: formData.start_year,
        end_year: formData.end_year,
        status: formData.status
      };
      
      await updateStrategicIssue(editingIssue.id, updateData);
      
      // Close modal and reload data
      setShowEditModal(false);
      setEditingIssue(null);
      await loadData();
    } catch (error) {
      console.error('Error updating strategic issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete issue
  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบประเด็นยุทธศาสตร์นี้หรือไม่?')) {
      return;
    }
    
    try {
      await deleteStrategicIssue(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting strategic issue:', error);
    }
  };

  // Open edit modal
  const openEditModal = (issue: StrategicIssue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      start_year: issue.start_year,
      end_year: issue.end_year,
      status: issue.status
    });
    setShowEditModal(true);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ดำเนินการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'inactive': return 'ไม่ใช้งาน';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600">กำลังโหลดประเด็นยุทธศาสตร์...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Target className="text-blue-600" />
                  ประเด็นยุทธศาสตร์
                </h1>
                <p className="text-slate-600 mt-2">จัดการประเด็นยุทธศาสตร์ขององค์กร</p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มประเด็นยุทธศาสตร์
              </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">ทั้งหมด</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">กำลังดำเนินการ</p>
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">เสร็จสิ้น</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">ช่วงปี</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stats.earliest_year}-{stats.latest_year}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="ค้นหาประเด็นยุทธศาสตร์..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="สถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ทุกสถานะ</SelectItem>
                      <SelectItem value="active">กำลังดำเนินการ</SelectItem>
                      <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                      <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    placeholder="ปี"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full md:w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {issue.title}
                    </CardTitle>
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusText(issue.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {issue.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {issue.start_year} - {issue.end_year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {issue.creator.name}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(issue)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      แก้ไข
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(issue.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  ไม่พบประเด็นยุทธศาสตร์
                </h3>
                <p className="text-slate-600 mb-4">
                  ไม่พบประเด็นยุทธศาสตร์ที่ตรงกับการค้นหา
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มประเด็นยุทธศาสตร์แรก
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>เพิ่มประเด็นยุทธศาสตร์ใหม่</CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="title">ชื่อประเด็นยุทธศาสตร์ *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="กรอกชื่อประเด็นยุทธศาสตร์"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">รายละเอียด</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                      placeholder="กรอกรายละเอียดประเด็นยุทธศาสตร์"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_year">ปีเริ่มต้น *</Label>
                      <Input
                        id="start_year"
                        type="number"
                        value={formData.start_year}
                        onChange={(e) => setFormData({...formData, start_year: parseInt(e.target.value)})}
                        min="2000"
                        max="2100"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="end_year">ปีสิ้นสุด *</Label>
                      <Input
                        id="end_year"
                        type="number"
                        value={formData.end_year}
                        onChange={(e) => setFormData({...formData, end_year: parseInt(e.target.value)})}
                        min="2000"
                        max="2100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">สถานะ</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'active' | 'inactive' | 'completed') => 
                        setFormData({...formData, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">กำลังดำเนินการ</SelectItem>
                        <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                        <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      ยกเลิก
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          กำลังบันทึก...
                        </>
                      ) : (
                        'บันทึก'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>แก้ไขประเด็นยุทธศาสตร์</CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <Label htmlFor="edit_title">ชื่อประเด็นยุทธศาสตร์ *</Label>
                    <Input
                      id="edit_title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="กรอกชื่อประเด็นยุทธศาสตร์"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit_description">รายละเอียด</Label>
                    <Textarea
                      id="edit_description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                      placeholder="กรอกรายละเอียดประเด็นยุทธศาสตร์"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit_start_year">ปีเริ่มต้น *</Label>
                      <Input
                        id="edit_start_year"
                        type="number"
                        value={formData.start_year}
                        onChange={(e) => setFormData({...formData, start_year: parseInt(e.target.value)})}
                        min="2000"
                        max="2100"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit_end_year">ปีสิ้นสุด *</Label>
                      <Input
                        id="edit_end_year"
                        type="number"
                        value={formData.end_year}
                        onChange={(e) => setFormData({...formData, end_year: parseInt(e.target.value)})}
                        min="2000"
                        max="2100"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit_status">สถานะ</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'active' | 'inactive' | 'completed') => 
                        setFormData({...formData, status: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">กำลังดำเนินการ</SelectItem>
                        <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                        <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingIssue(null);
                      }}
                      className="flex-1"
                    >
                      ยกเลิก
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          กำลังบันทึก...
                        </>
                      ) : (
                        'บันทึกการแก้ไข'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
