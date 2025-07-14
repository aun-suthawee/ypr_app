import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'completed' | 'planning' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          text: 'ดำเนินการ',
          className: 'bg-blue-500 text-white border-blue-500'
        };
      case 'completed':
        return {
          variant: 'secondary' as const,
          text: 'เสร็จสิ้น',
          className: 'bg-green-500 text-white border-green-500'
        };
      case 'planning':
        return {
          variant: 'outline' as const,
          text: 'วางแผน',
          className: 'bg-yellow-500 text-white border-yellow-500'
        };
      default:
        return {
          variant: 'secondary' as const,
          text: status,
          className: 'bg-gray-500 text-white border-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.text}
    </Badge>
  );
}

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'Project Manager':
        return {
          className: 'bg-blue-500 text-white border-blue-500'
        };
      case 'Developer':
        return {
          className: 'bg-green-500 text-white border-green-500'
        };
      case 'Business Analyst':
        return {
          className: 'bg-purple-500 text-white border-purple-500'
        };
      default:
        return {
          className: 'bg-gray-500 text-white border-gray-500'
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Badge 
      variant="default"
      className={cn(config.className, className)}
    >
      {role}
    </Badge>
  );
}

interface DepartmentBadgeProps {
  department: string;
  className?: string;
}

export function DepartmentBadge({ department, className }: DepartmentBadgeProps) {
  const getDepartmentConfig = (department: string) => {
    switch (department) {
      case 'IT':
        return {
          className: 'bg-cyan-500 text-white border-cyan-500'
        };
      case 'Strategy':
        return {
          className: 'bg-orange-500 text-white border-orange-500'
        };
      case 'HR':
        return {
          className: 'bg-pink-500 text-white border-pink-500'
        };
      default:
        return {
          className: 'bg-gray-500 text-white border-gray-500'
        };
    }
  };

  const config = getDepartmentConfig(department);

  return (
    <Badge 
      variant="default"
      className={cn(config.className, className)}
    >
      {department}
    </Badge>
  );
}
