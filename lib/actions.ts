// // lib/actions.ts
// "use server";

// import { dbConnect } from "./mongodb";
// import Booking from "@/models/Booking";
// import { BookingSchema } from "./validations";
// import { redirect } from "next/navigation";
// import { generateBookingRef } from "./utils"; // Removed calculateTotal from here
// import { headers, cookies } from "next/headers";
// import { sendTicketEmail, sendVerificationCode } from "./mailer";
// import { logEvent } from "./logger";
// import { SignJWT, jwtVerify } from "jose";
// import { checkRateLimit } from "./internalRateLimit"; 

// // 🚀 NEW: Import the Dynamic Pricing Engine
// import { calculateDynamicPrice } from "./pricingEngine";

// // 🛡️ ENCRYPTION SETUP
// const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_secret_min_32_chars");
// const ALGORITHM = "HS256";

// /**
//  * ACTION 1: INITIATE VERIFICATION
//  * Recalculates price dynamically on the server to prevent fraud.
//  */
// export async function initiateVerification(formData: FormData) {
//   const headerList = await headers();
//   const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
//   const userAgent = headerList.get("user-agent") || "unknown";

//   // 1. 🛑 INTERNAL RATE LIMITING (MongoDB TTL Based)
//   const limitOk = await checkRateLimit(ip, "booking_init", 3);
//   if (!limitOk.success) {
//     await logEvent("WARNING", "RATE_LIMIT_EXCEEDED", "Blocking booking attempt", { ip });
//     throw new Error("Too many attempts. Please wait 10 minutes.");
//   }

//   // 2. 🍯 BOT PROTECTION: Honeypot Check
//   const honeypot = formData.get("honeypot_field");
//   if (honeypot && (honeypot as string).length > 0) {
//     await logEvent("CRITICAL", "BOT_ATTEMPT", "Honeypot field triggered", { ip, userAgent });
//     throw new Error("Security violation detected.");
//   }

//   // 3. 🧠 BOT PROTECTION: Math Captcha Check
//   const captchaAnswer = Number(formData.get("captcha_answer"));
//   const captchaExpected = Number(formData.get("captcha_expected"));
//   if (captchaAnswer !== captchaExpected) {
//     await logEvent("WARNING", "CAPTCHA_FAIL", "Math challenge failed", { ip });
//     throw new Error("Verification failed. Please solve the math problem correctly.");
//   }

//   // 4. 📋 DATA EXTRACTION
//   const rawData = {
//     customerName: formData.get("customerName") as string,
//     email: (formData.get("email") as string)?.toLowerCase().trim(),
//     attractionName: formData.get("attractionName") as string,
//     visitDate: formData.get("visitDate") as string,
//     timeSlot: formData.get("timeSlot") as string,
//     adultTickets: Number(formData.get("adultTickets") || 0),
//     childTickets: Number(formData.get("childTickets") || 0),
//     seniorTickets: Number(formData.get("seniorTickets") || 0),
//     isMalaysian: formData.get("isMalaysian") === "true",
//     totalPrice: Number(formData.get("totalPrice") || 0),
//   };

//   // 5. 🛡️ SCHEMA VALIDATION
//   const validation = BookingSchema.safeParse(rawData);
//   if (!validation.success) {
//     await logEvent("WARNING", "VALIDATION_ERROR", "Zod check failed", { errors: validation.error.format() });
//     throw new Error("Invalid booking details.");
//   }

//   const data = validation.data;

//   // 6. 💰 ANTI-TAMPER: Server-Side Dynamic Price Recalculation
//   // We don't trust the price coming from the 'totalPrice' field in the form.
//   const verifiedPrice = await calculateDynamicPrice(
//     { 
//       adult: data.adultTickets, 
//       child: data.childTickets, 
//       senior: data.seniorTickets 
//     },
//     data.isMalaysian,
//     data.visitDate,
//     data.timeSlot
//   );

//   // Compare submitted price with server-calculated price
//   // We use Math.abs with a small tolerance for rounding differences
//   if (Math.abs(data.totalPrice - verifiedPrice) > 0.01) {
//     await logEvent("CRITICAL", "PRICE_TAMPERING", "Frontend price manipulated!", { 
//         ip, 
//         userSubmitted: data.totalPrice, 
//         serverCalculated: verifiedPrice,
//         date: data.visitDate,
//         time: data.timeSlot
//     });
//     throw new Error("Access Denied: Pricing inconsistency detected. Please refresh.");
//   }

//   // 7. 🔑 OTP GENERATION & SESSION SEALING
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
//   const token = await new SignJWT({ ...data, otp, totalPrice: verifiedPrice })
//     .setProtectedHeader({ alg: ALGORITHM })
//     .setIssuedAt()
//     .setExpirationTime("10m") 
//     .sign(SECRET);

//   // 8. 🍪 SET SECURE TEMPORARY COOKIE
//   (await cookies()).set("pending_booking", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 600, // 10 minutes
//     path: "/",
//   });

