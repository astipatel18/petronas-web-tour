// import type { NextConfig } from "next";

// /**
//  * 🛡️ TITAN SECURE CONTENT SECURITY POLICY (CSP)
//  * 
//  * - default-src 'self': Only allow content from our own domain by default.
//  * - script-src: 'self' allows our scripts; 'unsafe-inline' is required for Next.js hydration.
//  * - style-src: 'self' + 'unsafe-inline' allows Tailwind v4 and Framer Motion animations.
//  * - img-src: Trusted sources for architecture photos (Unsplash) and UI icons.
//  * - frame-src: Specifically allows the Google Maps iframe for the 360° Virtual Tour.
//  * - connect-src: Allows your server to talk to Upstash Redis for security rate-limiting.
//  */
// const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'unsafe-inline';
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' blob: data: https://images.unsplash.com;
//     font-src 'self' data:;
//     object-src 'none';
//     base-uri 'self';
//     form-action 'self';
//     frame-src 'self' https://www.google.com https://www.google.com/maps;
//     frame-ancestors 'none';
//     connect-src 'self' https://*.upstash.io;
//     upgrade-insecure-requests;
// `.replace(/\s{2,}/g, " ").trim();

// const nextConfig: NextConfig = {
//   // Enable the React Compiler for high-performance rendering (Next.js 15+)
//   reactCompiler: true,
  
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },

//   // 🔐 ENTERPRISE SECURITY HEADERS
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Content-Security-Policy",
//             value: cspHeader,
//           },
//           {
//             key: "X-Frame-Options",
//             value: "DENY",
//           },
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "Referrer-Policy",
//             value: "strict-origin-when-cross-origin",
//           },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=31536000; includeSubDomains; preload",
//           },
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
//           },
//           {
//             key: "X-XSS-Protection",
//             value: "1; mode=block",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;







// import type { NextConfig } from "next";

// /**
//  * 🛡️ TITAN SECURE CONTENT SECURITY POLICY (CSP)
//  * 
//  * - default-src 'self': Restricts all content to our own domain by default.
//  * - script-src: 'self' + 'unsafe-inline' allows Next.js hydration and core functions.
//  * - style-src: 'self' + 'unsafe-inline' is required for Tailwind CSS v4 and Framer Motion.
//  * - img-src: Strictly allows local images and high-res architecture from Unsplash.
//  * - font-src: Allows local fonts and data-uri fonts used by UI libraries.
//  * - frame-src: Specific whitelist for the 360° Virtual Tour (Google Maps).
//  * - connect-src 'self': Removed Upstash. Only allows requests to our own API/Server Actions.
//  */
// const cspHeader = `
//     default-src 'self';
//     script-src 'self' 'unsafe-inline';
//     style-src 'self' 'unsafe-inline';
//     img-src 'self' blob: data: https://images.unsplash.com;
//     font-src 'self' data:;
//     object-src 'none';
//     base-uri 'self';
//     form-action 'self';
//     frame-src 'self' https://www.google.com https://www.google.com/maps;
//     frame-ancestors 'none';
//     connect-src 'self';
//     upgrade-insecure-requests;
// `.replace(/\s{2,}/g, " ").trim();

// const nextConfig: NextConfig = {
//   // 🚀 Performance: React Compiler for Next.js 15+ 
//   reactCompiler: true,
  
//   // 🖼️ Image Optimization
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },

//   // 🔐 ENTERPRISE-GRADE SECURITY HEADERS
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Content-Security-Policy",
//             value: cspHeader,
//           },
//           {
//             key: "X-Frame-Options",
//             value: "DENY",
//           },
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "Referrer-Policy",
//             value: "strict-origin-when-cross-origin",
//           },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=31536000; includeSubDomains; preload",
//           },
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
//           },
//           {
//             key: "X-XSS-Protection",
//             value: "1; mode=block",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;





import type { NextConfig } from "next";

// 🛠️ Check if we are in development mode
const isDev = process.env.NODE_ENV === "development";

/**
 * 🛡️ TITAN SECURE CONTENT SECURITY POLICY (CSP)
 * 
 * - default-src 'self': Restricts all content to our own domain by default.
 * - script-src: Added YouTube and Google domains to allow the 360° player logic.
 * - frame-src: Specific whitelist for YouTube Embeds and Google Maps.
 * - img-src: Added i.ytimg.com for YouTube video thumbnails.
 */
const getCspHeader = () => {
  const policy = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "https://www.youtube.com",
      "https://s.ytimg.com",
      "https://maps.googleapis.com",
      // 🚀 Add 'unsafe-eval' only in development to fix Next.js/Turbopack errors
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'", 
      "blob:", 
      "data:", 
      "https://images.unsplash.com", 
      "https://i.ytimg.com", // 🎥 YouTube Thumbnails
      "https://maps.gstatic.com",
      "https://maps.googleapis.com"
    ],
    "font-src": ["'self'", "data:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-src": [
      "'self'", 
      "https://www.youtube.com", 
      "https://www.youtube-nocookie.com", 
      "https://www.google.com", 
      "https://www.google.com/maps"
    ],
    "media-src": [
      "'self'", 
      "blob:", 
      "data:", 
      "https://assets.mixkit.co"
    ],
    "frame-ancestors": ["'none'"],
    "connect-src": [
      "'self'", 
      "https://www.youtube.com", 
      "https://google.com",
      "https://images.unsplash.com",
      "*.upstash.io"
    ],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(policy)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");
};

const nextConfig: NextConfig = {
  // 🚀 Performance: React Compiler for Next.js 15+ 
  reactCompiler: true,
  
  // 🖼️ Image Optimization
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

  // 🔐 ENTERPRISE-GRADE SECURITY HEADERS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: getCspHeader(),
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
            value: "camera=(), microphone=(), geolocation=(), font-display-late-swap=()",
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