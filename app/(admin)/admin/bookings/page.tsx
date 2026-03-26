// // app/(admin)/bookings/page.tsx
// import { dbConnect } from "@/lib/mongodb";
// import Booking from "@/models/Booking";
// import { 
//   Search, 
//   Filter, 
//   Download, 
//   MoreVertical, 
//   UserCheck, 
//   UserCircle,
//   Globe,
//   CreditCard,
//   ChevronRight
// } from "lucide-react";

// export default async function BookingsListPage() {
//   // 1. Connect to Database
//   await dbConnect();
  
//   // 2. Fetch all bookings from MongoDB (Newest first)
//   const bookings = await Booking.find().sort({ createdAt: -1 });

//   return (
//     <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      
//       {/* --- HEADER SECTION --- */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reservations Manager</h1>
//           <p className="text-slate-500 text-sm">Real-time overview of all tower admissions and visitor types.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all text-slate-700">
//             <Download size={14} /> Export CSV
//           </button>
//           <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-all text-white">
//             Print Manifest
//           </button>
//         </div>
//       </div>

//       {/* --- SEARCH & FILTER TOOLBAR --- */}
//       <div className="bg-white p-4 border border-slate-200 rounded-t-xl flex flex-wrap gap-4 items-center justify-between">
//         <div className="relative w-full max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input 
//             type="text" 
//             placeholder="Search by reference, name or email..." 
//             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
//           />
//         </div>
//         <div className="flex gap-2">
//           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
//             <Filter size={14} /> Advanced Filters
//           </button>
//         </div>
//       </div>

//       {/* --- DATA TABLE --- */}
//       <div className="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-slate-50/50 border-b border-slate-200">
//               <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400">
//                 <th className="p-4">Ref & Source</th>
//                 <th className="p-4">Visitor Details</th>
//                 <th className="p-4">Nationality</th>
//                 <th className="p-4">Schedule</th>
//                 <th className="p-4">Ticket Mix</th>
//                 <th className="p-4">Total Revenue</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {bookings.map((booking) => (
//                 <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors group">
                  
//                   {/* Reference & Source (Guest vs Member) */}
//                   <td className="p-4">
//                     <div className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded w-fit mb-1 border border-blue-100">
//                       {booking.bookingRef}
//                     </div>
//                     {booking.userId ? (
//                       <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase">
//                         <UserCheck size={10} /> Member Account
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
//                         <UserCircle size={10} /> Guest Checkout
//                       </div>
//                     )}
//                   </td>

//                   {/* Customer Details */}
//                   <td className="p-4">
//                     <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
//                     <div className="text-xs text-slate-500 truncate max-w-37.5">{booking.email}</div>
//                   </td>

//                   {/* Nationality (MyKad vs Standard) */}
//                   <td className="p-4">
//                     {booking.isMalaysian ? (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
//                         <Globe size={10} /> MYKAD
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">
//                         <Globe size={10} /> STANDARD
//                       </span>
//                     )}
//                   </td>

//                   {/* Visit Schedule */}
//                   <td className="p-4">
//                     <div className="text-xs font-bold text-slate-700">
//                       {new Date(booking.visitDate).toLocaleDateString('en-GB', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </div>
//                     <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
//                       Slot: {booking.timeSlot}
//                     </div>
//                   </td>

//                   {/* Ticket Types Breakdown */}
//                   <td className="p-4">
//                     <div className="flex flex-wrap gap-1">
//                       {booking.adultTickets > 0 && (
//                         <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">A: {booking.adultTickets}</span>
//                       )}
//                       {booking.seniorTickets > 0 && (
//                         <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">S: {booking.seniorTickets}</span>
//                       )}
//                       {booking.childTickets > 0 && (
//                         <span className="bg-cyan-500 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">C: {booking.childTickets}</span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Financials (Grand Total) */}
//                   <td className="p-4 font-mono font-bold text-slate-900 text-sm">
//                     RM {(booking.totalPrice || 0).toFixed(2)}
//                   </td>

//                   {/* Payment Status */}
//                   <td className="p-4">
//                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black bg-green-100 text-green-700 uppercase border border-green-200">
//                       <div className="w-1 h-1 rounded-full bg-green-700 animate-pulse" />
//                       Paid
//                     </span>
//                   </td>

//                   {/* Row Actions */}
//                   <td className="p-4 text-right">
//                     <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all">
//                       <MoreVertical size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* --- EMPTY STATE HANDLER --- */}
//         {bookings.length === 0 && (
//           <div className="py-32 text-center flex flex-col items-center justify-center">
//             <div className="bg-slate-100 p-4 rounded-full mb-4">
//               <CreditCard className="text-slate-300 w-8 h-8" />
//             </div>
//             <p className="text-slate-500 font-medium">No admissions recorded yet.</p>
//             <p className="text-slate-400 text-xs">New bookings from the website will appear here instantly.</p>
//           </div>
//         )}
//       </div>

