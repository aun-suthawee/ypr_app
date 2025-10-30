import { Target, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                ระบบจัดการด้านการศึกษาจังหวัดยะลา
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              ระบบจัดการด้านการศึกษาจังหวัดยะลา - แพลตฟอร์มสำหรับจัดการโครงการ ประเด็นยุทธศาสตร์ และสถิติการศึกษา
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">เมนูหลัก</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/dashboard"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  หน้าหลัก
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/strategic-issues"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  ประเด็นยุทธศาสตร์
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/strategies"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  กลยุทธ์
                </a>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  โครงการ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">ติดต่อเรา</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">yalaedu01@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">0 7372 9828</span>
              </li>
              {/* <li className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">GitHub Repository</span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 text-center">
          <p className="text-sm text-slate-600">
            Copyright &copy; ypr.yalapeo.go.th All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
