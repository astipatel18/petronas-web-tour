// // components/home/Hero.tsx
// "use client";

// import {, Variants } from "framer-motion";
// import Link from "next/link";
// import { ChevronDown } from "lucide-react";

// // 1. Explicitly typing the variants to resolve TS errors
// const containerVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { 
//       duration: 0.8, 
//       ease: [0.21, 0.47, 0.32, 0.98] as const 
//     },
//   },
// };

// export default function Hero() {
//   return (
//     <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
//       {/* 1. BACKGROUND LAYER */}
//       <div className="absolute inset-0 z-0">
//         <motion.div 
//           initial={{ scale: 1.1, opacity: 0 }}
//           animate={{ scale: 1, opacity: 0.7 }}
//           transition={{ duration: 10, ease: "easeOut" }}
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{ 
//             backgroundImage: `url('https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2500')`,
//           }}
//         />
        
//         {/* Gradient overlays for cinematic depth (Tailwind v4 compatible) */}
//         <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-deep-slate/90" />
//         <div className="absolute inset-0 bg-black/20" />
//       </div>

//       {/* 2. CONTENT LAYER */}
//       <motion.div 
//         className="relative z-10 text-center px-6 max-w-6xl"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.span 
//           variants={itemVariants}
//           className="inline-block text-cyan-500 tracking-[0.5em] uppercase text-[10px] md:text-xs font-black mb-8"
//         >
//           Kuala Lumpur • Malaysia
//         </motion.span>
        
//         <motion.h1 
//           variants={itemVariants}
//           className="text-6xl md:text-[8rem] lg:text-[10rem] font-serif text-white leading-[0.85] tracking-tighter mb-10"
//         >
//           THE <span className="text-slate-500 italic font-light">SKY</span> <br className="hidden md:block" /> ABOVE
//         </motion.h1>
        
//         <motion.p 
//           variants={itemVariants}
//           className="text-slate-300 text-sm md:text-xl max-w-2xl mx-auto mb-14 font-light tracking-wide leading-relaxed uppercase"
//         >
//           Experience the heart of a nation. Witness the architectural 
//           pinnacle of the world&apos;s tallest twin towers.
//         </motion.p>

//         <motion.div 
//           variants={itemVariants}
//           className="flex flex-col md:flex-row gap-6 justify-center items-center"
//         >
//           {/* PRIMARY CTA: OPEN IN NEW TAB */}
//           <Link 
//             href="/booking" 
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-cyan-500 hover:text-white w-full md:w-auto overflow-hidden"
//           >
//             <span className="relative z-10">Secure Tickets</span>
//             {/* Hover Slide Effect */}
//             <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
//           </Link>
          
//           {/* SECONDARY CTA: INTERNAL PAGE */}
//           <Link 
//             href="/experience" 
//             className="px-12 py-6 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white w-full md:w-auto"
//           >
//             The Experience
//           </Link>
//         </motion.div>
//       </motion.div>

//       {/* 3. SCROLL INDICATOR */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 2.5, duration: 1.5 }}
//         className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
//       >
//         <span className="text-[9px] text-white/20 uppercase tracking-[0.5em] font-bold">Scroll to explore</span>
//         <motion.div
//           animate={{ y: [0, 6, 0] }}
//           transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <ChevronDown className="text-white/20" size={18} strokeWidth={1} />
//         </motion.div>
//       </motion.div>

//       {/* 4. DESIGN ELEMENT: OPERATION STATUS */}
//       <motion.div 
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 2, duration: 1 }}
//         className="hidden lg:block absolute bottom-12 left-12 z-10"
//       >
//         <div className="pl-6 border-l border-white/10">
//           <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold mb-2">Operation Status</p>
//           <p className="text-white text-[10px] uppercase tracking-widest flex items-center gap-3">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//             </span>
//             Towers Open Today: 09:00 — 21:00
//           </p>
//         </div>
//       </motion.div>
//     </section>
//   );
// }






"use client";

import { m, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* 1. OPTIMIZED BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        {/* 🚀 LCP OPTIMIZATION: High-priority placeholder image */}
        <Image
          src="https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2000&auto=format&fit=crop"
          alt="Petronas Towers Backdrop"
          fill
          priority // 🛡️ CRITICAL: Tells Next.js to load this first
          className={`object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-0" : "opacity-60"
          }`}
          sizes="100vw"
        />

        {/* 🎥 VIDEO LAYER */}
        <video
          autoPlay
          muted
          loop
          playsInline
          onPlay={() => setIsVideoLoaded(true)}
          poster="https://images.unsplash.com/photo-1544918877-460635b6d13e?q=40&w=1000"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-60" : "opacity-0"
          }`}
        >
          {/* Use a compressed local .mp4 or .webm path */}
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-deep-slate/95 z-1" />
      </div>

      {/* 2. CONTENT LAYER */}
      <m.div 
        className="relative z-10 text-center px-6 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <m.span 
          variants={itemVariants}
          className="inline-block text-cyan-500 tracking-[0.5em] uppercase text-[10px] md:text-xs font-black mb-8"
        >
          Kuala Lumpur • Malaysia
        </m.span>
        
        {/* 🛡️ Performance Tip: The LCP text element */}
        <m.h1 
          variants={itemVariants}
          className="text-6xl md:text-[8rem] lg:text-[10rem] font-serif text-white leading-[0.85] tracking-tighter mb-10"
        >
          THE <span className="text-slate-500 italic font-light">SKY</span> <br className="hidden md:block" /> ABOVE
        </m.h1>
        
        <m.p 
          variants={itemVariants}
          className="text-slate-300 text-sm md:text-xl max-w-2xl mx-auto mb-14 font-light tracking-wide leading-relaxed uppercase"
        >
          Experience the heart of a nation. Witness the architectural 
          pinnacle of the world&apos;s tallest twin towers.
        </m.p>

        <m.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Link 
            href="/booking" 
            className="group relative px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 hover:bg-cyan-500 hover:text-white w-full md:w-auto overflow-hidden"
          >
            <span className="relative z-10">Secure Tickets</span>
            <div className="absolute inset-0 bg-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
          </Link>
          
          <Link 
            href="/experience" 
            className="px-12 py-6 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:border-white w-full md:w-auto"
          >
            The Experience
          </Link>
        </m.div>
      </m.div>

      {/* 3. SCROLL INDICATOR */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[9px] text-white/20 uppercase tracking-[0.5em] font-bold">Scroll to explore</span>
        <m.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/20" size={18} strokeWidth={1} />
        </m.div>
      </div>
    </section>
  );
}