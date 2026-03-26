import { Container } from "./Container"
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 relative overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
          <div className="text-sm text-slate-400 font-medium tracking-tight">
            © {new Date().getFullYear()} PETRONAS TWIN TOWERS. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex gap-8 mt-6 md:mt-0 text-[10px] uppercase tracking-[0.2em] font-black">
            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-cyan-500 transition-colors">Safety</a>
          </div>
        </div>
      </Container>

      {/* 
          🍯 THE INVISIBLE SHADOW TRIPWIRE (Strategy 1)
          ---------------------------------------------
          - opacity-0: Invisible to the eye.
          - pointer-events-none: Cannot be accidentally clicked by a mouse.
          - tabIndex={-1}: Ignored by keyboard 'Tab' navigation.
          - aria-hidden="true": Ignored by Screen Readers (Accessibility safety).
          - rel="nofollow": Tells Googlebot to ignore it, but scrapers will follow it.
      */}
      <Link 
        href="/api/trap" 
        className="opacity-0 absolute left-0 bottom-0 w-0 h-0 pointer-events-none select-none"
        tabIndex={-1}
        aria-hidden="true"
        rel="nofollow"
      >
        System Administrative Data Feed v4.2.1
      </Link>
    </footer>
  )
}