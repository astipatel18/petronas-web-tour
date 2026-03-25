// components/home/AwardSection.tsx
"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "../shared/Container";
import { Star } from "lucide-react";

export default function AwardSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="py-24 md:py-32 bg-deep-slate border-b border-white/5 overflow-hidden"
    >
      <Container className="text-center">
        {/* 1. THE BADGE: Tripadvisor Recognition */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 border border-gold/30 bg-gold/5 px-6 py-2 mb-12"
        >
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="text-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
            Tripadvisor Traveller&apos;s Choice 2024
          </span>
          <Star className="w-3 h-3 text-gold fill-gold" />
        </m.div>

        {/* 2. THE QUOTE: Emotional Hook */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Subtle Decorative Quote Mark (Left) */}
          <span className="absolute -top-10 left-0 md:left-20 text-white/5 text-9xl font-serif select-none">
            &ldquo;
          </span>
          
          <h2 className="relative z-10 text-3xl md:text-6xl font-serif text-white max-w-5xl mx-auto leading-[1.2] tracking-tight">
            A masterpiece of <span className="text-slate-500 italic font-light">modern architecture</span> and the ultimate gateway to the Malaysian skyline.
          </h2>

          {/* Subtle Decorative Quote Mark (Right) */}
          <span className="absolute -bottom-20 right-0 md:right-20 text-white/5 text-9xl font-serif select-none">
            &rdquo;
          </span>
        </m.div>

        {/* 3. SUBTLE DIVIDER */}
        <m.div 
          initial={{ width: 0 }}
          animate={isInView ? { width: "80px" } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-px bg-gold/50 mx-auto mt-16"
        />
      </Container>
    </section>
  );
}