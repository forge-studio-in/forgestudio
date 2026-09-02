"use client";

import { motion } from "framer-motion";

const capabilities = [
  "SOFTWARE",
  "WEB",
  "DESIGN",
  "MEDIA",
  "MARKETING",
  "AI & AUTOMATION",
];

export function CapabilityStrip() {
  // We duplicate the array to create a seamless marquee effect
  const marqueeItems = [...capabilities, ...capabilities, ...capabilities];

  return (
    <div className="w-full bg-surface-light border-y border-border py-4 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
          className="flex gap-8 md:gap-16 items-center px-4 md:px-8 shrink-0"
        >
          {marqueeItems.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-8 md:gap-16">
              <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-foreground/80">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
