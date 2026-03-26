import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { UserPlus, ShieldCheck, Mail, Calendar, Search, MoreVertical } from "lucide-react";
import AdminUserList from "@/components/admin/AdminUserList"; // Client wrapper for interactivity

export default async function AdminManagement() {
  const session = await auth();
  await dbConnect();
  
  // Fetch all admins, newest first
  const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      
      {/* 1. HEADER & GLOBAL ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 mb-2">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Staff Governance</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Identity Management</h1>
          <p className="text-slate-500 text-sm mt-1">Control system access and administrative privileges.</p>
        </div>
        
        {/* We pass the initial data to a client component to handle search/modals */}
        <AdminUserList 
          initialAdmins={JSON.parse(JSON.stringify(admins))} 
          currentAdminId={session?.user?.id || ""} 
        />
      </div>

      {/* 2. SECURITY NOTICE */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10 flex items-center gap-4">
        <div className="p-3 bg-blue-600 text-white rounded-xl">
           <ShieldCheck size={20} />
        </div>
        <div className="text-sm text-blue-900 leading-relaxed">
          <strong>Security Protocol:</strong> All administrative changes are recorded in the system audit logs. 
          New admins will require their temporary passwords to be changed upon first login.
        </div>
      </div>

    </div>
  );
}