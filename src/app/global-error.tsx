"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  RefreshCw, 
  AlertTriangle,
  Bug
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-0">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Bug className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    เกิดข้อผิดพลาดที่ไม่คาดคิด
                  </h1>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    ขออภัย เกิดข้อผิดพลาดในระบบ
                    เราได้บันทึกข้อผิดพลาดนี้และจะแก้ไขโดยเร็วที่สุด
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
                    <p>• กลับไปหน้าหลักและลองใหม่</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="cursor-pointer w-full sm:w-auto flex items-center space-x-2 hover:bg-slate-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>ลองใหม่</span>
                  </Button>

                  <Link href="/" className="w-full sm:w-auto">
                    <Button className="cursor-pointer w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 flex items-center space-x-2">
                      <Home className="w-4 h-4" />
                      <span>กลับหน้าหลัก</span>
                    </Button>
                  </Link>
                </div>

                {/* Additional Help */}
                <div className="pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบและแจ้ง Error ID
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decorative Elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-red-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>
        </div>
      </body>
    </html>
  );
}
