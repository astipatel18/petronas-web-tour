// components/booking/Step5_Checkout.tsx
"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
// 🛡️ Triggering the Server Action to send OTP and set temp encrypted cookie
import { initiateVerification } from "@/lib/actions"; 
import BotProtection from "./BotProtection"; 
import { 
  Mail, 
  User, 
  ArrowLeft, 
  Loader2, 
  Lock, 
  ChevronRight,
  MapPin,
  AlertCircle,
  ShieldCheck
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
    totalPrice // 🚀 FIX: Reading the verified price directly from state
  } = useBookingStore();

  // Generating a cosmetic Order ID for the UI
  const orderId = `PTT-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-6xl mx-auto pb-20 text-slate-900">
      
      {/* 1. PROGRESS INDICATOR (Step 5 of 6) */}
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
              <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase">
                Guest <span className="text-slate-400 italic font-serif">Information</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Verification is required to secure your booking and deliver tickets.
              </p>
            </div>

            <form 
              action={async (formData: FormData) => {
                setIsSubmitting(true);
                setFormError(null);
                
                const email = formData.get("email") as string;
                
                try {
                  // 🚀 CALL SERVER ACTION: 
                  // This validates data, calculates server-side price, generates OTP, 
                  // and sets the encrypted 'pending_booking' cookie.
                  const result = await initiateVerification(formData);
                  
                  if (result.success) {
                    setTempEmail(email); 
                    setStep(6);         
                  }
                } catch (error: any) {
                  setIsSubmitting(false);
                  setFormError(error.message || "Unable to initiate verification.");
                }
              }} 
              className="space-y-8"
            >
              {/* 🛡️ HIDDEN INPUTS: Passing the verified totalPrice from store to the server */}
              <input type="hidden" name="attractionName" value={selectedAttraction?.name || ""} />
              <input type="hidden" name="visitDate" value={selectedDate} />
              <input type="hidden" name="timeSlot" value={selectedTime} />
              <input type="hidden" name="adultTickets" value={String(tickets.adult)} />
              <input type="hidden" name="childTickets" value={String(tickets.child)} />
              <input type="hidden" name="seniorTickets" value={String(tickets.senior)} />
              <input type="hidden" name="isMalaysian" value={isMalaysian ? "true" : "false"} />
              <input type="hidden" name="totalPrice" value={String(totalPrice)} />

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                    Full Name (As per ID/Passport) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={18} />
                    <input 
                      name="customerName" 
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-sm text-slate-900 focus:bg-white focus:border-cyan-500 outline-none transition-all" 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                </div>

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
                      className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 text-sm text-slate-900 focus:bg-white focus:border-cyan-500 outline-none transition-all" 
                      placeholder="visitor@example.com" 
                    />
                  </div>
                </div>
              </div>

              {/* 🤖 BOT PROTECTION */}
              <BotProtection />

              {formError && (
                <m.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-sm flex items-center gap-3"
                >
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    {formError}
                  </p>
                </m.div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(4)}
                  className="p-5 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="grow bg-slate-950 text-white py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Verifying...
                    </>
                  ) : (
                    <>Request Verification Code <ChevronRight size={14} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
        <div className="lg:col-span-2 lg:sticky lg:top-28">
          <div className="bg-slate-950 text-white p-8 shadow-2xl border border-white/5 rounded-3xl">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/10">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                ID: {orderId}
              </span>
              <ShieldCheck size={16} className="text-cyan-500" />
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2">Final Summary</p>
                <p className="text-xl font-bold uppercase tracking-tighter leading-tight">
                    {selectedAttraction?.name}
                </p>
                <div className="mt-2 flex items-center gap-2 text-slate-500">
                    <MapPin size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Kuala Lumpur, Malaysia</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                <div>
                  <p className="text-slate-500 uppercase text-[9px] font-black mb-1 tracking-widest">Visit Date</p>
                  <p className="text-sm font-bold text-white uppercase">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 uppercase text-[9px] font-black mb-1 tracking-widest">Entry Slot</p>
                  <p className="text-sm font-bold text-white tracking-tighter">{selectedTime}</p>
                </div>
              </div>

              <div className="space-y-3">
                <TicketLine label="Adult" qty={tickets.adult} />
                <TicketLine label="Child" qty={tickets.child} />
                <TicketLine label="Senior" qty={tickets.senior} />
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Total Amount</span>
                    <span className="text-[9px] text-cyan-500 font-bold uppercase">
                      {isMalaysian ? "MyKad Pricing Applied" : "Standard Pricing Applied"}
                    </span>
                </div>
                <span className="text-4xl font-black text-white tracking-tighter font-mono">
                  RM {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketLine({ label, qty }: { label: string, qty: number }) {
  if (qty === 0) return null;
  return (
    <div className="flex justify-between text-[11px] items-center">
      <span className="text-slate-400 uppercase font-bold tracking-widest">{label}</span>
      <span className="text-white font-bold">x {qty}</span>
    </div>
  );
}