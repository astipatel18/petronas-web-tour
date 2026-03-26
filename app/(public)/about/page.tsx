// // // app/(public)/about/page.tsx
"use client";

import { Container } from "@/components/shared/Container";
import { m } from "framer-motion";
import Image from "next/image";
import { Award, CheckCircle2, Pyramid, Globe, Zap } from "lucide-react";
import Link from "next/link";

const IMAGES = {
  HERO: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=2000",
  DETAIL: "https://images.unsplash.com/photo-1595841055318-5089e080753d?auto=format&fit=crop&q=80&w=1200",
  ARCH: "https://images.unsplash.com/photo-1544918877-460635b6d13e?auto=format&fit=crop&q=80&w=1200"
};

const stats = [
  { label: "Total Height", value: "451.9m", detail: "Global Landmark" },
  { label: "Floor Count", value: "88", detail: "Above Ground" },
  { label: "Construction", value: "7 Years", detail: "1993 - 1999" },
];

const timeline = [
  { year: "1993", event: "Breaking Ground", desc: "Excavation 30m deep for the world's most robust foundation." },
  { year: "1996", event: "Global Record", desc: "Officially recognized as the world's tallest buildings." },
  { year: "1999", event: "The Opening", desc: "Inaugurated as the permanent heart of Kuala Lumpur." },
];

export default function AboutPage() {
  return (
    <main className="bg-deep-slate text-white selection:bg-cyan-500/30">
      
      {/* 1. CINEMATIC HERO - UI FIXED FOR NAVBAR CLEARANCE */}
      <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden bg-black">
        <Image 
          src={IMAGES.HERO}
          alt="Petronas Towers"
          fill
          priority
          className="object-cover opacity-50 grayscale transition-all duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-deep-slate z-10" />
        
        {/* pt-32 added here to push content below the fixed Navbar */}
        <Container className="relative z-20 pt-32 pb-20">
          <m.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <m.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 mb-8 text-amber-500"
            >
              <Award size={20} />
              <span className="text-[10px] uppercase tracking-[0.5em] font-black border-l border-amber-500/30 pl-3">
                Architecture Heritage
              </span>
            </m.div>
            <h1 className="text-6xl md:text-9xl font-serif leading-[0.85] uppercase tracking-tighter mb-10">
              The <br /> <span className="text-slate-400 italic font-light">Twin Titans</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-light max-w-xl">
              An engineering marvel that redefined the skyline of Southeast Asia and stands as a symbol of Malaysian pride.
            </p>
          </m.div>
        </Container>
      </section>

      {/* 2. ARCHITECTURAL DETAIL SECTION */}
      <section className="py-24 md:py-40 border-t border-white/5">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-32 items-center">
            <m.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight mb-8">
                Visionary <br/><span className="text-slate-500 italic">Engineering</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-light mb-10">
                Designed by César Pelli, the towers feature a multi-faceted facade of stainless steel and glass, 
                blending high-tech innovation with traditional motifs.
              </p>
              <div className="space-y-4">
                {['Architect: César Pelli Associates', 'Style: Post-Modern Islamic', 'Height: 451.9 Meters'].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-sm text-slate-200 border-b border-white/5 pb-4">
                    <CheckCircle2 size={16} className="text-cyan-500" /> {item}
                  </div>
                ))}
              </div>
            </m.div>
            
            <div className="relative aspect-4/5 md:aspect-square border border-white/5 overflow-hidden group bg-slate-900 shadow-2xl">
              <Image 
                src={IMAGES.DETAIL} 
                alt="Architectural Detail" 
                fill 
                className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                sizes="(max-width: 768px) 100vw, 50vw" 
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. DESIGN PHILOSOPHY SECTION */}
      <section className="py-24 md:py-40 bg-white/1 border-y border-white/5">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="relative aspect-4/5 md:aspect-square order-2 md:order-1 border border-white/5 overflow-hidden group bg-slate-900 shadow-2xl">
              <Image 
                src={IMAGES.ARCH} 
                alt="Geometric Symmetry" 
                fill 
                className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                sizes="(max-width: 768px) 100vw, 50vw" 
              />
            </div>
            
            <m.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-tight mb-8">
                Sacred <br/><span className="text-slate-500 italic">Geometry</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-light mb-12">
                The floor plan is based on an eight-pointed star (Rub el Hizb), representing the Islamic principles 
                of unity, harmony, and stability through perfect mathematical symmetry.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-black border border-white/5 backdrop-blur-md">
                  <Pyramid className="text-cyan-500 mb-4 w-8 h-8" />
                  <p className="text-xs font-black uppercase text-white tracking-widest mb-1">Facade</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">33,000 Stainless Steel Panels</p>
                </div>
                <div className="p-8 bg-black border border-white/5 backdrop-blur-md">
                  <Globe className="text-cyan-500 mb-4 w-8 h-8" />
                  <p className="text-xs font-black uppercase text-white tracking-widest mb-1">Impact</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Global Architectural Icon</p>
                </div>
              </div>
            </m.div>
          </div>
        </Container>
      </section>

      {/* 4. ANIMATED STATS GRID */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 shadow-2xl">
            {stats.map((stat, i) => (
              <m.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-deep-slate p-16 text-center group hover:bg-black/40 transition-colors"
              >
                <m.h4 
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  className="text-6xl md:text-7xl font-black text-white mb-3 tracking-tighter group-hover:text-cyan-500 transition-colors"
                >
                  {stat.value}
                </m.h4>
                <p className="text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-black mb-2">{stat.label}</p>
                <p className="text-slate-600 text-[10px] uppercase font-bold">{stat.detail}</p>
              </m.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. HISTORY TIMELINE - UI FIXED FOR MARKER ALIGNMENT */}
      <section className="py-32 border-b border-white/5">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-20 text-center">Chronological Legacy</h2>
            <div className="border-l-2 border-white/10 pl-10 md:pl-16 space-y-20 relative">
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  {/* Fixed markers using precise pixel offsets */}
                  <div className="absolute -left-12.25 md:-left-18.25 top-1 w-4 h-4 bg-cyan-500 border-4 border-deep-slate shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                  <p className="text-cyan-500 font-black text-xs uppercase tracking-widest mb-2">{item.year}</p>
                  <h4 className="text-2xl font-bold uppercase mb-3 text-white tracking-tight">{item.event}</h4>
                  <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. CTA */}
      <section className="py-40 bg-black">
        <Container className="text-center">
          <m.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-8xl font-serif uppercase tracking-tighter mb-12 leading-none"
          >
            Be Part of <br/> <span className="text-slate-500 italic font-light">The Story</span>
          </m.h2>
          <Link href="/booking" className="inline-block group">
            <button className="bg-white text-black px-16 py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-2xl transform active:scale-95">
              Secure Admission
            </button>
          </Link>
        </Container>
      </section>
    </main>
  );
}