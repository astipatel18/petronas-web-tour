// components/home/SocialProof.tsx
"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { Container } from "../shared/Container";
import { Star, Users, Award } from "lucide-react";

// Reusable Counter logic for consistency across the platform
function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent = latest.toFixed(decimals);
      }
    });
  }, [springValue, decimals]);

  return <span ref={ref}>0</span>;
}

const proofStats = [
  {
    icon: <Star className="w-4 h-4" />,
    value: 94000,
    suffix: "+",
    label: "Google Reviews",
    sub: "Global Consensus",
  },
  {
    icon: <Award className="w-4 h-4" />,
    value: 4.8,
    suffix: "/ 5.0",
    label: "Visitor Rating",
    sub: "Average Excellence",
    decimals: 1,
  },
  {
    icon: <Users className="w-4 h-4" />,
    value: 7.8,
    suffix: "M+",
    label: "Annual Visitors",
    sub: "Worldwide Guests",
    decimals: 1,
  },
];

export default function SocialProof() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-deep-slate border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent opacity-30 pointer-events-none" />

      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
          {proofStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="flex flex-col items-center md:items-start text-center md:text-left group relative"
            >
              {/* Stat Icon & Label */}
              <div className="flex items-center gap-3 text-cyan-500 mb-4">
                <div className="p-2 border border-cyan-500/20 rounded-full group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                  {stat.icon}
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
                  {stat.label}
                </span>
              </div>

              {/* Big Number */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-baseline gap-1">
                <Counter value={stat.value} decimals={stat.decimals} />
                <span className="text-slate-500 font-light text-2xl">{stat.suffix}</span>
              </div>

              {/* Sub-label */}
              <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium">
                {stat.sub}
              </p>

              {/* Vertical Divider for Desktop */}
              {i < proofStats.length - 1 && (
                <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 h-16 w-px bg-white/10" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}