// components/booking/Step5_Checkout.tsx
"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
// 🛡️ Triggering the Server Action to send OTP and set temp encrypted cookie
import { initiateVerification } from "@/lib/actions"; 
import BotProtection from "./BotProtection"; 
import { 
  ShieldCheck, 
  Mail, 
  User, 
  ArrowLeft, 
  Loader2, 
  Lock, 
  ChevronRight,
  MapPin,
  AlertCircle
} from "lucide-react";
import { m } from "framer-motion";

export default function Step5_Checkout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const { 
    tickets, 
    selectedAttraction, 
    isMalaysian, 
    selectedDate, 
    selectedTime,
    setStep,
    setTempEmail,
    getTotalPrice
  } = useBookingStore();

  // 💰 Calculate total using logic centralized in the store
  const total = getTotalPrice();
  
  // Generating a cosmetic Order ID for the UI
  const orderId = `PTT-${Math.floor(100000 + Math.random() * 900000)}`;

  // Ticket price breakdown based on nationality
  const rates = isMalaysian 
    ? { adult: 35, senior: 25, child: 17 } 
    : { adult: 98, senior: 75, child: 50 };

  return (
    <div className="max-w-6xl mx-auto pb-20 text-slate-900">
      
      {/* 1. PROGRESS INDICATOR (Moving to 5 of 6) */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">Step 05</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">/ 06</span>
        </div>
        <div className="grow h-0.5 bg-slate-100 relative overflow-hidden rounded-full">
            <m.div 
                initial={{ width: "66%" }}
                animate={{ width: "83%" }}
                transition={{ duration: 1, ease: "circOut" }}
                className="absolute left-0 top-0 h-full bg-cyan-500" 
            />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">   
        
        {/* LEFT COLUMN: CUSTOMER DATA FORM */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase">Guest <span className="text-slate-400 italic font-serif">Information</span></h2>
              <p className="text-slate-500 text-sm font-medium">Verification is required to secure your booking and deliver tickets.</p>
            </div>

            <form 
              action={async (formData: FormData) => {
                setIsSubmitting(true);
                setFormError(null);
                
                const email = formData.get("email") as string;
                
                try {
                  // 🚀 CALL SERVER ACTION: 
                  // This validates data, calculates server-side price, generates OTP, 
                  // sends the email, and sets the encrypted 'pending_booking' cookie.
                  const result = await initiateVerification(formData);
                  
                  if (result.success) {
                    setTempEmail(email); // Save for display on Step 6 screen
                    setStep(6);         // Navigate to OTP input
                  }
                } catch (error: any) {
                  setIsSubmitting(false);
                  setFormError(error.message || "Unable to initiate verification. Please try again.");
                }
              }} 
              className="space-y-8"
            >
              {/* 🛡️ HIDDEN INPUTS: Pass store state into the Server Action's FormData */}
              <input type="hidden" name="attractionName" value={selectedAttraction?.name || "Standard Visit"} />
              <input type="hidden" name="visitDate" value={selectedDate} />
              <input type="hidden" name="timeSlot" value={selectedTime} />
              <input type="hidden" name="adultTickets" value={String(tickets.adult)} />
              <input type="hidden" name="childTickets" value={String(tickets.child)} />
              <input type="hidden" name="seniorTickets" value={String(tickets.senior)} />
              <input type="hidden" name="isMalaysian" value={isMalaysian ? "true" : "false"} />
              <input type="hidden" name="totalPrice" value={String(total)} />

              <div className="grid gap-6">
                {/* NAME INPUT */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                    Full Name (As per ID/Passport) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input 
                      name="customerName" 
                      required 
                      autoComplete="name"
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-sm text-slate-900 focus:bg-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300" 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                </div>

                {/* EMAIL INPUT */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                    Email Address (For Code & Tickets) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      autoComplete="email"
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-sm text-slate-900 focus:bg-white focus:border-cyan-500 outline-none transition-all placeholder:text-slate-300" 
                      placeholder="visitor@example.com" 
                    />
                  </div>
                </div>
              </div>

              {/* 🤖 BOT PROTECTION: Math Challenge + Honeypot */}
              <BotProtection />

              {/* ERROR ALERT BOX */}
              {formError && (
                <m.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-sm flex items-center gap-3"
                >
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    {formError}
                  </p>
                </m.div>
              )}

              {/* BOTTOM NAVIGATION BUTTONS */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(4)}
                  className="p-5 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-30"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="grow bg-slate-950 text-white py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Verifying Data...
                    </>
                  ) : (
                    <>Send Verification Code <ChevronRight size={14} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <div className="lg:col-span-2 lg:sticky lg:top-28">
          <div className="bg-slate-950 text-white p-8 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/10">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Invoice: {orderId}
              </span>
              <Lock size={14} className="text-cyan-500 opacity-50" />
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-3">Your Selection</p>
                <p className="text-xl font-bold uppercase tracking-tighter leading-tight">
                    {selectedAttraction?.name || "Petronas Experience"}
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-500">
                    <MapPin size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">KLCC, Kuala Lumpur</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8 text-xs">
                <div>
                  <p className="text-slate-500 uppercase font-bold mb-1 tracking-widest">Visit Date</p>
                  <p className="font-bold text-white uppercase">{selectedDate || "Not Selected"}</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase font-bold mb-1 tracking-widest">Entry Slot</p>
                  <p className="font-bold text-white tracking-tighter">{selectedTime || "09:00 AM"}</p>
                </div>
              </div>

              {/* TICKET BREAKDOWN TABLE */}
              <div className="space-y-4">
                {tickets.adult > 0 && <SummaryRow label="Adult" qty={tickets.adult} p={rates.adult} />}
                {tickets.child > 0 && <SummaryRow label="Child" qty={tickets.child} p={rates.child} />}
                {tickets.senior > 0 && <SummaryRow label="Senior" qty={tickets.senior} p={rates.senior} />}
              </div>

              {/* TOTAL CALCULATION FOOTER */}
              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Total Payable</span>
                    <span className="text-[9px] text-cyan-500/50 uppercase font-bold border border-cyan-500/10 px-2 py-0.5 rounded-sm">
                      {isMalaysian ? "MyKad Rates" : "Standard Rates"}
                    </span>
                </div>
                <span className="text-4xl font-black text-white tracking-tighter font-mono">
                  RM {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-center text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
            All tickets are subject to availability. <br/> 
            Digital delivery within <span className="text-slate-600">60 seconds</span> of verification.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable row for the Order Summary breakdown
 */
function SummaryRow({ label, qty, p }: { label: string, qty: number, p: number }) {
  return (
    <div className="flex justify-between text-xs items-center">
      <span className="text-slate-500 uppercase font-bold tracking-tighter">{label} x {qty}</span>
      <span className="text-white font-mono font-bold">RM {(qty * p).toFixed(2)}</span>
    </div>
  );
}