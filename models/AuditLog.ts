// models/AuditLog.ts
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  level: { 
    type: String, 
    enum: ["INFO", "WARNING", "CRITICAL"], 
    default: "INFO" 
  },
  action: { type: String, required: true }, // e.g., "LOGIN_FAIL", "PRICE_TAMPER"
  message: { type: String, required: true },
  metadata: { type: Object }, // Store IP, User Agent, or input data
  timestamp: { type: Date, default: Date.now }
}, { expires: '30d' }); // 🛡️ AUTO-DELETE: Logs older than 30 days are removed automatically

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);