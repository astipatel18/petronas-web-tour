// auth.config.ts
import type { NextAuthConfig } from "next-auth";

/**
 * 💡 WHY THIS FILE EXISTS:
 * This configuration is "Edge-compatible." It does not import Mongoose, 
 * Bcrypt, or Nodemailer. Next.js Middleware uses this file to check 
 * authentication status without crashing the Edge runtime.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // 🛡️ Mandatory for Edge-based role checking
  },
  callbacks: {
    /**
     * 🛡️ AUTHORIZED CALLBACK
     * This runs before every request handled by the middleware.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as any)?.role === "admin";
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");

      if (isOnAdminPanel) {
        // If they are on an admin page, they MUST be logged in AND be an admin
        if (isLoggedIn && isAdmin) return true;
        return false; // Redirects to the login page defined above
      }
      
      return true; // Allow access to public pages
    },

    /**
     * 🔑 JWT CALLBACK
     * This runs when the JWT is created (on login) or updated.
     * We persist the user role from the database into the encrypted cookie.
     */
    async jwt({ token, user }) {
      if (user) {
        // The 'user' object is passed here only on the first sign-in
        token.role = (user as any).role;
      }
      return token;
    },

    /**
     * 👤 SESSION CALLBACK
     * This runs whenever a session is checked (e.g., via useSession or auth()).
     * It makes the role available to your React components and Server Actions.
     */
    async session({ session, token }) {
      if (session.user && token.role) {
        // We cast as 'any' to avoid TypeScript errors for our custom role property
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [], // 🚀 Keep empty! Providers (Credentials) are added in auth.ts only.
} satisfies NextAuthConfig;