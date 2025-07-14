import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
        className
      )}
      onChange={(e) => {
        if (onCheckedChange) {
          onCheckedChange(e.target.checked)
        }
        if (props.onChange) {
          props.onChange(e)
        }
      }}
      {...props}
    />
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