//   // 9. 📧 DISPATCH OTP
//   try {
//     await sendVerificationCode(data.email, otp);
//     await logEvent("INFO", "OTP_SENT", `Code sent to ${data.email}`);
//     return { success: true };
//   } catch (error) {
//     await logEvent("CRITICAL", "MAIL_ERROR", "Nodemailer SMTP failed", { error });
//     throw new Error("Email service is currently unreachable.");
//   }
// }

// /**
//  * ACTION 2: FINALIZE VERIFIED BOOKING
//  */
// export async function finalizeVerifiedBooking(userOtp: string) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("pending_booking")?.value;

//   if (!token) throw new Error("Session expired. Please start again.");

//   try {
//     // 1. 🔓 DECRYPT SESSION (The payload is already verified by initiateVerification)
//     const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALGORITHM] });
//     const data = payload as any;

//     // 2. 📋 OTP VERIFICATION
//     if (userOtp !== data.otp) {
//       await logEvent("WARNING", "OTP_MISMATCH", "Invalid code entered", { email: data.email });
//       throw new Error("Invalid verification code.");
//     }

//     // 3. 🗄️ PERSIST TO MONGODB
//     await dbConnect();
//     const successRef = generateBookingRef();

//     await Booking.create({
//       customerName: data.customerName,
//       email: data.email,
//       attractionName: data.attractionName,
//       visitDate: new Date(data.visitDate),
//       timeSlot: data.timeSlot,
//       isMalaysian: data.isMalaysian,
//       tickets: {
//         adult: data.adultTickets,
//         child: data.childTickets,
//         senior: data.seniorTickets,
//       },
//       totalPrice: data.totalPrice,
//       bookingRef: successRef,
//       status: "confirmed",
//     });

//     // 4. 🧹 CLEANUP & SUCCESS GATE
//     cookieStore.delete("pending_booking");
    
//     // Create a 60-second flash session so success page is protected
//     const successToken = await new SignJWT({ ref: successRef })
//         .setProtectedHeader({ alg: ALGORITHM })
//         .setIssuedAt()
//         .setExpirationTime("60s")
//         .sign(SECRET);

//     cookieStore.set("booking_session", successToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60,
//       path: "/",
//     });

//     // 5. 🎟️ SEND FINAL TICKET
//     // We don't await this to keep the response snappy for the user
//     sendTicketEmail(data.email, { 
//         customerName: data.customerName,
//         bookingRef: successRef,
//         visitDate: data.visitDate,
//         timeSlot: data.timeSlot,
//         adultTickets: data.adultTickets,
//         totalPrice: data.totalPrice
//     });

//     await logEvent("INFO", "BOOKING_COMPLETE", `Successfully booked: ${successRef}`);

//     return { success: true, ref: successRef };

//   } catch (error: any) {
//     if (error.code === "ERR_JWT_EXPIRED") throw new Error("Session timeout.");
//     throw new Error(error.message || "Finalization failed.");
//   }
// }








"use server";

import { dbConnect } from "./mongodb";
import Booking from "@/models/Booking";
import { BookingSchema } from "./validations";
import { redirect } from "next/navigation";
import { generateBookingRef } from "./utils"; 
import { headers, cookies } from "next/headers";
import { sendTicketEmail, sendVerificationCode, sendCancellationEmail } from "./mailer";
import { logEvent } from "./logger";
import { auth } from "@/auth";
import { SignJWT, jwtVerify } from "jose";
import { checkRateLimit } from "./internalRateLimit"; 
import { calculateDynamicPrice } from "./pricingEngine";

// 🛡️ ENCRYPTION SETUP (Shared for OTP and Cancellation Tokens)
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback_secret_min_32_chars");
const ALGORITHM = "HS256";

/**
 * 🛠️ ACTION 1: INITIATE VERIFICATION
 * Validates inputs, recalculates prices, and dispatches OTP.
 */
