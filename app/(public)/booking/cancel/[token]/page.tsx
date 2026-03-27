"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { userCancelBooking } from "@/lib/actions";
import { Container } from "@/components/shared/Container";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function CancelBookingPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCancel = async () => {
    setStatus("loading");
    const res = await userCancelBooking(token as string);
    if (res.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setMessage(res.error || "");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center pt-20">
      <Container className="max-w-md">
        <div className="bg-white/5 border border-white/10 p-10 text-center rounded-2xl backdrop-blur-xl">
          {status === "idle" && (
            <>
              <AlertTriangle className="text-amber-500 w-12 h-12 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">Cancel Booking?</h1>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to cancel your visit? This action is permanent.</p>
              <button onClick={handleCancel} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-bold uppercase text-xs tracking-widest transition-all">
                Confirm Cancellation
              </button>
            </>
          )}

          {status === "loading" && <Loader2 className="animate-spin text-cyan-500 w-10 h-10 mx-auto" />}

          {status === "success" && (
            <div className="animate-in fade-in zoom-in">
              <CheckCircle className="text-emerald-500 w-12 h-12 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-2">Booking Cancelled</h1>
              <p className="text-slate-400 text-sm">Your refund request is being processed. You will receive a confirmation email shortly.</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-red-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-6" />
              <h1 className="text-xl font-bold mb-2">Unable to Cancel</h1>
              <p className="text-sm opacity-70">{message}</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}