// components/shared/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, ChevronDown, Rotate3d } from "lucide-react";
import { Container } from "./Container";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Visit", href: "/visit", hasDropdown: true },
  { name: "Gallery", href: "/gallery" },
  { name: "Views", href: "/360-view", isSpecial: true }, // Added 360 View
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [mobileVisitOpen, setMobileVisitOpen] = useState(false);
  
  const pathname = usePathname();

  // Scroll detection for background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsVisitOpen(false);
    setMobileVisitOpen(false);
  }, [pathname]);

  return (
    <nav 
      onMouseLeave={() => setIsVisitOpen(false)}
      className={cn(
        "fixed top-0 w-full z-100 transition-all duration-500 h-20 md:h-24",
        scrolled || isVisitOpen
          ? "bg-deep-slate/95 backdrop-blur-xl border-b border-white/10 h-16 md:h-20" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <Container className="h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* 1. BRAND IDENTITY */}
          <Link href="/" className="group flex items-center gap-3 z-110 h-full">
            <div className={cn(
                "w-10 h-10 flex items-center justify-center transition-all duration-500 border",
                scrolled || isVisitOpen ? "bg-white border-white" : "bg-transparent border-white/30"
            )}>
              <span className={cn(
                  "font-black text-sm tracking-tighter transition-colors duration-500",
                  scrolled || isVisitOpen ? "text-deep-slate" : "text-white"
              )}>
                PT
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-towers text-white uppercase leading-none">
                Petronas
              </span>
              <span className="text-[9px] tracking-[0.4em] text-silver/60 uppercase font-light mt-1">
                Twin Towers
              </span>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10 h-full">
            <div className="flex items-center h-full">
              {navLinks.map((link) => (
                <div 
                  key={link.href}
                  className="relative h-full flex items-center px-3 lg:px-4"
                  onMouseEnter={() => {
                    if (link.hasDropdown) setIsVisitOpen(true);
                    else setIsVisitOpen(false);
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-1 text-[10px] uppercase tracking-towers font-bold transition-all duration-300 h-full",
                      pathname === link.href || (link.hasDropdown && isVisitOpen) 
                        ? "text-cyan-400" 
                        : "text-silver hover:text-white"
                    )}
                  >
                    {link.name}
                    
                    {/* VISIT DROPDOWN ICON */}
                    {link.hasDropdown && (
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform duration-300", 
                        isVisitOpen && "rotate-180"
                      )} />
                    )}

                    {/* 360 VIEW LIVE BADGE */}
                    {link.isSpecial && (
                      <span className="absolute -top-1 -right-4 bg-cyan-500 text-[7px] px-1 py-0.5 rounded-sm animate-pulse text-black font-black leading-none">
                        LIVE
                      </span>
                    )}
                  </Link>
                  
                  {/* Underline for non-dropdown active links */}
                  {pathname === link.href && !isVisitOpen && !link.hasDropdown && (
                    <m.div 
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-3 right-3 h-px bg-cyan-500"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <Link 
              href="/booking" 
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative overflow-hidden px-8 py-3 text-[10px] uppercase tracking-towers font-bold transition-all duration-500",
                scrolled || isVisitOpen
                  ? "bg-white text-black hover:bg-cyan-500 hover:text-white" 
                  : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black"
              )}
            >
              <span className="relative z-10">Tickets</span>
            </Link>
          </div>

          {/* 3. MOBILE TOGGLE */}
          <button 
            className="md:hidden text-white transition-transform active:scale-90 z-110"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </Container>

      {/* 4. MEGA MENU (DESKTOP) */}
      <MegaMenu isOpen={isVisitOpen} onClose={() => setIsVisitOpen(false)} />

      {/* 5. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <m.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen bg-deep-slate z-100 flex flex-col md:hidden pt-32 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6 px-10 pb-20">
              {navLinks.map((link) => (
                <div key={link.href} className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <Link
                      href={link.href}
                      className={cn(
                          "relative text-3xl uppercase tracking-towers font-serif transition-colors",
                          pathname === link.href ? "text-cyan-500" : "text-white"
                      )}
                    >
                      {link.name}
                      {link.isSpecial && (
                        <span className="ml-4 bg-cyan-500 text-[10px] px-2 py-0.5 rounded-sm text-black font-black align-middle">
                          LIVE
                        </span>
                      )}
                    </Link>
                    {link.hasDropdown && (
                      <button 
                        onClick={() => setMobileVisitOpen(!mobileVisitOpen)}
                        className="p-4"
                      >
                        <ChevronDown className={cn("text-white transition-transform duration-300", mobileVisitOpen && "rotate-180")} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Accordion for Visit */}
                  {link.hasDropdown && (
                    <m.div 
                      initial={false}
                      animate={{ height: mobileVisitOpen ? "auto" : 0, opacity: mobileVisitOpen ? 1 : 0 }}
                      className="overflow-hidden flex flex-col pl-4 space-y-5"
                    >
                      <Link href="/visit/getting-here" className="text-silver uppercase tracking-widest text-xs pt-6">Getting Here</Link>
                      <Link href="/visit/facilities" className="text-silver uppercase tracking-widest text-xs">Facilities</Link>
                      <Link href="/visit/admission" className="text-silver uppercase tracking-widest text-xs">Tickets & Admission</Link>
                      <Link href="/visit/agent-portal" className="text-silver uppercase tracking-widest text-xs pb-4">Agent Portal</Link>
                    </m.div>
                  )}
                </div>
              ))}
              
              {/* MOBILE CTA */}
              <Link 
                  href="/booking" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center gap-4 bg-white text-deep-slate px-12 py-5 uppercase tracking-towers font-black text-xs mt-10"
              >
                  Book Tickets <ChevronRight size={16} />
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}