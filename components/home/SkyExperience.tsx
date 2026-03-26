// components/home/SkyExperience.tsx
import Image from "next/image";

export default function SkyExperience() {
  return (
    <section className="relative py-24 bg-black overflow-hidden border-t border-white/5">
      <div className="grid md:grid-cols-2 items-stretch">
        {/* TEXT CONTENT */}
        <div className="p-12 md:p-24 flex flex-col justify-center order-2 md:order-1 bg-deep-slate">
          <span className="text-cyan-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">
            Peak of your journey
          </span>
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 leading-tight">
            THE SKY <br /> <span className="text-slate-500 italic">EXPERIENCE</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
            Step onto the world's highest two-story bridge and ascend to the 86th floor 
            Observation Deck. Experience a perspective that defines a nation—a memory 
            etched in the clouds.
          </p>
          <button className="w-fit border-b border-white/30 text-white pb-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-cyan-400 hover:border-cyan-400 transition-all duration-300">
            Explore the Heights
          </button>
        </div>
        
        {/* IMAGE CONTENT */}
        <div className="relative h-125 md:h-auto min-h-150 order-1 md:order-2 overflow-hidden group">
          <Image
            // 🚀 VERIFIED PETRONAS ARCHITECTURE ID (Deep Steel & Night Sky)
            src="https://images.unsplash.com/photo-1544918877-460635b6d13e?auto=format&fit=crop&q=80&w=1200"
            alt="Petronas Twin Towers Skybridge Architecture"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            priority={false}
          />
          {/* Subtle overlay to blend with the text section */}
          <div className="absolute inset-0 bg-linear-to-r from-deep-slate/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}