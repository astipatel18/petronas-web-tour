import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CheckCircle, Calendar, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PrintButton from "@/components/booking/PrintButton";
import { decrypt } from "@/lib/session"; // 🛡️ Our cryptographic engine

/**
 * SuccessPage - Next.js 15 Hardened Version
 * 
 * DESIGN: Glassmorphic Digital Receipt
 * SECURITY: URL vs Encrypted Cookie Reference Matching
 */
export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ ref?: string }> 
}) {
  // 1. Resolve Next.js 15 Async requirements
  const params = await searchParams;
  const urlRef = params.ref;

  // 2. Access the secure cookie store
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("booking_session")?.value;

  // 🛡️ SECURITY CHECK 1: Presence
  if (!sessionToken || !urlRef) {
    redirect("/booking");
  }

  // 🛡️ SECURITY CHECK 2: Cryptographic Integrity
  // Decrypts and checks if the session has expired (maxAge: 60s)
  const sessionData = await decrypt(sessionToken);

  if (!sessionData) {
    // If decryption fails or token expired, redirect to start
    redirect("/booking");
  }

  // 🛡️ SECURITY CHECK 3: Reference Matching
  const cookieRef = sessionData.ref;
  if (cookieRef !== urlRef) {
    console.error("🚨 SECURITY_MISMATCH: URL reference does not match encrypted session.");
    redirect("/booking");
  }

  // 🛡️ NOTE: cookieStore.delete() has been removed to prevent runtime errors.
  // The cookie will self-destruct automatically in 60 seconds.

  return (
    <main className="min-h-screen bg-slate-950 flex items-center py-20 selection:bg-cyan-500/30">
      <Container>
        <div className="max-w-2xl mx-auto">
          
          {/* Header Scene */}
          <div className="text-center mb-12">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <CheckCircle className="text-cyan-500 w-16 h-16" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 uppercase tracking-tighter">
              Booking <span className="text-slate-500 italic">Confirmed</span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
               <ShieldCheck size={14} className="text-cyan-600" /> Session Authenticated
            </div>
          </div>

          {/* Glassmorphic Digital Receipt */}
          <div className="bg-white/3 border border-white/10 backdrop-blur-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl rounded-sm">
            
            {/* Background Watermark */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none select-none">
               <h2 className="text-[120px] font-black tracking-tighter text-white uppercase">PETRONAS</h2>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/5 pb-8 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-1">Status</p>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded border border-emerald-500/20">
                    Admission Authorized
                  </span>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-1">Booking Ref</p>
                  <p className="text-3xl font-mono text-white font-black uppercase tracking-tight">
                    {urlRef}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                     <Calendar className="text-cyan-500 w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Visit Validation</p>
                     <p className="text-white text-sm font-medium">Original ID/Passport Required</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                     <Mail className="text-cyan-500 w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Delivery Method</p>
                     <p className="text-white text-sm font-medium">Digital Ticket Sent to Email</p>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border-l-2 border-cyan-500 p-6">
                <p className="text-[10px] text-cyan-500 uppercase font-bold tracking-[0.2em] mb-2">Arrival Instructions</p>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  &quot;Please present this digital confirmation or your printed receipt at the Ticketing Counter on the Lower Ground Floor (LG). Arrive 15 minutes prior to your allocated slot.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center items-center">
            <Link 
              href="/" 
              className="text-slate-500 text-[10px] uppercase tracking-widest font-black hover:text-cyan-400 transition-all py-2 border-b border-transparent hover:border-cyan-400"
            >
              Return to Earth
            </Link>
            
            <div className="h-4 w-px bg-white/10 hidden md:block" />

            <PrintButton /> 

            <div className="h-4 w-px bg-white/10 hidden md:block" />

            <Link 
              href="/experience" 
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-all border border-white/5"
            >
              <span className="text-white text-[10px] uppercase tracking-widest font-black">Explore More</span>
              <ArrowRight size={14} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}