// // lib/mailer.ts
// import nodemailer from "nodemailer";
// import { logEvent } from "./logger";
// import { dbConnect } from "./mongodb";
// import EmailQueue from "@/models/EmailQueue";

// /**
//  * 🛡️ XSS PREVENTION UTILITY
//  * Sanitizes user input to prevent "Email Injection" attacks.
//  */
// const escapeHTML = (str: string | undefined | null): string => {
//   if (!str) return "";
//   return str.replace(/[&<>"']/g, (m) => ({
//     '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
//   }[m] || m));
// };

// /**
//  * 🔌 CONFIGURE NODEMAILER TRANSPORTER
//  * 🚀 EXPORTED: This allows the Cron job (/api/cron/retry-emails) to reuse the connection.
//  */
// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS, 
//   },
// });

// /**
//  * 🛠️ INTERNAL HELPER: executeMailWithQueue
//  * The core logic that attempts to send an email. If it fails, 
//  * it saves the email to the MongoDB queue for the Cron job to retry.
//  */
// async function executeMailWithQueue(options: {
//   to: string;
//   subject: string;
//   html: string;
//   actionName: string;
//   bookingRef?: string;
// }) {
//   const { to, subject, html, actionName, bookingRef } = options;

//   try {
//     const info = await transporter.sendMail({
//       from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     await logEvent("INFO", `${actionName}_SUCCESS`, `Mail delivered to ${to}`, { 
//       messageId: info.messageId, 
//       bookingRef 
//     });
//     return { success: true, status: "sent" };

//   } catch (error: any) {
//     // 🚀 FAIL-SAFE: If SMTP fails, move to MongoDB Queue
//     try {
//       await dbConnect();
//       await EmailQueue.create({
//         to,
//         subject,
//         html,
//         attempts: 1,
//         status: 'pending',
//         lastError: error.message
//       });

//       await logEvent("WARNING", `${actionName}_QUEUED`, `SMTP Failure. Email to ${to} added to retry queue.`, { 
//         error: error.message,
//         bookingRef 
//       });

//       return { success: true, status: "queued" }; 
//     } catch (dbError: any) {
//       // If even the database fails, log to console as a last resort
//       console.error("FATAL MAIL ERROR: Could not send or queue email", dbError);
//       await logEvent("CRITICAL", "MAIL_SYSTEM_FATAL", "Failed to even queue the email.", { error: dbError.message });
//       return { success: false, status: "failed" };
//     }
//   }
// }

// /**
//  * 📧 1. SEND VERIFICATION CODE (OTP)
//  */
// export async function sendVerificationCode(to: string, code: string) {
//   const htmlContent = `
//     <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
//       <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #0891b2;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; font-size: 20px; text-transform: uppercase;">PETRONAS</h1>
//       </div>
//       <div style="padding: 40px; background-color: #ffffff; text-align: center;">
//         <h2 style="color: #0f172a;">Verify Your Identity</h2>
//         <p>Enter the code below to confirm your booking request.</p>
//         <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #0891b2;">
//           ${code}
//         </div>
//         <p style="font-size: 12px; color: #64748b;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
//       </div>
//     </div>
//   `;

//   return await executeMailWithQueue({
//     to,
//     subject: `[VERIFICATION] Your Security Code: ${code}`,
//     html: htmlContent,
//     actionName: "OTP_DISPATCH"
//   });
// }

// /**
//  * 🎟️ 2. SEND FINAL ADMISSION TICKET
//  */
// export async function sendTicketEmail(to: string, bookingDetails: any) {
//   const { customerName, bookingRef, visitDate, timeSlot, totalPrice = 0 } = bookingDetails;
  
//   // 🛡️ Escape inputs to prevent Email XSS
//   const safeName = escapeHTML(customerName);
//   const safeRef = escapeHTML(bookingRef);

//   const formattedDate = new Date(visitDate).toLocaleDateString('en-MY', { 
//     weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
//   });

//   const htmlContent = `
//     <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
//       <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #0891b2;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 8px; font-size: 24px; text-transform: uppercase;">PETRONAS</h1>
//         <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-top: 5px;">Admission Authorized</p>
//       </div>
//       <div style="padding: 40px; background-color: #ffffff;">
//         <p style="font-size: 18px; font-weight: bold; color: #0f172a;">Greetings ${safeName},</p>
//         <p style="color: #475569;">Your sky-high journey is confirmed. Please find your ticket details below.</p>
        
