# 🗼 Petronas Twin Towers Digital Ecosystem

An end-to-end tourism platform and e-ticketing system for the Petronas Twin Towers. This project implements a cinematic visitor experience paired with a secure, high-utility administrative backend.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (CSS-variable-first approach)
- **Database:** MongoDB via Mongoose (Local/Atlas)
- **State Management:** Zustand (Multi-step SPA booking flow)
- **Authentication:** Auth.js v5 (Role-based access for staff)
- **Security Logic:** Jose (Stateless JWT encryption)
- **Testing:** Vitest (Unit testing for financial logic)

## 🌟 Key Features

### Visitor Experience
- **Cinematic Storytelling:** Scroll-based animations and optimized media delivery.
- **6-Step Booking Funnel:** A single-page application (SPA) flow for ticket selection, nationality verification, and checkout.
- **Interactive 360° Tour:** Immersive virtual view of the towers using a custom HUD layout.
- **Dynamic Pricing Engine:** Logic-driven pricing that automatically adjusts for time of day, weekends, and specific Malaysian festivals.
- **Self-Service Cancellation:** Secure, time-sensitive cancellation links sent via email (5-hour grace period).

### Administrative Portal
- **Real-time Analytics:** Dashboard tracking total bookings, revenue, and visitor segmentation.
- **Reservation Manager:** Searchable and paginated list of all confirmed admissions.
- **Staff Governance:** CRUD interface for managing administrative users and access keys.
- **Price Management:** Dynamic holiday manager to set peak pricing dates without code changes.

## 🔒 Security & Architecture
- **In-House Bot Protection:** Dual-layer Honeypot traps and a server-side math challenge (no third-party scripts).
- **Identity Verification:** Email-based OTP (One-Time Password) system required to finalize bookings.
- **Defensive Engineering:** Server-side price recalculation to prevent client-side tampering.
- **Stateless Sessions:** Encrypted HttpOnly cookies using `jose` for secure, database-less session management.
- **Infrastructure Hardening:** Strict Content Security Policy (CSP) and rate-limiting enforced at the database level using TTL indexes.
- **Observability:** Centralized audit logging for critical security events and system failures.

## 🚀 Performance
- **Optimized Assets:** Automatic WebP conversion and responsive sizing via `next/image`.
- **Bundle Optimization:** Implementation of `LazyMotion` for Framer Motion to reduce initial JavaScript payload.
- **Resource Hints:** `preconnect` and `dns-prefetch` utilized for low-latency asset delivery.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/petronas-web.git
   cd petronas-web
