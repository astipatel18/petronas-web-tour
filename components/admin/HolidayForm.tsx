"use client";
import { addHoliday } from "@/lib/admin-actions";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

export default function HolidayForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addHoliday(formData);
    setLoading(false);
    (document.getElementById("h-form") as HTMLFormElement).reset();
  }

  return (
    <form id="h-form" action={handleSubmit} className="bg-white p-6 border border-slate-200 rounded-xl mb-8 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-50 space-y-1">
        <label className="text-[10px] font-bold uppercase text-slate-400">Festival Name</label>
        <input name="name" required className="w-full border p-2 rounded-lg outline-none focus:border-cyan-500" placeholder="e.g. Hari Raya" />
      </div>
      <div className="w-48 space-y-1">
        <label className="text-[10px] font-bold uppercase text-slate-400">Date</label>
        <input name="date" type="date" required className="w-full border p-2 rounded-lg outline-none focus:border-cyan-500" />
      </div>
      <div className="w-32 space-y-1">
        <label className="text-[10px] font-bold uppercase text-slate-400">Premium %</label>
        <input name="multiplier" type="number" defaultValue={25} required className="w-full border p-2 rounded-lg outline-none focus:border-cyan-500" />
      </div>
      <button disabled={loading} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase flex items-center gap-2 hover:bg-cyan-600 transition-all">
        {loading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>}
        Add Peak Day
      </button>
    </form>
  );
}