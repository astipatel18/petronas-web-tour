// import { Container } from "../shared/Container";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// const tracks = [
//   { 
//     title: "Plan Your Visit", 
//     href: "/visit/getting-here", 
//     img: "https://images.unsplash.com/photo-1544918877-460635b6d13e" 
//   },
//   { 
//     title: "The Experience", 
//     href: "/experience", 
//     // Immersive upward view of the Skybridge
//     img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07" 
//   },
//   { 
//     title: "Admission", 
//     href: "/visit/admission", 
//     // Classic iconic view of the full towers at twilight
//     img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" 
//   },
// ];

// export default function DiscoveryGrid() {
//   return (
//     <section className="py-32 bg-deep-slate">
//       <Container>
//         <h2 className="text-white text-[10px] uppercase tracking-[0.5em] font-bold mb-16 text-center opacity-50">Discover the Twins</h2>
//         <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
//           {tracks.map((t) => (
//             <Link key={t.title} href={t.href} className="group relative h-137.5 overflow-hidden bg-black">
//               <div 
//                 className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
//                 style={{ backgroundImage: `url(${t.img})` }}
//               />
//               <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
//               <div className="absolute bottom-12 left-12 right-12">
//                 <h4 className="text-white text-3xl font-bold uppercase tracking-tight mb-4 leading-none">{t.title}</h4>
//                 <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
//                   Explore <ArrowRight size={14} />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }






import { Container } from "../shared/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image"; // 🚀 Import Next.js Image component

const tracks = [
  { 
    title: "Plan Your Visit", 
    href: "/visit/getting-here", 
    img: "https://images.unsplash.com/photo-1544918877-460635b6d13e" 
  },
  { 
    title: "The Experience", 
    href: "/experience", 
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07" 
  },
  { 
    title: "Admission", 
    href: "/visit/admission", 
    img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" 
  },
];

export default function DiscoveryGrid() {
  return (
    <section className="py-32 bg-deep-slate">
      <Container>
        <h2 className="text-white text-[10px] uppercase tracking-[0.5em] font-bold mb-16 text-center opacity-50">
          Discover the Twins
        </h2>
        
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {tracks.map((t) => (
            <Link 
              key={t.title} 
              href={t.href} 
              className="group relative h-137.5 overflow-hidden bg-black"
            >
              {/* 🚀 Optimized Next/Image Replacement */}
              <Image 
                src={`${t.img}?auto=format&fit=crop&q=75`} // q=75 is the sweet spot for visual quality vs weight
                alt={t.title}
                fill // Tells image to fill the container
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 🛡️ CRITICAL for performance
                className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />

              {/* Gradient Overlay (Moved to a separate div to sit above the image) */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10" />

              {/* Content (Z-indexed to stay on top) */}
              <div className="absolute bottom-12 left-12 right-12 z-20">
                <h4 className="text-white text-3xl font-bold uppercase tracking-tight mb-4 leading-none">
                  {t.title}
                </h4>
                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}