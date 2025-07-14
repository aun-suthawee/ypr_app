"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login, isAuthenticated } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่
  useEffect(() => {
    if (isAuthenticated()) {
      // ถ้าเข้าสู่ระบบแล้ว redirect ไป dashboard
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 800);
    }
    
    // ตรวจสอบ Remember Me และเติมข้อมูลอัตโนมัติ
    const rememberedEmail = localStorage.getItem('ypr_remembered_email');
    const isRemembered = localStorage.getItem('ypr_remember') === 'true';
    
    if (isRemembered && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // ตรวจสอบ rate limiting
    const loginAttemptKey = `login_attempts_${formData.email}`;
    const blockUntilKey = `login_blocked_until_${formData.email}`;
    const currentTime = Date.now();
    
    // ตรวจสอบว่าถูกบล็อกอยู่หรือไม่
    const blockedUntil = localStorage.getItem(blockUntilKey);
    if (blockedUntil && currentTime < parseInt(blockedUntil)) {
      const remainingTime = Math.ceil((parseInt(blockedUntil) - currentTime) / (1000 * 60)); // แปลงเป็นนาที
      setErrors({ 
        email: `มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก ${remainingTime} นาที` 
      });
      return;
    }

    setIsLoading(true);

    try {
      // เชื่อมต่อกับ Backend API ผ่าน auth utility
      const response = await login(formData.email, formData.password);

      // เก็บ JWT token ใน localStorage
      localStorage.setItem('ypr_token', response.data.token);
      localStorage.setItem('ypr_user', JSON.stringify(response.data.user));

      // เก็บ rememberMe setting
      if (formData.rememberMe) {
        localStorage.setItem('ypr_remember', 'true');
        localStorage.setItem('ypr_remembered_email', formData.email);
      } else {
        // ถ้าไม่เลือก Remember Me ให้ลบข้อมูลที่เก็บไว้
        localStorage.removeItem('ypr_remember');
        localStorage.removeItem('ypr_remembered_email');
      }

      // ล้าง login attempts เมื่อ login สำเร็จ
      localStorage.removeItem(loginAttemptKey);
      localStorage.removeItem(blockUntilKey);
      
      // Show redirect loading state
      setIsRedirecting(true);
      
      // Redirect ไปหน้า dashboard with delay to show loading
      setTimeout(() => {
        // Get redirect URL from query params or default to dashboard
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/';
        window.location.href = redirectUrl;
      }, 1200);
      
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      
      // จัดการ rate limiting
      const attempts = parseInt(localStorage.getItem(loginAttemptKey) || '0') + 1;
      localStorage.setItem(loginAttemptKey, attempts.toString());
      
      if (attempts >= 5) {
        // บล็อกเป็นเวลา 15 นาที
        const blockUntil = currentTime + (15 * 60 * 1000);
        localStorage.setItem(blockUntilKey, blockUntil.toString());
        setErrors({ 
          email: 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในอีก 15 นาที' 
        });
      } else {
        const remainingAttempts = 5 - attempts;
        setErrors({ 
          email: `${errorMessage} (เหลือ ${remainingAttempts} ครั้ง)`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show redirect loading screen
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">เข้าสู่ระบบสำเร็จ!</h2>
          <p className="text-white/80">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex">
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-7/12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large rotating squares */}
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rotate-45 animate-spin-slow"></div>
          <div className="absolute top-60 left-60 w-24 h-24 border-2 border-white/30 rotate-12 animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border-2 border-white/25 -rotate-45 animate-bounce-slow"></div>
          <div className="absolute top-96 right-32 w-28 h-28 border-2 border-white/15 rotate-75 animate-spin-slow"></div>
          <div className="absolute bottom-80 left-80 w-16 h-16 border-2 border-white/25 rotate-30 animate-pulse"></div>

          {/* Floating triangles */}
          <div className="absolute top-40 right-40 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[52px] border-l-transparent border-r-transparent border-b-white/20 animate-float"></div>
          <div className="absolute bottom-60 right-60 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-white/15 animate-float-delayed"></div>
          <div className="absolute top-32 left-96 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[43px] border-l-transparent border-r-transparent border-b-white/10 animate-float"></div>
          <div className="absolute bottom-32 right-20 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-white/20 animate-float-delayed"></div>

          {/* Hexagons */}
          <div
            className="absolute top-72 left-32 w-20 h-20 bg-white/5 transform rotate-30 animate-pulse"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
            }}
          ></div>
          <div
            className="absolute bottom-96 right-80 w-16 h-16 bg-white/10 transform rotate-45 animate-bounce-slow"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
            }}
          ></div>
          <div
            className="absolute top-48 right-96 w-12 h-12 bg-white/8 transform -rotate-15 animate-float"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
            }}
          ></div>

          {/* Diamonds */}
          <div className="absolute top-80 right-20 w-10 h-10 bg-white/15 transform rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-48 left-60 w-14 h-14 bg-white/8 transform rotate-45 animate-pulse"></div>
          <div className="absolute top-24 left-40 w-8 h-8 bg-white/12 transform rotate-45 animate-bounce-slow"></div>
          <div className="absolute bottom-72 right-40 w-12 h-12 bg-white/10 transform rotate-45 animate-float-delayed"></div>

          {/* Circles with different animations */}
          <div className="absolute top-80 left-80 w-16 h-16 rounded-full border-2 border-white/30 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute top-52 left-20 w-20 h-20 rounded-full border border-white/20 animate-bounce-slow"></div>
          <div className="absolute bottom-84 right-96 w-8 h-8 rounded-full bg-white/15 animate-float"></div>
          <div className="absolute top-96 right-60 w-14 h-14 rounded-full border-2 border-white/25 animate-pulse"></div>

          {/* Pentagon shapes */}
          <div
            className="absolute top-64 left-96 w-18 h-18 bg-white/8 animate-spin-slow"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          ></div>
          <div
            className="absolute bottom-56 left-24 w-14 h-14 bg-white/12 animate-float-delayed"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          ></div>

          {/* Lines and strips */}
          <div className="absolute top-44 left-72 w-40 h-1 bg-white/15 transform rotate-45 animate-pulse"></div>
          <div className="absolute bottom-64 right-32 w-32 h-0.5 bg-white/20 transform -rotate-30 animate-float"></div>
          <div className="absolute top-88 right-72 w-24 h-1 bg-white/10 transform rotate-60 animate-bounce-slow"></div>

          {/* Dots pattern */}
          <div className="absolute top-36 right-24 grid grid-cols-3 gap-2">
            <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-white/15 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/25 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/10 rounded-full animate-pulse"
              style={{ animationDelay: "0.6s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{ animationDelay: "0.8s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/15 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* More complex shapes */}
          <div
            className="absolute bottom-88 left-48 w-16 h-16 border-2 border-white/15 animate-spin-slow"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            }}
          ></div>
          <div
            className="absolute top-56 right-48 w-12 h-12 bg-white/8 animate-float"
            style={{
              clipPath:
                "polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)",
            }}
          ></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-white/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Flowing waves */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-float"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/15 to-transparent animate-float-delayed"></div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
        </div>

        {/* Content on left side */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            ยินดีต้อนรับสู่
            <br />
            <span className="text-yellow-300">YPR Dashboard</span>
          </h1>
          <p className="text-xl text-blue-100 mb-4 leading-relaxed">
            ระบบจัดการแผนยุทธศาสตร์องค์กร
            <br />
            ที่ทันสมัยและใช้งานง่าย
          </p>
          
          {/* Motto */}
          <div className="mb-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="text-lg font-medium text-yellow-200 text-center">
              &ldquo;สานพลังการศึกษา ยะลาเป็นหนึ่ง&rdquo;
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-blue-100">จัดการประเด็นยุทธศาสตร์</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-blue-100">
                ติดตามความก้าวหน้าแบบเรียลไทม์
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-blue-100">ระบบความปลอดภัยสูง</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-900" />
              </div>
              <span className="text-blue-100">จัดการโครงการ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 bg-gray-50">
        <div className="relative w-full max-w-md">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="absolute -top-12 left-0 flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group z-10"
          >
            <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">กลับหน้าหลัก</span>
          </Link>

          <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
              เข้าสู่ระบบ
            </CardTitle>
            <p className="text-slate-600">
              กรุณาเข้าสู่ระบบเพื่อใช้งาน YPR Dashboard
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  อีเมล
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isLoading}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรุณาใส่รหัสผ่าน"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setFormData((prev) => ({ ...prev, rememberMe: checked }))
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    จำการเข้าสู่ระบบ
                  </Label>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
