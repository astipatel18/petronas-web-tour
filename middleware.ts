// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // 🚀 Import the Edge-safe config ONLY
import { NextResponse } from "next/server";

// 🛡️ Initialize a lightweight Auth instance for the Edge Runtime
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // 🔑 Extracting the role from the JWT token (Safe on Edge)
  const userRole = (req.auth?.user as any)?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // 1. Always allow API Auth requests (Sign in/out internal calls)
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Protect Admin Routes (/admin/*)
  if (isAdminRoute) {
    // If NOT logged in OR logged in but NOT an admin
    if (!isLoggedIn || userRole !== "admin") {
      // Redirect to login with the current URL as a callback
      const loginUrl = new URL("/login", nextUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged-in Admins from accessing the Login page
  // This improves UX by sending them straight to their workspace
  if (isLoginPage && isLoggedIn && userRole === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  // 4. Public Routes (Homepage, About, Booking, etc.) are allowed by default
  return NextResponse.next();
});

// ⚙️ The Matcher tells Next.js exactly which paths to run this code on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. api (Internal API routes)
     * 2. _next/static (static files)
     * 3. _next/image (image optimization files)
     * 4. favicon.ico (favicon file)
     * 5. Any files with extensions (e.g., .svg, .jpg, .png, .pdf)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};