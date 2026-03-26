"use client";

import { useState } from "react";
import { UserPlus, Search, Trash2, Mail } from "lucide-react";
import { deleteAdminAccount } from "@/lib/admin-actions";
import AddAdminModal from "./AddAdminModal";

export default function AdminUserList({ 
  initialAdmins, 
  currentAdminId 
}: { 
  initialAdmins: any[], 
  currentAdminId: string 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Instant Client-side filtering
  const filteredAdmins = initialAdmins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete(id: string, email: string) {
    if (window.confirm(`SECURITY ALERT: Revoke all administrative access for ${email}?`)) {
      const res = await deleteAdminAccount(id);
      if (!res.success) {
        alert(res.error);
      }
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name or email..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-cyan-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <UserPlus size={16} /> Add New Admin
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                <th className="p-6">Staff Identity</th>
                <th className="p-6">Role & Status</th>
                <th className="p-6">Joined Date</th>
                <th className="p-6 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{admin.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      admin._id === currentAdminId 
                       ? "bg-amber-50 text-amber-600 border-amber-100" 
                       : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {admin._id === currentAdminId ? "Active Session" : "System Admin"}
                    </span>
                  </td>
                  <td className="p-6 text-xs text-slate-500 font-medium">
                    {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-6 text-right">
                    {admin._id !== currentAdminId ? (
                      <button 
                        onClick={() => handleDelete(admin._id, admin.email)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Revoke Permissions"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 italic px-2">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}