// app/api/security/check/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/internalRateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  
  // 🛡️ Strategy 5: Limit to 20 page views per minute
  // "page_view" is the action name, 20 is the limit
  const isAllowed = await checkRateLimit(ip, "page_view", 20);

  if (!isAllowed.success) {
    return NextResponse.json({ blocked: true }, { status: 429 });
  }

  return NextResponse.json({ blocked: false }, { status: 200 });
}