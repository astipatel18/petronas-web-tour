// store/useBookingStore.ts
import { create } from 'zustand';

// 1. Define the Attraction Interface for Type Safety
export interface Attraction {
  id: string;
  name: string;
  image: string;
}

// 2. Define the Ticket Types
export type TicketType = 'adult' | 'child' | 'senior';

interface BookingState {
  // --- CORE STATE ---
  step: number;
  selectedAttraction: Attraction | null;
  isMalaysian: boolean | null;
  selectedDate: string;
  selectedTime: string;
  tickets: { adult: number; child: number; senior: number };
  
  // 🛡️ OTP / VERIFICATION STATE
  // Stores the email address entered in Step 5 so it can be displayed in Step 6
  tempEmail: string; 
  
  // --- NAVIGATION ACTIONS ---
  setStep: (step: number) => void;
  
  // --- STEP 1: ATTRACTION SELECTION ---
  setAttraction: (attr: Attraction) => void;
  
  // --- STEP 2: ELIGIBILITY CHECK ---
  setEligibility: (isLocal: boolean) => void;
  
  // --- STEP 3: SCHEDULE & QUANTITY ---
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  updateTickets: (type: TicketType, val: number) => void;
  
  // --- STEP 5 -> 6: VERIFICATION HANDSHAKE ---
  setTempEmail: (email: string) => void;

  // --- 💰 PRICE COMPUTATION ---
  // Calculates real-time total based on nationality and ticket mix
  getTotalPrice: () => number;

  // --- SYSTEM UTILS ---
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // --- INITIAL STATE ---
  step: 1,
  selectedAttraction: null,
  isMalaysian: null,
  selectedDate: "",
  selectedTime: "",
  tickets: { adult: 0, child: 0, senior: 0 },
  tempEmail: "",

  // --- NAVIGATION ---
  setStep: (step) => set({ step }),

  // --- SELECTION LOGIC ---
  setAttraction: (attr) => set({ 
    selectedAttraction: attr, 
    step: 2 
  }),

  setEligibility: (isLocal) => set({ 
    isMalaysian: isLocal, 
    step: 3 
  }),

  // --- STEP 3 INTERACTIVITY ---
  setDate: (date) => set({ selectedDate: date }),
  
  setTime: (time) => set({ selectedTime: time }),

  updateTickets: (type, val) => set((state) => ({
    tickets: { 
        ...state.tickets, 
        [type]: Math.max(0, val) 
    }
  })),

  // --- 🛡️ VERIFICATION LOGIC ---
  // Called when the user clicks 'Verify' in Step 5
  setTempEmail: (email) => set({ tempEmail: email }),

  // --- 💰 DYNAMIC PRICE CALCULATOR ---
  getTotalPrice: () => {
    const { isMalaysian, tickets } = get();
    
    // Official Pricing Logic (Can be moved to a config file for easier updates)
    const rates = isMalaysian 
      ? { adult: 35, senior: 25, child: 17 }  // MYKAD Rates
      : { adult: 98, senior: 75, child: 50 }; // STANDARD Rates
      
    return (
      (tickets.adult * rates.adult) +
      (tickets.senior * rates.senior) +
      (tickets.child * rates.child)
    );
  },

  // --- GLOBAL RESET ---
  // Clears all PII (Personally Identifiable Information) and selections
  reset: () => set({ 
    step: 1, 
    selectedAttraction: null, 
    isMalaysian: null, 
    selectedDate: "", 
    selectedTime: "", 
    tickets: { adult: 0, child: 0, senior: 0 },
    tempEmail: "" 
  }),
}));