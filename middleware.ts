// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl, headers } = req;
  
  // 1. 🛡️ CRITICAL BYPASS: Internal API & Auth Routes
  // We MUST allow these to pass through immediately to prevent "Unexpected token <" 
  // errors and to ensure the Pricing Engine works without lag.
  if (
    nextUrl.pathname.startsWith("/api/booking/price") || 
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/api/seed")
  ) {
    return NextResponse.next();
  }

  // 2. 🚀 PREFETCH OPTIMIZATION
  // Next.js background prefetches are ignored by the security engine to save DB resources.
  const isPrefetch = 
    headers.get("next-router-prefetch") || 
    headers.get("purpose") === "prefetch" ||
    headers.get("x-middleware-prefetch");

  if (!isPrefetch) {
    const userAgent = headers.get("user-agent") || "";
    const ip = headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

    // --- STRATEGY 2: BEHAVIOR FINGERPRINTING ---
    const botPatterns = ["python", "curl", "go-http", "axios", "selenium", "puppeteer", "postman", "node-fetch"];
    const isKnownBot = botPatterns.some(p => userAgent.toLowerCase().includes(p));
    const secChUa = headers.get("sec-ch-ua");
    const isImpersonatingBrowser = !secChUa && (userAgent.includes("Chrome") || userAgent.includes("Edge"));

    if (isKnownBot || isImpersonatingBrowser) {
      const reportUrl = new URL("/api/trap", nextUrl.origin);
      // Fire-and-forget reporting (Background)
      fetch(reportUrl, {
        method: "GET",
        headers: {
          "x-bot-detected": "true",
          "x-detection-reason": isKnownBot ? "Known Library" : "Browser Impersonation",
          "user-agent": userAgent,
        },
      }).catch(() => {});
    }

    // --- STRATEGY 5: THE BOUNCER (Rate Limiting) ---
    // Only enforced on main public pages to prevent scraping
    const isPublicPage = ["/", "/about", "/experience", "/visit", "/gallery"].some(path => 
      nextUrl.pathname === path || nextUrl.pathname.startsWith(path + "/")
    );

    if (isPublicPage) {
      try {
        const bouncerUrl = new URL("/api/security/check", nextUrl.origin);
        const bouncerCheck = await fetch(bouncerUrl, {
          method: "GET",
          headers: { "x-forwarded-for": ip },
          cache: 'no-store'
        });

        if (bouncerCheck.status === 429) {
          return new NextResponse(
            `<html>
              <body style="background:#0a0a0a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; text-align:center; padding: 20px;">
                <div style="border: 1px solid #1e293b; padding: 40px; background: #000;">
                  <h1 style="color:#06b6d4; font-size: 3rem; margin:0;">429</h1>
                  <h2 style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 0.8rem; margin-top: 10px; color: #94a3b8;">Unusual Traffic Detected</h2>
                  <p style="color:#64748b; max-width: 350px; margin: 25px auto; line-height: 1.8; font-size: 0.75rem;">
                    Our security perimeter has flagged your connection for accessing pages too quickly. 
                    Please wait 60 seconds before trying again.
                  </p>
                  <a href="/" style="color:#06b6d4; text-decoration:none; font-size: 0.7rem; font-weight:bold; text-transform:uppercase; border: 1px solid #06b6d4; padding: 12px 24px; display: inline-block;">Reload Portal</a>
                </div>
              </body>
            </html>`,
            { status: 429, headers: { "Content-Type": "text/html" } }
          );
        }
      } catch (error) {
        console.error("Bouncer bypass (Fail-Open)");
      }
    }
  }

  // --- 3. IDENTITY & ACCESS CONTROL ---
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // Redirect to login if accessing admin pages without correct role
  if (isAdminRoute) {
    if (!isLoggedIn || userRole !== "admin") {
      const loginUrl = new URL("/login", nextUrl.origin);
      // Pass the attempted URL so we can redirect back after login
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in as admin, don't show the login page
  if (isLoginPage && isLoggedIn && userRole === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl.origin));
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
     * 4. Static media assets (.jpg, .png, .mp4, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};