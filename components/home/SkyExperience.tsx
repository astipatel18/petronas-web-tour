// components/home/SkyExperience.tsx
import Image from "next/image";

export default function SkyExperience() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="p-12 md:p-24 flex flex-col justify-center order-2 md:order-1">
          <span className="text-cyan-500 font-bold uppercase tracking-widest text-xs mb-4">Peak of your journey</span>
          <h2 className="text-5xl font-serif text-white mb-6 leading-tight">THE SKY <br/>EXPERIENCE</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Walk the world's highest two-story bridge and stand on the 86th floor Observation Deck. 
            It’s not just a view—it’s a memory etched in the clouds.
          </p>
          <button className="w-fit border-b border-white text-white pb-2 text-xs uppercase tracking-widest hover:text-cyan-400 hover:border-cyan-400 transition-all">
            Learn More
          </button>
        </div>
        <div className="relative h-150 order-1 md:order-2">
          <Image 
            src="https://images.unsplash.com/photo-1595841055318-5089e080753d" 
            alt="Skybridge" 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
      </div>
    </section>
  );
}