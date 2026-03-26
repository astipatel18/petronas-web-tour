// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl, headers } = req;
  const userAgent = headers.get("user-agent") || "";
  const ip = headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

  // 1. 🛡️ EXCLUSION ZONE: Prevent infinite loops
  // Do not rate-limit the security check API or authentication routes
  const isInternalApi = nextUrl.pathname.startsWith("/api/security") || nextUrl.pathname.startsWith("/api/auth");
  if (isInternalApi) return NextResponse.next();

  // --- STRATEGY 2: BEHAVIOR FINGERPRINTING (Intelligence Gathering) ---
  const botPatterns = ["python", "curl", "go-http", "axios", "selenium", "puppeteer", "postman", "node-fetch"];
  const isKnownBot = botPatterns.some(p => userAgent.toLowerCase().includes(p));
  const secChUa = headers.get("sec-ch-ua");
  const isImpersonatingBrowser = !secChUa && (userAgent.includes("Chrome") || userAgent.includes("Edge"));

  if (isKnownBot || isImpersonatingBrowser) {
    const reportUrl = new URL("/api/trap", nextUrl.origin);
    // Non-blocking fetch (Fire and forget)
    fetch(reportUrl, {
      method: "GET",
      headers: {
        "x-bot-detected": "true",
        "x-detection-reason": isKnownBot ? "Known Library" : "Browser Impersonation",
        "user-agent": userAgent,
      },
    }).catch(() => {});
  }

  // --- STRATEGY 5: THE BOUNCER (Rate Limiting Enforcement) ---
  // This blocks the request if the IP exceeds 20 page views per minute
  try {
    const bouncerUrl = new URL("/api/security/check", nextUrl.origin);
    const bouncerCheck = await fetch(bouncerUrl, {
      method: "GET",
      headers: { "x-forwarded-for": ip },
      cache: 'no-store' // Ensure we don't cache the security decision
    });

    if (bouncerCheck.status === 429) {
      return new NextResponse(
        `<html>
          <body style="background:#0a0a0a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; text-align:center;">
            <div>
              <h1 style="color:#06b6d4;">429: Unusual Traffic Detected</h1>
              <p style="color:#64748b;">You are accessing pages too quickly. <br/> Please wait 60 seconds before trying again.</p>
            </div>
          </body>
        </html>`,
        { status: 429, headers: { "Content-Type": "text/html" } }
      );
    }
  } catch (error) {
    // Fail-open: If the security API fails, let the user in so the site doesn't break
    console.error("Bouncer check failed to respond. Allowing request.");
  }

  // --- AUTHENTICATION LOGIC (EXISTING) ---
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "admin") {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  if (isLoginPage && isLoggedIn && userRole === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. Static assets like images/pdfs (.jpg, .png, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};