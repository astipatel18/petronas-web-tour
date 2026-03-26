import mongoose from "mongoose";

const EmailQueueSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: String,
  html: String,
  attempts: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'failed', 'sent'], default: 'pending' },
  lastError: String,
}, { timestamps: true });

export default mongoose.models.EmailQueue || mongoose.model("EmailQueue", EmailQueueSchema);