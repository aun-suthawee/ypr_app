import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'planning' | 'cancelled';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'ดำเนินการ',
          className: 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm',
          icon: Clock
        };
      case 'completed':
        return {
          text: 'เสร็จสิ้น',
          className: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm',
          icon: CheckCircle
        };
      case 'planning':
        return {
          text: 'วางแผน',
          className: 'bg-amber-500 text-slate-900 border-amber-500 hover:bg-amber-600 shadow-sm font-semibold',
          icon: AlertCircle
        };
      case 'cancelled':
        return {
          text: 'ยกเลิก',
          className: 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-sm',
          icon: XCircle
        };
      default:
        return {
          text: status,
          className: 'bg-slate-700 text-white border-slate-700 hover:bg-slate-800 shadow-sm',
          icon: Clock
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "border flex items-center gap-1 font-medium max-w-full whitespace-normal break-words",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {config.text}
    </Badge>
  );
}

interface CountBadgeProps {
  count: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export function CountBadge({ count, label, variant = 'default', className }: CountBadgeProps) {
  const getVariantConfig = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm';
      case 'warning':
        return 'bg-amber-500 text-slate-900 border-amber-500 hover:bg-amber-600 shadow-sm font-semibold';
      case 'info':
        return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm';
      default:
        return 'bg-slate-700 text-white border-slate-700 hover:bg-slate-800 shadow-sm';
    }
  };

  return (
    <Badge 
      className={cn(
        "border font-medium max-w-full whitespace-normal break-words",
        getVariantConfig(variant),
        className
      )}
    >
      {count} {label}
    </Badge>
  );
}

interface CustomBadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'cyan' | 'pink' | 'gray';
  className?: string;
}

export function CustomBadge({ children, color = 'gray', className }: CustomBadgeProps) {
  const getColorConfig = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm';
      case 'green': return 'bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm';
      case 'yellow': return 'bg-yellow-500 text-slate-900 border-yellow-500 hover:bg-yellow-600 shadow-sm font-semibold';
      case 'red': return 'bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-sm';
      case 'purple': return 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm';
      case 'orange': return 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 shadow-sm';
      case 'cyan': return 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700 shadow-sm';
      case 'pink': return 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700 shadow-sm';
      default: return 'bg-slate-700 text-white border-slate-700 hover:bg-slate-800 shadow-sm';
    }
  };

  return (
    <Badge 
      className={cn(
        "border font-medium transition-colors max-w-full whitespace-normal break-words",
        getColorConfig(color),
        className
      )}
    >
      {children}
    </Badge>
  );
}
