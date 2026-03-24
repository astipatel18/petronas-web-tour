// lib/ratelimit.ts
// We are now using local MongoDB logic instead of Upstash.
export { checkRateLimit as internalRateLimit } from "./internalRateLimit";