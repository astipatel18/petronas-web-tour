// lib/logger.ts
import AuditLog from "@/models/AuditLog";
import { dbConnect } from "./mongodb";

export async function logEvent(level: "INFO" | "WARNING" | "CRITICAL", action: string, message: string, metadata?: any) {
  try {
    await dbConnect();
    await AuditLog.create({ level, action, message, metadata });
    console.log(`[${level}] ${action}: ${message}`);
  } catch (error) {
    console.error("Logger failed:", error);
  }
}