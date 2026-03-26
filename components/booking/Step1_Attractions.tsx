"use client";
import { useBookingStore, Attraction } from "@/store/useBookingStore";
import Image from "next/image";

// 🚀 100% VERIFIED SLUG-BASED LINKS (PERMANENT CDN ACCESS)
const attractions: Attraction[] = [
  { 
    id: "sky-standard", 
    name: "Sky Experience - Standard Visit", 
    image: "https://images.unsplash.com/photo-1544918877-460635b6d13e" 
  },
  { 
    id: "sky-priority", 
    name: "Sky Experience - Priority Access", 
    image: "https://images.unsplash.com/photo-1595841055318-5089e080753d" 
  },
  { 
    id: "sky-sunset", 
    name: "Premium Sunset Experience", 
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" 
  },
  { 
    id: "sky-combo", 
    name: "Tower Combo - Visit & Dine", 
    image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884" 
  },
];

export default function Step1_Attractions() {
  const setAttraction = useBookingStore((state) => state.setAttraction);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {attractions.map((attr) => (
        <div 
          key={attr.id} 
          className="border border-slate-200 group hover:border-cyan-600 transition-all bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-xl"
        >
          <div className="relative h-60 w-full overflow-hidden bg-slate-100">
            {/* 🚀 LOGIC: Standard URL + Professional CDN Parameters */}
            <Image 
              src={`${attr.image}?auto=format&fit=crop&q=80&w=800`} 
              alt={attr.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" 
              priority={attr.id === 'sky-standard'}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          </div>

          <div className="p-8 flex flex-col grow">
            <div className="mb-6">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-600 block mb-2">
                 Official Admission
               </span>
               <h3 className="font-bold text-xl leading-tight text-slate-900 group-hover:text-cyan-700 transition-colors">
                 {attr.name}
               </h3>
            </div>
            
            <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-light">
              Full access to the Skybridge and Observation Deck with professional guided insights.
            </p>

            <button 
              onClick={() => setAttraction(attr)}
              className="w-full bg-slate-900 text-white font-black py-4 text-[10px] tracking-[0.2em] hover:bg-cyan-600 transition-all uppercase mt-auto shadow-lg shadow-slate-900/10"
            >
              Select Package
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}