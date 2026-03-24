"use client";
import { useBookingStore, Attraction } from "@/store/useBookingStore";
import Image from "next/image";

const attractions: Attraction[] = [
  { id: "sky-standard", name: "Sky Experience - Standard Visit", image: "https://images.unsplash.com/photo-1544918877-460635b6d13e" },
  { id: "sky-priority", name: "Sky Experience - Priority Access", image: "https://images.unsplash.com/photo-1595841055318-5089e080753d" },
  { id: "sky-sunset", name: "Premium Sunset Experience", image: "https://images.unsplash.com/photo-1528181304800-2f140819ad1c" },
  { id: "sky-combo", name: "Tower Combo - Visit & Dine", image: "https://images.unsplash.com/photo-1561350111-7dad5f13d8d2" },
];

export default function Step1_Attractions() {
  const setAttraction = useBookingStore((state) => state.setAttraction);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {attractions.map((attr) => (
        <div key={attr.id} className="border border-slate-200 group hover:border-cyan-600 transition-all bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md">
          <div className="relative h-56 w-full overflow-hidden">
            <Image 
              src={`${attr.image}?q=80&w=800`} 
              alt={attr.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          {/* Changed flex-grow to grow for Tailwind v4 best practice */}
          <div className="p-8 flex flex-col grow">
            <h3 className="font-bold text-xl mb-6 h-14 flex items-start leading-tight text-slate-900">
              {attr.name}
            </h3>
            <button 
              onClick={() => setAttraction(attr)}
              className="w-full bg-slate-900 text-white font-black py-4 text-[10px] tracking-[0.2em] hover:bg-cyan-600 transition-all uppercase mt-auto"
            >
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}