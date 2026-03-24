"use client";

import { Container } from "@/components/shared/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Users, 
  Heart, 
  Compass, 
  ArrowDownCircle, 
  Layers, 
  Maximize, 
  Eye 
} from "lucide-react";

const journeySteps = [
  {
    stage: "The Concourse",
    title: "A Grand Welcome",
    desc: "Your journey begins in the Concourse. Experience immersive digital displays that narrate the tower's history before you board the high-speed elevators.",
    img: "https://images.unsplash.com/photo-1561350111-7dad5f13d8d2",
    icon: <Layers className="w-6 h-6" />,
  },
  {
    stage: "Level 41 & 42",
    title: "The Skybridge",
    desc: "Stand 170 meters above the ground. Walk the world’s highest two-story bridge, connecting the two titans. Feel the city breathe beneath your feet.",
    img: "https://images.unsplash.com/photo-1595841055318-5089e080753d",
    icon: <Maximize className="w-6 h-6" />,
  },
  {
    stage: "Level 86",
    title: "The Observation Deck",
    desc: "The climax of your visit. At 370 meters, the city unfolds in a 360° panorama. State-of-the-art telescopes and interactive AR displays bring the KL skyline to life.",
    img: "https://images.unsplash.com/photo-1544918877-460635b6d13e",
    icon: <Eye className="w-6 h-6" />,
  }
];

const personas = [
  { name: "Families", icon: <Users className="w-6 h-6" />, text: "Interactive exhibits and educational displays for all ages." },
  { name: "Couples", icon: <Heart className="w-6 h-6" />, text: "Breathtaking sunset views for an unforgettable romantic evening." },
  { name: "Explorers", icon: <Compass className="w-6 h-6" />, text: "Detailed architectural insights for the design enthusiasts." },
];

export default function ExperiencePage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Image (Ken Burns Effect) */}
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
            alt="The Experience"
            fill
            className="object-cover opacity-50 grayscale"
            priority
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black z-1" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1 }}
            className="text-cyan-500 text-xs font-bold uppercase block mb-6"
          >
            The Journey Above
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-9xl font-serif tracking-tighter uppercase leading-none"
          >
            The <br /> <span className="text-slate-500 italic">Experience</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20 flex flex-col items-center gap-4 opacity-40"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to start</span>
            <ArrowDownCircle className="animate-bounce w-6 h-6" />
          </motion.div>
        </div>
      </section>

      {/* 2. THE STORY SECTION */}
      <section className="py-32 border-y border-white/5 relative z-10 bg-black">
        <Container className="text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block border border-amber-500/50 px-4 py-1 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-10">
              Tripadvisor Traveller&apos;s Choice 2024
            </div>
            <h2 className="text-3xl md:text-5xl font-serif italic mb-8">
              &quot;It&apos;s not just a visit, it&apos;s a testament to human ingenuity.&quot;
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              Rising 451.9 meters into the clouds, the PETRONAS Twin Towers 
              are more than a feat of engineering. They are the heartbeat 
              of Kuala Lumpur, offering a multi-sensory journey from the 
              ground floor to the pinnacle of architectural grace.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. THE VERTICAL JOURNEY */}
      <section className="py-24 bg-black">
        <Container>
          <div className="space-y-40">
            {journeySteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
              >
                {/* Image Component - Fixed Heights */}
                <div className="w-full md:w-1/2 relative h-87.5 md:h-137.5 overflow-hidden group border border-white/10">
                  <Image 
                    src={step.img} 
                    alt={step.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                </div>

                {/* Text Component */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="flex items-center gap-4 text-cyan-500">
                    <span className="p-3 border border-cyan-500/20 rounded-full">{step.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{step.stage}</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="pt-6 h-px w-20 bg-cyan-500/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. PERSONA SECTION */}
      <section className="py-32 bg-white/2 border-y border-white/5">
        <Container>
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4">Tailored For Every Explorer</h2>
            <p className="text-slate-500">Whatever your journey, the Towers have a story for you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {personas.map((p, i) => (
              <div key={i} className="p-10 border border-white/10 text-center hover:border-cyan-500 transition-colors group bg-black/40">
                <div className="text-cyan-500 flex justify-center mb-6 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h4 className="text-xl font-bold uppercase mb-4 tracking-widest">{p.name}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-32 bg-black">
        <Container className="text-center">
          <h3 className="text-5xl md:text-7xl font-serif italic mb-12">Peak of your journey.</h3>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <a 
              href="/booking" 
              className="bg-white text-black px-16 py-6 font-bold uppercase tracking-widest text-xs hover:bg-cyan-500 transition-all inline-block"
            >
              Secure Your Experience
            </a>
          </motion.div>
        </Container>
      </section>

    </main>
  );
}