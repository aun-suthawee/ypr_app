import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/error-boundary";
import LoadingBar from "@/components/loading-bar";

import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบจัดการด้านการศึกษาจังหวัดยะลา",
  description: "ระบบจัดการด้านการศึกษาจังหวัดยะลา - แพลตฟอร์มสำหรับจัดการโครงการ ประเด็นยุทธศาสตร์ และสถิติการศึกษา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${prompt.variable} antialiased font-prompt`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LoadingBar />
            {children}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
