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
  
  // 💰 DYNAMIC PRICING STATE
  // Stores the final price verified by the server API
  totalPrice: number; 

  // 🛡️ OTP / VERIFICATION STATE
  tempEmail: string; 
  
  // --- NAVIGATION ACTIONS ---
  setStep: (step: number) => void;
  
  // --- STEP 1: ATTRACTION SELECTION ---
  setAttraction: (attr: Attraction) => void;
  
  // --- STEP 2: ELIGIBILITY CHECK ---
  setEligibility: (isLocal: boolean) => void;
  
  // --- STEP 3: SCHEDULE & QUANTITY ---
  // 🚀 These now reset totalPrice to 0 to trigger a re-fetch in the UI
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  updateTickets: (type: TicketType, val: number) => void;
  
  // --- 💰 PRICE ACTIONS ---
  setTotalPrice: (price: number) => void; 
  
  // --- STEP 5 -> 6: VERIFICATION HANDSHAKE ---
  setTempEmail: (email: string) => void;

  // --- 🛠️ UI HELPERS ---
  getEstimate: () => number;

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
  totalPrice: 0, 
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
    step: 3,
    totalPrice: 0 // Invalidate price when nationality changes
  }),

  // --- STEP 3 INTERACTIVITY (FIXED FOR DYNAMIC TRIGGERING) ---
  
  setDate: (date) => set({ 
    selectedDate: date, 
    totalPrice: 0 // 🚀 Reset forces UI to show "calculating" and re-fetch API
  }),
  
  setTime: (time) => set({ 
    selectedTime: time, 
    totalPrice: 0 // 🚀 Reset forces UI to show "calculating" and re-fetch API
  }),

  updateTickets: (type, val) => set((state) => ({
    tickets: { 
        ...state.tickets, 
        [type]: Math.max(0, val) 
    },
    totalPrice: 0 // 🚀 Reset price so server re-verifies new quantity with surges
  })),

  // --- 💰 DYNAMIC PRICE SAVER ---
  setTotalPrice: (price) => set({ totalPrice: price }),

  // --- 🛡️ VERIFICATION LOGIC ---
  setTempEmail: (email) => set({ tempEmail: email }),

  // --- 🛠️ ESTIMATE HELPER ---
  getEstimate: () => {
    const { isMalaysian, tickets } = get();
    if (isMalaysian === null) return 0;

    const rates = isMalaysian 
      ? { adult: 35, senior: 25, child: 17 }
      : { adult: 98, senior: 75, child: 50 };
      
    return (
      (tickets.adult * rates.adult) +
      (tickets.senior * rates.senior) +
      (tickets.child * rates.child)
    );
  },

  // --- GLOBAL RESET ---
  reset: () => set({ 
    step: 1, 
    selectedAttraction: null, 
    isMalaysian: null, 
    selectedDate: "", 
    selectedTime: "", 
    tickets: { adult: 0, child: 0, senior: 0 },
    totalPrice: 0,
    tempEmail: "" 
  }),
}));