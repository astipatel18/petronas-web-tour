"use client";

import { Container } from "@/components/shared/Container";
import { Train, Bus, Car, Navigation, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const transportData = [
  {
    title: "By LRT (Light Rail Transit)",
    icon: <Train className="w-8 h-8 text-cyan-500" />,
    description: "The most convenient way to reach us via public transport.",
    steps: [
      "Take the Kelana Jaya Line (Line 5) and alight at KLCC Station (KJ10).",
      "Follow the underground pedestrian walkway signs towards Suria KLCC / Petronas Twin Towers.",
      "The ticketing counter is located on the Lower Ground (LG) level."
    ]
  },
  {
    title: "By Taxi / E-Hailing",
    icon: <Navigation className="w-8 h-8 text-cyan-500" />,
    description: "Direct drop-off at the heart of the city.",
    steps: [
      "Input 'Petronas Twin Towers' or 'Suria KLCC' as your destination.",
      "The main drop-off point is located at the Tower 1 main entrance.",
      "Enter the lobby and proceed to the Lower Ground floor via the escalators."
    ]
  },
  {
    title: "By Bus (GOKL)",
    icon: <Bus className="w-8 h-8 text-cyan-500" />,
    description: "Free city bus service for commuters.",
    steps: [
      "Look for the GOKL City Bus (Green Line).",
      "Alight at the KLCC Bus Stop (directly outside the mall).",
      "Walk through the Suria KLCC entrance to reach the Tower concourse."
    ]
  },
  {
    title: "By Car (Parking)",
    icon: <Car className="w-8 h-8 text-cyan-500" />,
    description: "Secure underground parking is available 24/7.",
    steps: [
      "Enter via Jalan Ampang or Jalan P. Ramlee into the Suria KLCC parking.",
      "Park near the 'Tower 1' or 'Tower 2' pillars for the shortest walk.",
      "Standard parking rates apply. Take the lift to the Concourse (C) or LG level."
    ]
  }
];

export default function GettingHerePage() {
  return (
    <main className="bg-black min-h-screen text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-48 pb-24 border-b border-white/10 bg-linear-to-b from-slate-900/50 to-black">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
              Plan Your Visit
            </span>
            <h1 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter leading-none">
              Getting <br />
              <span className="text-slate-500 italic">Here</span>
            </h1>
          </motion.div>
        </Container>
      </section>

      {/* 2. TRANSPORT MODES GRID */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {transportData.map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black p-10 md:p-16 flex flex-col hover:bg-white/2 transition-colors group"
              >
                <div className="mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-sm">
                  {item.description}
                </p>
                
                <ul className="space-y-6 mt-auto">
                  {item.steps.map((step, sIndex) => (
                    <li key={sIndex} className="flex gap-4 items-start">
                      <span className="text-cyan-500 font-mono text-xs pt-1 opacity-50">
                        0{sIndex + 1}
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. LOCATION INFO & MAP CTA */}
      <section className="pb-32">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-3 text-cyan-500 mb-6">
                <MapPin size={20} />
                <span className="text-xs uppercase tracking-widest font-bold">Location</span>
              </div>
              <p className="text-3xl md:text-4xl font-serif leading-tight text-white">
                Lower Ground (LG) Level, <br />
                Petronas Twin Towers, <br />
                Kuala Lumpur City Centre.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link 
                href="https://maps.google.com" 
                target="_blank"
                className="inline-block bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-500 transition-all active:scale-95"
              >
                Get Directions
              </Link>
            </motion.div>
          </div>

          {/* Styled Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 h-112.5 w-full relative overflow-hidden group border border-white/10"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-[2s] group-hover:scale-110"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2 text-[10px] uppercase tracking-widest">View on Map</span>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}