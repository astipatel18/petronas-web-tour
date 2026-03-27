// components/booking/Step3_Selection.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { m, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Plus, 
  Minus, 
  Info, 
  ChevronDown,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Calendar from "./Calendar";

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

export default function Step3_Selection() {
  const { 
    isMalaysian, 
    tickets, 
    updateTickets, 
    setStep,
    selectedDate,
    selectedTime,
    setDate,
    setTime,
    totalPrice,      
    setTotalPrice,
    getEstimate      
  } = useBookingStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [currentUnitPrices, setCurrentUnitPrices] = useState({
    adult: isMalaysian ? 35 : 98,
    senior: isMalaysian ? 25 : 75,
    child: isMalaysian ? 17 : 50
  });

  const displayTotal = useMemo(() => {
    return (selectedDate && selectedTime && totalPrice > 0) ? totalPrice : getEstimate();
  }, [selectedDate, selectedTime, totalPrice, getEstimate, tickets]);

  // 📈 LOGGED DYNAMIC PRICING FETCHER
  const fetchDynamicPrice = useCallback(async () => {
    // --- DEBUG LOG START ---
    console.group("🚀 STEP 3: Pricing Engine Check");
    console.log("DATE:", selectedDate);
    console.log("TIME:", selectedTime);
    console.log("MALAYSIAN:", isMalaysian);
    console.log("TICKETS:", tickets);

    if (!selectedDate || !selectedTime) {
      console.warn("⚠️ Aborted: Missing Date or Time selection.");
      console.groupEnd();
      return;
    }

    const hasTickets = tickets.adult > 0 || tickets.child > 0 || tickets.senior > 0;
    if (!hasTickets) {
        console.warn("⚠️ Aborted: Ticket quantity is zero.");
        setTotalPrice(0);
        console.groupEnd();
        return;
    }

    setIsCalculating(true);
    try {
      console.log("📡 Sending request to /api/booking/price...");
      
      const response = await fetch("/api/booking/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tickets,
          isLocal: isMalaysian,
          date: selectedDate,
          timeSlot: selectedTime
        }),
      });
      
      console.log("🛰️ API Status Code:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ SECURITY ALERT: API returned HTML instead of JSON. This usually means Middleware is redirecting to Login or showing a 429 page.");
        throw new Error("Invalid Content Type");
      }

      const data = await response.json();
      console.log("✅ Data Received from Engine:", data);
      
      if (response.ok) {
        setTotalPrice(data.totalPrice);
        if (data.breakdown) {
          setCurrentUnitPrices({
            adult: data.breakdown.adult,
            senior: data.breakdown.senior,
            child: data.breakdown.child,
          });
        }
      } else {
        console.error("❌ API Error Payload:", data);
      }
    } catch (error) {
      console.error("❌ Network/Logic Exception:", error);
    } finally {
      setIsCalculating(false);
      console.groupEnd();
    }
  }, [tickets, isMalaysian, selectedDate, selectedTime, setTotalPrice]);

  useEffect(() => {
    fetchDynamicPrice();
  }, [fetchDynamicPrice]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 font-black mb-2">Admission & Schedule</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sky Experience <span className="font-light text-slate-400">— Selection</span>
          </h2>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-3 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg",
            isExpanded 
              ? "bg-red-50 text-red-600 hover:bg-red-100 shadow-red-100" 
              : "bg-black text-white hover:bg-cyan-600 shadow-slate-200"
          )}
        >
          {isExpanded ? "Close Selection" : "Select Option"}
          <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <m.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50"
          >
            <div className="p-8 md:p-12 space-y-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 1. DATE SELECTION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">
                    <CalendarIcon size={14} className="text-cyan-500" /> 1. Select Visit Date
                  </div>
                  <Calendar 
                    selectedDate={selectedDate} 
                    onSelect={(date) => {
                      setTotalPrice(0); 
                      setDate(date);
                    }} 
                  />
                </div>

                {/* 2. TIME SELECTION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">
                    <Clock size={14} className="text-cyan-500" /> 2. Choose Arrival Time
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button 
                        key={slot} 
                        onClick={() => {
                          setTotalPrice(0); 
                          setTime(slot);
                        }}
                        className={cn(
                          "py-4 rounded-2xl text-xs font-bold border transition-all duration-300",
                          selectedTime === slot 
                            ? "bg-black text-white border-black shadow-lg shadow-slate-300 scale-[1.02]" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {!selectedTime && (
                    <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-3">
                        <Info size={14} className="text-amber-600 mt-0.5" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                            Evening slots (05:00 PM onwards) and weekends are subject to dynamic surge rates.
                        </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. TICKET QUANTITIES */}
              <div className="pt-12 border-t border-slate-100 space-y-8">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                    <Info size={14} className="text-cyan-500" /> 3. Visitor Quantity
                  </div>
                  {isCalculating && (
                    <div className="flex items-center gap-2 text-cyan-600 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Recalculating Rates...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { type: 'adult', label: 'Adult', age: '13-60', p: currentUnitPrices.adult },
                    { type: 'senior', label: 'Senior', age: '61+', p: currentUnitPrices.senior },
                    { type: 'child', label: 'Child', age: '3-12', p: currentUnitPrices.child },
                  ].map((t) => (
                    <div key={t.type} className="p-6 bg-slate-50 rounded-4xl border border-slate-100 hover:border-cyan-200 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">{t.label}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.age} years</p>
                        </div>
                        <p className={cn(
                            "font-mono font-bold text-sm transition-all",
                            isCalculating ? "opacity-30 blur-sm" : "text-cyan-600"
                        )}>
                            RM {t.p}
                        </p>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
                        <button 
                          onClick={() => updateTickets(t.type as any, tickets[t.type as keyof typeof tickets] - 1)} 
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
                        >
                          <Minus size={16}/>
                        </button>
                        <span className="font-black text-slate-900">{tickets[t.type as keyof typeof tickets]}</span>
                        <button 
                          onClick={() => updateTickets(t.type as any, tickets[t.type as keyof typeof tickets] + 1)} 
                          className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-md active:scale-90"
                        >
                          <Plus size={16}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FOOTER TOTAL & NEXT STEP */}
              <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">Final Payable Amount</p>
                  <p className={cn(
                      "text-5xl font-black text-slate-950 tracking-tighter transition-all duration-500",
                      isCalculating && "opacity-20 blur-md"
                  )}>
                    RM {displayTotal.toFixed(2)}
                  </p>
                </div>
                <m.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={displayTotal === 0 || !selectedTime || !selectedDate || isCalculating}
                  onClick={() => setStep(4)}
                  className="w-full md:w-auto bg-black text-white px-16 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-cyan-600 transition-all disabled:opacity-20 shadow-2xl shadow-cyan-900/10"
                >
                  {isCalculating ? "Updating Total..." : "Secure Admission"}
                </m.button>
              </div>

            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}