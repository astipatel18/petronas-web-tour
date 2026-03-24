// app/page.tsx
import Hero from "@/components/home/Hero";
import AwardSection from "@/components/home/AwardSection";
import VerticalStats from "@/components/home/VerticalStats";
import SkyExperience from "@/components/home/SkyExperience";
import Highlights from "@/components/home/Highlights";
import DiscoveryGrid from "@/components/home/DiscoveryGrid"; // NEW
import SocialProof from "@/components/home/SocialProof";
import QuickNav from "@/components/home/QuickNav"; // NEW
import { Container } from "@/components/shared/Container";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-deep-slate overflow-x-hidden">
      
      {/* SCENE 1: Cinematic Opening */}
      <Hero />

      {/* SCENE 2: Instant Credibility */}
      <AwardSection />

      {/* SCENE 3: The Narrative (Emotional Intro) */}
      <section className="py-32 md:py-48 bg-deep-slate">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-cyan-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">
              A Global Landmark
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-white leading-[1.05] tracking-tighter mb-10">
              At the heart of the city, <br />
              <span className="text-slate-500 italic font-light">touching the clouds.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              Rising 451.9 metres above street level, the PETRONAS Twin Towers 
              is Malaysia&apos;s most iconic twin architectural marvel and a symbol of 
              the nation&apos;s futuristic vision and cultural grace.
            </p>
          </div>
        </Container>
      </section>

      {/* SCENE 4: Engineering Scale (Animated) */}
      <VerticalStats />

      {/* SCENE 5: The "Feeling" (Sky Experience) */}
      <SkyExperience />

      {/* SCENE 6: Feature Breakdown */}
      <section className="py-24 bg-black/40 border-y border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h4 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-tighter">Sky High Details</h4>
              <p className="text-slate-500 mt-4 text-sm tracking-widest uppercase">The architectural heights of your visit.</p>
            </div>
            <div className="h-px grow bg-white/10 mx-8 hidden md:block mb-6" />
          </div>
          <Highlights />
        </Container>
      </section>

      {/* SCENE 7: Visual Discovery (NEW)
          This mimics the "Discover the Twins" section from the official site.
      */}
      <DiscoveryGrid />

      {/* SCENE 8: Architectural Insight */}
      <section className="py-32 md:py-48 relative overflow-hidden bg-deep-slate">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
            <div className="relative aspect-4/5 overflow-hidden border border-white/10 group">
              <Image 
                src="https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=1200" 
                alt="Geometric Detail" 
                fill 
                className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-60" />
            </div>

            <div className="space-y-10">
              <div className="h-0.5 w-16 bg-cyan-500" />
              <h4 className="text-4xl md:text-6xl font-serif text-white leading-tight tracking-tighter uppercase">
                Geometric Perfection <br /> 
                <span className="text-slate-500 italic font-light uppercase">Inspired by Heritage.</span>
              </h4>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                The floor plate of the towers is based on an eight-pointed star formed by 
                intersecting squares—a motif found in Islamic architecture, 
                representing the principles of unity, harmony, and stability.
              </p>
              <div className="grid grid-cols-1 gap-6 pt-6">
                {["Stainless Steel Facade", "33,000 Glass Panels", "Islamic Geometric Patterns"].map((text, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <span className="text-cyan-500 font-mono text-xs tracking-tighter group-hover:translate-x-1 transition-transform">0{i+1}</span>
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-hover:text-white transition-colors">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SCENE 9: Social Proof */}
      <SocialProof />

      {/* SCENE 10: Final Conversion (NEW)
          A high-end "Next Steps" exit section.
      */}
      <QuickNav />

    </main>
  );
}