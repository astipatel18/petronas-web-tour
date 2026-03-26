// // // models/Booking.ts
// import mongoose, { Schema, model, models } from 'mongoose';

// /**
//  * BookingSchema
//  * Database definition for the Petronas Twin Towers ticketing system.
//  * Includes explicit validation and audit metadata.
//  */
// const BookingSchema = new Schema({
//   customerName: { 
//     type: String, 
//     required: true,
//     trim: true 
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     lowercase: true, 
//     trim: true 
//   },
//   // Matches the attraction selected in Step 1
//   attractionName: { 
//     type: String, 
//     required: true 
//   },
//   visitDate: { 
//     type: Date, 
//     required: true 
//   },
//   timeSlot: { 
//     type: String, 
//     required: true 
//   },
//   isMalaysian: { 
//     type: Boolean, 
//     required: true,
//     default: false 
//   },
//   // Structured ticket counts
//   tickets: {
//     adult: { type: Number, default: 0, min: 0 },
//     child: { type: Number, default: 0, min: 0 },
//     senior: { type: Number, default: 0, min: 0 },
//   },
//   // Final verified price calculated on the server
//   totalPrice: { 
//     type: Number, 
//     required: true,
//     min: 0 
//   },
//   // Unique professional reference (e.g., PET-K8X2W9-42)
//   bookingRef: { 
//     type: String, 
//     required: true,
//     unique: true,
//     index: true // Optimized for fast lookups
//   },
//   status: { 
//     type: String, 
//     enum: ['pending', 'confirmed', 'cancelled'],
//     default: 'confirmed' 
//   },
//   // Security audit data (Helps identify bot patterns)
//   metadata: {
//     ipAddress: { type: String },
//     userAgent: { type: String },
//   }
// }, { 
//   // Automatically adds createdAt and updatedAt fields
//   timestamps: true 
// });

// /**
//  * Next.js Specific Model Export
//  * This check prevents Mongoose from trying to re-compile the model 
//  * during hot-reloads in development.
//  */
// export default models.Booking || model('Booking', BookingSchema);








import mongoose, { Schema, model, models } from 'mongoose';

/**
 * BookingSchema
 * Database definition for the Petronas Twin Towers ticketing system.
 * Enhanced with Status Management and Cancellation audit trails.
 */
const BookingSchema = new Schema({
  customerName: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  attractionName: { 
    type: String, 
    required: true 
  },
  visitDate: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    required: true 
  },
  isMalaysian: { 
    type: Boolean, 
    required: true,
    default: false 
  },
  tickets: {
    adult: { type: Number, default: 0, min: 0 },
    child: { type: Number, default: 0, min: 0 },
    senior: { type: Number, default: 0, min: 0 },
  },
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0 
  },
  bookingRef: { 
    type: String, 
    required: true,
    unique: true,
    index: true 
  },
  
  // 🛡️ STATUS MANAGEMENT
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'refunded'],
    default: 'confirmed',
    index: true // 🚀 Optimized for Admin Dashboard filters
  },

  // 📉 CANCELLATION AUDIT TRAIL
  cancellation: {
    reason: { type: String, trim: true },
    cancelledAt: { type: Date },
    refundId: { type: String }, // For tracking the financial return
  },

  // Security audit data
  metadata: {
    ipAddress: { type: String },
    userAgent: { type: String },
  }
}, { 
  timestamps: true 
});

/**
 * Next.js Specific Model Export
 */
export default models.Booking || model('Booking', BookingSchema);