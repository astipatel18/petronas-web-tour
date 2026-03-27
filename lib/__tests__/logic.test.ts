import { describe, it, expect, vi } from 'vitest';
import { calculateDynamicPrice } from '../pricingEngine';

// MOCK DATABASE: Prevent tests from actually hitting MongoDB
vi.mock('../mongodb', () => ({
  dbConnect: vi.fn(),
}));

vi.mock('@/models/Holiday', () => ({
  default: {
    findOne: vi.fn().mockReturnValue({
      lean: vi.fn().mockReturnValue(null), // Default: No database holidays found
    }),
  },
}));

describe('TITAN Dynamic Pricing Engine', () => {
  
  // CASE 1: Standard Weekday Morning (Base Price)
  it('calculates base international rate on a Tuesday morning', async () => {
    const tickets = { adult: 1, child: 0, senior: 0 };
    const price = await calculateDynamicPrice(tickets, false, "2024-05-14", "10:00");
    
    // Standard Adult base: 98.00
    expect(price).toBe(98);
  });

  // CASE 2: Local Weekend Surge (+RM 10)
  it('applies RM 10 surge for local MyKad on a Saturday', async () => {
    const tickets = { adult: 1, child: 0, senior: 0 };
    const price = await calculateDynamicPrice(tickets, true, "2024-05-18", "10:00");
    
    // Local base: 35.00 + 10.00 weekend surge = 45.00
    expect(price).toBe(45);
  });

  // CASE 3: Evening Premium (+15%)
  it('applies 15% evening premium for sunset slots', async () => {
    const tickets = { adult: 1, child: 0, senior: 0 };
    const price = await calculateDynamicPrice(tickets, false, "2024-05-14", "19:00");
    
    // Standard base: 98.00 * 1.15 multiplier = 112.7 -> Math.ceil = 113
    expect(price).toBe(113);
  });

  // CASE 4: Fixed Festival (Merdeka Day Aug 31)
  it('identifies fixed Merdeka Day and applies 25% premium', async () => {
    const tickets = { adult: 1, child: 0, senior: 0 };
    // 2024-08-31 is a Saturday. 
    const price = await calculateDynamicPrice(tickets, false, "2024-08-31", "10:00");
    
    // Base: 98.00
    // Multiplier: 1.0 + 0.25 (Merdeka) = 1.25
    // Surge: 10.00 (Saturday)
    // Calc: (98 * 1.25) + 10 = 122.5 + 10 = 132.5 -> Math.ceil = 133
    expect(price).toBe(133);
  });

  // CASE 5: High-Complexity Stacked Logic
  it('stacks Weekend + Evening + Festival premiums correctly', async () => {
    const tickets = { adult: 1, child: 0, senior: 0 };
    // Scenario: Merdeka Day (Aug 31, 2024), Saturday, at 7:00 PM (Evening)
    const price = await calculateDynamicPrice(tickets, false, "2024-08-31", "19:00");
    
    // Base: 98.00
    // Multipliers: 1.0 (base) + 0.25 (Festival) + 0.15 (Evening) = 1.40 Total Multiplier
    // Flat Surges: 10.00 (Weekend)
    // Final: (98 * 1.40) + 10 = 137.2 + 10 = 147.2 -> Math.ceil = 148
    expect(price).toBe(148);
  });

  // CASE 6: Edge Case - Zero Tickets
  it('returns 0 when no tickets are selected', async () => {
    const tickets = { adult: 0, child: 0, senior: 0 };
    const price = await calculateDynamicPrice(tickets, false, "2024-05-14", "10:00");
    expect(price).toBe(0);
  });

});