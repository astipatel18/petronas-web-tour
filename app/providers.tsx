// "use client";

// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   );
// }





"use client";

import React from "react";
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";

/**
 * 🚀 PERFORMANCE OPTIMIZATION:
 * We use 'LazyMotion' with 'domMax' features to reduce initial JS bundle size.
 * 'domMax' includes support for animations, exit effects (AnimatePresence), 
 * and gestures (drag/hover).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <AnimatePresence mode="wait">
        {/* 
           🛡️ Note: Use 'm' instead of 'motion' for the light-weight component.
           'strict' prop ensures we don't accidentally pull in the heavy engine.
        */}
        <m.div
          key="root-presence"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}