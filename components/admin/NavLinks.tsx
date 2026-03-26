"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Settings, 
  ShieldAlert,
  Ghost // 🚀 Added for Bot Tracking
} from "lucide-react";
import { cn } from "@/lib/utils";

// Updated navigation structure
const links = [
  { 
    name: "Overview", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "Bookings", 
    href: "/admin/bookings", 
    icon: Ticket 
  },
  { 
    name: "Visitors", 
    href: "/admin/users", 
    icon: Users 
  },
  { 
    name: "Security Logs", 
    href: "/admin/logs", 
    icon: ShieldAlert 
  },
  { 
    // 🕵️‍♂️ NEW: Bot Sightings (Intelligence Dashboard)
    name: "Bot Sightings", 
    href: "/admin/bots", 
    icon: Ghost 
  },
  { 
    name: "Settings", 
    href: "/admin/settings", 
    icon: Settings 
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
              isActive 
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {/* Icon with active/hover state transitions */}
            <LinkIcon 
              size={18} 
              className={cn(
                "transition-colors duration-300 relative z-10",
                isActive ? "text-black" : "text-slate-500 group-hover:text-cyan-400"
              )} 
            />
            
            <span className="relative z-10">{link.name}</span>

            {/* Premium Indicator for Active Link */}
            {isActive && (
              <m.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-5 bg-black rounded-r-full z-20"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            {/* Subtle Hover Glow for Inactive Links (Tailwind v4 syntax) */}
            {!isActive && (
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}
          </Link>
        );
      })}
    </div>
  );
}