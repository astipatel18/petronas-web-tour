// // models/BotSighting.ts
// import mongoose from "mongoose";

// const BotSightingSchema = new mongoose.Schema({
//   ip: { type: String, required: true },
//   userAgent: String,
//   pathAttempted: String,
//   headers: Object, // Store all headers for deep analysis
//   timestamp: { type: Date, default: Date.now }
// });

// export default mongoose.models.BotSighting || mongoose.model("BotSighting", BotSightingSchema);




// models/BotSighting.ts
import mongoose from "mongoose";

const BotSightingSchema = new mongoose.Schema({
  ip: { 
    type: String, 
    required: true 
  },
  userAgent: { 
    type: String 
  },
  pathAttempted: { 
    type: String 
  },
  // 🚀 NEW: Explains the logic that caught the bot
  reason: { 
    type: String 
  },
  // 🛡️ Fingerprinting: Stores the raw header packet for deep analysis
  headers: { 
    type: Object 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // 🧹 HOUSEKEEPING: Auto-delete logs after 90 days to keep the DB lean
  expires: '90d' 
});

// Adding an index on IP for faster lookups in the Admin Panel
BotSightingSchema.index({ ip: 1 });

export default mongoose.models.BotSighting || mongoose.model("BotSighting", BotSightingSchema);