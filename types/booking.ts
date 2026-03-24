// types/booking.ts
export interface TicketCounts {
  adult: number;
  child: number;
}

export interface BookingInput {
  customerName: string;
  email: string;
  visitDate: Date | string;
  timeSlot: string;
  tickets: TicketCounts;
}

export interface BookingDocument extends BookingInput {
  _id: string;
  totalPrice: number;
  bookingRef: string;
  createdAt: Date;
}