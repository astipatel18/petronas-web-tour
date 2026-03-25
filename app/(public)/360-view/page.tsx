// app/(public)/360-view/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { m , AnimatePresence} from "framer-motion";
import { Container } from "@/components/shared/Container";
import { 
  Rotate3d, 
  MousePointer2, 
  Move, 
  X, 
  Loader2, 
  Smartphone, 
  AlertCircle,
  ChevronRight
} from "lucide-react";

const TOURS = [
  {
    id: "AERIAL",
    title: "Celestial Heights",
    level: "Drone VR • 4K",
    description: "An aerial flight circling the spires of the twin towers.",
    embedId: "mHI-nlwS2F8", 
  },
  {
    id: "SKYBRIDGE",
    title: "Double-Decker Link",
    level: "Level 41/42",
    description: "The world's highest two-story bridge in total immersion.",
    embedId: "YBlTprfVEfI",
  },
  {
    id: "GROUND",
    title: "Park Vista",
    level: "KLCC Gardens",
    description: "Witness the shimmering steel geometry from below.",
    embedId: "vHAGkipBt5U",
  }
];

export default function VirtualTourPage() {
  const router = useRouter();
  const [activeTour, setActiveTour] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Optimized Device Detection
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 2. Real Readiness Handler
  const handleFrameLoad = useCallback(() => {
    // We add a tiny 300ms delay after iframe load to allow 
    // the YouTube 360 degree engine to initialize its textures
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handleTourChange = (index: number) => {
    if (index === activeTour) return;
    setLoading(true);
    setHasError(false);
    setActiveTour(index);
  };

  return (
    <main className="h-screen w-full bg-black overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* 3. PERFORMANCE-OPTIMIZED LOADER */}
      <AnimatePresence>
        {loading && !hasError && (
          <m.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-100 bg-black flex flex-col items-center justify-center"
          >
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-6" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.6em] text-cyan-400 font-black">
                Initializing Stream
              </span>
              <div className="w-32 h-px bg-white/10 relative overflow-hidden">
                <m.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-cyan-500"
                />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* 4. IMMERSIVE ENGINE (With Clipping & Scaling) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <m.div 
          animate={{ scale: isMobile ? 1.3 : 1.55 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          {/* <iframe
            key={TOURS[activeTour].embedId}
            title={`360 degree view of ${TOURS[activeTour].title}`}
            aria-label={`Interactive 360 virtual tour of ${TOURS[activeTour].title}`}
            src={`https://www.youtube.com/embed/${TOURS[activeTour].embedId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            width="100%"
            height="100%"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full brightness-[0.85] contrast-[1.1] pointer-events-auto"
            onLoad={handleFrameLoad}
            onError={() => setHasError(true)}
          /> */}
          <iframe
  key={TOURS[activeTour].embedId}
  title={`360 degree view of ${TOURS[activeTour].title}`}
  // 🚀 FIXED SRC SYNTAX BELOW
  src={`https://www.youtube.com/embed/${TOURS[activeTour].embedId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&playsinline=1`}
  width="100%"
  height="100%"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  className="w-full h-full brightness-[0.85] contrast-[1.1] pointer-events-auto"
  onLoad={handleFrameLoad}
  onError={() => setHasError(true)}
/>
        </m.div>
        {/* Cinematic Vignette - Masks YouTube Logo edges */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
      </div>

      {/* 5. HUD CONTROLS (Heads-Up Display) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Container className="h-full flex flex-col justify-between py-10 md:py-14">
          
          {/* TOP BAR */}
          <div className="flex justify-between items-start pointer-events-auto">
            <m.div
              key={TOURS[activeTour].title}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/70 backdrop-blur-xl p-6 md:p-8 border-l-4 border-cyan-500"
            >
              <h1 className="text-white font-bold uppercase tracking-towers text-xl md:text-2xl leading-none">
                {TOURS[activeTour].title}
              </h1>
              <p className="text-cyan-500/70 text-[8px] md:text-[9px] uppercase tracking-[0.4em] mt-3 font-bold">
                {TOURS[activeTour].level} • PERSPECTIVE
              </p>
            </m.div>

            <button 
              onClick={() => router.back()}
              aria-label="Exit virtual tour"
              className="group p-4 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all rounded-full border border-white/10"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* DYNAMIC HINT */}
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : [0, 1, 1, 0] }}
            transition={{ duration: 6, times: [0, 0.1, 0.9, 1] }}
            className="flex flex-col items-center gap-4 bg-black/40 backdrop-blur-md px-10 py-6 rounded-full border border-white/5 mx-auto"
          >
            <div className="flex items-center gap-5">
              {isMobile ? <Smartphone className="text-cyan-400 w-5 h-5" /> : <MousePointer2 className="text-cyan-400 w-5 h-5" />}
              <span className="text-[10px] text-white uppercase font-black tracking-[0.3em]">
                {isMobile ? "Move Device to Look" : "Click & Drag to Orbit"}
              </span>
            </div>
          </m.div>

          {/* BOTTOM NAVIGATION */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pointer-events-auto">
            
            <div className="bg-black/90 backdrop-blur-2xl p-8 max-w-sm border border-white/5 hidden md:block">
              <p className="text-xs text-slate-400 leading-relaxed italic mb-6">
                &quot;{TOURS[activeTour].description}&quot;
              </p>
              <button 
                onClick={() => router.push('/booking')}
                aria-label="Book tickets now"
                className="flex items-center justify-between w-full bg-white text-black p-4 font-bold uppercase text-[9px] tracking-[0.2em] hover:bg-cyan-500 transition-all"
              >
                Book Tickets <ChevronRight size={14} />
              </button>
            </div>

            {/* TOUR SWITCHER */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <span className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-black ml-1">Change Viewport</span>
              <div className="flex gap-2 p-1.5 bg-black/60 backdrop-blur-xl rounded-sm border border-white/10">
                {TOURS.map((tour, index) => (
                  <button
                    key={tour.id}
                    onClick={() => handleTourChange(index)}
                    aria-label={`Switch to ${tour.title}`}
                    aria-current={activeTour === index ? "true" : "false"}
                    className={`px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-sm ${
                      activeTour === index 
                        ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tour.id}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>
    </main>
  );
}