import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectCardSkeleton() {
  return (
    <Card className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
          </div>
          
          <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-10"></div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 animate-pulse"></div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded animate-pulse w-16 mb-2"></div>
            <div className="h-6 bg-slate-200 rounded animate-pulse w-24"></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StrategicIssueCardSkeleton() {
  return (
    <Card className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="w-4 h-4 bg-slate-100 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-6 bg-slate-100 rounded animate-pulse w-8"></div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-16 mb-1"></div>
              <div className="h-6 bg-slate-100 rounded animate-pulse w-8"></div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-4"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StrategicIssuesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <StrategicIssueCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StrategyCardSkeleton() {
  return (
    <Card className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
          </div>
          
          <div className="pt-2 border-t border-slate-100">
            <div className="h-3 bg-slate-100 rounded animate-pulse w-16 mb-2"></div>
            <div className="h-6 bg-slate-100 rounded animate-pulse w-32"></div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-slate-100 rounded animate-pulse w-12"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StrategiesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <StrategyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <Card className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-2/3 mb-1"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-24"></div>
            <div className="h-6 bg-slate-100 rounded animate-pulse w-32"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded animate-pulse w-20"></div>
            <div className="h-6 bg-slate-100 rounded animate-pulse w-28"></div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-16"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function UsersLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-8 bg-slate-200 rounded animate-pulse w-16 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded animate-pulse w-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardQuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-md bg-white/95 backdrop-blur-sm border border-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mb-1"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
