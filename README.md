# 🗼 Petronas Twin Towers Digital Experience

A world-class, cinematic tourism platform for Malaysia's iconic landmark.

## 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Modern CSS-first approach)
- **Database:** MongoDB (Local/Atlas)
- **State Management:** Zustand (Single Page Booking Flow)
- **Authentication:** Auth.js v5 (Staff Portal)
- **Security:** CSRF protection, HttpOnly Cookies, and In-house Rate Limiting.
- **Communication:** Automated Ticketing via Nodemailer (SMTP).

## 🛠️ Installation & Setup
1. Clone the repo: `git clone https://github.com/your-user/repo.git`
2. Install dependencies: `npm install`
3. Create a `.env.local` file (see .env.example)
4. Run development server: `npm run dev`

## 🔒 Security Features
- **No-Third-Party Bot Protection:** Honeypot + Math Challenge.
- **Verification:** 6-digit OTP email verification for all bookings.
- **Audit Logs:** Full administrative logging of security events.