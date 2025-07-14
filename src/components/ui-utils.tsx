import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = { default: 1, md: 2, lg: 3 }
}: ResponsiveGridProps) {
  const gridCols = cn(
    `grid grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    "gap-6"
  );

  return (
    <div className={cn(gridCols, className)}>
      {children}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700 bg-blue-500',
    green: 'from-green-50 to-green-100 border-green-200 text-green-700 bg-green-500',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700 bg-purple-500',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 bg-yellow-500',
    red: 'from-red-50 to-red-100 border-red-200 text-red-700 bg-red-500',
  };

  const classes = colorClasses[color];
  const [gradientFrom, gradientTo, border, textColor, iconBg] = classes.split(' ');

  return (
    <div className={cn(
      "bg-gradient-to-br p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow",
      `${gradientFrom} ${gradientTo} ${border}`
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-sm font-medium", textColor)}>
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-slate-500 ml-1">จากเดือนที่แล้ว</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", iconBg)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
