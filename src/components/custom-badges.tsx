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
          className: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
          icon: Clock
        };
      case 'completed':
        return {
          text: 'เสร็จสิ้น',
          className: 'bg-green-500 text-white border-green-500 hover:bg-green-600',
          icon: CheckCircle
        };
      case 'planning':
        return {
          text: 'วางแผน',
          className: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600',
          icon: AlertCircle
        };
      case 'cancelled':
        return {
          text: 'ยกเลิก',
          className: 'bg-red-500 text-white border-red-500 hover:bg-red-600',
          icon: XCircle
        };
      default:
        return {
          text: status,
          className: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600',
          icon: Clock
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "border flex items-center gap-1 font-medium",
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
        return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      default:
        return 'bg-slate-500 text-white border-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <Badge 
      className={cn(
        "border font-medium",
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
      case 'blue': return 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600';
      case 'green': return 'bg-green-500 text-white border-green-500 hover:bg-green-600';
      case 'yellow': return 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600';
      case 'red': return 'bg-red-500 text-white border-red-500 hover:bg-red-600';
      case 'purple': return 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600';
      case 'orange': return 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600';
      case 'cyan': return 'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600';
      case 'pink': return 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600';
      default: return 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Badge 
      className={cn(
        "border font-medium transition-colors",
        getColorConfig(color),
        className
      )}
    >
      {children}
    </Badge>
  );
}
