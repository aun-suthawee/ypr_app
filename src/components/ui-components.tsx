import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 className={cn(
      "animate-spin text-blue-500",
      sizeClasses[size],
      className
    )} />
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl p-6",
      className
    )}>
      <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="mt-4 flex space-x-2">
          <div className="h-6 bg-slate-200 rounded w-16"></div>
          <div className="h-6 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description: string;
  onClose?: () => void;
}

export function Alert({ variant, title, description, onClose }: AlertProps) {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-lg border p-4 flex items-start space-x-3",
      config.container
    )}>
      <Icon className={cn("w-5 h-5 mt-0.5", config.iconColor)} />
      <div className="flex-1">
        {title && (
          <h4 className="font-medium mb-1">{title}</h4>
        )}
        <p className="text-sm">{description}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'yellow';
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  size = 'md', 
  color = 'blue', 
  showValue = true,
  className 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <div className={cn("space-y-2", className)}>
      {showValue && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">ความก้าวหน้า</span>
          <span className="font-semibold text-slate-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full bg-slate-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div 
          className={cn(
            "h-full bg-gradient-to-r transition-all duration-300 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
