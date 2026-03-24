"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Ticket, 
  ShieldCheck, 
  MapPin,
  ChevronRight,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Step4_Cart() {
  const { 
    tickets, 
    selectedAttraction, 
    isMalaysian, 
    selectedDate,   
    selectedTime,   
    setStep, 
    reset 
  } = useBookingStore();

  const prices = isMalaysian 
    ? { adult: 35, senior: 25, child: 17 } 
    : { adult: 98, senior: 75, child: 50 };

  const total = (tickets.adult * prices.adult) + (tickets.senior * prices.senior) + (tickets.child * prices.child);

  if (total === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ticket className="text-slate-300" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Your cart is empty</h3>
        <p className="text-slate-500 mt-2 mb-8">Start by selecting an iconic experience.</p>
        <button 
          onClick={() => setStep(1)} 
          className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-cyan-600 transition-all"
        >
          Browse Attractions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* 1. Progress Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Review your <span className="text-slate-400 italic font-serif">Order</span></h2>
          <p className="text-sm text-slate-500 mt-1">Step 4 of 5 — Confirmation</p>
        </div>
        <button 
          onClick={reset} 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} className="group-hover:shake" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* LEFT COLUMN: Booking Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Attraction Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
              <Image 
                src={selectedAttraction?.image || "https://images.unsplash.com/photo-1544918877-460635b6d13e"} 
                alt="Experience" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-8 grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-md mb-2 block w-fit">
                    Confirmed Availability
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedAttraction?.name}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><Calendar size={18} className="text-cyan-600" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Date</span>
                    <span className="text-sm font-bold text-slate-800">{selectedDate || "Today, 24 Oct 2024"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><Clock size={18} className="text-cyan-600" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Timeslot</span>
                    <span className="text-sm font-bold text-slate-800">{selectedTime || "09:00 AM"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Breakdown List */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Ticket Breakdown</h4>
            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm">
              <TicketRow label="Adult" age="13-60 yrs" qty={tickets.adult} price={prices.adult} />
              <TicketRow label="Child" age="3-12 yrs" qty={tickets.child} price={prices.child} />
              <TicketRow label="Senior" age="61+ yrs" qty={tickets.senior} price={prices.senior} />
              
              <div className="pt-6 border-t border-slate-50 flex items-center gap-3 text-slate-400 italic">
                <Info size={14} />
                <p className="text-[10px]">Identification for {isMalaysian ? 'Malaysians' : 'International Guests'} will be verified at entry.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep(3)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-600 transition-colors px-2"
          >
            <ArrowLeft size={14} /> Modify Selection
          </button>
        </div>

        {/* RIGHT COLUMN: Sticky Summary */}
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center justify-between">
              Summary
              <ShieldCheck className="text-green-500" size={20} />
            </h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal Tickets</span>
                <span className="font-mono font-bold">RM {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="font-mono text-green-600">FREE</span>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total</span>
                <span className="text-4xl font-black tracking-tighter text-slate-900">RM {total.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(5)}
              className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-cyan-500/20 hover:bg-cyan-700 transition-all flex items-center justify-center gap-3"
            >
              Secure Checkout <ChevronRight size={14} />
            </motion.button>

            <div className="mt-8 space-y-3">
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Instant Confirmation
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-slate-400" /> SSL Encrypted Payment
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TicketRow({ label, age, qty, price }: { label: string, age: string, qty: number, price: number }) {
  if (qty === 0) return null;
  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
          <Ticket size={18} />
        </div>
        <div>
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{age} • x{qty}</p>
        </div>
      </div>
      <p className="font-mono font-bold text-slate-900">RM {(qty * price).toFixed(2)}</p>
    </div>
  );
}