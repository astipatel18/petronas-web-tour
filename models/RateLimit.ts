import mongoose from "mongoose";

const RateLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  action: { type: String, required: true }, // e.g., "login" or "booking"
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // 🛡️ TTL: Documents delete themselves after 10 minutes
  },
});

// Indexing for high-performance lookups
RateLimitSchema.index({ ip: 1, action: 1 });

export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);