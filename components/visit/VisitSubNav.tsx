"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { name: "Overview", href: "/visit" },
  { name: "Getting Here", href: "/visit/getting-here" },
  { name: "Facilities", href: "/visit/facilities" },
  { name: "Agent Portal", href: "/visit/agent-portal" },
];

export default function VisitSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8 h-14 items-center overflow-x-auto no-scrollbar">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap transition-all relative h-full flex items-center",
                pathname === link.href ? "text-cyan-400" : "text-slate-500 hover:text-white"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}