import { dbConnect } from "./mongodb";
import RateLimit from "@/models/RateLimit";

export async function checkRateLimit(ip: string, action: string, limit: number) {
  await dbConnect();

  // 1. Count how many attempts this IP has made recently
  const count = await RateLimit.countDocuments({ ip, action });

  if (count >= limit) {
    return { success: false };
  }

  // 2. Record the new attempt
  await RateLimit.create({ ip, action });
  
  return { success: true };
}