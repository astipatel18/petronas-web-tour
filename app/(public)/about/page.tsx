// app/(public)/about/page.tsx
"use client";

import { Container } from "@/components/shared/Container";
import { m} from "framer-motion";
import Image from "next/image";
import { History, Pyramid, Globe, ArrowRight, Zap, Award, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const IMAGES = {
  HERO: "https://images.unsplash.com/photo-1528181304800-2f140819ad1c",
  ARCH: "https://images.unsplash.com/photo-1595841055318-5089e080753d",
  DETAIL: "https://images.unsplash.com/photo-1544918877-460635b6d13e"
};

const stats = [
  { label: "Total Height", value: "451.9m", detail: "Tallest Twin Towers" },
  { label: "Floor Count", value: "88", detail: "Above Ground" },
  { label: "Stainless Steel", value: "33k", detail: "Facade Panels" },
];

const timeline = [
  { year: "1993", event: "Excavation Started", desc: "30 meters below ground level to create the world's deepest foundation." },
  { year: "1996", event: "Topping Out", desc: "Officially became the tallest buildings in the world at the time." },
  { year: "1999", event: "Official Opening", desc: "Inaugurated as a symbol of a modern, global Malaysia." },
];

export default function AboutPage() {
  return (
    <main className="bg-deep-slate text-white selection:bg-cyan-500/30 selection:text-cyan-400">
      
      {/* 1. REFINED HERO: Clarity Over Abstraction */}
      {/* <section className="relative h-[65vh] flex items-center overflow-hidden"> */}
      <section className="relative h-[65vh] w-full flex items-center overflow-hidden bg-slate-900">
        {/* <Image 
          src={`${IMAGES.HERO}?q=80&w=2000`}
          alt="About Petronas Towers"
          fill
          className="object-cover opacity-30 grayscale"
          priority
        /> */}
         <Image 
    src="https://images.unsplash.com/photo-1528181304800-2f140819ad1c?q=80&w=2000"
    alt="About Petronas Towers"
    fill
    priority
    className="object-cover opacity-40 grayscale"
  />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-deep-slate z-1" />
        
        <Container className="relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-gold mb-4">
              <Award size={16} />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Official Landmark Guide</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight uppercase">
              About the <br /> <span className="text-slate-400 italic font-light">Towers</span>
            </h1>
            <p className="mt-6 text-slate-300 text-lg leading-relaxed font-light">
              Explore the history, architectural innovation, and the cultural legacy of Malaysia&apos;s most iconic twin titans.
            </p>
          </m.div>
        </Container>
      </section>

      {/* 2. INTRODUCTION: Alternating Layout (Text Left) */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <m.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">The Visionary <br/><span className="text-slate-500">Masterpiece</span></h2>
              <p className="text-slate-400 leading-relaxed font-light">
                Designed by César Pelli, the PETRONAS Twin Towers stand as a gateway 
                to the future. Every curve reflects a nation&apos;s journey toward the horizon, blending modern engineering with traditional heritage.
              </p>
              <ul className="space-y-3">
                {['Architect: César Pelli Associates', 'Structural Style: Post-Modern', 'Completed: 1999'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-cyan-500" /> {item}
                  </li>
                ))}
              </ul>
            </m.div>
            <div className="relative h-100 rounded-none border border-white/10 overflow-hidden bg-black/40">
              <Image src={`${IMAGES.DETAIL}?q=80&w=1000`} alt="Detail" fill className="object-cover grayscale" />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. DESIGN PHILOSOPHY: Alternating Layout (Text Right) */}
      <section className="py-20 md:py-28 bg-white/2 border-y border-white/5">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-100 order-2 md:order-1 border border-white/10 overflow-hidden bg-black/40">
              <Image src={`${IMAGES.ARCH}?q=80&w=1000`} alt="Architecture" fill className="object-cover grayscale" />
            </div>
            <m.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 order-1 md:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">Islamic <br/><span className="text-slate-500">Geometry</span></h2>
              <p className="text-slate-400 leading-relaxed font-light">
                The floor plate is based on an eight-pointed star (Rub el Hizb), representing unity and harmony. This geometric precision ensures that the towers remain structurally stable while maintaining their symbolic grace.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-black/20 border border-white/5">
                  <Pyramid className="text-cyan-500 mb-2 w-5 h-5" />
                  <p className="text-xs font-bold uppercase text-white">Facade</p>
                  <p className="text-[10px] text-slate-500">Stainless Steel Panels</p>
                </div>
                <div className="p-4 bg-black/20 border border-white/5">
                  <Globe className="text-cyan-500 mb-2 w-5 h-5" />
                  <p className="text-xs font-bold uppercase text-white">Global</p>
                  <p className="text-[10px] text-slate-500">Design Consensus</p>
                </div>
              </div>
            </m.div>
          </div>
        </Container>
      </section>

      {/* 4. KEY STATS: Animated Entry */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {stats.map((stat, i) => (
              <m.div 
                key={i} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-deep-slate p-12 text-center"
              >
                <h4 className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h4>
                <p className="text-cyan-500 text-[10px] uppercase tracking-widest font-bold mb-2">{stat.label}</p>
                <p className="text-slate-600 text-[10px] uppercase">{stat.detail}</p>
              </m.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. HISTORY TIMELINE: Simplified Readability */}
      <section className="py-20 md:py-28 border-b border-white/5">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-16">Historical Timeline</h2>
            <div className="border-l border-white/10 pl-8 md:pl-12 space-y-12 relative">
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-9.25 md:-left-13.25 top-1.5 w-3 h-3 bg-cyan-500 rounded-none border-2 border-deep-slate" />
                  <p className="text-cyan-500 font-bold text-sm mb-1">{item.year}</p>
                  <h4 className="text-xl font-bold uppercase mb-2">{item.event}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. DID YOU KNOW: Subtle Toning */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="bg-cyan-500/5 border border-cyan-500/10 p-12 md:p-16 text-center relative overflow-hidden">
            <Zap className="mx-auto mb-6 text-cyan-500 w-10 h-10 opacity-50" />
            <h2 className="text-3xl font-bold uppercase mb-6 tracking-tighter">Did You Know?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              The foundation of the towers is the deepest in the world, stretching <span className="text-cyan-400 font-bold">120 meters</span> into the earth. This floating foundation supports 600,000 tonnes of concrete and steel.
            </p>
          </div>
        </Container>
      </section>

      {/* 7. CTA: Conversion Focused */}
      <section className="py-28 md:py-40">
        <Container className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6">Ready to experience <br/> it yourself?</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">Join millions of visitors and stand on the peak of Kuala Lumpur.</p>
          <Link href="/booking">
            <button className="bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all active:scale-95 shadow-xl shadow-white/5">
              Book Tickets Now
            </button>
          </Link>
        </Container>
      </section>

    </main>
  );
}