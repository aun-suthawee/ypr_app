"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  RefreshCw, 
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-0">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center space-y-6">
            {/* Error Icon */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                เกิดข้อผิดพลาด
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                ขออภัย หน้าเว็บนี้ไม่สามารถโหลดได้ในขณะนี้
              </p>
            </div>

            {/* Error Details (Dev Mode) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                <h3 className="font-semibold text-red-800 mb-2">
                  ข้อมูล Error (Development Mode):
                </h3>
                <code className="text-sm text-red-700 block whitespace-pre-wrap">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="text-xs text-red-600 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Suggestions */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-center space-x-2 text-slate-700">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-medium">คำแนะนำ</span>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p>• ลองรีเฟรชหน้าเว็บ</p>
                <p>• ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p>
                <p>• รอสักครู่แล้วลองใหม่</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Button
                onClick={reset}
                className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ลองใหม่</span>
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="cursor-pointer w-full flex items-center space-x-2 hover:bg-slate-50"
                >
                  <Home className="w-4 h-4" />
                  <span>กลับหน้าหลัก</span>
                </Button>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
