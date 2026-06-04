"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TextCarousel() {
  const phrases = [
    "Following a map we didn't draw.",
    "Facing the reflection of the system.",
    "Protecting the sanctuary of the mind."
  ];

  return (
    <div className="w-full bg-[#1C1C1E] border-b border-white/5 py-3 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-16 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35,
        }}
      >
        {/* Render twice for seamless looping */}
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {phrases.map((phrase, j) => (
              <div key={`${i}-${j}`} className="flex items-center gap-16">
                <span className="text-xs font-sans tracking-[0.2em] uppercase text-zinc-500">
                  {phrase}
                </span>
                <span className="text-white/20 text-xs">◆</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
