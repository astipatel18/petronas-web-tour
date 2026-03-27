import Holiday from "@/models/Holiday";
import { dbConnect } from "./mongodb";

const BASE_RATES = {
  local: { adult: 35, child: 17, senior: 25 },
  standard: { adult: 98, child: 50, senior: 75 }
};

export async function calculateDynamicPrice(
  tickets: { adult: number; child: number; senior: number },
  isLocal: boolean,
  date: string, // Expected format: "YYYY-MM-DD"
  timeSlot: string // Expected format: "07:00 PM" or "19:00"
) {
  await dbConnect();
  
  // 1. 🛡️ PARSE DATE SAFELY (Prevents Timezone Shift)
  // Splitting manually ensures "2024-10-26" is always interpreted as the specific day
  const [year, month, day] = date.split("-").map(Number);
  const visitDate = new Date(year, month - 1, day); 
  
  const dayOfWeek = visitDate.getDay(); // 0: Sun, 6: Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // 2. 🛡️ PARSE TIME SAFELY
  let hours = 0;
  const timeClean = timeSlot.trim().toUpperCase();
  
  if (timeClean.includes("AM") || timeClean.includes("PM")) {
    // Logic for "07:00 PM"
    const [timePart, period] = timeClean.split(" ");
    let [h] = timePart.split(":").map(Number);
    
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    hours = h;
  } else {
    // Logic for "19:00"
    hours = parseInt(timeClean.split(":")[0]);
  }

  // 3. 📈 DEFINE SURGE FACTORS
  let multiplier = 1.0;
  let flatSurge = 0;
  const rates = isLocal ? BASE_RATES.local : BASE_RATES.standard;

  // A. Evening Premium (+15%) - 5:00 PM (17:00) onwards
  if (hours >= 17) {
    multiplier += 0.15;
  }

  // B. Fixed Malaysian Holidays (+25%)
  if (month === 8 && day === 31) multiplier += 0.25; // Merdeka
  if (month === 5 && day === 1) multiplier += 0.20;  // Labor Day

  // C. Dynamic Database Holidays (Search by Date String)
  const dbHoliday = await Holiday.findOne({ date }).lean();
  if (dbHoliday) {
    multiplier += dbHoliday.multiplier;
  }

  // D. Weekend Flat Surge (RM 10 per person)
  if (isWeekend) {
    flatSurge = 10;
  }

  // 4. 🧮 FINAL CALCULATION LOGIC
  // Logic: (Base Rate * Stacked Multipliers) + Flat Surge
  const calculateItem = (base: number, qty: number, isChild: boolean = false) => {
    if (qty <= 0) return 0;
    // Children get half the weekend surge (RM 5)
    const activeSurge = isChild && isWeekend ? 5 : flatSurge;
    return qty * (Math.round(base * multiplier) + activeSurge);
  };

  const total = 
    calculateItem(rates.adult, tickets.adult) +
    calculateItem(rates.senior, tickets.senior) +
    calculateItem(rates.child, tickets.child, true);

  // Return final rounded integer
  return total;
}