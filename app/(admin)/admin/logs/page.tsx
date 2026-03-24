// app/(admin)/admin/logs/page.tsx
import { dbConnect } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { ShieldAlert, Info, AlertTriangle, Clock } from "lucide-react";

export default async function LogsPage() {
  await dbConnect();
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Security Audit Trail</h1>
        <p className="text-slate-500 italic text-sm">Real-time system monitoring and threat detection.</p>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log._id} className="bg-white border border-slate-200 p-6 flex items-start gap-6 shadow-sm group hover:border-blue-300 transition-all">
            <div className={`p-3 rounded-lg ${
              log.level === "CRITICAL" ? "bg-red-100 text-red-600" : 
              log.level === "WARNING" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
            }`}>
              {log.level === "CRITICAL" ? <ShieldAlert size={20}/> : 
               log.level === "WARNING" ? <AlertTriangle size={20}/> : <Info size={20}/>}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-mono font-bold text-xs uppercase tracking-widest">{log.action}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                  <Clock size={10} /> {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-700 font-medium mb-2">{log.message}</p>
              {log.metadata && (
                <div className="bg-slate-50 p-3 rounded text-[10px] font-mono text-slate-500 overflow-x-auto whitespace-pre">
                   {JSON.stringify(log.metadata, null, 2)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}