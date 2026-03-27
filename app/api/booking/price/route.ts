// // 1. Import Next.js server utilities
// import { NextRequest, NextResponse } from "next/server";

// // 2. Import your custom pricing engine logic
// import { calculateDynamicPrice } from "@/lib/pricingEngine";

// export async function POST(req: NextRequest) {
//   try {
//     // Extract data from the request body
//     const { tickets, isLocal, date, timeSlot } = await req.json();

//     // 1. Calculate the final total price based on quantities
//     const totalPrice = await calculateDynamicPrice(tickets, isLocal, date, timeSlot);

//     // 2. Calculate individual unit prices for the UI cards
//     // We run the engine with 1 ticket for each type to see the "Current Rate" for that time/date
//     const adultUnit = await calculateDynamicPrice({ adult: 1, child: 0, senior: 0 }, isLocal, date, timeSlot);
//     const childUnit = await calculateDynamicPrice({ adult: 0, child: 1, senior: 0 }, isLocal, date, timeSlot);
//     const seniorUnit = await calculateDynamicPrice({ adult: 0, child: 0, senior: 1 }, isLocal, date, timeSlot);

//     // 3. Return the data as JSON
//     return NextResponse.json({ 
//       totalPrice,
//       breakdown: {
//         adult: adultUnit,
//         child: childUnit,
//         senior: seniorUnit
//       }
//     });
    
//   } catch (error) {
//     console.error("Price API Error:", error);
//     return NextResponse.json(
//       { error: "Failed to calculate dynamic price" }, 
//       { status: 500 }
//     );
//   }
// }










import { NextRequest, NextResponse } from "next/server";
import { calculateDynamicPrice } from "@/lib/pricingEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tickets, isLocal, date, timeSlot } = body;

    // 1. 🛡️ Basic Validation
    // Ensure we don't crash if the frontend sends incomplete data
    if (!date || !timeSlot || isLocal === undefined || !tickets) {
      return NextResponse.json(
        { error: "Incomplete selection data" }, 
        { status: 400 }
      );
    }

    /**
     * 🚀 PERFORMANCE OPTIMIZATION: Promise.all
     * Instead of waiting for one calculation to finish before starting the next,
     * we run all 4 calculations in parallel. This is much faster.
     */
    const [totalPrice, adultUnit, childUnit, seniorUnit] = await Promise.all([
      // Calculate final total based on user selection
      calculateDynamicPrice(tickets, isLocal, date, timeSlot),
      
      // Get surge-inclusive unit prices for the UI display
      calculateDynamicPrice({ adult: 1, child: 0, senior: 0 }, isLocal, date, timeSlot),
      calculateDynamicPrice({ adult: 0, child: 1, senior: 0 }, isLocal, date, timeSlot),
      calculateDynamicPrice({ adult: 0, child: 0, senior: 1 }, isLocal, date, timeSlot),
    ]);

    // 3. Return the data as clean JSON
    return NextResponse.json({ 
      totalPrice,
      breakdown: {
        adult: adultUnit,
        child: childUnit,
        senior: seniorUnit
      }
    });
    
  } catch (error) {
    // 🛡️ Log the error on the server for debugging, but send a clean message to the client
    console.error("CRITICAL: Price API Failure:", error);
    
    return NextResponse.json(
      { error: "Pricing engine encountered an error." }, 
      { status: 500 }
    );
  }
}