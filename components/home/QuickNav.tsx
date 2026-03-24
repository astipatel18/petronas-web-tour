// components/home/QuickNav.tsx
import { Container } from "../shared/Container";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

export default function QuickNav() {
  return (
    <section className="py-32 bg-black border-t border-white/5">
      <Container className="grid md:grid-cols-2 gap-12 items-center">
        {/* Cinematic Heading */}
        <h3 className="text-5xl md:text-7xl font-serif text-white uppercase tracking-tighter italic leading-[0.9]">
          Ready for <br />
          <span className="text-silver/40">the peak?</span>
        </h3>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6">
          {/* INTERNAL LINK: Remains in same tab */}
          <Link
            href="/visit/getting-here"
            className="group flex items-center gap-3 border border-white/20 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500"
          >
            Getting Here
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* EXTERNAL LINK: Opens in new tab */}
          <Link
            href="/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-cyan-600 px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-cyan-500 transition-all duration-500 shadow-lg shadow-cyan-900/20"
          >
            Book Tickets
            <ArrowUpRight 
                size={14} 
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" 
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}