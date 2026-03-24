// components/home/StatsSection.tsx
"use client"
import { motion } from "framer-motion"
import { Container } from "../shared/Container"

const stats = [
  { label: "Height", value: "451.9m", sub: "World's Tallest Twin Towers" },
  { label: "Floors", value: "88", sub: "Above Ground Level" },
  { label: "Steel Beams", value: "33,000", sub: "Structural Integrity" },
  { label: "Visitors", value: "2M+", sub: "Annual Experiences" },
]

export default function StatsSection() {
  return (
    <section className="py-24 bg-slate-950 border-y border-slate-900">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-cyan-500 font-bold uppercase tracking-widest text-xs mb-1">{stat.label}</div>
              <div className="text-slate-500 text-xs">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}