//app/(admin)/layout.tsx
import { auth, signOut } from "@/auth";
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavLinks from "@/components/admin/NavLinks";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Fetch session on the server
  const session = await auth();

  /**
   * 🛡️ LAYER 2 SECURITY DEFENSE
   * Verified Server-side redirect. If the session is invalid or the role 
   * is not 'admin', we terminate the request immediately.
   */
  if (!session || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-cyan-500/10">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-66 bg-slate-950 text-white fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-white/5 shadow-2xl">
        
        {/* Branding Area */}
        <div className="p-8 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck size={22} className="text-black" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tighter leading-none text-white">Petronas</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-8 space-y-10 overflow-y-auto no-scrollbar">
          <div>
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-5">Main Operations</p>
            <nav className="space-y-1.5">
              <NavLinks />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-5">Quick Access</p>
            <Link 
              href="/" 
              target="_blank"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                Live Website
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* User Account & Sign Out */}
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="flex items-center gap-3 p-4 mb-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="w-11 h-11 rounded-xl bg-linear-to-br from-slate-800 to-black flex items-center justify-center text-sm font-black border border-white/10 text-cyan-400 shadow-inner">
                {session.user?.name?.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white uppercase tracking-tight">{session.user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] text-emerald-500/80 uppercase font-black tracking-tighter">System Admin</p>
                </div>
             </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Terminate Session
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 ml-66 flex flex-col">
        
        {/* Top Header: Glassmorphism Effect */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-10 shadow-sm">
           <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Global search: Bookings, Refs, or Visitors..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all placeholder:text-slate-400 font-medium"
              />
           </div>

           <div className="flex items-center gap-6">
              {/* Notifications */}
              <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all group border border-slate-100">
                 <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              
              <div className="h-8 w-px bg-slate-200" />
              
              {/* Profile Details */}
              <div className="flex items-center gap-4">
                 <div className="text-right hidden xl:block">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1.5">{session.user?.name}</p>
                    <div className="flex justify-end">
                      <p className="text-[9px] text-emerald-600 uppercase font-black tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        Live Now
                      </p>
                    </div>
                 </div>
                 <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm hover:border-cyan-500/30 transition-colors cursor-pointer group">
                    <User size={24} className="text-slate-400 translate-y-1 group-hover:text-cyan-500 transition-colors" />
                 </div>
              </div>
           </div>
        </header>

        {/* Page Content Rendering Area */}
        <main className="flex-1 p-10">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}