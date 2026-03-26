"use server";

import { auth } from "@/auth";
import { dbConnect } from "./mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { logEvent } from "./logger";
import { sendCancellationEmail } from "./mailer";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * 🛡️ AUTHORIZATION GUARD (Internal Helper)
 * Ensures only authorized admins can execute these actions.
 */
async function ensureAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    throw new Error("Unauthorized: Administrative privileges required.");
  }
  return session;
}

/**
 * 🎟️ ACTION: processCancellation
 * Secured Server Action to void a booking and notify the customer.
 */
export async function processCancellation(bookingId: string, reason: string = "Customer Request") {
  const session = await ensureAdmin();

  try {
    await dbConnect();
    const booking = await Booking.findById(bookingId);
    
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "cancelled") return { success: true, message: "Already cancelled" };

    booking.status = "cancelled";
    booking.cancellation = {
      reason,
      cancelledAt: new Date(),
    };

    await booking.save();

    // Notify customer in the background
    sendCancellationEmail(booking.email, {
      customerName: booking.customerName,
      bookingRef: booking.bookingRef
    }).catch(err => console.error("Email failed:", err));

    await logEvent("WARNING", "BOOKING_CANCELLED", `Ref: ${booking.bookingRef} voided by ${session.user.email}`);

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 👤 ACTION: createAdminAccount
 * Generates a new staff member with encrypted credentials.
 */
export async function createAdminAccount(formData: FormData) {
  const session = await ensureAdmin();

  try {
    await dbConnect();
    
    const name = formData.get("name") as string;
    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("A staff member with this email already exists.");

    // Encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await logEvent("INFO", "STAFF_CREATED", `New admin account created: ${email} by ${session.user.email}`);

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 🗑️ ACTION: deleteAdminAccount
 * Removes a staff member from the system. Prevents self-deletion.
 */
export async function deleteAdminAccount(userId: string) {
  const session = await ensureAdmin();

  try {
    await dbConnect();

    // 🛡️ Lockout Protection: Prevent an admin from deleting themselves
    if (userId === session.user.id) {
      throw new Error("Security Violation: You cannot delete your own administrative account.");
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) throw new Error("Staff member not found.");

    await User.findByIdAndDelete(userId);

    await logEvent("CRITICAL", "STAFF_DELETED", `Admin ${userToDelete.email} removed by ${session.user.email}`);

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 📝 ACTION: updateAdminName
 * Simple utility to update staff profile names.
 */
export async function updateAdminName(userId: string, newName: string) {
  await ensureAdmin();

  try {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { name: newName });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}