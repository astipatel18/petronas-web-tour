import { Container } from "@/components/shared/Container";
import { Users, Briefcase, FileText } from "lucide-react";

export default function AgentPortalPage() {
  return (
    <div className="pt-32 pb-20 bg-deep-slate min-h-screen">
      <Container>
        <h1 className="text-5xl font-serif text-white mb-6 uppercase tracking-tighter">AGENT PORTAL</h1>
        <p className="text-slate-400 max-w-2xl mb-12">Partner with us for group bookings, travel agent rates, and corporate events at the world's tallest twin towers.</p>
        <div className="grid md:grid-cols-3 gap-6">
            {["Group Bookings", "Contracted Rates", "Marketing Assets"].map((item) => (
                <div key={item} className="p-6 border border-white/10 hover:border-cyan-500 transition-colors">
                    <h3 className="text-white font-bold uppercase text-sm mb-4">{item}</h3>
                    <button className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase">Request Access →</button>
                </div>
            ))}
        </div>
      </Container>
    </div>
  );
}