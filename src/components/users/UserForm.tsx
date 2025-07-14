"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  USER_ROLES,
} from "@/types/user";

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    password: "",
    role: user?.role || ("department" as "admin" | "department"),
    title_prefix: user?.title_prefix || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    position: user?.position || "",
    department: user?.department || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "อีเมลเป็นข้อมูลที่จำเป็น";
    if (!user && !formData.password.trim())
      newErrors.password = "รหัสผ่านเป็นข้อมูลที่จำเป็น";
    if (!formData.first_name.trim())
      newErrors.first_name = "ชื่อเป็นข้อมูลที่จำเป็น";
    if (!formData.last_name.trim())
      newErrors.last_name = "นามสกุลเป็นข้อมูลที่จำเป็น";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    // Password validation (only for new users)
    if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Remove password field if editing and password is empty
    if (user && !formData.password.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...updateData } = formData;
      await onSubmit(updateData);
    } else {
      await onSubmit(formData);
    }
  };

  const updateFormData = (field: string, value: string) => {
    // Handle "none" values for optional fields
    const actualValue = value === "none" ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: actualValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{user ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</CardTitle>
        <CardDescription>กรุณากรอกข้อมูลผู้ใช้ให้ครบถ้วน</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ข้อมูลพื้นฐาน</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">บทบาท</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="cursor-pointer hover:bg-gray-200"
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {!user && (
              <div>
                <Label htmlFor="password">รหัสผ่าน *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="รหัสผ่าน"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ข้อมูลส่วนตัว</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="title_prefix">คำนำหน้า</Label>
                <Select
                  value={formData.title_prefix || "none"}
                  onValueChange={(value) =>
                    updateFormData("title_prefix", value)
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="เลือกคำนำหน้า" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="none">
                      ไม่ระบุ
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="นาย">
                      นาย
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="นาง">
                      นาง
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="นางสาว">
                      นางสาว
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="first_name">ชื่อ *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData("first_name", e.target.value)}
                  placeholder="ชื่อ"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name">นามสกุล *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData("last_name", e.target.value)}
                  placeholder="นามสกุล"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">ตำแหน่ง</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => updateFormData("position", e.target.value)}
                  placeholder="ตำแหน่งงาน"
                />
              </div>

              <div>
                <Label htmlFor="department">หน่วยงาน</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => updateFormData("department", e.target.value)}
                  placeholder="หน่วยงาน"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="hover:bg-gray-100 cursor-pointer"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin " />}
              {user ? "อัปเดต" : "เพิ่ม"}ผู้ใช้
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
