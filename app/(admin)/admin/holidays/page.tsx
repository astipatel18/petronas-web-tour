// app/(admin)/admin/holidays/page.tsx
import { dbConnect } from "@/lib/mongodb";
import Holiday from "@/models/Holiday";
import { CalendarDays, Trash2, Info } from "lucide-react";
import HolidayForm from "@/components/admin/HolidayForm";
import { deleteHoliday } from "@/lib/admin-actions";

export default async function HolidayManagerPage() {
  await dbConnect();
  const holidays = await Holiday.find().sort({ date: 1 });

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
          <CalendarDays className="text-cyan-600" /> Peak Price Management
        </h1>
        <p className="text-slate-500 mt-2">Configure seasonal surges and public holiday premiums.</p>
      </div>

      {/* 🚀 ADD NEW HOLIDAY FORM */}
      <div className="mb-10">
        <HolidayForm />
      </div>

      {/* 📊 HOLIDAYS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-white">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Scheduled Peak Days</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-bold text-slate-400">
            <tr>
              <th className="p-6">Holiday Name</th>
              <th className="p-6">Date</th>
              <th className="p-6">Surge Multiplier</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {holidays.map((h) => (
              <tr key={h._id.toString()} className="hover:bg-slate-50 transition-colors">
                <td className="p-6 font-bold text-slate-800">{h.name}</td>
                <td className="p-6 font-mono text-slate-600">{h.date}</td>
                <td className="p-6">
                   <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-bold text-xs border border-cyan-100">
                      +{Math.round(h.multiplier * 100)}% Premium
                   </span>
                </td>
                <td className="p-6 text-right">
                  <form action={async () => {
                    "use server";
                    await deleteHoliday(h._id.toString());
                  }}>
                    <button className="text-slate-300 hover:text-red-500 transition-colors p-2">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {holidays.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 italic">
                  No peak dates configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PRO-TIP BOX */}
      <div className="mt-8 flex gap-4 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
         <Info className="text-blue-500 shrink-0" />
         <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Note:</strong> Fixed holidays (like Merdeka Day) are handled automatically by the system engine. 
            Use this dashboard only for variable dates like Hari Raya or Chinese New Year.
         </p>
      </div>
    </div>
  );
}