"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { ChangePasswordRequest } from '@/types/user';

interface ChangePasswordFormProps {
  userId: string;
  isCurrentUser: boolean;
  onSubmit: (data: ChangePasswordRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ChangePasswordForm({ 
  isCurrentUser, 
  onSubmit, 
  onCancel, 
  isLoading 
}: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isCurrentUser && !formData.currentPassword.trim()) {
      newErrors.currentPassword = 'กรุณาระบุรหัสผ่านปัจจุบัน';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'กรุณาระบุรหัสผ่านใหม่';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่านใหม่';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านใหม่ไม่ตรงกัน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: ChangePasswordRequest = {
      newPassword: formData.newPassword,
    };

    if (isCurrentUser) {
      submitData.currentPassword = formData.currentPassword;
    }

    await onSubmit(submitData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>เปลี่ยนรหัสผ่าน</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "กรุณาระบุรหัสผ่านปัจจุบันและรหัสผ่านใหม่"
            : "กรุณาระบุรหัสผ่านใหม่สำหรับผู้ใช้นี้"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isCurrentUser && (
            <div>
              <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    updateFormData("currentPassword", e.target.value)
                  }
                  placeholder="รหัสผ่านปัจจุบัน"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => toggleShowPassword("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="newPassword">รหัสผ่านใหม่ *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => updateFormData("newPassword", e.target.value)}
                placeholder="รหัสผ่านใหม่"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => toggleShowPassword("new")}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่ *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                placeholder="ยืนยันรหัสผ่านใหม่"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => toggleShowPassword("confirm")}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className='cursor-pointer hover:bg-gray-200'>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading} className='cursor-pointer hover:bg-blue-600 hover:text-white'>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              เปลี่ยนรหัสผ่าน
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
