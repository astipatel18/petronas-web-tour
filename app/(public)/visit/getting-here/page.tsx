// "use client";

// import { Container } from "@/components/shared/Container";
// import { Train, Bus, Car, Navigation, MapPin } from "lucide-react";
// import Link from "next/link";
// import { m } from "framer-motion";

// const transportData = [
//   {
//     title: "By LRT (Light Rail Transit)",
//     icon: <Train className="w-8 h-8 text-cyan-500" />,
//     description: "The most convenient way to reach us via public transport.",
//     steps: [
//       "Take the Kelana Jaya Line (Line 5) and alight at KLCC Station (KJ10).",
//       "Follow the underground pedestrian walkway signs towards Suria KLCC / Petronas Twin Towers.",
//       "The ticketing counter is located on the Lower Ground (LG) level."
//     ]
//   },
//   {
//     title: "By Taxi / E-Hailing",
//     icon: <Navigation className="w-8 h-8 text-cyan-500" />,
//     description: "Direct drop-off at the heart of the city.",
//     steps: [
//       "Input 'Petronas Twin Towers' or 'Suria KLCC' as your destination.",
//       "The main drop-off point is located at the Tower 1 main entrance.",
//       "Enter the lobby and proceed to the Lower Ground floor via the escalators."
//     ]
//   },
//   {
//     title: "By Bus (GOKL)",
//     icon: <Bus className="w-8 h-8 text-cyan-500" />,
//     description: "Free city bus service for commuters.",
//     steps: [
//       "Look for the GOKL City Bus (Green Line).",
//       "Alight at the KLCC Bus Stop (directly outside the mall).",
//       "Walk through the Suria KLCC entrance to reach the Tower concourse."
//     ]
//   },
//   {
//     title: "By Car (Parking)",
//     icon: <Car className="w-8 h-8 text-cyan-500" />,
//     description: "Secure underground parking is available 24/7.",
//     steps: [
//       "Enter via Jalan Ampang or Jalan P. Ramlee into the Suria KLCC parking.",
//       "Park near the 'Tower 1' or 'Tower 2' pillars for the shortest walk.",
//       "Standard parking rates apply. Take the lift to the Concourse (C) or LG level."
//     ]
//   }
// ];

// export default function GettingHerePage() {
//   return (
//     <main className="bg-black min-h-screen text-white">
//       {/* 1. HERO HEADER */}
//       <section className="pt-48 pb-24 border-b border-white/10 bg-linear-to-b from-slate-900/50 to-black">
//         <Container>
//           <m.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <span className="text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">
//               Plan Your Visit
//             </span>
//             <h1 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter leading-none">
//               Getting <br />
//               <span className="text-slate-500 italic">Here</span>
//             </h1>
//           </m.div>
//         </Container>
//       </section>

//       {/* 2. TRANSPORT MODES GRID */}
//       <section className="py-24">
//         <Container>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
//             {transportData.map((item, index) => (
//               <m.div 
//                 key={index} 
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-black p-10 md:p-16 flex flex-col hover:bg-white/2 transition-colors group"
//               >
//                 <div className="mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:text-white">
//                   {item.icon}
//                 </div>
//                 <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">
//                   {item.title}
//                 </h3>
//                 <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-sm">
//                   {item.description}
//                 </p>
                
//                 <ul className="space-y-6 mt-auto">
//                   {item.steps.map((step, sIndex) => (
//                     <li key={sIndex} className="flex gap-4 items-start">
//                       <span className="text-cyan-500 font-mono text-xs pt-1 opacity-50">
//                         0{sIndex + 1}
//                       </span>
//                       <p className="text-slate-300 text-sm leading-relaxed">
//                         {step}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               </m.div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* 3. LOCATION INFO & MAP CTA */}
//       <section className="pb-32">
//         <Container>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
//             <m.div 
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="max-w-xl"
//             >
//               <div className="flex items-center gap-3 text-cyan-500 mb-6">
//                 <MapPin size={20} />
//                 <span className="text-xs uppercase tracking-widest font-bold">Location</span>
//               </div>
//               <p className="text-3xl md:text-4xl font-serif leading-tight text-white">
//                 Lower Ground (LG) Level, <br />
//                 Petronas Twin Towers, <br />
//                 Kuala Lumpur City Centre.
//               </p>
//             </m.div>
            
//             <m.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//             >
//               <Link 
//                 href="https://maps.google.com" 
//                 target="_blank"
//                 className="inline-block bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-500 transition-all active:scale-95"
//               >
//                 Get Directions
//               </Link>
//             </m.div>
//           </div>

//           {/* Styled Map Placeholder */}
//           <m.div 
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="mt-16 h-112.5 w-full relative overflow-hidden group border border-white/10"
//           >
//             <div 
//               className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-[2s] group-hover:scale-110"
//               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')` }}
//             />
//             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-700" />
//             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-2 text-[10px] uppercase tracking-widest">View on Map</span>
//             </div>
//           </m.div>
//         </Container>
//       </section>
//     </main>
//   );
// }








"use client";

import { Container } from "@/components/shared/Container";
import { Train, Bus, Car, Navigation, MapPin } from "lucide-react";
import Link from "next/link";
import { m } from "framer-motion";

// 🚀 GOOGLE MAPS DEEP LINK
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Petronas+Twin+Towers/@3.1579277,101.7067282,16z/data=!3m2!4b1!5s0x31cc3624d159584b:0xd7fdfb7d8ae99871!4m6!3m5!1s0x31cc37d12d669c1f:0x9e3afdd17c8a9056!8m2!3d3.1574693!4d101.7115639!16zL20vMHN5bHo?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D";

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
          <m.div
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
          </m.div>
        </Container>
      </section>

      {/* 2. TRANSPORT MODES GRID */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {transportData.map((item, index) => (
              <m.div 
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
              </m.div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. LOCATION INFO & MAP CTA */}
      <section className="pb-32">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <m.div 
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
            </m.div>
            
            <m.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* 🚀 FIXED LINK */}
              <Link 
                href={GOOGLE_MAPS_URL} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black px-12 py-5 font-bold uppercase tracking-widest text-[10px] hover:bg-cyan-500 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                Get Directions
              </Link>
            </m.div>
          </div>

          {/* 🚀 WRAPPED IMAGE IN LINK FOR BETTER UX */}
          <Link href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            <m.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 h-112.5 w-full relative overflow-hidden group border border-white/10 cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-[2s] group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-700" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 text-[10px] uppercase font-bold tracking-[0.3em]">
                    View Landmark on Google Maps
                 </span>
              </div>
            </m.div>
          </Link>
        </Container>
      </section>
    </main>
  );
}