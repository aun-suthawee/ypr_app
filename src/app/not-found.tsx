"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  ArrowLeft, 
  AlertTriangle,
  FileQuestion
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl bg-white/90 backdrop-blur-sm border-0">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center space-y-6">
            {/* 404 Visual */}
            <div className="relative">
              <div className="text-8xl sm:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text">
                404
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400 animate-pulse" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                ไม่พบหน้าที่คุณต้องการ
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                ขออภัย หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่จริง
              </p>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-center space-x-2 text-slate-700">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-medium">คำแนะนำ</span>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p>• ตรวจสอบการสะกดของ URL</p>
                <p>• ลองค้นหาหน้าที่ต้องการใน Dashboard</p>
                <p>• กลับไปหน้าหลักและเริ่มต้นใหม่</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="cursor-pointer w-full sm:w-auto flex items-center space-x-2 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับหน้าก่อนหน้า</span>
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2">
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
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
