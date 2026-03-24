// hooks/useBooking.ts
"use client";
import { useState } from 'react';
import { BookingInput } from '@/types/booking';

export const useBooking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingInput>>({
    tickets: { adult: 1, child: 0 }
  });

  const updateBooking = (data: Partial<BookingInput>) => {
    setBookingData((prev: Partial<BookingInput>) => ({ 
      ...prev, 
      ...data 
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return { step, bookingData, updateBooking, nextStep, prevStep };
};