"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { Container } from "@/components/shared/Container";
import { m, AnimatePresence } from "framer-motion";

// Import all 6 Steps
import Step1_Attractions from "@/components/booking/Step1_Attractions";
import Step2_Eligibility from "@/components/booking/Step2_Eligibility";
import Step3_Selection from "@/components/booking/Step3_Selection";
import Step4_Cart from "@/components/booking/Step4_Cart";
import Step5_Checkout from "@/components/booking/Step5_Checkout";
import Step6_Verification from "@/components/booking/Step6_Verification"; // 🛡️ New Verification Step

// Updated labels for 6 steps
const stepLabels = [
  "Experience",
  "Visitor Type",
  "Details",
  "Review",
  "Checkout",
  "Verify"
];

export default function BookingPage() {
  const { step } = useBookingStore();

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24 text-slate-900">
      <Container>
        
        {/* --- 1. DYNAMIC PROGRESS TRACKER --- */}
        <div className="max-w-4xl mx-auto mb-20 px-4">
          <div className="flex justify-between items-center relative">
            
            {/* Background Track */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {/* Animated Active Track (Calculated for 6 steps) */}
            <m.div 
              className="absolute top-1/2 left-0 h-0.5 bg-cyan-600 -translate-y-1/2 z-0"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />

            {stepLabels.map((label, index) => {
              const stepNum = index + 1;
              const isPast = step > stepNum;
              const isCurrent = step === stepNum;
              const isFuture = step < stepNum;

              return (
                <div key={label} className="relative z-10 flex flex-col items-center">
                  {/* Step Circle */}
                  <m.div 
                    animate={{ 
                        scale: isCurrent ? 1.15 : 1,
                        backgroundColor: isFuture ? "#ffffff" : "#0891b2" 
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 border-4 ${
                      isCurrent 
                        ? "border-cyan-600 text-cyan-600 shadow-xl shadow-cyan-200" 
                        : isPast 
                        ? "border-cyan-600 text-white" 
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {isPast ? "✓" : stepNum}
                  </m.div>

                  {/* Step Label (Hidden on tiny screens to prevent overlap) */}
                  <span 
                    className={`absolute top-14 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] font-black transition-all duration-500 hidden sm:block ${
                      isCurrent ? "text-cyan-700 opacity-100" : "text-slate-400 opacity-50"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- 2. MAIN STEP CONTENT (SPA Switcher) --- */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 shadow-2xl shadow-slate-200/60 rounded-none overflow-hidden min-h-125">
            <AnimatePresence mode="wait">
              <m.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-8 md:p-16"
              >
                {/* 🛡️ Logic to render one step at a time */}
                {step === 1 && <Step1_Attractions />}
                {step === 2 && <Step2_Eligibility />}
                {step === 3 && <Step3_Selection />}
                {step === 4 && <Step4_Cart />}
                {step === 5 && <Step5_Checkout />}
                {step === 6 && <Step6_Verification />}
              </m.div>
            </AnimatePresence>
          </div>

          {/* --- 3. TRUST FOOTER --- */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex gap-8 items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Server Status: Secured</span>
                </div>
                <span className="h-4 w-px bg-slate-200 hidden md:block" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">SSL 256-bit Encrypted</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400">
                <p className="text-[10px] uppercase tracking-widest font-bold">Support ID:</p>
                <span className="text-[10px] font-mono font-bold text-slate-500">PTT-LIVE-2024</span>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}