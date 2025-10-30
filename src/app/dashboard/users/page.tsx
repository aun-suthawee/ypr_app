"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Key,
  AlertTriangle,
  Users,
  Shield,
  Building,
  Mail,
} from "lucide-react";
import { UserForm } from "@/components/users/UserForm";
import { ChangePasswordForm } from "@/components/users/ChangePasswordForm";
import { useUsers, useUserStats } from "@/hooks/useUsers";
import { userService } from "@/services/userService";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
} from "@/types/user";
import { getUser } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard-layout";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState<{
    user: User;
    isCurrentUser: boolean;
  } | null>(null);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current user only on client side
  const currentUser = mounted ? getUser() : null;

  const filters = {
    search: searchTerm,
    role:
      roleFilter && roleFilter !== "all"
        ? (roleFilter as "admin" | "department")
        : undefined,
    department:
      departmentFilter && departmentFilter !== "all"
        ? departmentFilter
        : undefined,
    is_active:
      statusFilter && statusFilter !== "all"
        ? statusFilter === "active"
        : undefined,
  };

  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    changePassword,
    updateFilters,
    clearError,
  } = useUsers(filters);

  const { stats } = useUserStats();

  // Get current user only on client side (moved to useEffect above)

  const handleSearch = () => {
    updateFilters(filters);
  };

  const handleReset = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");

    const resetFilters = {
      search: "",
      role: undefined,
      department: undefined,
      is_active: undefined,
    };
    updateFilters(resetFilters);
  };

  const handleCreateUser = async (
    userData: CreateUserRequest | UpdateUserRequest
  ) => {
    const success = await createUser(userData as CreateUserRequest);
    if (success) {
      setShowCreateForm(false);
    }
  };

  const handleEditUser = async (
    userData: CreateUserRequest | UpdateUserRequest
  ) => {
    if (!editingUser) return;

    const success = await updateUser(
      editingUser.id,
      userData as UpdateUserRequest
    );
    if (success) {
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      window.confirm(
        `คุณต้องการลบผู้ใช้ "${userService.getFullName(user)}" หรือไม่?`
      )
    ) {
      await deleteUser(user.id);
    }
  };

  const handleActivateUser = async (user: User) => {
    await activateUser(user.id);
  };

  const handleDeactivateUser = async (user: User) => {
    if (
      window.confirm(
        `คุณต้องการปิดใช้งานผู้ใช้ "${userService.getFullName(user)}" หรือไม่?`
      )
    ) {
      await deactivateUser(user.id);
    }
  };

  const handleChangePassword = async (passwordData: ChangePasswordRequest) => {
    if (!showPasswordForm) return;

    const success = await changePassword(
      showPasswordForm.user.id,
      passwordData
    );
    if (success) {
      setShowPasswordForm(null);
    }
  };

  const isCurrentUser = (user: User) => mounted && currentUser?.id === user.id;
  const isAdmin = mounted && currentUser?.role === "admin";

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white border-red-500";
      case "department":
        return "bg-blue-500 text-white border-blue-500";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case "IT":
        return "bg-cyan-500 text-white border-cyan-500";
      case "Strategy":
        return "bg-orange-500 text-white border-orange-500";
      case "HR":
        return "bg-pink-500 text-white border-pink-500";
      default:
        return "bg-gray-500 text-white border-gray-500";
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.is_active) {
      return <Badge className="bg-green-500 text-white">ใช้งาน</Badge>;
    }
    return <Badge variant="secondary">ปิดใช้งาน</Badge>;
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                กำลังโหลดข้อมูลผู้ใช้
              </h3>
              <p className="text-slate-600">กรุณารอสักครู่...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading && !users.length) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                กำลังโหลดข้อมูลผู้ใช้
              </h3>
              <p className="text-slate-600">กรุณารอสักครู่...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">จัดการผู้ใช้</h1>
            <p className="text-slate-700 font-medium">
              จัดการข้อมูลผู้ใช้และสิทธิ์การเข้าถึง
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้ใหม่
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
              <Button variant="outline" size="sm" onClick={clearError}>
                ปิด
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">รายชื่อผู้ใช้</TabsTrigger>
          </TabsList>

          {/* Stats Section - Always show at top */}
          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        ผู้ใช้งานทั้งหมด
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {stats?.total || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        ผู้ใช้งานเปิดใช้งาน
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {stats?.active || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        ผู้ดูแลระบบ
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {stats?.admin || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">
                        ผู้ใช้งานปิดใช้งาน
                      </p>
                      <p className="text-3xl font-bold text-orange-900">
                        {stats?.inactive || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full">
                      <UserX className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <TabsContent value="users" className="space-y-6">
            {/* Modern Search and Filters */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  ค้นหาและกรองข้อมูล
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600" />
                  <Input
                    placeholder="ค้นหาผู้ใช้ด้วยชื่อ, อีเมล, ตำแหน่ง..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-800"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      บทบาท
                    </label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue placeholder="เลือกบทบาท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                        <SelectItem value="department">
                          เจ้าหน้าที่หน่วยงาน
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      แผนก
                    </label>
                    <Input
                      placeholder="ระบุชื่อแผนก..."
                      value={departmentFilter === "all" ? "" : departmentFilter}
                      onChange={(e) =>
                        setDepartmentFilter(e.target.value || "all")
                      }
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      สถานะ
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                        <SelectValue placeholder="เลือกสถานะ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        <SelectItem value="active">ใช้งาน</SelectItem>
                        <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end space-x-2">
                    <Button
                      onClick={handleSearch}
                      className="cursor-pointer flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-lg px-6 py-3"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      ค้นหา
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="cursor-pointer px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300"
                    >
                      รีเซ็ต
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Grid */}
            {users.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    ไม่พบข้อมูลผู้ใช้
                  </h3>
                  <p className="text-slate-700 mb-6">
                    ไม่มีผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="mr-2"
                  >
                    ล้างตัวกรอง
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มผู้ใช้ใหม่
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.first_name.charAt(0)}
                              {user.last_name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-slate-900">
                              {userService.getFullName(user)}
                            </CardTitle>
                            <p className="text-sm text-slate-600">
                              {user.position}
                            </p>
                          </div>
                        </div>
                        {/* Only show dropdown menu for admin users */}
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white shadow-lg rounded-lg"
                            >
                              <DropdownMenuItem
                                onClick={() => setEditingUser(user)}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setShowPasswordForm({
                                    user,
                                    isCurrentUser: isCurrentUser(user),
                                  })
                                }
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                <Key className="w-4 h-4 mr-2" />
                                เปลี่ยนรหัสผ่าน
                              </DropdownMenuItem>
                              {user.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => handleDeactivateUser(user)}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  ปิดใช้งาน
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleActivateUser(user)}
                                  className="cursor-pointer hover:bg-gray-100"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  เปิดใช้งาน
                                </DropdownMenuItem>
                              )}
                              {isAdmin && !isCurrentUser(user) && (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600 hover:bg-red-100 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  ลบ
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>

                        <div className="flex items-center text-sm text-slate-600">
                          <Building className="w-4 h-4 mr-2" />
                          <Badge
                            className={`${getDepartmentColor(
                              user.department || ""
                            )} text-xs ml-2`}
                          >
                            {user.department}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Badge
                            className={`${getRoleColor(user.role)} text-xs`}
                          >
                            {user.role === "admin"
                              ? "ผู้ดูแลระบบ"
                              : "เจ้าหน้าที่หน่วยงาน"}
                          </Badge>
                          {getStatusBadge(user)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create User Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <UserForm
                user={editingUser}
                onSubmit={handleEditUser}
                onCancel={() => setEditingUser(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={!!showPasswordForm}
          onOpenChange={() => setShowPasswordForm(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
            </DialogHeader>
            {showPasswordForm && (
              <ChangePasswordForm
                userId={showPasswordForm.user.id}
                onSubmit={handleChangePassword}
                onCancel={() => setShowPasswordForm(null)}
                isCurrentUser={showPasswordForm.isCurrentUser}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
