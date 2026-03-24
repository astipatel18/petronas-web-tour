import { Container } from "@/components/shared/Container";
import { 
  Briefcase, 
  Accessibility, 
  Baby, 
  MapPin, 
  Users, 
  Info, 
  ShieldCheck 
} from "lucide-react";

const facilitiesData = [
  {
    title: "Luggage & Stroller Storage",
    icon: <Briefcase className="w-8 h-8 text-cyan-500" />,
    desc: "For safety and comfort, large bags and strollers are not permitted in the galleries. We provide a secure storage area for your belongings.",
    location: "Location: Luggage Counter, Lower Ground (LG) Level."
  },
  {
    title: "Wheelchair Accessibility",
    icon: <Accessibility className="w-8 h-8 text-cyan-500" />,
    desc: "The towers are fully wheelchair accessible. Complimentary wheelchairs are available on a first-come, first-served basis.",
    location: "Approach: Our Concierge desk at the Concourse Level."
  },
  {
    title: "Prayer Rooms (Surau)",
    icon: <MapPin className="w-8 h-8 text-cyan-500" />,
    desc: "Dedicated prayer rooms for Muslim visitors are available, equipped with wudhu facilities for both men and women.",
    location: "Location: Level Concourse (C) and Level 2."
  },
  {
    title: "Baby Care & Nursing",
    icon: <Baby className="w-8 h-8 text-cyan-500" />,
    desc: "Private nursing rooms and baby changing stations are provided for families traveling with infants.",
    location: "Location: Level Concourse (C) and Level 2, near the restrooms."
  },
  {
    title: "Guided Tours",
    icon: <Users className="w-8 h-8 text-cyan-500" />,
    desc: "Our professional guides provide detailed historical and architectural insights during your Skybridge and Observation Deck visit.",
    location: "Service: Included with all valid admission tickets."
  },
  {
    title: "Safety & Security",
    icon: <ShieldCheck className="w-8 h-8 text-cyan-500" />,
    desc: "All visitors must pass through security screening. Prohibited items include sharp objects, flammable materials, and professional tripods.",
    location: "Requirement: Valid ID or Passport is required for check-in."
  }
];

export default function FacilitiesPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      {/* 1. HERO HEADER */}
      <section className="pt-40 pb-20 border-b border-white/10">
        <Container>
          <span className="text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
            Plan Your Visit
          </span>
          <h1 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter leading-none">
            Facilities & <br />
            <span className="text-slate-500 italic">Accessibility</span>
          </h1>
        </Container>
      </section>

      {/* 2. INTRO TEXT */}
      <section className="py-20 border-b border-white/10">
        <Container>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl leading-relaxed font-light">
            We are committed to providing a safe, comfortable, and inclusive 
            experience for all our visitors. Our facilities are designed to 
            meet international standards of accessibility and hospitality.
          </p>
        </Container>
      </section>

      {/* 3. FACILITIES GRID */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {facilitiesData.map((item, index) => (
              <div 
                key={index} 
                className="bg-black p-12 flex flex-col hover:bg-white/2 transition-colors"
              >
                <div className="mb-8">{item.icon}</div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 grow">
                  {item.desc}
                </p>
                <div className="pt-6 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold block mb-1">
                    Visitor Note
                  </span>
                  <p className="text-slate-500 text-xs italic">
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CONCIERGE HELP CTA */}
      <section className="pb-32">
        <Container>
          <div className="bg-slate-900/50 border border-white/10 p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div>
              <h4 className="text-2xl font-bold uppercase mb-4">Need Assistance?</h4>
              <p className="text-slate-400 max-w-md">
                Our customer service team is available at the Concourse level to help 
                with special requirements or emergency medical assistance.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start gap-4 text-white">
                <Info size={20} className="text-cyan-500" />
                <span className="text-sm font-mono tracking-widest">+60 3-2331 8080</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}