//         <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
//            <table style="width: 100%; border-collapse: collapse;">
//              <tr>
//                <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">REFERENCE</td>
//                <td style="text-align: right; font-weight: bold; font-family: monospace;">${safeRef}</td>
//              </tr>
//              <tr>
//                <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">DATE</td>
//                <td style="text-align: right; font-weight: 600;">${formattedDate}</td>
//              </tr>
//              <tr>
//                <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">TIME SLOT</td>
//                <td style="text-align: right; font-weight: 600;">${timeSlot}</td>
//              </tr>
//              <tr>
//                <td style="font-weight: bold; padding-top: 15px; border-top: 1px solid #e2e8f0;">TOTAL PAID</td>
//                <td style="text-align: right; font-weight: bold; color: #0891b2; padding-top: 15px; border-top: 1px solid #e2e8f0;">RM ${totalPrice.toFixed(2)}</td>
//              </tr>
//            </table>
//         </div>

//         <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px;">
//           <p style="margin: 0; font-size: 12px; color: #92400e;">
//             <strong>Check-in Requirement:</strong> Please arrive at the Concierge (Lower Ground Floor) 15 minutes before your slot. Present this email and a valid ID/Passport.
//           </p>
//         </div>
//       </div>
//       <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 10px; color: #94a3b8;">
//         Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia
//       </div>
//     </div>
//   `;

//   return await executeMailWithQueue({
//     to,
//     subject: `CONFIRMED: Your Admission Ticket [${safeRef}]`,
//     html: htmlContent,
//     actionName: "TICKET_DELIVERY",
//     bookingRef: safeRef
//   });
// }

// /**
//  * 🚫 3. SEND CANCELLATION NOTICE
//  */
// export async function sendCancellationEmail(to: string, details: { customerName: string; bookingRef: string }) {
//   const safeName = escapeHTML(details.customerName);
//   const safeRef = escapeHTML(details.bookingRef);

//   const htmlContent = `
//     <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #fee2e2; border-radius: 16px; overflow: hidden;">
//       <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #ef4444;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; text-transform: uppercase;">PETRONAS</h1>
//         <p style="color: #ef4444; font-size: 10px; text-transform: uppercase; margin-top: 5px;">Booking Revoked</p>
//       </div>
//       <div style="padding: 40px; background-color: #ffffff; text-align: center;">
//         <h2 style="color: #991b1b;">Reservation Voided</h2>
//         <p style="color: #475569;">This email confirms that the booking reference <strong>${safeRef}</strong> for ${safeName} has been cancelled.</p>
//         <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you believe this was a mistake, please contact our support team immediately.</p>
//       </div>
//     </div>
//   `;

//   return await executeMailWithQueue({
//     to,
//     subject: `CANCELLATION: Booking Reference ${safeRef}`,
//     html: htmlContent,
//     actionName: "CANCELLATION_NOTICE",
//     bookingRef: safeRef
//   });
// }






// lib/mailer.ts
import nodemailer from "nodemailer";
import { logEvent } from "./logger";
import { dbConnect } from "./mongodb";
import EmailQueue from "@/models/EmailQueue";
import { encrypt } from "./session"; // 🚀 Added to secure the cancellation link

/**
 * 🛡️ XSS PREVENTION UTILITY
 * Sanitizes user input to prevent "Email Injection" attacks.
 */
const escapeHTML = (str: string | undefined | null): string => {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m] || m));
};

/**
 * 🔌 CONFIGURE NODEMAILER TRANSPORTER
 */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, 
  },
});

/**
 * 🛠️ INTERNAL HELPER: executeMailWithQueue
 */
