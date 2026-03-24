// lib/validations.ts
import { z } from "zod";

/**
 * BookingSchema
 * Hardened validation for the Petronas Twin Towers booking engine.
 * Handles String inputs from HTML Form Data via Coercion.
 */
export const BookingSchema = z.object({
  customerName: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name is too long" })
    .trim()
    .regex(/^[a-zA-Z\s]*$/, { 
      message: "Name can only contain letters and spaces" 
    }),
  
  email: z.string()
    .email({ message: "A valid email is required for ticket delivery" })
    .toLowerCase()
    .trim(),
  
  attractionName: z.string()
    .min(1, { message: "Please select an attraction" }),

  /**
   * ROBUST DATE CHECK:
   * Compares the date at midnight to avoid timezone mismatch errors.
   */
  visitDate: z.string().refine((dateString) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  }, { 
    message: "Selected date cannot be in the past" 
  }),

  timeSlot: z.string()
    .min(1, { message: "Please select a preferred arrival time" }),
  
  // 🛡️ COERCE: Converts string "2" -> number 2 automatically
  adultTickets: z.coerce.number()
    .min(0)
    .max(10, { message: "Limit of 10 adult tickets per booking" }),
    
  childTickets: z.coerce.number()
    .min(0)
    .max(10, { message: "Limit of 10 child tickets per booking" }),
    
  seniorTickets: z.coerce.number()
    .min(0)
    .max(10, { message: "Limit of 10 senior tickets per booking" }),
  
  /**
   * 🛡️ PREPROCESS FIX: 
   * Converts HTML string "true"/"false" into actual boolean.
   * Removed the problematic 'invalid_type_error' key to fix TS 2353.
   */
  isMalaysian: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ),

  // 🛡️ COERCE: Converts string "246.00" -> number 246.00
  totalPrice: z.coerce.number()
    .min(0, { message: "Total price calculation error" }),
});

export type BookingInput = z.infer<typeof BookingSchema>;