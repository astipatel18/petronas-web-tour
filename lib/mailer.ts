// // lib/mailer.ts
// import nodemailer from "nodemailer";
// import { logEvent } from "./logger";

// /**
//  * 🛡️ XSS PREVENTION UTILITY
//  * Sanitizes user input by converting reserved HTML characters 
//  * into safe entities. This prevents "Email Injection" where a user
//  * could try to run scripts or break the email layout.
//  */
// const escapeHTML = (str: string | undefined | null): string => {
//   if (!str) return "";
//   return str.replace(/[&<>"']/g, (m) => ({
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;'
//   }[m] || m));
// };

// // 🔌 CONFIGURE NODEMAILER TRANSPORTER
// // Optimized for Gmail SMTP with high-security App Passwords
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS, // 16-digit App Password from Google
//   },
// });

// /**
//  * 📧 1. SEND VERIFICATION CODE (OTP)
//  * Triggered in Step 5. 
//  * High-priority security email to verify user ownership of the address.
//  */
// export async function sendVerificationCode(to: string, code: string) {
//   const htmlContent = `
//     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
//       <!-- BRAND HEADER -->
//       <div style="background-color: #0a0a0a; padding: 40px 20px; text-align: center; border-bottom: 4px solid #0891b2;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; font-size: 22px; text-transform: uppercase; font-weight: 900;">PETRONAS</h1>
//         <p style="color: #64748b; margin: 6px 0 0 0; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">Digital Access Protocol</p>
//       </div>

//       <div style="padding: 50px 40px; background-color: #ffffff; text-align: center;">
//         <h2 style="color: #0f172a; margin-bottom: 15px; font-size: 24px; font-weight: 800;">Verify Your Identity</h2>
//         <p style="color: #64748b; line-height: 1.6; font-size: 15px;">Please utilize the security code below to authorize your booking request.</p>
        
//         <!-- ENHANCED CODE BOX -->
//         <div style="margin: 40px 0; padding: 30px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; display: inline-block; width: 80%;">
//           <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; letter-spacing: 15px; color: #0891b2; display: block;">
//             ${code}
//           </span>
//         </div>

//         <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
//           <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.5;">
//             <strong>Expiry Notice:</strong> This code is valid for <strong>10 minutes</strong>. <br>
//             For your security, do not share this code with anyone.
//           </p>
//         </div>
//       </div>

//       <div style="background-color: #0a0a0a; padding: 25px; text-align: center; font-size: 10px; color: #475569; letter-spacing: 1px;">
//         CONFIDENTIAL • PETRONAS TWIN TOWERS SECURITY DEPT
//       </div>
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: `"Petronas Security" <${process.env.MAIL_USER}>`,
//       to,
//       subject: `[ACTION REQUIRED] Security Code: ${code}`,
//       html: htmlContent,
//     });

//     await logEvent("INFO", "SECURITY_OTP_DISPATCHED", `Verification code transmitted to ${to}`);
//     return { success: true };
//   } catch (error: any) {
//     await logEvent("CRITICAL", "SECURITY_MAIL_ERROR", `Failed to transmit OTP to ${to}`, { error: error.message });
//     return { success: false };
//   }
// }

// /**
//  * 🎟️ 2. SEND FINAL ADMISSION TICKET
//  * Triggered in Step 6 after DB success.
//  * This is the legal "Proof of Purchase" and visitor pass.
//  */
// export async function sendTicketEmail(to: string, bookingDetails: any) {
//   const { 
//     customerName, 
//     bookingRef, 
//     visitDate, 
//     timeSlot, 
//     adultTickets = 0, 
//     childTickets = 0, 
//     seniorTickets = 0, 
//     totalPrice = 0 
//   } = bookingDetails;

//   const safeName = escapeHTML(customerName);
//   const safeRef = escapeHTML(bookingRef);
//   const safeSlot = escapeHTML(timeSlot);

//   const formattedDate = new Date(visitDate).toLocaleDateString('en-MY', { 
//     weekday: 'long',
//     day: 'numeric', 
//     month: 'long', 
//     year: 'numeric' 
//   });

