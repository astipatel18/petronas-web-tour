// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { auth } from '@/auth';

/**
 * GET /api/bookings
 * Secure, Paginated API for the Admin Dashboard
 */
export async function GET(req: NextRequest) {
  try {
    // 1. 🛡️ AUTHENTICATION GUARD
    // We verify the session and specifically check for the 'admin' role
    const session = await auth();
    
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required." }, 
        { status: 401 }
      );
    }

    // 2. 🔌 DATABASE INITIALIZATION
    await dbConnect();

    // 3. 📝 PARAMETER EXTRACTION & SANITIZATION
    const { searchParams } = new URL(req.url);
    
    // Pagination: Strict 50-record maximum per request for performance safety
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10"))); 
    const skip = (page - 1) * limit;
    
    // Filters
    const search = searchParams.get("search")?.trim() || "";
    const dateFilter = searchParams.get("date"); // Format: YYYY-MM-DD

    // 4. 🔍 DYNAMIC QUERY ARCHITECTURE
    let query: any = {};

    // Fuzzy search logic (Case-insensitive)
    if (search) {
      query.$or = [
        { bookingRef: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Temporal filtering logic
    if (dateFilter) {
      const startOfDay = new Date(dateFilter);
      if (!isNaN(startOfDay.getTime())) {
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateFilter);
        endOfDay.setHours(23, 59, 59, 999);
        query.visitDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // 5. ⚡ HIGH-PERFORMANCE DATA RETRIEVAL
    // Using .lean() converts Mongoose docs to plain JS objects, 
    // significantly reducing CPU usage and memory footprint for read-only ops.
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), 
      Booking.countDocuments(query),
    ]);

    // 6. 📦 PAGINATED RESPONSE WITH HUD METADATA
    return NextResponse.json({
      success: true,
      data: bookings,
      meta: {
        totalItems: totalCount,
        itemCount: bookings.length,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: skip + bookings.length < totalCount,
        hasPreviousPage: page > 1,
      },
    }, {
      // 🛡️ Explicitly prevent client-side caching of sensitive admin data
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error: any) {
    // 🛡️ ERROR MASKING: Log the real error for devops, return generic error to client
    console.error("FATAL_API_ERROR [bookings/route.ts]:", error);

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error", 
        message: process.env.NODE_ENV === "development" ? error.message : "Service temporarily unavailable." 
      }, 
      { status: 500 }
    );
  }
}