import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-all duration-200",
        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/25 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/25",
        className
      )}
      {...props}
    />
  )
}

export { Input }
