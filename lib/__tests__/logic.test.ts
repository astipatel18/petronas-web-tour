// lib/__tests__/logic.test.ts
import { describe, it, expect } from 'vitest';

const calculateTotal = (adults: number, children: number, isLocal: boolean) => {
  const prices = isLocal ? { adult: 35, child: 17 } : { adult: 98, child: 50 };
  return (adults * prices.adult) + (children * prices.child);
};

describe('Ticketing Logic', () => {
  it('calculates international rates correctly', () => {
    expect(calculateTotal(2, 1, false)).toBe(246);
  });

  it('calculates local MyKad rates correctly', () => {
    expect(calculateTotal(1, 0, true)).toBe(35);
  });

  it('handles zero tickets safely', () => {
    expect(calculateTotal(0, 0, false)).toBe(0);
  });
});