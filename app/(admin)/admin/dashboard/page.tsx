// app/(admin)/dashboard/page.tsx
import { dbConnect } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { auth } from "@/auth";
import { 
  Users, 
  Ticket, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

export default async function AdminDashboard() {
  // 1. Authenticate the Admin session
  const session = await auth();
  
  // 2. Connect to MongoDB
  await dbConnect();

  // 3. 📊 Fetch Stats from MongoDB
  const totalBookingsCount = await Booking.countDocuments();
  
  // Get Today's Date range
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayBookingsCount = await Booking.countDocuments({ 
    createdAt: { $gte: startOfToday, $lte: endOfToday } 
  });
  
  // Fetch all for revenue and table
  const allBookings = await Booking.find().sort({ createdAt: -1 });
  
  const totalRevenue = allBookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const recentBookings = allBookings.slice(0, 6); // Last 6 bookings

  const stats = [
    { 
        label: "Total Bookings", 
        value: totalBookingsCount, 
        icon: <Ticket className="w-5 h-5" />, 
        color: "bg-blue-600",
        bg: "bg-blue-50" 
    },
    { 
        label: "New Today", 
        value: todayBookingsCount, 
        icon: <TrendingUp className="w-5 h-5" />, 
        color: "bg-emerald-600",
        bg: "bg-emerald-50" 
    },
    { 
        label: "Total Revenue", 
        value: `RM ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
        icon: <DollarSign className="w-5 h-5" />, 
        color: "bg-amber-600",
        bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="p-10 bg-slate-50 min-h-screen text-slate-900">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Management Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{session?.user?.name}</span>. Here is what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
            <div className="bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
        </div>
      </div>
      
      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`${s.bg} ${s.color.replace('bg-', 'text-')} p-3 rounded-xl`}>
                    {s.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Recent Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Reservations</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Real-time update from store</p>
          </div>
          <a href="/admin/bookings" className="text-blue-600 text-sm font-bold hover:underline">View All Bookings</a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-6">Ref. ID</th>
                <th className="p-6">Visitor Details</th>
                <th className="p-6">Visit Schedule</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-xs">
                      {b.bookingRef}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{b.customerName}</p>
                    <p className="text-xs text-slate-500">{b.email}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-medium text-slate-700">{new Date(b.visitDate).toLocaleDateString('en-GB')}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{b.timeSlot}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-slate-900">RM {(b.totalPrice || 0).toFixed(2)}</p>
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                       Confirmed
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 italic">
                    No reservations found in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}