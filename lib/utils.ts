// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the official pricing tiers for the Petronas Twin Towers.
 * Centralizing this here makes the app maintainable.
 */
export const getRates = (isMalaysian: boolean) => {
  return isMalaysian
    ? { adult: 35, senior: 25, child: 17 }
    : { adult: 98, senior: 75, child: 50 };
};

/**
 * Formats numbers into Ringgit Malaysia (RM) currency format.
 * Example: 98 -> RM 98.00
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("MYR", "RM");
};

/**
 * Formats dates into a premium readable format.
 * Example: 2024-12-25 -> Wednesday, 25 Dec 2024
 */
export const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Guard against invalid date strings
  if (isNaN(d.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
};

/**
 * Generates a unique, professional booking reference.
 * Uses a 6-character alphanumeric string + current millisecond slice.
 * Example: PET-K8X2W9-42
 */
export const generateBookingRef = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No O, 0, I, or 1 to avoid confusion
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const suffix = Date.now().toString().slice(-2);
  return `PET-${randomPart}-${suffix}`;
};

/**
 * Calculates total price based on ticket counts and local/international status.
 * This is the 'Source of Truth' for the Server Action verification.
 */
export const calculateTotal = (
  adults: number,
  children: number,
  seniors: number,
  isMalaysian: boolean
) => {
  const prices = getRates(isMalaysian);
  
  return (
    adults * prices.adult + 
    seniors * prices.senior + 
    children * prices.child
  );
};

/**
 * Helper to calculate total ticket count for UI summaries.
 */
export const getTotalTickets = (tickets: { adult: number; child: number; senior: number }) => {
  return tickets.adult + tickets.child + tickets.senior;
};