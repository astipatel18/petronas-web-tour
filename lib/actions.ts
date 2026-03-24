// lib/actions.ts
"use server";

import { dbConnect } from "./mongodb";
import Booking from "@/models/Booking";
import { BookingSchema } from "./validations";
import { redirect } from "next/navigation";
import { generateBookingRef, calculateTotal } from "./utils";
import { headers, cookies } from "next/headers";
import { sendTicketEmail, sendVerificationCode } from "./mailer";
import { logEvent } from "./logger";
import { SignJWT, jwtVerify } from "jose";
// 🛡️ INTERNAL RATE LIMIT (Replaced Upstash)
import { checkRateLimit } from "./internalRateLimit"; 

// 🛡️ ENCRYPTION SETUP
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_secret_min_32_chars");
const ALGORITHM = "HS256";

/**
 * ACTION 1: INITIATE VERIFICATION
 * Now uses LOCAL MongoDB Rate Limiting (No Third Party)
 */
export async function initiateVerification(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 1. 🛑 INTERNAL RATE LIMITING (MongoDB TTL Based)
  const limitOk = await checkRateLimit(ip, "booking_init", 3);
  
  if (!limitOk.success) {
    await logEvent("WARNING", "RATE_LIMIT_EXCEEDED", "Blocking IP via Local DB", { ip });
    throw new Error("Too many attempts. For security, please wait 10 minutes.");
  }

  // 2. 🍯 BOT PROTECTION: Honeypot Check
  const honeypot = formData.get("honeypot_field");
  if (honeypot && (honeypot as string).length > 0) {
    await logEvent("CRITICAL", "BOT_ATTEMPT", "Honeypot field filled", { ip, userAgent });
    throw new Error("Security violation detected.");
  }

  // 3. 🧠 BOT PROTECTION: Math Captcha Check
  const captchaAnswer = Number(formData.get("captcha_answer"));
  const captchaExpected = Number(formData.get("captcha_expected"));
  if (captchaAnswer !== captchaExpected) {
    await logEvent("WARNING", "CAPTCHA_FAIL", "User failed simple math", { ip });
    throw new Error("Security verification failed. Please try again.");
  }

  // 4. 📋 DATA EXTRACTION & VALIDATION
  const rawData = {
    customerName: formData.get("customerName") as string,
    email: (formData.get("email") as string)?.toLowerCase().trim(),
    attractionName: formData.get("attractionName") as string,
    visitDate: formData.get("visitDate") as string,
    timeSlot: formData.get("timeSlot") as string,
    adultTickets: Number(formData.get("adultTickets") || 0),
    childTickets: Number(formData.get("childTickets") || 0),
    seniorTickets: Number(formData.get("seniorTickets") || 0),
    isMalaysian: formData.get("isMalaysian") === "true",
    totalPrice: Number(formData.get("totalPrice") || 0),
  };

  const validation = BookingSchema.safeParse(rawData);
  if (!validation.success) {
    await logEvent("WARNING", "VALIDATION_ERROR", "Data does not match schema", { errors: validation.error.format() });
    throw new Error("Invalid details. Please refresh and try again.");
  }

  const data = validation.data;

  // 5. 💰 ANTI-TAMPER: Server-Side Price Verification
  const verifiedPrice = calculateTotal(
    data.adultTickets, 
    data.childTickets, 
    data.seniorTickets, 
    data.isMalaysian
  );

  if (Math.abs(data.totalPrice - verifiedPrice) > 0.01) {
    await logEvent("CRITICAL", "PRICE_TAMPERING", "Frontend price manipulated", { 
        ip, 
        expected: verifiedPrice, 
        received: data.totalPrice 
    });
    throw new Error("Access Denied: Pricing inconsistency detected.");
  }

  // 6. 🔑 OTP GENERATION & SESSION SEALING
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  const token = await new SignJWT({ ...data, otp })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("10m") 
    .sign(SECRET);

  // 7. 🍪 SET SECURE TEMPORARY COOKIE
  (await cookies()).set("pending_booking", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  // 8. 📧 DISPATCH OTP
  try {
    await sendVerificationCode(data.email, otp);
    await logEvent("INFO", "OTP_SENT", `Verification dispatched to ${data.email}`);
    return { success: true };
  } catch (error) {
    await logEvent("CRITICAL", "MAIL_ERROR", "Internal SMTP failed", { email: data.email });
    throw new Error("Email service temporarily unavailable.");
  }
}

/**
 * ACTION 2: FINALIZE VERIFIED BOOKING
 */
export async function finalizeVerifiedBooking(userOtp: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pending_booking")?.value;

  if (!token) {
    throw new Error("Session expired. Please restart the process.");
  }

  try {
    // 1. 🔓 DECRYPT SESSION
    const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALGORITHM] });
    const data = payload as any;

    // 2. 📋 OTP VERIFICATION
    if (userOtp !== data.otp) {
      await logEvent("WARNING", "OTP_MISMATCH", "Invalid code entered", { email: data.email });
      throw new Error("Invalid verification code.");
    }

    // 3. 🗄️ PERSIST TO MONGODB
    await dbConnect();
    const successRef = generateBookingRef();

    await Booking.create({
      customerName: data.customerName,
      email: data.email,
      attractionName: data.attractionName,
      visitDate: new Date(data.visitDate),
      timeSlot: data.timeSlot,
      isMalaysian: data.isMalaysian,
      tickets: {
        adult: data.adultTickets,
        child: data.childTickets,
        senior: data.seniorTickets,
      },
      totalPrice: data.totalPrice,
      bookingRef: successRef,
      status: "confirmed",
    });

    // 4. 🧹 CLEANUP & SUCCESS GATE
    cookieStore.delete("pending_booking");
    
    // 🛡️ Create a "Short-Lived" Flash Session for the Success Page
    const successToken = await new SignJWT({ ref: successRef })
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime("60s") // 🛡️ Expires in 60 seconds
        .sign(SECRET);

    cookieStore.set("booking_session", successToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60, // 🛡️ Cookie self-destructs in 1 minute
      path: "/",
    });

    // 5. 🎟️ SEND FINAL TICKET
    await sendTicketEmail(data.email, { ...data, bookingRef: successRef });
    await logEvent("INFO", "BOOKING_COMPLETE", `Confirmed: ${successRef}`, { email: data.email });

    return { success: true, ref: successRef };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") throw new Error("Verification session expired.");
    throw new Error(error.message || "A system error occurred.");
  }
}