async function executeMailWithQueue(options: {
  to: string;
  subject: string;
  html: string;
  actionName: string;
  bookingRef?: string;
}) {
  const { to, subject, html, actionName, bookingRef } = options;

  try {
    const info = await transporter.sendMail({
      from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    await logEvent("INFO", `${actionName}_SUCCESS`, `Mail delivered to ${to}`, { 
      messageId: info.messageId, 
      bookingRef 
    });
    return { success: true, status: "sent" };

  } catch (error: any) {
    try {
      await dbConnect();
      await EmailQueue.create({
        to,
        subject,
        html,
        attempts: 1,
        status: 'pending',
        lastError: error.message
      });

      await logEvent("WARNING", `${actionName}_QUEUED`, `SMTP Failure. Email to ${to} added to retry queue.`, { 
        error: error.message,
        bookingRef 
      });

      return { success: true, status: "queued" }; 
    } catch (dbError: any) {
      console.error("FATAL MAIL ERROR:", dbError);
      return { success: false, status: "failed" };
    }
  }
}

/**
 * 📧 1. SEND VERIFICATION CODE (OTP)
 */
export async function sendVerificationCode(to: string, code: string) {
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
      <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #0891b2;">
        <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; font-size: 20px; text-transform: uppercase;">PETRONAS</h1>
      </div>
      <div style="padding: 40px; background-color: #ffffff; text-align: center;">
        <h2 style="color: #0f172a;">Verify Your Identity</h2>
        <p>Enter the code below to confirm your booking request.</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #0891b2;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #64748b;">This code is valid for 10 minutes.</p>
      </div>
    </div>
  `;

  return await executeMailWithQueue({
    to,
    subject: `[VERIFICATION] Your Security Code: ${code}`,
    html: htmlContent,
    actionName: "OTP_DISPATCH"
  });
}

/**
 * 🎟️ 2. SEND FINAL ADMISSION TICKET (Updated with Cancellation Link)
 */
export async function sendTicketEmail(to: string, bookingDetails: any) {
  const { customerName, bookingRef, visitDate, timeSlot, totalPrice = 0, _id } = bookingDetails;
  
  // 🛡️ 1. Generate Secure Cancellation Token (Valid for the 5-hour grace period)
  const cancelToken = await encrypt({ bookingId: _id.toString() });
  const cancelLink = `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel/${cancelToken}`;

  const safeName = escapeHTML(customerName);
  const safeRef = escapeHTML(bookingRef);

  const formattedDate = new Date(visitDate).toLocaleDateString('en-MY', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #0891b2;">
        <h1 style="color: #ffffff; margin: 0; letter-spacing: 8px; font-size: 24px; text-transform: uppercase;">PETRONAS</h1>
        <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; margin-top: 5px;">Admission Authorized</p>
      </div>
      <div style="padding: 40px; background-color: #ffffff;">
        <p style="font-size: 18px; font-weight: bold; color: #0f172a;">Greetings ${safeName},</p>
        <p style="color: #475569;">Your sky-high journey is confirmed. Please find your ticket details below.</p>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
           <table style="width: 100%; border-collapse: collapse;">
             <tr>
               <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">REFERENCE</td>
               <td style="text-align: right; font-weight: bold; font-family: monospace;">${safeRef}</td>
             </tr>
             <tr>
               <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">DATE</td>
               <td style="text-align: right; font-weight: 600;">${formattedDate}</td>
             </tr>
             <tr>
               <td style="color: #94a3b8; font-size: 11px; padding: 5px 0;">TIME SLOT</td>
               <td style="text-align: right; font-weight: 600;">${timeSlot}</td>
             </tr>
             <tr>
               <td style="font-weight: bold; padding-top: 15px; border-top: 1px solid #e2e8f0;">TOTAL PAID</td>
               <td style="text-align: right; font-weight: bold; color: #0891b2; padding-top: 15px; border-top: 1px solid #e2e8f0;">RM ${totalPrice.toFixed(2)}</td>
             </tr>
           </table>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 0; font-size: 12px; color: #92400e;">
            <strong>Check-in:</strong> Please arrive at the Concierge 15 mins before your slot with a valid ID/Passport.
          </p>
        </div>

        <!-- 🚀 NEW: CANCELLATION SECTION -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 25px; text-align: center;">
          <p style="font-size: 11px; color: #94a3b8; margin-bottom: 15px;">
            Need to change plans? You can cancel this booking within 5 hours for a full refund.
          </p>
          <a href="${cancelLink}" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; border: 1px solid #ef4444; color: #ef4444; text-decoration: none; font-size: 11px; font-weight: bold; border-radius: 6px; text-transform: uppercase;">
            Cancel Reservation
          </a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 10px; color: #94a3b8;">
        Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia
      </div>
    </div>
  `;

  return await executeMailWithQueue({
    to,
    subject: `CONFIRMED: Your Admission Ticket [${safeRef}]`,
    html: htmlContent,
    actionName: "TICKET_DELIVERY",
    bookingRef: safeRef
  });
}

/**
 * 🚫 3. SEND CANCELLATION NOTICE
 */
export async function sendCancellationEmail(to: string, details: { customerName: string; bookingRef: string }) {
  const safeName = escapeHTML(details.customerName);
  const safeRef = escapeHTML(details.bookingRef);

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #fee2e2; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0a0a0a; padding: 40px; text-align: center; border-bottom: 4px solid #ef4444;">
        <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; text-transform: uppercase;">PETRONAS</h1>
        <p style="color: #ef4444; font-size: 10px; text-transform: uppercase; margin-top: 5px;">Booking Revoked</p>
      </div>
      <div style="padding: 40px; background-color: #ffffff; text-align: center;">
        <h2 style="color: #991b1b;">Reservation Voided</h2>
        <p style="color: #475569;">The booking reference <strong>${safeRef}</strong> for ${safeName} has been cancelled.</p>
        <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you believe this was a mistake, please contact our support team.</p>
      </div>
    </div>
  `;

  return await executeMailWithQueue({
    to,
    subject: `CANCELLATION: Booking Reference ${safeRef}`,
    html: htmlContent,
    actionName: "CANCELLATION_NOTICE",
    bookingRef: safeRef
  });
}