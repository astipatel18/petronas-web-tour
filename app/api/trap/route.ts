// app/api/trap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers as getHeaders } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import BotSighting from "@/models/BotSighting";
import { logEvent } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const headersList = await getHeaders();
  
  // 1. Identification: Is this from our Middleware Fingerprinting or a Direct Link Click?
  const isFromMiddleware = headersList.get("x-bot-detected") === "true";
  const detectionReason = headersList.get("x-detection-reason") || "Direct Honeypot Link Hit";
  
  const ip = headersList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
  const userAgent = headersList.get("user-agent") || "unknown";
  
  // 2. Intelligence Gathering: Map all headers to an object
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    // Skip internal headers that might be sensitive or redundant
    if (!key.startsWith('x-vercel') && !key.startsWith('x-forwarded')) {
      allHeaders[key] = value;
    }
  });

  try {
    await dbConnect();

    // 3. Persistent Logging: Save the "Fingerprint" to your BotSighting collection
    await BotSighting.create({
      ip,
      userAgent,
      pathAttempted: isFromMiddleware ? "Global Behavior Check" : "/api/trap",
      headers: allHeaders,
      reason: detectionReason, // Make sure to add 'reason: String' to your BotSighting model
      timestamp: new Date()
    });

    // 4. Administrator Alert: Log a Warning in the main Audit Log
    await logEvent(
      "WARNING", 
      "SCRAPER_IDENTIFIED", 
      `Intelligence gathered on potential bot via: ${detectionReason}`,
      { ip, userAgent }
    );

  } catch (error) {
    // We log to console but don't crash, ensuring the bot doesn't know anything is wrong
    console.error("Scraper intelligence gathering failed:", error);
  }

  // 5. THE SHADOW RESPONSE LOGIC
  
  // If the report came from Middleware (Background Fetch):
  // We return a simple 200 OK. The "User" never sees this.
  if (isFromMiddleware) {
    return new Response("OK", { status: 200 });
  }

  // If a Bot actually clicked the invisible link in the Footer:
  // We quietly redirect them back home. They think they clicked a "dead" or "private" link.
  return NextResponse.redirect(new URL("/", req.url));
}