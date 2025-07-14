"use client";

import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "เลือกรายการ...",
  maxItems = 10,
  disabled = false,
  loading = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onValueChange(newValue);
  };

  const handleRemove = (valueToRemove: string) => {
    onValueChange(value.filter((v) => v !== valueToRemove));
  };

  const selectedOptions = options.filter((option) => value.includes(option.value));
  const filteredOptions = options.filter((option) => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("w-full relative", className)}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-auto min-h-[2.5rem] p-2"
        disabled={disabled || loading}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        type="button"
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">
              {loading ? "กำลังโหลด..." : placeholder}
            </span>
          ) : (
            selectedOptions.slice(0, maxItems).map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="text-xs flex items-center gap-1"
              >
                {option.label}
                <span
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRemove(option.value);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </span>
              </Badge>
            ))
          )}
          {selectedOptions.length > maxItems && (
            <Badge variant="secondary" className="text-xs">
              +{selectedOptions.length - maxItems} อื่นๆ
            </Badge>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1 text-sm text-gray-500">ไม่พบรายการ</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Checkbox
                    checked={value.includes(option.value)}
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    readOnly
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
