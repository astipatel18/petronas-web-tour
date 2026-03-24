// lib/mailer.ts
import nodemailer from "nodemailer";
import { logEvent } from "./logger";

/**
 * 🛡️ XSS PREVENTION UTILITY
 * Sanitizes user input by converting reserved HTML characters 
 * into safe entities. This prevents "Email Injection" where a user
 * could try to run scripts or break the email layout.
 */
const escapeHTML = (str: string | undefined | null): string => {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m] || m));
};

// 🔌 CONFIGURE NODEMAILER TRANSPORTER
// Optimized for Gmail SMTP with high-security App Passwords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // 16-digit App Password from Google
  },
});

/**
 * 📧 1. SEND VERIFICATION CODE (OTP)
 * Triggered in Step 5. 
 * High-priority security email to verify user ownership of the address.
 */
export async function sendVerificationCode(to: string, code: string) {
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- BRAND HEADER -->
      <div style="background-color: #0a0a0a; padding: 40px 20px; text-align: center; border-bottom: 4px solid #0891b2;">
        <h1 style="color: #ffffff; margin: 0; letter-spacing: 5px; font-size: 22px; text-transform: uppercase; font-weight: 900;">PETRONAS</h1>
        <p style="color: #64748b; margin: 6px 0 0 0; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">Digital Access Protocol</p>
      </div>

      <div style="padding: 50px 40px; background-color: #ffffff; text-align: center;">
        <h2 style="color: #0f172a; margin-bottom: 15px; font-size: 24px; font-weight: 800;">Verify Your Identity</h2>
        <p style="color: #64748b; line-height: 1.6; font-size: 15px;">Please utilize the security code below to authorize your booking request.</p>
        
        <!-- ENHANCED CODE BOX -->
        <div style="margin: 40px 0; padding: 30px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; display: inline-block; width: 80%;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; letter-spacing: 15px; color: #0891b2; display: block;">
            ${code}
          </span>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.5;">
            <strong>Expiry Notice:</strong> This code is valid for <strong>10 minutes</strong>. <br>
            For your security, do not share this code with anyone.
          </p>
        </div>
      </div>

      <div style="background-color: #0a0a0a; padding: 25px; text-align: center; font-size: 10px; color: #475569; letter-spacing: 1px;">
        CONFIDENTIAL • PETRONAS TWIN TOWERS SECURITY DEPT
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Petronas Security" <${process.env.MAIL_USER}>`,
      to,
      subject: `[ACTION REQUIRED] Security Code: ${code}`,
      html: htmlContent,
    });

    // 🛡️ Log the event for Admin monitoring
    await logEvent("INFO", "SECURITY_OTP_DISPATCHED", `Verification code transmitted to ${to}`);
    return { success: true };
  } catch (error: any) {
    await logEvent("CRITICAL", "SECURITY_MAIL_ERROR", `Failed to transmit OTP to ${to}`, { error: error.message });
    return { success: false };
  }
}

/**
 * 🎟️ 2. SEND FINAL ADMISSION TICKET
 * Triggered in Step 6 after DB success.
 * This is the legal "Proof of Purchase" and visitor pass.
 */