//   const htmlContent = `
//     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      
//       <div style="background-color: #0a0a0a; padding: 50px 20px; text-align: center; border-bottom: 4px solid #0891b2;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 8px; font-size: 28px; text-transform: uppercase; font-weight: 900;">PETRONAS</h1>
//         <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; font-weight: bold;">Experience Confirmed</p>
//       </div>
      
//       <div style="padding: 45px 35px; background-color: #ffffff;">
//         <p style="font-size: 20px; color: #0f172a; margin-bottom: 12px; font-weight: 700;">Greetings ${safeName},</p>
//         <p style="color: #64748b; line-height: 1.7; font-size: 16px;">Your admission to the world's tallest twin towers is officially authorized. Please retain this digital pass for your visit.</p>
        
//         <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 35px; margin: 35px 0;">
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr>
//               <td style="padding-bottom: 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">Reference Number</td>
//               <td style="padding-bottom: 20px; text-align: right; color: #0891b2; font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 900;">${safeRef}</td>
//             </tr>
//             <tr>
//               <td style="padding: 15px 0; border-top: 1px solid #edf2f7; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Admission Date</td>
//               <td style="padding: 15px 0; border-top: 1px solid #edf2f7; text-align: right; color: #1e293b; font-weight: 700; font-size: 16px;">${formattedDate}</td>
//             </tr>
//             <tr>
//               <td style="padding: 15px 0; border-top: 1px solid #edf2f7; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Entry Window</td>
//               <td style="padding: 15px 0; border-top: 1px solid #edf2f7; text-align: right; color: #1e293b; font-weight: 700; font-size: 16px;">${safeSlot}</td>
//             </tr>
//             <tr>
//               <td style="padding-top: 30px; border-top: 2px solid #0891b2; color: #0f172a; font-size: 14px; text-transform: uppercase; font-weight: 900;">Total Transaction</td>
//               <td style="padding-top: 30px; border-top: 2px solid #0891b2; text-align: right; color: #0891b2; font-size: 30px; font-weight: 900;">RM ${totalPrice.toFixed(2)}</td>
//             </tr>
//           </table>
//         </div>

//         <div style="background-color: #f8fafc; border-left: 4px solid #0891b2; padding: 25px; border-radius: 8px;">
//           <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Mandatory Visit Protocol:</h4>
//           <ul style="margin: 0; padding-left: 18px; color: #64748b; font-size: 13px; line-height: 1.6;">
//             <li>Arrive at the Concourse Level (LG) exactly 15 minutes prior to entry.</li>
//             <li>Original MyKad (Malaysians) or Passport (Foreigners) required for all visitors.</li>
//           </ul>
//         </div>
//       </div>

//       <div style="background-color: #0a0a0a; padding: 40px; text-align: center; font-size: 11px; color: #64748b; letter-spacing: 1.5px; line-height: 2;">
//         <strong style="color: #ffffff;">PETRONAS TWIN TOWERS VISIT OPERATIONS</strong><br>
//         Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia
//       </div>
//     </div>
//   `;

//   try {
//     const info = await transporter.sendMail({
//       from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`, 
//       to, 
//       subject: `SUCCESS: Your Admission Ticket [${safeRef}]`,
//       html: htmlContent,
//     });

//     await logEvent("INFO", "TICKET_DELIVERED", `Final ticket emailed to ${to}`, { bookingRef: safeRef, messageId: info.messageId });
//     return { success: true };
//   } catch (error: any) {
//     await logEvent("CRITICAL", "TICKET_DELIVERY_FAILURE", `Fatal error sending ticket to ${to}`, { error: error.message, bookingRef: safeRef });
//     return { success: false };
//   }
// }

// /**
//  * 🚫 3. SEND CANCELLATION NOTICE
//  * Triggered by Admin Action.
//  * Notifies the user that their specific booking has been voided.
//  */
// export async function sendCancellationEmail(to: string, details: { customerName: string; bookingRef: string }) {
//   const safeName = escapeHTML(details.customerName);
//   const safeRef = escapeHTML(details.bookingRef);

//   const htmlContent = `
//     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #fee2e2; border-radius: 16px; overflow: hidden; color: #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      
//       <!-- ALERT HEADER -->
//       <div style="background-color: #0a0a0a; padding: 50px 20px; text-align: center; border-bottom: 4px solid #ef4444;">
//         <h1 style="color: #ffffff; margin: 0; letter-spacing: 8px; font-size: 28px; text-transform: uppercase; font-weight: 900;">PETRONAS</h1>
//         <p style="color: #ef4444; margin: 10px 0 0 0; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; font-weight: bold;">Booking Revoked</p>
//       </div>
      
