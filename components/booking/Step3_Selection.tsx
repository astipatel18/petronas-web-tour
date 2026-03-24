// components/booking/Step3_Selection.tsx
"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Plus, 
  Minus, 
  Info, 
  CheckCircle2, 
  ChevronDown,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Calendar from "./Calendar"; // Ensure this import matches your file structure

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

export default function Step3_Selection() {
  // 1. Pull everything needed from the Global Store
  const { 
    isMalaysian, 
    tickets, 
    updateTickets, 
    setStep,
    selectedDate,
    selectedTime,
    setDate,
    setTime
  } = useBookingStore();

  const [isExpanded, setIsExpanded] = useState(false);

  // Pricing Logic
  const prices = isMalaysian 
    ? { adult: 35, senior: 25, child: 17 } 
    : { adult: 98, senior: 75, child: 50 };

  const total = (tickets.adult * prices.adult) + (tickets.senior * prices.senior) + (tickets.child * prices.child);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 font-black mb-2">
            Availability & Tickets
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Sky Experience <span className="font-light text-slate-400">— Standard Visit</span>
          </h2>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-3 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
            isExpanded 
              ? "bg-red-50 text-red-600 hover:bg-red-100" 
              : "bg-black text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
          )}
        >
          {isExpanded ? "Cancel Selection" : "Select Option"}
          <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: 20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100"
          >
            <div className="p-8 md:p-10 space-y-12">
              
              {/* 2. DATE & TIME PICKER GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* A. CALENDAR SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Select Visit Date
                    </label>
                  </div>
                  {/* SYNC: setDate called here */}
                  <Calendar 
    selectedDate={selectedDate || ""} 
    onSelect={(date: string) => setDate(date)} 
  />
                </div>

                {/* B. TIME SLOT SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Choose Arrival Time
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button 
                        key={slot} 
                        // SYNC: setTime called here
                        onClick={() => setTime(slot)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium transition-all border text-center",
                          selectedTime === slot 
                            ? "bg-black text-white border-black shadow-md" 
                            : "bg-white text-slate-600 border-slate-100 hover:border-slate-300"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* INFO CALLOUT */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">
                      <span className="font-bold text-cyan-600">Note:</span> Please arrive 15 minutes before your selected time slot for security briefing.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. TICKET COUNTER GRID */}
              <div className="space-y-6 pt-12 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Quantity & Passenger Type
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: 'adult', label: 'Adult', sub: '13-60 yrs', p: prices.adult },
                    { type: 'senior', label: 'Senior', sub: '61+ yrs', p: prices.senior },
                    { type: 'child', label: 'Child', sub: '3-12 yrs', p: prices.child },
                  ].map((t) => (
                    <div 
                      key={t.type} 
                      className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-6 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-bold text-slate-900 uppercase tracking-tight">{t.label}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.sub}</p>
                        </div>
                        <p className="font-mono font-bold text-cyan-600">RM {t.p}</p>
                      </div>

                      <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-slate-100 shadow-inner">
                        <button 
                          type="button"
                          onClick={() => updateTickets(t.type as any, tickets[t.type as keyof typeof tickets] - 1)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-slate-400" />
                        </button>
                        <span className="text-lg font-black text-slate-900">{tickets[t.type as keyof typeof tickets]}</span>
                        <button 
                          type="button"
                          onClick={() => updateTickets(t.type as any, tickets[t.type as keyof typeof tickets] + 1)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900 text-white hover:bg-black transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOTAL & CTA SUMMARY */}
              <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Amount</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">RM {total}</p>
                  </div>
                  {(selectedTime || selectedDate) && (
                    <div className="bg-slate-100 h-12 w-px hidden md:block" />
                  )}
                  <div className="hidden md:block">
                    {selectedDate && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDate}</p>
                    )}
                    {selectedTime && (
                      <p className="text-lg font-bold text-cyan-600 flex items-center gap-2">
                        <CheckCircle2 size={16} /> {selectedTime}
                      </p>
                    )}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  // 🛡️ SECURITY: Only allow proceed if ALL data is present
                  disabled={total === 0 || !selectedTime || !selectedDate}
                  onClick={() => setStep(4)}
                  className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-20 disabled:grayscale cursor-pointer"
                >
                  {(!selectedDate || !selectedTime) ? "Select Date & Time" : "Confirm & Add to Cart"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}