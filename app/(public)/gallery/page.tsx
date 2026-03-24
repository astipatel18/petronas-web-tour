// app/(public)/gallery/page.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { X, ChevronLeft, ChevronRight, Camera, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";

// 🏆 CURATED PETRONAS-SPECIFIC DATASET (24 Images)
const galleryImages = [
  // --- DAWN ---
  { id: 0, category: "Skyline", phase: "Dawn", src: "https://images.unsplash.com/photo-1587474260584-136574528ed5", title: "The Blue Hour", desc: "The towers emerging through the early morning mist." },
  { id: 1, category: "Architecture", phase: "Dawn", src: "https://images.unsplash.com/photo-1593450974136-e0281b37f40d", title: "Steel Silhouette", desc: "First light reflecting off the Vision Panels." },
  { id: 2, category: "Skyline", phase: "Dawn", src: "https://images.unsplash.com/photo-1621360841013-c7683c659ec6", title: "Morning Purity", desc: "A clean perspective of the icons at daybreak." },
  { id: 3, category: "Architecture", phase: "Dawn", src: "https://images.unsplash.com/photo-1595841055318-5089e080753d", title: "Vertical Ascent", desc: "The geometric precision of the Rub el Hizb design." },

  // --- DAY ---
  { id: 4, category: "Skyline", phase: "Day", src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200", title: "KLCC Park Greenery", desc: "The towers standing tall above the city's green lung." },
  { id: 5, category: "Interiors", phase: "Day", src: "https://images.unsplash.com/photo-1561350111-7dad5f13d8d2", title: "The Concourse", desc: "Luxury and geometry meet in the grand entrance." },
  { id: 6, category: "Architecture", phase: "Day", src: "https://images.unsplash.com/photo-1596422846543-75c6fc18a5cf", title: "Stainless Brilliance", desc: "Capturing the 33,000 external panels under the sun." },
  { id: 7, category: "Skyline", phase: "Day", src: "https://images.unsplash.com/photo-1493606278519-11aa9f86e40a", title: "Park Reflection", desc: "Mirror image in the KLCC symphony fountain." },
  { id: 8, category: "Interiors", phase: "Day", src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272", title: "Suria Atrium", desc: "The bustling life at the base of the pillars." },
  { id: 9, category: "Skyline", phase: "Day", src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda", title: "Equatorial Icon", desc: "The twins framed by tropical palm trees." },

  // --- DUSK ---
  { id: 10, category: "Skybridge", phase: "Dusk", src: "https://images.unsplash.com/photo-1590518342263-547e271a53f9", title: "The Sky Connector", desc: "Watching the sun dip below the horizon from level 42." },
  { id: 11, category: "Skyline", phase: "Dusk", src: "https://images.unsplash.com/photo-1528181304800-2f140819ad1c", title: "Golden Hour Peaks", desc: "Orange hues washing over the stainless steel spires." },
  { id: 12, category: "Skyline", phase: "Dusk", src: "https://images.unsplash.com/photo-1444723121867-7a241cacace9", title: "Twilight Transition", desc: "The moment the city lights begin to flicker on." },
  { id: 13, category: "Architecture", phase: "Dusk", src: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade", title: "Pinnacle Sunset", desc: "Detailed view of the towers as they catch the last light." },

  // --- NIGHT ---
  { id: 14, category: "Skyline", phase: "Night", src: "https://images.unsplash.com/photo-1544918877-460635b6d13e", title: "Midnight Beacon", desc: "The world-famous white glow against the black sky." },
  { id: 15, category: "Architecture", phase: "Night", src: "https://images.unsplash.com/photo-1507661060265-ed4576395e84", title: "Geometric Night", desc: "A ground-up perspective of the illuminated motifs." },
  { id: 16, category: "Skybridge", phase: "Night", src: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884", title: "Floating Path", desc: "The Skybridge suspended in a sea of urban lights." },
  { id: 17, category: "Skyline", phase: "Night", src: "https://images.unsplash.com/photo-1518391846015-55a97e198179", title: "Urban Galaxy", desc: "The towers as the center of the KL galaxy." },
  { id: 18, category: "Skyline", phase: "Night", src: "https://images.unsplash.com/photo-1571439243729-195f26938221", title: "Luminous Titans", desc: "High-contrast night view from Bukit Bintang." },
  { id: 19, category: "Interiors", phase: "Night", src: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68", title: "Luxury Lighting", desc: "The warm interior glow during a night visit." },
  { id: 20, category: "Architecture", phase: "Night", src: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33", title: "Symmetry in Dark", desc: "The perfect alignment of the world's tallest twin towers." },
  { id: 21, category: "Skyline", phase: "Night", src: "https://images.unsplash.com/photo-1496560230580-0a25692607f0", title: "Symphony Fountains", desc: "Water and light dance at the foot of the icons." },
  { id: 22, category: "Skybridge", phase: "Night", src: "https://images.unsplash.com/photo-1511210112837-12499119616d", title: "Sky Walkway", desc: "An unparalleled view of the city from the bridge." },
  { id: 23, category: "Skyline", phase: "Night", src: "https://images.unsplash.com/photo-1525625230556-878f9ee922c0", title: "Electric KL", desc: "The vibrant energy of Kuala Lumpur at midnight." },
];

const categories = ["All", "Architecture", "Skyline", "Interiors", "Skybridge"];
const phases = ["Dawn", "Day", "Dusk", "Night"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const filteredImages = filter === "All"
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* 🚀 CINEMATIC HERO */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=2000"
            alt="Hero Background"
            fill
            className="object-cover opacity-60 scale-110"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#050505]" />

        <Container className="relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <Camera className="w-12 h-12 text-cyan-500 mx-auto mb-8 opacity-40" />
            <h1 className="text-7xl md:text-9xl font-serif leading-none tracking-tighter uppercase">
              Visual <br /> <span className="text-gray-500 italic">Narrative</span>
            </h1>
            <p className="mt-8 text-gray-400 uppercase tracking-[0.6em] text-[10px] font-bold">
              Kuala Lumpur through the lens
            </p>
          </motion.div>
        </Container>
      </section>

      {/* 💎 GLASSMORPHISM FILTER BAR */}
      <div className="sticky top-20 z-40 py-8 bg-black/60 backdrop-blur-2xl border-y border-white/5">
        <Container className="flex justify-center gap-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                filter === cat 
                ? "bg-white text-black" 
                : "text-gray-500 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </Container>
      </div>

      {/* 🎞️ STORY CHAPTERS */}
      <section className="py-24">
        <Container>
          {phases.map((phase, pIdx) => {
            const phaseImages = filteredImages.filter(img => img.phase === phase);
            if (!phaseImages.length) return null;

            return (
              <div key={phase} className="mb-40">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  whileInView={{ opacity: 1 }} 
                  className="flex items-center gap-8 mb-16"
                >
                  <h2 className="text-5xl md:text-6xl font-serif italic text-white/90">{phase}</h2>
                  <div className="h-px grow bg-linear-to-r from-white/20 to-transparent" />
                  <span className="text-[10px] font-mono text-gray-600">CHAPTER 0{pIdx + 1}</span>
                </motion.div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                  {phaseImages.map((img, idx) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="relative group cursor-none overflow-hidden border border-white/5 bg-zinc-900"
                      onClick={() => setLightboxIndex(filteredImages.findIndex(i => i.id === img.id))}
                    >
                      <Image
                        src={`${img.src}?q=80&w=800`}
                        alt={img.title}
                        width={800}
                        height={600}
                        className="transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      />

                      {/* HOVER OVERLAY */}
                      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                        <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase mb-2">
                           <Eye size={12} /> View Frame
                        </div>
                        <h4 className="text-2xl font-serif italic text-white">{img.title}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* 🏁 FINAL CTA */}
      <section className="py-48 text-center bg-white/1 border-t border-white/5">
        <Container>
          <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-12">
            Ready to frame your own <span className="text-gray-500">memory?</span>
          </h2>
          <Link 
            href="/booking" 
            className="group inline-flex items-center gap-6 bg-white text-black px-16 py-6 font-bold uppercase text-xs tracking-[0.3em] hover:bg-cyan-500 transition-all"
          >
            Secure Admission <ArrowRight className="group-hover:translate-x-3 transition-transform" />
          </Link>
        </Container>
      </section>

      {/* 🖼️ ADVANCED LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-200 flex items-center justify-center p-4 md:p-12"
            onClick={() => setLightboxIndex(null)}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white z-210 transition-colors">
              <X size={40} strokeWidth={1} />
            </button>
            
            <button 
              onClick={prevImage} 
              className="absolute left-10 text-white/20 hover:text-cyan-500 z-210 hidden md:block transition-all"
            >
              <ChevronLeft size={64} strokeWidth={1} />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-10 text-white/20 hover:text-cyan-500 z-210 hidden md:block transition-all"
            >
              <ChevronRight size={64} strokeWidth={1} />
            </button>

            <div className="w-full max-w-6xl flex flex-col items-center">
              <motion.div 
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-[60vh] md:h-[75vh]"
              >
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt="Full view"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
              
              <div className="mt-12 text-center max-w-2xl px-6">
                <p className="text-cyan-500 font-bold uppercase tracking-[0.4em] text-[10px]">
                  Frame {lightboxIndex + 1} of {filteredImages.length}
                </p>
                <h3 className="text-3xl font-serif italic text-white mt-4">{filteredImages[lightboxIndex].title}</h3>
                <p className="text-gray-500 text-sm mt-4 font-light leading-relaxed">
                  {filteredImages[lightboxIndex].desc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}