//       <div style="padding: 45px 35px; background-color: #ffffff;">
//         <p style="font-size: 20px; color: #0f172a; margin-bottom: 12px; font-weight: 700;">Attention ${safeName},</p>
//         <p style="color: #64748b; line-height: 1.7; font-size: 16px;">We are writing to formally notify you that your reservation for the Petronas Twin Towers has been <strong>cancelled</strong> and is no longer valid for entry.</p>
        
//         <!-- STATUS CARD -->
//         <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 16px; padding: 35px; margin: 35px 0; text-align: center;">
//           <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">Reference Number</p>
//           <p style="margin: 0 0 20px 0; color: #ef4444; font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 900; text-decoration: line-through;">${safeRef}</p>
//           <div style="display: inline-block; background: #ef4444; color: #ffffff; padding: 6px 15px; border-radius: 4px; font-size: 10px; font-weight: 900; uppercase; letter-spacing: 1px;">
//             VOIDED & INVALID
//           </div>
//         </div>

//         <div style="background-color: #f8fafc; border-left: 4px solid #64748b; padding: 25px; border-radius: 8px;">
//           <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Administrative Note:</h4>
//           <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
//             If this cancellation was unexpected, please contact our visitor support desk immediately. If a refund was processed, it may take 5 to 10 business days to appear on your statement depending on your banking institution.
//           </p>
//         </div>
//       </div>

//       <div style="background-color: #0a0a0a; padding: 40px; text-align: center; font-size: 11px; color: #64748b; letter-spacing: 1.5px; line-height: 2;">
//         <strong style="color: #ffffff;">PETRONAS TWIN TOWERS VISIT OPERATIONS</strong><br>
//         Security & Administrative Division<br>
//         <span style="color: #ef4444;">support.tours@petronas.com.my</span>
//       </div>
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`, 
//       to, 
//       subject: `URGENT: Booking Cancellation [${safeRef}]`,
//       html: htmlContent,
//     });

//     await logEvent("WARNING", "CANCELLATION_EMAIL_SENT", `Void notice dispatched to ${to}`, { bookingRef: safeRef });
//     return { success: true };
//   } catch (error: any) {
//     await logEvent("CRITICAL", "CANCELLATION_MAIL_FAILURE", `Failed to notify ${to} of cancellation`, { error: error.message, bookingRef: safeRef });
//     return { success: false };
//   }
// }








// lib/mailer.ts
import nodemailer from "nodemailer";
import { logEvent } from "./logger";
import { dbConnect } from "./mongodb";
import EmailQueue from "@/models/EmailQueue";

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
 * 🚀 EXPORTED: This allows the Cron job (/api/cron/retry-emails) to reuse the connection.
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
 * The core logic that attempts to send an email. If it fails, 
 * it saves the email to the MongoDB queue for the Cron job to retry.
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
    // 🚀 FAIL-SAFE: If SMTP fails, move to MongoDB Queue
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
      // If even the database fails, log to console as a last resort
      console.error("FATAL MAIL ERROR: Could not send or queue email", dbError);
      await logEvent("CRITICAL", "MAIL_SYSTEM_FATAL", "Failed to even queue the email.", { error: dbError.message });
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
        <p style="font-size: 12px; color: #64748b;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
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
 * 🎟️ 2. SEND FINAL ADMISSION TICKET
 */
export async function sendTicketEmail(to: string, bookingDetails: any) {
  const { customerName, bookingRef, visitDate, timeSlot, totalPrice = 0 } = bookingDetails;
  
  // 🛡️ Escape inputs to prevent Email XSS
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

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; font-size: 12px; color: #92400e;">
            <strong>Check-in Requirement:</strong> Please arrive at the Concierge (Lower Ground Floor) 15 minutes before your slot. Present this email and a valid ID/Passport.
          </p>
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
        <p style="color: #475569;">This email confirms that the booking reference <strong>${safeRef}</strong> for ${safeName} has been cancelled.</p>
        <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you believe this was a mistake, please contact our support team immediately.</p>
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