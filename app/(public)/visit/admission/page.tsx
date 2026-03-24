"use client";

import { Container } from "@/components/shared/Container";
import { Clock, Info, AlertTriangle, CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingData = {
  standard: [
    { type: "Adult", age: "13 - 60 years", price: "RM 98.00" },
    { type: "Child", age: "3 - 12 years", price: "RM 50.00" },
    { type: "Senior Citizen", age: "61 years & above", price: "RM 50.00" },
    { type: "Infant", age: "Below 3 years", price: "FREE" },
  ],
  mykad: [
    { type: "Adult", age: "13 - 60 years", price: "RM 35.00" },
    { type: "Child", age: "3 - 12 years", price: "RM 17.00" },
    { type: "Senior Citizen", age: "61 years & above", price: "RM 17.00" },
    { type: "Infant", age: "Below 3 years", price: "FREE" },
  ]
};

export default function AdmissionPage() {
  return (
    <main className="bg-black min-h-screen text-white pb-32">
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-20 border-b border-white/10">
        <Container>
          <span className="text-cyan-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
            Plan Your Visit
          </span>
          <h1 className="text-6xl md:text-8xl font-serif uppercase tracking-tighter leading-none">
            Admission & <br />
            <span className="text-slate-500 italic">Ticketing</span>
          </h1>
        </Container>
      </section>

      {/* 2. VISITING HOURS */}
      <section className="py-20 border-b border-white/10 bg-white/1">
        <Container>
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="flex gap-6 items-center">
              <Clock className="text-cyan-500 w-10 h-10" />
              <div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Visiting Hours</h3>
                <p className="text-slate-400 text-sm">Tues - Sun (Closed on Mondays)</p>
              </div>
            </div>
            <div className="text-2xl font-light">
              09:00 AM — 09:00 PM
            </div>
            <div className="text-slate-500 text-xs italic leading-relaxed">
              *Last admission at 08:30 PM. <br />
              *Subject to change for special events or holidays.
            </div>
          </div>
        </Container>
      </section>

      {/* 3. PRICING SECTION (The Decision Table) */}
      <section className="py-24">
        <Container>
          <div className="mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4">Ticket Categories</h2>
            <p className="text-slate-400">Please select the appropriate category. MyKad/MyKid required for Malaysian rates.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Standard (Foreign) */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px grow bg-white/10"></span>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500">Standard Holders</h3>
                <span className="h-px grow bg-white/10"></span>
              </div>
              <div className="border border-white/10 bg-slate-900/20">
                {pricingData.standard.map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-6 border-b border-white/5 last:border-0 hover:bg-white/2">
                    <div>
                      <p className="font-bold uppercase text-sm tracking-tight">{row.type}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{row.age}</p>
                    </div>
                    <div className="text-xl font-mono text-cyan-400">{row.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MyKad (Local) */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px grow bg-white/10"></span>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500">MyKad / MyKid Holders</h3>
                <span className="h-px grow bg-white/10"></span>
              </div>
              <div className="border border-white/10 bg-slate-900/20">
                {pricingData.mykad.map((row, i) => (
                  <div key={i} className="flex justify-between items-center p-6 border-b border-white/5 last:border-0 hover:bg-white/2">
                    <div>
                      <p className="font-bold uppercase text-sm tracking-tight">{row.type}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{row.age}</p>
                    </div>
                    <div className="text-xl font-mono text-cyan-400">{row.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-20 bg-cyan-600">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">Secure Your Journey</h2>
            <p className="text-cyan-100 italic">Tickets are limited. Pre-booking online is highly recommended.</p>
          </div>
          <Link href="/booking" className="bg-black text-white px-12 py-5 font-bold uppercase tracking-widest text-xs hover:bg-slate-900 transition-all">
            Book Tickets Now
          </Link>
        </Container>
      </section>

      {/* 5. RULES & POLICIES */}
      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 text-cyan-500 mb-8">
                <AlertTriangle size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Important Notes</h3>
              </div>
              <ul className="space-y-6">
                {[
                  "Tickets are non-refundable and non-transferable.",
                  "Please arrive at least 15 minutes before your time slot.",
                  "A valid MyKad or Passport must be presented at the check-in counter.",
                  "Last entry is 30 minutes before closing time."
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-slate-700 shrink-0 mt-1" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 border border-white/10 bg-slate-900/30">
              <div className="flex items-center gap-3 text-cyan-500 mb-8">
                <CreditCard size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Payment Methods</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                We accept all major credit/debit cards (Visa, Mastercard), 
                FPX Online Banking, and major E-Wallets.
              </p>
              <div className="flex flex-wrap gap-4 opacity-40 grayscale">
                {/* Visual indicators for payment methods */}
                <div className="px-3 py-1 border border-white/20 text-[10px] font-bold">VISA</div>
                <div className="px-3 py-1 border border-white/20 text-[10px] font-bold">MASTERCARD</div>
                <div className="px-3 py-1 border border-white/20 text-[10px] font-bold">FPX</div>
                <div className="px-3 py-1 border border-white/20 text-[10px] font-bold">E-WALLET</div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}