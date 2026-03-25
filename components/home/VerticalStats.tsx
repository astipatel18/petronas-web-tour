// components/home/VerticalStats.tsx
"use client";

import { m, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { Container } from "../shared/Container";

// Sub-component for the rolling number effect
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return (
    <span className="flex items-baseline justify-center">
      <span ref={ref}>0</span>
      <span className="text-slate-500 font-light ml-1">{suffix}</span>
    </span>
  );
}

const stats = [
  { val: 452, suffix: "M", label: "Height Above Earth" },
  { val: 88, suffix: "", label: "Storeys of Steel" },
  { val: 7.8, suffix: "M", label: "Annual Visitors", isFloat: true },
];

export default function VerticalStats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={containerRef} 
      className="py-40 bg-deep-slate border-y border-white/5 relative overflow-hidden"
    >
      {/* Background Decorative Element: Subtle Vertical Lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-3 gap-20 px-4">
          <div className="border-x border-white h-full w-full" />
          <div className="border-x border-white h-full w-full" />
          <div className="border-x border-white h-full w-full" />
        </div>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-12 lg:gap-20 items-start">
          {stats.map((stat, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center group"
            >
              {/* Animated Stat Header */}
              <h3 className="text-8xl lg:text-[10rem] font-black text-white/95 tracking-tighter mb-4 leading-none">
                <Counter value={stat.val} suffix={stat.suffix} />
              </h3>

              {/* Engineering Accent Line */}
              <m.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: "48px" } : {}}
                transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                className="h-1 bg-cyan-500 mx-auto mb-8" 
              />

              {/* Label Section */}
              <div className="space-y-2">
                <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <p className="text-slate-600 text-[10px] uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Global Engineering Marvel
                </p>
              </div>

              {/* Subtle vertical glow effect on hover */}
              <div className="absolute -inset-y-10 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}