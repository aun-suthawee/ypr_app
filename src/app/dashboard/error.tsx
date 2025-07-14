"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  RefreshCw, 
  Target
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-xl bg-white/90 backdrop-blur-sm border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-3">
              <h1 className="text-xl font-bold text-slate-900">
                เกิดข้อผิดพลาดใน Dashboard
              </h1>
              <p className="text-slate-600">
                ไม่สามารถโหลดข้อมูล Dashboard ได้ในขณะนี้
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={reset}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ลองใหม่</span>
              </Button>
              
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>หน้าหลัก</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
