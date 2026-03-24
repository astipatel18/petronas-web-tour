// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("flex h-12 w-full border border-slate-800 bg-slate-900 px-4 py-2 text-white ring-offset-slate-950 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50", className)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"