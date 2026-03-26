// app/api/cron/retry-emails/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import EmailQueue from "@/models/EmailQueue";
import { transporter } from "@/lib/mailer"; // Now exported from mailer.ts
import { logEvent } from "@/lib/logger";

export async function GET(req: Request) {
  // 🛡️ SECURITY: Only allow execution if a secret key matches
  // Usage: /api/cron/retry-emails?key=your_secret_key
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // 1. Find emails that are 'pending' and have failed less than 5 times
    const pendingEmails = await EmailQueue.find({ 
      status: 'pending', 
      attempts: { $lt: 5 } 
    });

    if (pendingEmails.length === 0) {
      return NextResponse.json({ message: "No pending emails to process." });
    }

    let successCount = 0;
    let failCount = 0;

    // 2. Loop through and retry
    for (const mail of pendingEmails) {
      try {
        await transporter.sendMail({ 
          from: `"Petronas Ticketing" <${process.env.MAIL_USER}>`,
          to: mail.to, 
          subject: mail.subject, 
          html: mail.html 
        });

        mail.status = 'sent';
        successCount++;
      } catch (e: any) {
        mail.attempts += 1;
        mail.lastError = e.message;
        
        if (mail.attempts >= 5) {
          mail.status = 'failed';
          await logEvent("CRITICAL", "MAIL_RETRY_EXHAUSTED", `Email to ${mail.to} failed after 5 attempts.`);
        }
        failCount++;
      }
      await mail.save();
    }

    return NextResponse.json({ 
      processed: pendingEmails.length,
      success: successCount,
      failed: failCount
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}