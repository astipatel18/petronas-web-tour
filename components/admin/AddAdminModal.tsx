"use client";

import { useState } from "react";
import { createAdminAccount } from "@/lib/admin-actions";
import { X, Loader2, ShieldPlus } from "lucide-react";

export default function AddAdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await createAdminAccount(formData);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to create account");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldPlus className="text-cyan-600" size={20} /> Add Staff Member
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        
        <form action={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Full Name</label>
            <input name="name" required className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:border-cyan-500" placeholder="e.g. Sarah Connor" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Staff Email</label>
            <input name="email" type="email" required className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:border-cyan-500" placeholder="staff@petronastowers.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Temporary Access Key (Password)</label>
            <input name="password" type="password" required minLength={8} className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:border-cyan-500" placeholder="••••••••" />
          </div>

          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Authorize New Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}