// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error("❌ Invalid Environment Variables:", envParsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = envParsed.data;