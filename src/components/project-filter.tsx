import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter, Calendar } from "lucide-react";
import { StrategicIssue } from "@/types/strategicIssues";
import { Strategy } from "@/types/strategies";

export interface ProjectFilters {
  search: string;
  minBudget: string;
  maxBudget: string;
  projectType: string;
  startDate: string;
  endDate: string;
  status: string;
  districts: string[];
  strategicIssueIds: string[];
  strategyIds: string[];
}

export interface ProjectFilterProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  strategicIssues: StrategicIssue[];
  strategies: Strategy[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  onFiltersChange,
  strategicIssues,
  strategies,
  isExpanded,
  onToggleExpanded,
}) => {
  const updateFilter = (
    field: keyof ProjectFilters,
    value: string | string[]
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const updateArrayFilter = (field: "districts" | "strategicIssueIds" | "strategyIds", value: string) => {
    const currentArray = filters[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(field, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      minBudget: "",
      maxBudget: "",
      projectType: "",
      startDate: "",
      endDate: "",
      status: "",
      districts: [],
      strategicIssueIds: [],
      strategyIds: [],
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.minBudget ||
      filters.maxBudget ||
      filters.projectType ||
      filters.startDate ||
      filters.endDate ||
      filters.status ||
      filters.districts.length > 0 ||
      filters.strategicIssueIds.length > 0 ||
      filters.strategyIds.length > 0
    );
  };

  // Thai districts list for Yala province
  const thaiDistricts = [
    "เมืองยะลา",
    "เบตง",
    "บันนังสตา",
    "ธารโต",
    "ยะหริ่ง",
    "รามัน",
    "กาบัง",
    "กรงปินัง",
  ];

  return (
    <Card className="bg-gradient-to-br from-white/95 via-blue-50/90 to-indigo-50/95 backdrop-blur-xl border border-white/20 shadow-xl mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50/90 via-blue-50/80 to-indigo-50/90 border-b border-blue-100/60 py-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            ค้นหาและกรองโครงการ
          </CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 hover:border-red-300 hover:text-red-800 cursor-pointer text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden xs:inline">ล้างทั้งหมด</span>
                <span className="xs:hidden">ล้าง</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpanded}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 cursor-pointer text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Filter className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              <span className="hidden sm:inline">
                {isExpanded ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง"}
              </span>
              <span className="sm:hidden">{isExpanded ? "ซ่อน" : "กรอง"}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-2 sm:p-4 pt-2">
        {/* Search Input - Always visible */}
        <div className="relative -mt-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center p-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ค้นหาชื่อโครงการ, กิจกรรมหลัก หรือผู้รับผิดชอบ..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-12 pr-4 py-3 text-base bg-transparent border-0 rounded-xl focus:ring-0 focus:border-0 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="p-6 bg-gradient-to-br from-white/80 to-blue-50/50 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {/* Budget Range */}
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  งบประมาณ (บาท)
                </label>
                <div className="flex flex-col xs:flex-row gap-3">
                  <Input
                    placeholder="ต่ำสุด"
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => updateFilter("minBudget", e.target.value)}
                    className="text-sm flex-1 border-2 border-slate-200 hover:border-green-400 focus:border-green-500 rounded-lg transition-colors duration-200 bg-white"
                  />
                  <Input
                    placeholder="สูงสุด"
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => updateFilter("maxBudget", e.target.value)}
                    className="text-sm flex-1 border-2 border-slate-200 hover:border-green-400 focus:border-green-500 rounded-lg transition-colors duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                  ประเภทโครงการ
                </label>
                <Select
                  value={filters.projectType || "all"}
                  onValueChange={(value) =>
                    updateFilter("projectType", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="text-sm border-2 border-slate-200 hover:border-purple-400 focus:border-purple-500 rounded-lg transition-colors duration-200 bg-white">
                    <SelectValue placeholder="เลือกประเภทโครงการ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 shadow-lg">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="new">โครงการใหม่</SelectItem>
                    <SelectItem value="continuous">โครงการต่อเนื่อง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                  สถานะโครงการ
                </label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    updateFilter("status", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="text-sm border-2 border-slate-200 hover:border-orange-400 focus:border-orange-500 rounded-lg transition-colors duration-200 bg-white">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 shadow-lg">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="planning">วางแผน</SelectItem>
                    <SelectItem value="active">ดำเนินการ</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                    <SelectItem value="cancelled">ยกเลิก</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Districts */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                  อำเภอ
                </label>
                <Select
                  value="placeholder"
                  onValueChange={(value) => {
                    if (value !== "placeholder") {
                      updateArrayFilter("districts", value);
                    }
                  }}
                >
                  <SelectTrigger className="text-sm border-2 border-slate-200 hover:border-cyan-400 focus:border-cyan-500 rounded-lg transition-colors duration-200 bg-white">
                    <SelectValue placeholder="เลือกอำเภอ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 shadow-lg">
                    <SelectItem value="placeholder" disabled>
                      เลือกอำเภอ
                    </SelectItem>
                    {thaiDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.districts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {filters.districts.map((district, index) => (
                      <Badge
                        key={`${district}-${index}`}
                        variant="secondary"
                        className="text-xs cursor-pointer bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 hover:from-cyan-200 hover:to-blue-200 border border-cyan-200 transition-colors duration-200 rounded-full px-3 py-1"
                        onClick={() => updateArrayFilter("districts", district)}
                      >
                        <span className="max-w-[100px] truncate">{district}</span>
                        <X className="w-3 h-3 ml-2 hover:text-red-500" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range - Start Date */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                  วันที่เริ่มโครงการ
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => updateFilter("startDate", e.target.value)}
                    className="text-sm pl-10 pr-4 py-3 border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 rounded-lg transition-colors duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Date Range - End Date */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
                  วันที่สิ้นสุดโครงการ
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilter("endDate", e.target.value)}
                    className="text-sm pl-10 pr-4 py-3 border-2 border-slate-200 hover:border-rose-400 focus:border-rose-500 rounded-lg transition-colors duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Strategic Issues */}
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full"></div>
                  ประเด็นยุทธศาสตร์
                </label>
                <Select
                  value="placeholder"
                  onValueChange={(value) => {
                    if (value !== "placeholder") {
                      updateArrayFilter("strategicIssueIds", value);
                    }
                  }}
                >
                  <SelectTrigger className="text-sm border-2 border-slate-200 hover:border-indigo-400 focus:border-indigo-500 rounded-lg transition-colors duration-200 bg-white">
                    <SelectValue placeholder="เลือกประเด็นยุทธศาสตร์" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 shadow-lg">
                    <SelectItem value="placeholder" disabled>
                      เลือกประเด็นยุทธศาสตร์
                    </SelectItem>
                    {strategicIssues.map((issue) => (
                      <SelectItem key={issue.id} value={issue.id}>
                        <div className="w-full">
                          <div className="block sm:hidden text-xs">
                            <div className="truncate max-w-[180px] font-semibold text-indigo-700">
                              ประเด็นที่ {issue.order}
                            </div>
                            <div className="truncate max-w-[350px] text-gray-600 mt-0.5">
                              {issue.title}
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            ประเด็นที่ {issue.order}: {issue.title}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.strategicIssueIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {filters.strategicIssueIds.map((issueId, index) => {
                      const issue = strategicIssues.find(
                        (si) => si.id === issueId
                      );
                      return (
                        <Badge
                          key={`${issueId}-${index}`}
                          variant="secondary"
                          className="text-xs cursor-pointer bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 hover:from-indigo-200 hover:to-blue-200 border border-indigo-200 transition-colors duration-200 rounded-full px-3 py-1"
                          onClick={() =>
                            updateArrayFilter("strategicIssueIds", issueId)
                          }
                        >
                          <span className="max-w-[120px] truncate">
                            {issue ? `ประเด็นที่ ${issue.order}` : "ไม่พบข้อมูล"}
                          </span>
                          <X className="w-3 h-3 ml-2 hover:text-red-500" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Strategies */}
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-green-500 rounded-full"></div>
                  กลยุทธ์
                </label>
                <Select
                  value="placeholder"
                  disabled={filters.strategicIssueIds.length === 0}
                  onValueChange={(value) => {
                    if (value !== "placeholder") {
                      updateArrayFilter("strategyIds", value);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`text-sm border-2 border-slate-200 hover:border-teal-400 focus:border-teal-500 rounded-lg transition-colors duration-200 bg-white ${
                      filters.strategicIssueIds.length === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-50"
                        : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        filters.strategicIssueIds.length === 0
                          ? "เลือกประเด็นยุทธศาสตร์ก่อน"
                          : "เลือกกลยุทธ์"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 shadow-lg">
                    <SelectItem value="placeholder" disabled>
                      {filters.strategicIssueIds.length === 0
                        ? "เลือกประเด็นยุทธศาสตร์ก่อน"
                        : "เลือกกลยุทธ์"}
                    </SelectItem>
                    {strategies
                      .filter(
                        (strategy) =>
                          filters.strategicIssueIds.length === 0 ||
                          filters.strategicIssueIds.includes(
                            strategy.strategic_issue_id
                          )
                      )
                      .filter(
                        (strategy) => !filters.strategyIds.includes(strategy.id)
                      )
                      .map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          <div className="w-full">
                            <div className="block sm:hidden text-xs">
                              <div className="truncate max-w-[180px] font-semibold text-teal-700">
                                ประเด็นที่{" "}
                                {strategy.strategic_issue?.order || "N/A"}{" "}
                                กลยุทธ์ที่ {strategy.order}
                              </div>
                              <div className="truncate max-w-[350px] text-gray-600 mt-0.5">
                                {strategy.name}
                              </div>
                            </div>
                            <div className="hidden sm:block">
                              ประเด็นที่{" "}
                              {strategy.strategic_issue?.order || "N/A"}:{" "}
                              กลยุทธ์ที่ {strategy.order} -{" "}
                              <span className="truncate">{strategy.name}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {filters.strategyIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {filters.strategyIds.map((strategyId, index) => {
                      const strategy = strategies.find(
                        (s) => s.id === strategyId
                      );
                      return (
                        <Badge
                          key={`${strategyId}-${index}`}
                          variant="secondary"
                          className="text-xs cursor-pointer bg-gradient-to-r from-teal-100 to-green-100 text-teal-800 hover:from-teal-200 hover:to-green-200 border border-teal-200 transition-colors duration-200 rounded-full px-3 py-1"
                          onClick={() =>
                            updateArrayFilter("strategyIds", strategyId)
                          }
                        >
                          <span className="max-w-[150px] sm:max-w-[200px] truncate">
                            {strategy
                              ? `ประเด็นที่ ${
                                  strategy.strategic_issue?.order || "N/A"
                                } กลยุทธ์ที่ ${strategy.order}`
                              : "ไม่พบข้อมูล"}
                          </span>
                          <X className="w-3 h-3 ml-2 hover:text-red-500" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="pt-4 border-t border-slate-200">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Filter className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    ตัวกรองที่ใช้:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-white border-gray-300 text-gray-700 rounded-full px-3 py-1"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      <span className="truncate">
                        &quot;{filters.search}&quot;
                      </span>
                    </Badge>
                  )}
                  {(filters.minBudget || filters.maxBudget) && (
                    <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700 rounded-full px-3 py-1">
                      งบประมาณ: {filters.minBudget || "0"} - {filters.maxBudget || "∞"}
                    </Badge>
                  )}
                  {filters.projectType && (
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-300 text-purple-700 rounded-full px-3 py-1">
                      ประเภท: {filters.projectType === "new"
                        ? "โครงการใหม่"
                        : "โครงการต่อเนื่อง"}
                    </Badge>
                  )}
                  {filters.status && (
                    <Badge variant="outline" className="text-xs bg-orange-50 border-orange-300 text-orange-700 rounded-full px-3 py-1">
                      สถานะ: {filters.status === "planning"
                        ? "วางแผน"
                        : filters.status === "active"
                        ? "ดำเนินการ"
                        : filters.status === "completed"
                        ? "เสร็จสิ้น"
                        : filters.status === "cancelled"
                        ? "ยกเลิก"
                        : filters.status}
                    </Badge>
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center bg-emerald-50 border-emerald-300 text-emerald-700 rounded-full px-3 py-1"
                    >
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {filters.startDate || "∞"} - {filters.endDate || "∞"}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFilter;
