"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="text-slate-500 text-[10px] uppercase tracking-widest font-bold hover:text-cyan-400 transition-all py-2 flex items-center gap-2"
    >
      <Printer size={14} /> Print Receipt
    </button>
  );
}