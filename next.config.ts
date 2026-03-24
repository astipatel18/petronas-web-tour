import type { NextConfig } from "next";

/**
 * 🛡️ TITAN SECURE CONTENT SECURITY POLICY (CSP)
 * 
 * - default-src 'self': Only allow content from our own domain by default.
 * - script-src: 'self' allows our scripts; 'unsafe-inline' is required for Next.js hydration.
 * - style-src: 'self' + 'unsafe-inline' allows Tailwind v4 and Framer Motion animations.
 * - img-src: Trusted sources for architecture photos (Unsplash) and UI icons.
 * - frame-src: Specifically allows the Google Maps iframe for the 360° Virtual Tour.
 * - connect-src: Allows your server to talk to Upstash Redis for security rate-limiting.
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://www.google.com https://www.google.com/maps;
    frame-ancestors 'none';
    connect-src 'self' https://*.upstash.io;
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  // Enable the React Compiler for high-performance rendering (Next.js 15+)
  reactCompiler: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 🔐 ENTERPRISE SECURITY HEADERS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;