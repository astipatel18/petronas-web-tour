// lib/session.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// 🔑 Use your AUTH_SECRET from .env.local as the encryption key
const secretKey = process.env.AUTH_SECRET || "at_least_32_character_long_secret_key";
const key = new TextEncoder().encode(secretKey);

/**
 * ENCRYPT: Seal data into a secure token
 * Used in Step 5 to hide the OTP and booking details from the user.
 */
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m") // Token expires in 10 minutes
    .sign(key);
}

/**
 * DECRYPT: Open a secure token and verify it hasn't been tampered with
 * Used in Step 6 to check if the user entered the correct OTP.
 */
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // If the token is expired or the secret key doesn't match
    console.error("Session Decryption Failed:", error);
    return null;
  }
}

/**
 * UTILITY: Get session data directly from cookies (Server Side)
 */
export async function getSession(cookieName: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value;
  if (!session) return null;
  return await decrypt(session);
}