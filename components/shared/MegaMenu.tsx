// components/shared/MegaMenu.tsx
"use client";
import React from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import { MapPin, Info, Ticket, Users, ArrowRight, Maximize } from "lucide-react";

const visitOptions = [
  {
    title: "Getting Here",
    desc: "Directions via LRT, Bus, or Car",
    href: "/visit/getting-here",
    icon: <MapPin className="w-4 h-4" />,
    isExternal: false,
  },
  {
    title: "Facilities",
    desc: "Lockers and accessibility",
    href: "/visit/facilities",
    icon: <Info className="w-4 h-4" />,
    isExternal: false,
  },
  {
    title: "Ticketing",
    desc: "Pricing and requirements",
    href: "/booking", // Updated to the Booking Engine path
    icon: <Ticket className="w-4 h-4" />,
    isExternal: true, // Marked to trigger New Tab logic
  },
  {
    title: "Agent Portal",
    desc: "Partnership bookings",
    href: "/visit/agent-portal",
    icon: <Users className="w-4 h-4" />,
    isExternal: false,
  },
//   {
//   title: "360° Virtual Tour",
//   desc: "Interactive top-to-bottom aerial view",
//   href: "/360-view",
//   icon: <Maximize className="w-5 h-5 text-amber-500" />, // Using a gold/amber color for prominence
// },
];

export default function MegaMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: 10, x: "-50%" }} 
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 10, x: "-50%" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          onMouseLeave={onClose}
          className="absolute top-[calc(100%-1px)] left-1/2 w-[90vw] max-w-212.5 z-90 pointer-events-auto"
        >
          {/* Floating 'Boxed' Card */}
          <div className="mt-2 bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
            
            {/* Subtle Top Glow Line */}
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {visitOptions.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    // NEW TAB LOGIC FOR TICKETING
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="group flex flex-col p-5 transition-all duration-300 hover:bg-white/4 rounded-lg border border-transparent hover:border-white/5"
                  >
                    {/* Compact Icon Section */}
                    <div className="text-cyan-500 mb-4 group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>

                    {/* Hierarchy: Title */}
                    <h4 className="text-white font-bold uppercase tracking-towers text-[10px] mb-2 flex items-center justify-between">
                      {item.title}
                      <ArrowRight className="w-3 h-3 text-cyan-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h4>

                    {/* Hierarchy: Muted Description */}
                    <p className="text-slate-500 text-[10px] leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Boxed Footer Area */}
              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
                <div className="flex items-center gap-3">
                  <span className="text-[8px] uppercase tracking-[0.4em] text-slate-300 font-bold">Official Gateway</span>
                  <div className="h-2 w-px bg-white/20" />
                  <span className="text-[8px] uppercase tracking-[0.4em] text-cyan-500 font-bold">Kuala Lumpur</span>
                </div>
                <div className="text-[8px] uppercase tracking-widest text-slate-500 font-mono">
                  Visit • Explore • Experience
                </div>
              </div>
            </div>
          </div>

          {/* Invisible bridge to keep menu open while moving mouse from Nav to Menu */}
          <div className="absolute -top-4 left-0 w-full h-8 bg-transparent -z-10" />
        </m.div>
      )}
    </AnimatePresence>
  );
}