//       {/* --- PAGINATION & DATABASE FOOTER --- */}
//       <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//         {/* FIXED: Changed <p> to <div> to avoid hydration error with nested <div> */}
//         <div className="text-[11px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
//           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//           Database Scan Complete • {bookings.length} Records Found
//         </div>
//         <div className="flex gap-2">
//            <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed flex items-center gap-2">
//              Previous
//            </button>
//            <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
//              Next <ChevronRight size={14} />
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }








import { dbConnect } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CancelBookingButton from "@/components/admin/CancelBookingButton"; // 🚀 Import the button
import { 
  Search, 
  Filter, 
  Download, 
  UserCheck, 
  UserCircle,
  Globe,
  CreditCard,
  ChevronRight,
  XCircle
} from "lucide-react";

export default async function BookingsListPage() {
  // 1. Connect to Database
  await dbConnect();
  
  // 2. Fetch all bookings from MongoDB (Newest first)
  const bookings = await Booking.find().sort({ createdAt: -1 });

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-shadow-sm">Reservations Manager</h1>
          <p className="text-slate-500 text-sm">Real-time overview of all tower admissions and visitor types.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all text-slate-700">
            <Download size={14} /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-all text-white">
            Print Manifest
          </button>
        </div>
      </div>

      {/* --- SEARCH & FILTER TOOLBAR --- */}
      <div className="bg-white p-4 border border-slate-200 rounded-t-xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by reference, name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={14} /> Advanced Filters
          </button>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                <th className="p-4">Ref & Source</th>
                <th className="p-4">Visitor Details</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Ticket Mix</th>
                <th className="p-4">Total Revenue</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking._id} className={`transition-colors group ${booking.status === 'cancelled' ? 'bg-red-50/30' : 'hover:bg-blue-50/30'}`}>
                  
                  {/* Reference & Source */}
                  <td className="p-4">
                    <div className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded w-fit mb-1 border border-blue-100">
                      {booking.bookingRef}
                    </div>
                    {booking.userId ? (
                      <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase">
                        <UserCheck size={10} /> Member
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                        <UserCircle size={10} /> Guest
                      </div>
                    )}
                  </td>

                  {/* Customer Details */}
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm">{booking.customerName}</div>
                    <div className="text-xs text-slate-500 truncate max-w-37.5">{booking.email}</div>
                  </td>

                  {/* Nationality */}
                  <td className="p-4">
                    {booking.isMalaysian ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        <Globe size={10} /> MYKAD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">
                        <Globe size={10} /> STANDARD
                      </span>
                    )}
                  </td>

                  {/* Visit Schedule */}
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-700">
                      {new Date(booking.visitDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                      Slot: {booking.timeSlot}
                    </div>
                  </td>

                  {/* Ticket Types Breakdown */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {booking.adultTickets > 0 && (
                        <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">A: {booking.adultTickets}</span>
                      )}
                      {booking.seniorTickets > 0 && (
                        <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">S: {booking.seniorTickets}</span>
                      )}
                      {booking.childTickets > 0 && (
                        <span className="bg-cyan-500 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-bold">C: {booking.childTickets}</span>
                      )}
                    </div>
                  </td>

                  {/* Financials */}
                  <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                    RM {(booking.totalPrice || 0).toFixed(2)}
                  </td>

                  {/* 🛡️ Status (Dynamic Badge) */}
                  <td className="p-4">
                    {booking.status === 'cancelled' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black bg-red-100 text-red-700 uppercase border border-red-200 shadow-sm">
                        <XCircle size={10} />
                        Voided
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black bg-green-100 text-green-700 uppercase border border-green-200 shadow-sm">
                        <div className="w-1 h-1 rounded-full bg-green-700 animate-pulse" />
                        Confirmed
                      </span>
                    )}
                  </td>

                  {/* 🚀 Actions (Cancel Button) */}
                  <td className="p-4 text-right">
                    {booking.status !== 'cancelled' ? (
                      <CancelBookingButton 
                        id={booking._id.toString()} 
                        refCode={booking.bookingRef} 
                      />
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold uppercase italic pr-2">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- EMPTY STATE --- */}
        {bookings.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center justify-center bg-white">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <CreditCard className="text-slate-300 w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium">No admissions recorded yet.</p>
            <p className="text-slate-400 text-xs">New bookings will appear here instantly.</p>
          </div>
        )}
      </div>

      {/* --- FOOTER & PAGINATION --- */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[11px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Database Scan Complete • {bookings.length} Records Found
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed flex items-center gap-2">
             Previous
           </button>
           <button className="px-4 py-2 text-xs font-bold border border-slate-200 rounded bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
             Next <ChevronRight size={14} />
           </button>
        </div>
      </div>
    </div>
  );
}