export async function initiateVerification(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "unknown";

  const limitOk = await checkRateLimit(ip, "booking_init", 3);
  if (!limitOk.success) {
    await logEvent("WARNING", "RATE_LIMIT_EXCEEDED", "Blocking booking attempt", { ip });
    throw new Error("Too many attempts. Please wait 10 minutes.");
  }

  const honeypot = formData.get("honeypot_field");
  if (honeypot && (honeypot as string).length > 0) {
    await logEvent("CRITICAL", "BOT_ATTEMPT", "Honeypot field triggered", { ip, userAgent });
    throw new Error("Security violation detected.");
  }

  const captchaAnswer = Number(formData.get("captcha_answer"));
  const captchaExpected = Number(formData.get("captcha_expected"));
  if (captchaAnswer !== captchaExpected) {
    await logEvent("WARNING", "CAPTCHA_FAIL", "Math challenge failed", { ip });
    throw new Error("Verification failed. Please solve the math problem correctly.");
  }

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
    await logEvent("WARNING", "VALIDATION_ERROR", "Zod check failed", { errors: validation.error.format() });
    throw new Error("Invalid booking details.");
  }

  const data = validation.data;

  const verifiedPrice = await calculateDynamicPrice(
    { adult: data.adultTickets, child: data.childTickets, senior: data.seniorTickets },
    data.isMalaysian,
    data.visitDate,
    data.timeSlot
  );

  if (Math.abs(data.totalPrice - verifiedPrice) > 0.01) {
    await logEvent("CRITICAL", "PRICE_TAMPERING", "Frontend price manipulated!", { 
        ip, 
        userSubmitted: data.totalPrice, 
        serverCalculated: verifiedPrice
    });
    throw new Error("Access Denied: Pricing inconsistency detected.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  const token = await new SignJWT({ ...data, otp, totalPrice: verifiedPrice })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("10m") 
    .sign(SECRET);

  (await cookies()).set("pending_booking", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 600,
    path: "/",
  });

  try {
    await sendVerificationCode(data.email, otp);
    await logEvent("INFO", "OTP_SENT", `Code sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    await logEvent("CRITICAL", "MAIL_ERROR", "Nodemailer SMTP failed", { error });
    throw new Error("Email service is currently unreachable.");
  }
}

/**
 * 🛠️ ACTION 2: FINALIZE VERIFIED BOOKING
 * Confirms OTP and persists record to MongoDB.
 */
export async function finalizeVerifiedBooking(userOtp: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("pending_booking")?.value;

  if (!token) throw new Error("Session expired. Please start again.");

  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALGORITHM] });
    const data = payload as any;

    if (userOtp !== data.otp) {
      await logEvent("WARNING", "OTP_MISMATCH", "Invalid code entered", { email: data.email });
      throw new Error("Invalid verification code.");
    }

    await dbConnect();
    const successRef = generateBookingRef();

    const newBooking = await Booking.create({
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

    cookieStore.delete("pending_booking");
    
    const successToken = await new SignJWT({ ref: successRef })
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime("60s")
        .sign(SECRET);

    cookieStore.set("booking_session", successToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60,
      path: "/",
    });

    // 📧 Trigger Ticket Email (Includes cancellation link)
    sendTicketEmail(data.email, newBooking);

    await logEvent("INFO", "BOOKING_COMPLETE", `Successfully booked: ${successRef}`);
    return { success: true, ref: successRef };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") throw new Error("Session timeout.");
    throw new Error(error.message || "Finalization failed.");
  }
}

/**
 * 🛠️ ACTION 3: USER SELF-SERVICE CANCELLATION
 * Checks the 5-hour grace period rule.
 */
export async function userCancelBooking(token: string) {
  try {
    // 1. 🔓 Decrypt the cancellation token
    const { payload } = await jwtVerify(token, SECRET, { algorithms: [ALGORITHM] });
    const { bookingId } = payload as { bookingId: string };

    await dbConnect();
    const booking = await Booking.findById(bookingId);

    if (!booking) return { success: false, error: "Booking record not found." };
    if (booking.status === "cancelled") return { success: false, error: "This booking is already cancelled." };

    // 2. 🕒 THE 5-HOUR GRACE PERIOD RULE
    const now = new Date();
    const bookingCreatedAt = new Date(booking.createdAt);
    const hoursSinceBooking = (now.getTime() - bookingCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceBooking > 5) {
      await logEvent("INFO", "CANCEL_DENIED", `Attempted late cancellation for: ${booking.bookingRef}`);
      return { 
        success: false, 
        error: "The 5-hour cancellation window has passed. Please contact support for manual assistance." 
      };
    }

    // 3. 🚫 Update Status & Notify
    booking.status = "cancelled";
    await booking.save();

    // 📧 Send Cancellation Confirmation Email
    await sendCancellationEmail(booking.email, {
      customerName: booking.customerName,
      bookingRef: booking.bookingRef
    });

    await logEvent("CRITICAL", "USER_CANCELLED", `User initiated cancellation for: ${booking.bookingRef}`);

    return { success: true };

  } catch (error: any) {
    console.error("Cancellation Error:", error);
    return { success: false, error: "Security validation failed. Link may be expired." };
  }
}

/**
 * 🛠️ ACTION 4: ADMIN CANCELLATION (Force)
 */
export async function adminCancelBooking(bookingId: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized access.");
  }

  await dbConnect();
  const booking = await Booking.findByIdAndUpdate(bookingId, { 
    status: "cancelled" 
  }, { new: true });

  if (booking) {
    await sendCancellationEmail(booking.email, {
      customerName: booking.customerName,
      bookingRef: booking.bookingRef
    });
    await logEvent("WARNING", "ADMIN_CANCEL", `Admin ${session.user?.email} cancelled booking ${booking.bookingRef}`);
  }

  return { success: true };
}