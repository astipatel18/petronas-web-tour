"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid authorization credentials.");
        setIsLoading(false);
      } else {
        // 🚀 SUCCESS: Redirect straight to the Admin Hub
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("System error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-deep-slate flex items-center justify-center">
      <Container className="max-w-md">
        <div className="bg-black/40 border border-white/10 p-8 md:p-12 backdrop-blur-xl rounded-none shadow-2xl relative overflow-hidden">
          
          {/* Subtle Security Badge */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck size={100} className="text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500 rounded-sm">
                <Lock size={18} className="text-black" />
              </div>
              <h1 className="text-2xl font-serif text-white uppercase tracking-tighter">
                Staff <span className="text-slate-500 italic">Portal</span>
              </h1>
            </div>

            <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-10 border-b border-white/5 pb-4">
              Authorized Management Personnel Only
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  Staff Identification (Email)
                </label>
                <input 
                  type="email" 
                  required 
                  disabled={isLoading}
                  placeholder="admin@petronas.com"
                  className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-cyan-500 transition-all placeholder:text-slate-700" 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  Security Access Key (Password)
                </label>
                <input 
                  type="password" 
                  required 
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-cyan-500 transition-all" 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3">
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                    {error}
                  </p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  "Initiate Access"
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-widest leading-relaxed">
                By logging in, you agree to the internal security protocols. <br />
                All access attempts are logged with IP: 127.0.0.1
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}