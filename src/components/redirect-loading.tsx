"use client";

import { Loader2 } from "lucide-react";

interface RedirectLoadingProps {
  message?: string;
  success?: boolean;
}

export function RedirectLoading({ 
  message = "กำลังโหลด...", 
  success = false 
}: RedirectLoadingProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      success 
        ? 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-700' 
        : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700'
    }`}>
      <div className="text-center text-white">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
        {success && (
          <h2 className="text-xl font-semibold mb-2">เข้าสู่ระบบสำเร็จ!</h2>
        )}
        <p className="text-white/80">{message}</p>
      </div>
    </div>
  );
}

export function NavigationLoading() {
  return (
    <div className="min-h-screen bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <h3 className="text-sm text-slate-600">กำลังโหลด...</h3>
      </div>
    </div>
  );
}
