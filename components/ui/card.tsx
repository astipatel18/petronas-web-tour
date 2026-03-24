// components/ui/card.tsx
import { cn } from "@/lib/utils"

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-slate-900 border border-slate-800 overflow-hidden", className)}>
    {children}
  </div>
)