"use client";

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                เกิดข้อผิดพลาด
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  รีเฟรชหน้า
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  กลับสู่หน้าหลัก
                </Button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                    รายละเอียดข้อผิดพลาด (Development Mode)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
