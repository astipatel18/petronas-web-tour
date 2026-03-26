"use client";

import { useState } from "react";
import { processCancellation } from "@/lib/admin-actions";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

export default function CancelBookingButton({ id, refCode }: { id: string; refCode: string }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm(`Are you sure you want to VOID booking ${refCode}? This cannot be undone.`);
    if (!confirmed) return;

    setLoading(true);
    const result = await processCancellation(id);
    if (!result.success) {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={loading}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
      title="Cancel Booking"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}