"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { 
  CreateProjectRequest, 
  UpdateProjectRequest, 
  Project, 
  YALA_DISTRICTS, 
  PROJECT_TYPES, 
  PROJECT_STATUS, 
  TITLE_PREFIXES 
} from '@/types/project';
import { useStrategicIssues } from '@/hooks/useStrategicIssues';
import { useStrategies } from '@/hooks/useStrategies';
import { MultiSelect } from '../ui/multi-select';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    key_activities: '',
    budget: '',
    expected_results: '',
    project_type: 'new' as 'new' | 'continuous',
    start_date: '',
    end_date: '',
    responsible_title_prefix: '',
    responsible_first_name: '',
    responsible_last_name: '',
    responsible_position: '',
    responsible_phone: '',
    responsible_email: '',
    activity_location: '',
    districts: [] as string[],
    province: 'ยะลา',
    strategic_issues: [] as string[],
    strategies: [] as string[],
    status: 'planning' as 'planning' | 'active' | 'completed' | 'cancelled',
  });

  const [documentLinks, setDocumentLinks] = useState<Array<{ name: string; url: string }>>([]);
  const [newDocumentLink, setNewDocumentLink] = useState({ name: '', url: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { strategicIssues, loading: strategicIssuesLoading } = useStrategicIssues();
  const { strategies, loading: strategiesLoading } = useStrategies();

  // Load project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        key_activities: project.key_activities,
        budget: project.budget?.toString() || '',
        expected_results: project.expected_results,
        project_type: project.project_type,
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        responsible_title_prefix: project.responsible_title_prefix,
        responsible_first_name: project.responsible_first_name,
        responsible_last_name: project.responsible_last_name,
        responsible_position: project.responsible_position,
        responsible_phone: project.responsible_phone,
        responsible_email: project.responsible_email,
        activity_location: project.activity_location,
        districts: project.districts,
        province: project.province,
        strategic_issues: project.strategic_issues,
        strategies: project.strategies,
        status: project.status,
      });
      setDocumentLinks(project.document_links || []);
    }
  }, [project]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'ชื่อโครงการเป็นข้อมูลที่จำเป็น';
    if (!formData.key_activities.trim()) newErrors.key_activities = 'กิจกรรมหลักเป็นข้อมูลที่จำเป็น';
    if (!formData.expected_results.trim()) newErrors.expected_results = 'ผลลัพธ์ที่คาดหวังเป็นข้อมูลที่จำเป็น';
    if (!formData.start_date) newErrors.start_date = 'วันที่เริ่มต้นเป็นข้อมูลที่จำเป็น';
    if (!formData.end_date) newErrors.end_date = 'วันที่สิ้นสุดเป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_title_prefix) newErrors.responsible_title_prefix = 'คำนำหน้าผู้รับผิดชอบเป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_first_name.trim()) newErrors.responsible_first_name = 'ชื่อผู้รับผิดชอบเป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_last_name.trim()) newErrors.responsible_last_name = 'นามสกุลผู้รับผิดชอบเป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_position.trim()) newErrors.responsible_position = 'ตำแหน่งผู้รับผิดชอบเป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_phone.trim()) newErrors.responsible_phone = 'เบอร์โทรศัพท์เป็นข้อมูลที่จำเป็น';
    if (!formData.responsible_email.trim()) newErrors.responsible_email = 'อีเมลเป็นข้อมูลที่จำเป็น';
    if (!formData.activity_location.trim()) newErrors.activity_location = 'สถานที่ดำเนินกิจกรรมเป็นข้อมูลที่จำเป็น';
    if (formData.districts.length === 0) newErrors.districts = 'กรุณาเลือกอำเภออย่างน้อย 1 อำเภอ';
    if (formData.strategic_issues.length === 0) newErrors.strategic_issues = 'กรุณาเลือกประเด็นยุทธศาสตร์อย่างน้อย 1 ประเด็น';
    if (formData.strategies.length === 0) newErrors.strategies = 'กรุณาเลือกกลยุทธ์อย่างน้อย 1 กลยุทธ์';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.responsible_email && !emailRegex.test(formData.responsible_email)) {
      newErrors.responsible_email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    // Phone validation
    if (formData.responsible_phone && formData.responsible_phone.length < 10) {
      newErrors.responsible_phone = 'เบอร์โทรศัพท์ต้องมีความยาวอย่างน้อย 10 ตัว';
    }

    // Date validation
    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น';
    }

    // Budget validation
    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'งบประมาณต้องเป็นจำนวนบวก';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      document_links: documentLinks,
    };

    await onSubmit(submitData);
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddDocumentLink = () => {
    if (newDocumentLink.name && newDocumentLink.url) {
      setDocumentLinks([...documentLinks, { ...newDocumentLink }]);
      setNewDocumentLink({ name: '', url: '' });
    }
  };

  const handleRemoveDocumentLink = (index: number) => {
    setDocumentLinks(documentLinks.filter((_, i) => i !== index));
  };

  const districtOptions = YALA_DISTRICTS.map(district => ({
    value: district,
    label: district
  }));

  const strategicIssueOptions = strategicIssues.map(issue => ({
    value: issue.id,
    label: issue.title
  }));

  const strategyOptions = strategies.map(strategy => ({
    value: strategy.id,
    label: strategy.name
  }));

  return (
    <Card className="w-full max-w-4xl mx-auto" key={project?.id || "new"}>
      <CardHeader>
        <CardTitle>{project ? "แก้ไขโครงการ" : "สร้างโครงการใหม่"}</CardTitle>
        <CardDescription>กรุณากรอกข้อมูลโครงการให้ครบถ้วน</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ข้อมูลพื้นฐาน</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">ชื่อโครงการ *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="ชื่อโครงการ"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="project_type">ประเภทโครงการ *</Label>
                <Select
                  key={`project_type_${project?.id || "new"}`}
                  defaultValue={formData.project_type}
                  onValueChange={(value) =>
                    updateFormData("project_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทโครงการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_type && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.project_type}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="key_activities">กิจกรรมหลัก *</Label>
              <Textarea
                id="key_activities"
                value={formData.key_activities}
                onChange={(e) =>
                  updateFormData("key_activities", e.target.value)
                }
                placeholder="กิจกรรมหลักของโครงการ"
                rows={3}
              />
              {errors.key_activities && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.key_activities}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expected_results">ผลลัพธ์ที่คาดหวัง *</Label>
              <Textarea
                id="expected_results"
                value={formData.expected_results}
                onChange={(e) =>
                  updateFormData("expected_results", e.target.value)
                }
                placeholder="ผลลัพธ์ที่คาดหวังจากโครงการ"
                rows={3}
              />
              {errors.expected_results && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.expected_results}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget">งบประมาณ (บาท)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => updateFormData("budget", e.target.value)}
                  placeholder="0.00"
                />
                {errors.budget && (
                  <p className="text-sm text-red-500 mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <Label htmlFor="start_date">วันที่เริ่มต้น *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateFormData("start_date", e.target.value)}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.start_date}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date">วันที่สิ้นสุด *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => updateFormData("end_date", e.target.value)}
                />
                {errors.end_date && (
                  <p className="text-sm text-red-500 mt-1">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="status">สถานะ</Label>
              <Select
                key={`status_${project?.id || "new"}`}
                defaultValue={formData.status}
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Responsible Person */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ผู้รับผิดชอบ</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="responsible_title_prefix">คำนำหน้า *</Label>
                <Select
                  key={`title_prefix_${project?.id || "new"}_${
                    formData.responsible_title_prefix
                  }`}
                  value={formData.responsible_title_prefix}
                  onValueChange={(value) =>
                    updateFormData("responsible_title_prefix", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกคำนำหน้า">
                      {formData.responsible_title_prefix || "เลือกคำนำหน้า"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TITLE_PREFIXES.map((prefix) => (
                      <SelectItem key={prefix} value={prefix}>
                        {prefix}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsible_title_prefix && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_title_prefix}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_first_name">ชื่อ *</Label>
                <Input
                  id="responsible_first_name"
                  value={formData.responsible_first_name}
                  onChange={(e) =>
                    updateFormData("responsible_first_name", e.target.value)
                  }
                  placeholder="ชื่อ"
                />
                {errors.responsible_first_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_first_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_last_name">นามสกุล *</Label>
                <Input
                  id="responsible_last_name"
                  value={formData.responsible_last_name}
                  onChange={(e) =>
                    updateFormData("responsible_last_name", e.target.value)
                  }
                  placeholder="นามสกุล"
                />
                {errors.responsible_last_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_last_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_position">ตำแหน่ง *</Label>
                <Input
                  id="responsible_position"
                  value={formData.responsible_position}
                  onChange={(e) =>
                    updateFormData("responsible_position", e.target.value)
                  }
                  placeholder="ตำแหน่ง"
                />
                {errors.responsible_position && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_position}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsible_phone">เบอร์โทรศัพท์ *</Label>
                <Input
                  id="responsible_phone"
                  value={formData.responsible_phone}
                  onChange={(e) =>
                    updateFormData("responsible_phone", e.target.value)
                  }
                  placeholder="08X-XXX-XXXX"
                />
                {errors.responsible_phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_phone}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_email">อีเมล *</Label>
                <Input
                  id="responsible_email"
                  type="email"
                  value={formData.responsible_email}
                  onChange={(e) =>
                    updateFormData("responsible_email", e.target.value)
                  }
                  placeholder="email@example.com"
                />
                {errors.responsible_email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.responsible_email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">สถานที่ดำเนินการ</h3>

            <div>
              <Label htmlFor="activity_location">สถานที่ดำเนินกิจกรรม *</Label>
              <Textarea
                id="activity_location"
                value={formData.activity_location}
                onChange={(e) =>
                  updateFormData("activity_location", e.target.value)
                }
                placeholder="สถานที่ดำเนินกิจกรรม"
                rows={2}
              />
              {errors.activity_location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.activity_location}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>อำเภอ *</Label>
                <MultiSelect
                  options={districtOptions}
                  value={formData.districts}
                  onValueChange={(values: string[]) =>
                    updateFormData("districts", values)
                  }
                  placeholder="เลือกอำเภอ"
                />
                {errors.districts && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.districts}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => updateFormData("province", e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Strategic Issues & Strategies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              ความเชื่อมโยงเชิงยุทธศาสตร์
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>ประเด็นยุทธศาสตร์ *</Label>
                <MultiSelect
                  options={strategicIssueOptions}
                  value={formData.strategic_issues}
                  onValueChange={(values: string[]) =>
                    updateFormData("strategic_issues", values)
                  }
                  placeholder="เลือกประเด็นยุทธศาสตร์"
                  loading={strategicIssuesLoading}
                />
                {errors.strategic_issues && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.strategic_issues}
                  </p>
                )}
              </div>

              <div>
                <Label>กลยุทธ์ *</Label>
                <MultiSelect
                  options={strategyOptions}
                  value={formData.strategies}
                  onValueChange={(values: string[]) =>
                    updateFormData("strategies", values)
                  }
                  placeholder="เลือกกลยุทธ์"
                  loading={strategiesLoading}
                />
                {errors.strategies && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.strategies}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Document Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">เอกสารที่เกี่ยวข้อง</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="document_name">ชื่อเอกสาร</Label>
                <Input
                  id="document_name"
                  value={newDocumentLink.name}
                  onChange={(e) =>
                    setNewDocumentLink({
                      ...newDocumentLink,
                      name: e.target.value,
                    })
                  }
                  placeholder="ชื่อเอกสาร"
                />
              </div>

              <div>
                <Label htmlFor="document_url">ลิงค์เอกสาร</Label>
                <Input
                  id="document_url"
                  value={newDocumentLink.url}
                  onChange={(e) =>
                    setNewDocumentLink({
                      ...newDocumentLink,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/document"
                />
              </div>

              <div>
                <Label>&nbsp;</Label>
                <Button
                  type="button"
                  onClick={handleAddDocumentLink}
                  disabled={!newDocumentLink.name || !newDocumentLink.url}
                  className="w-full cursor-pointer hover:bg-blue-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มเอกสาร
                </Button>
              </div>
            </div>

            {documentLinks.length > 0 && (
              <div className="space-y-2">
                <Label>เอกสารที่เพิ่มแล้ว</Label>
                {documentLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.name}
                      </a>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-red-400"
                      onClick={() => handleRemoveDocumentLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className='cursor-pointer hover:bg-gray-200'
              onClick={onCancel}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" loading={isLoading} className='cursor-pointer hover:bg-blue-500'>
              {project ? "อัปเดต" : "สร้าง"}โครงการ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
