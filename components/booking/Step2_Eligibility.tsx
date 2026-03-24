// components/booking/Step2_Eligibility.tsx
"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { motion } from "framer-motion";
import { UserCheck, Globe, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Step2_Eligibility() {
  const { setEligibility } = useBookingStore();
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelection = (isLocal: boolean) => {
    setSelected(isLocal);
    
    // Psychology: A small delay allows the user to see the "Active" state
    // and feel like their choice was "processed" before the UI jumps.
    setTimeout(() => {
      setEligibility(isLocal);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* 1. Context Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-widest mb-4"
        >
          Step 02 — Identification
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 uppercase tracking-tight">
          Who is <span className="italic text-slate-500">Visiting?</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Select your nationality category to unlock the correct admission rates for your journey.
        </p>
      </div>

      {/* 2. Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Malaysian Card */}
        <SelectionCard
          title="Malaysian Citizen"
          subtitle="MyKad / MyKid required"
          description="Enjoy localized rates for Malaysian residents and citizens."
          icon={<UserCheck className="w-8 h-8" />}
          isActive={selected === true}
          onClick={() => handleSelection(true)}
        />

        {/* International Card */}
        <SelectionCard
          title="International Guest"
          subtitle="Standard Admission"
          description="Universal access for our global visitors from around the world."
          icon={<Globe className="w-8 h-8" />}
          isActive={selected === false}
          onClick={() => handleSelection(false)}
        />
      </div>

      {/* 3. Footer Trust Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center"
      >
        <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <CheckCircle2 size={12} className="text-slate-300" />
          Identification will be verified at the check-in counter
        </p>
      </motion.div>
    </div>
  );
}

interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function SelectionCard({ title, subtitle, description, icon, isActive, onClick }: CardProps) {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center text-center p-8 border-2 transition-all duration-300 group",
        isActive 
          ? "border-cyan-600 bg-cyan-50/30 ring-4 ring-cyan-500/10" 
          : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
      )}
    >
      {/* Icon Wrapper */}
      <div className={cn(
        "mb-6 p-4 rounded-none border transition-colors duration-300",
        isActive ? "bg-cyan-600 text-white border-cyan-600" : "bg-slate-50 text-slate-400 border-slate-100 group-hover:text-slate-600"
      )}>
        {icon}
      </div>

      {/* Text Content */}
      <h3 className={cn(
        "text-lg font-bold uppercase tracking-tight mb-1 transition-colors",
        isActive ? "text-cyan-800" : "text-slate-900"
      )}>
        {title}
      </h3>
      
      <span className={cn(
        "text-[10px] font-black uppercase tracking-widest mb-4 px-2 py-0.5 rounded-sm",
        isActive ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500"
      )}>
        {subtitle}
      </span>

      <p className="text-xs text-slate-500 leading-relaxed">
        {description}
      </p>

      {/* Active Checkmark Indicator */}
      {isActive && (
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="absolute top-4 right-4 text-cyan-600"
        >
          <CheckCircle2 size={24} fill="currentColor" className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}