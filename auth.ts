// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { logEvent } from "@/lib/logger";
// 🛡️ IMPORT INTERNAL RATE LIMITER (Local MongoDB Logic)
import { checkRateLimit } from "@/lib/internalRateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Staff Portal",
      async authorize(credentials) {
        // 1. Basic validation
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // 2. Capture Identity info
        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
        const userAgent = headerList.get("user-agent") || "unknown";
        const identity = { ip, userAgent };

        // 3. 🛡️ INTERNAL RATE LIMITING (MongoDB TTL Based)
        // Action: "admin_login" | Limit: 5 attempts per 10 minutes
        const isAllowed = await checkRateLimit(ip, "admin_login", 5);

        if (!isAllowed.success) {
          await logEvent("CRITICAL", "AUTH_BRUTE_FORCE_BLOCK", `IP ${ip} throttled after 5 failed attempts`, identity);
          // 🛡️ High-Security Tip: Throw an error to stop execution before DB hit
          throw new Error("Security Alert: System locked for 10 minutes due to multiple failures.");
        }

        // 4. Database Connection
        await dbConnect();

        // 5. Find User
        const user = await User.findOne({ email });

        // LOG: Account Not Found
        if (!user) {
          await logEvent("WARNING", "AUTH_USER_NOT_FOUND", `Non-existent email: ${email}`, identity);
          throw new Error("Invalid Identification Key.");
        }

        // LOG: Role Mismatch (Prevent regular users from entering Admin portal)
        if (user.role !== "admin") {
          await logEvent("CRITICAL", "AUTH_UNAUTHORIZED_ACCESS", `User ${email} attempted unauthorized portal entry`, identity);
          throw new Error("Access Denied: Level 1 Authorization Required.");
        }

        // 6. Password Comparison
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // LOG: Invalid Password
        if (!isPasswordCorrect) {
          await logEvent("CRITICAL", "AUTH_INVALID_PASSWORD", `Incorrect credentials for: ${email}`, identity);
          throw new Error("Invalid Credentials.");
        }

        // 7. Success
        await logEvent("INFO", "AUTH_SUCCESS", `Portal Access Granted: ${user.email}`, { ip });

        // 8. Return Session Object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});