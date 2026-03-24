"use client";
import { useState, useEffect } from "react";

export default function BotProtection() {
  const [math, setMath] = useState({ a: 0, b: 0 });

  useEffect(() => {
    // Generate simple random numbers on the client to avoid hydration mismatch
    setMath({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
  }, []);

  return (
    <div className="space-y-6 mt-8 p-6 border border-slate-200 bg-slate-50">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Security Verification</h4>
      
      {/* 🍯 HONEYPOT FIELD (Hidden from humans) */}
      <div className="hidden" aria-hidden="true">
        <input 
          type="text" 
          name="honeypot_field" 
          tabIndex={-1} 
          autoComplete="off" 
          placeholder="Do not fill this"
        />
      </div>

      {/* 🧠 MATH CHALLENGE */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">
          What is {math.a} + {math.b}?
        </label>
        <input 
          type="number" 
          name="captcha_answer" 
          required 
          className="w-20 border border-slate-300 p-2 outline-none focus:border-cyan-500 text-center"
        />
        {/* Pass the expected sum to the server-side as a hidden field */}
        <input type="hidden" name="captcha_expected" value={math.a + math.b} />
      </div>
      
      <p className="text-[10px] text-slate-400 uppercase italic">
        * Anti-bot verification required to process admission.
      </p>
    </div>
  );
}