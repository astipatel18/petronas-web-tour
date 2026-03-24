// components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-cyan-500",
      outline: "border border-slate-700 text-white hover:bg-slate-800",
      ghost: "text-slate-400 hover:text-white"
    }
    return (
      <button
        ref={ref}
        className={cn("px-6 py-3 font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50", variants[variant], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"