export async function sendTicketEmail(to: string, bookingDetails: any) {
  const { 
    customerName, 
    bookingRef, 
    visitDate, 
    timeSlot, 
    adultTickets = 0, 
    childTickets = 0, 
    seniorTickets = 0, 
    totalPrice = 0 
  } = bookingDetails;

  // 🛡️ ESCAPE ALL DYNAMIC USER DATA
  const safeName = escapeHTML(customerName);
  const safeRef = escapeHTML(bookingRef);
  const safeSlot = escapeHTML(timeSlot);

  const formattedDate = new Date(visitDate).toLocaleDateString('en-MY', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      
      <!-- HERO HEADER -->
      <div style="background-color: #0a0a0a; padding: 50px 20px; text-align: center; border-bottom: 4px solid #0891b2;">
        <h1 style="color: #ffffff; margin: 0; letter-spacing: 8px; font-size: 28px; text-transform: uppercase; font-weight: 900;">PETRONAS</h1>
        <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 11px; letter-spacing: 5px; text-transform: uppercase; font-weight: bold;">Experience Confirmed</p>
      </div>
      
      <div style="padding: 45px 35px; background-color: #ffffff;">
        <p style="font-size: 20px; color: #0f172a; margin-bottom: 12px; font-weight: 700;">Greetings ${safeName},</p>
        <p style="color: #64748b; line-height: 1.7; font-size: 16px;">Your admission to the world's tallest twin towers is officially authorized. Please retain this digital pass for your visit.</p>
        
        <!-- TICKET SUMMARY CARD -->
        <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 35px; margin: 35px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 20px; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">Reference Number</td>
              <td style="padding-bottom: 20px; text-align: right; color: #0891b2; font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 900;">${safeRef}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Admission Date</td>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; text-align: right; color: #1e293b; font-weight: 700; font-size: 16px;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Entry Window</td>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; text-align: right; color: #1e293b; font-weight: 700; font-size: 16px;">${safeSlot}</td>
            </tr>
             <tr>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Ticket Tier</td>
              <td style="padding: 15px 0; border-top: 1px solid #edf2f7; text-align: right; color: #1e293b; font-weight: 700; font-size: 14px;">
                ${adultTickets > 0 ? `<span style="display:inline-block; background:#e2e8f0; color:#475569; padding:4px 10px; border-radius:6px; margin-left:6px; font-size:11px;">Adult x${adultTickets}</span>` : ''}
                ${childTickets > 0 ? `<span style="display:inline-block; background:#e2e8f0; color:#475569; padding:4px 10px; border-radius:6px; margin-left:6px; font-size:11px;">Child x${childTickets}</span>` : ''}
                ${seniorTickets > 0 ? `<span style="display:inline-block; background:#e2e8f0; color:#475569; padding:4px 10px; border-radius:6px; margin-left:6px; font-size:11px;">Senior x${seniorTickets}</span>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding-top: 30px; border-top: 2px solid #0891b2; color: #0f172a; font-size: 14px; text-transform: uppercase; font-weight: 900;">Total Transaction</td>
              <td style="padding-top: 30px; border-top: 2px solid #0891b2; text-align: right; color: #0891b2; font-size: 30px; font-weight: 900;">RM ${totalPrice.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #0891b2; padding: 25px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Mandatory Visit Protocol:</h4>
          <ul style="margin: 0; padding-left: 18px; color: #64748b; font-size: 13px; line-height: 1.6;">
            <li>Arrive at the Concourse Level (LG) exactly 15 minutes prior to entry.</li>
            <li>Original MyKad (Malaysians) or Passport (Foreigners) required for all visitors.</li>
            <li>Digital or printed version of this email must be presented at check-in.</li>
          </ul>
        </div>
      </div>

      <div style="background-color: #0a0a0a; padding: 40px; text-align: center; font-size: 11px; color: #64748b; letter-spacing: 1.5px; line-height: 2;">
        <strong style="color: #ffffff;">PETRONAS TWIN TOWERS VISIT OPERATIONS</strong><br>
        Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia<br>
        <span style="color: #0891b2;">www.petronastwintowers.com.my</span>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`, 
      to, 
      subject: `SUCCESS: Your Admission Ticket [${safeRef}]`,
      html: htmlContent,
    });

    // 🛡️ Audit log for business reporting
    await logEvent("INFO", "TICKET_DELIVERED", `Final ticket emailed to ${to}`, { bookingRef: safeRef, messageId: info.messageId });
    return { success: true };
  } catch (error: any) {
    await logEvent("CRITICAL", "TICKET_DELIVERY_FAILURE", `Fatal error sending ticket to ${to}`, { 
      error: error.message,
      bookingRef: safeRef 
    });
    return { success: false };
  }
}