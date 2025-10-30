"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { getUser, isAuthenticated, type User as UserType } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    title_prefix: '',
    first_name: '',
    last_name: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    project_updates: true,
    system_alerts: true
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user data
    const userData = getUser();
    if (userData) {
      setCurrentUser(userData);
      setProfileForm({
        title_prefix: userData.title_prefix || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || ''
      });
    }

    setLoading(false);
  }, [router]);

  // Auto-save notification settings when they change
  useEffect(() => {
    const saveNotificationSettings = async () => {
      try {
        // Simulate API call to save notification settings
        await new Promise(resolve => setTimeout(resolve, 500));
        // In real app, you would call API here
        console.log('Notification settings saved:', notificationSettings);
      } catch (err) {
        console.error('Failed to save notification settings:', err);
      }
    };

    // Only save if component is mounted and not in initial load
    if (!loading) {
      saveNotificationSettings();
    }
  }, [notificationSettings, loading]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally make an API call to update user profile
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileForm)
      // });

      setMessage({ type: 'success', text: 'ข้อมูลโปรไฟล์ได้รับการอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validate passwords
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' });
      setSaving(false);
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setMessage({ type: 'error', text: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
      setSaving(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally make an API call to change password
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     current_password: passwordForm.current_password,
      //     new_password: passwordForm.new_password
      //   })
      // });

      setMessage({ type: 'success', text: 'รหัสผ่านได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว' });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error('Password change error:', err);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'การตั้งค่าการแจ้งเตือนได้รับการอัปเดตเรียบร้อยแล้ว' });
    } catch (err) {
      console.error('Notification update error:', err);
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับ</span>
          </Button>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">ตั้งค่าบัญชี</h1>
              <p className="text-slate-600">
                จัดการข้อมูลส่วนตัวและการตั้งค่าของคุณ
                {currentUser && ` - ${currentUser.first_name} ${currentUser.last_name}`}
              </p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-md border-2 border-slate-200">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>ข้อมูลส่วนตัว</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>ความปลอดภัย</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>การแจ้งเตือน</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white shadow-lg border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>ข้อมูลส่วนตัว</span>
                </CardTitle>
                <CardDescription>
                  อัปเดตข้อมูลโปรไฟล์และข้อมูลติดต่อของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title_prefix">คำนำหน้าชื่อ</Label>
                      <Select
                        value={profileForm.title_prefix}
                        onValueChange={(value) => setProfileForm(prev => ({ ...prev, title_prefix: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกคำนำหน้าชื่อ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="นาย">นาย</SelectItem>
                          <SelectItem value="นาง">นาง</SelectItem>
                          <SelectItem value="นางสาว">นางสาว</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">ชื่อ</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="ชื่อ"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">นามสกุล</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="นามสกุล"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 font-semibold shadow-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          กำลังบันทึก...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          บันทึกการเปลี่ยนแปลง
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-white shadow-lg border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>ความปลอดภัย</span>
                </CardTitle>
                <CardDescription>
                  จัดการรหัสผ่านและการตั้งค่าความปลอดภัยของบัญชี
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">รหัสผ่านปัจจุบัน</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                        placeholder="กรอกรหัสผ่านปัจจุบัน"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-700" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-700" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">รหัสผ่านใหม่</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                        placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-700" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-700" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">ยืนยันรหัสผ่านใหม่</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                        placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-700" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-700" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• ความยาวอย่างน้อย 8 ตัวอักษร</li>
                      <li>• ควรประกอบด้วยตัวอักษรใหญ่ ตัวเล็ก ตัวเลข และสัญลักษณ์</li>
                      <li>• ไม่ควรใช้ข้อมูลส่วนตัวที่ง่ายต่อการเดา</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          กำลังเปลี่ยน...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          เปลี่ยนรหัสผ่าน
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white shadow-lg border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>การแจ้งเตือน</span>
                </CardTitle>
                <CardDescription>
                  จัดการการตั้งค่าการแจ้งเตือนและข้อความที่คุณต้องการรับ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">การแจ้งเตือนทั่วไป</h4>
                    
                    <div className="flex items-center justify-between p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">การแจ้งเตือนทางอีเมล</p>
                        <p className="text-sm text-slate-600">รับการแจ้งเตือนสำคัญทางอีเมล</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_notifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">การแจ้งเตือนแบบ Push</p>
                        <p className="text-sm text-slate-600">รับการแจ้งเตือนผ่านเบราว์เซอร์</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.push_notifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, push_notifications: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">การแจ้งเตือนเฉพาะเจาะจง</h4>
                    
                    <div className="flex items-center justify-between p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">อัปเดตโครงการ</p>
                        <p className="text-sm text-slate-600">แจ้งเตือนเมื่อมีการเปลี่ยนแปลงในโครงการ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.project_updates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, project_updates: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">การแจ้งเตือนระบบ</p>
                        <p className="text-sm text-slate-600">แจ้งเตือนสำคัญเกี่ยวกับระบบ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.system_alerts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, system_alerts: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700"></div>
                      </label>
                    </div>
                  </div>

                  {/* Auto-save notification when settings change */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      <p className="text-sm font-medium">การตั้งค่าจะถูกบันทึกอัตโนมัติเมื่อมีการเปลี่ยนแปลง</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleNotificationUpdate}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 font-semibold shadow-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          กำลังบันทึก...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          บันทึกการตั้งค่า
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
