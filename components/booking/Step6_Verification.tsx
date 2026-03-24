"use client";
import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { finalizeVerifiedBooking } from "@/lib/actions";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Step6_Verification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { tempEmail } = useBookingStore();
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await finalizeVerifiedBooking(otp);
      if (res.success) {
        router.push(`/booking/success?ref=${res.ref}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-cyan-50 rounded-full text-cyan-600">
          <ShieldCheck size={40} />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
      <p className="text-slate-500 text-sm mb-8">
        We've sent a 6-digit code to <br/> 
        <span className="font-bold text-slate-900">{tempEmail}</span>
      </p>

      <input 
        type="text"
        maxLength={6}
        placeholder="000000"
        className="w-full text-center text-4xl font-mono tracking-[0.5em] border-b-2 border-slate-200 focus:border-cyan-500 outline-none pb-2 mb-8"
        onChange={(e) => setOtp(e.target.value)}
      />

      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

      <button 
        onClick={handleVerify}
        disabled={otp.length !== 6 || loading}
        className="w-full bg-black text-white py-4 font-bold uppercase text-xs tracking-widest hover:bg-cyan-600 disabled:opacity-20 transition-all flex justify-center items-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        Complete Booking
      </button>
    </div>
  );
}