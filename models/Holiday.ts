import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true, unique: true }, // Format: "YYYY-MM-DD"
  multiplier: { type: Number, default: 0.25 }, // Custom premium for this specific holiday
});

export default mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);