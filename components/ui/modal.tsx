"use client"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X size={20}/></button>
        <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  )
}