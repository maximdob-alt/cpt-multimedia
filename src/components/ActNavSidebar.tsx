"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const acts = [
  { id: "hero-canvas", label: "Hero", numeral: "○" },
  { id: "act-I-section", label: "Act I", numeral: "I" },
  { id: "act-II-section", label: "Act II", numeral: "II" },
  { id: "act-III-section", label: "Act III", numeral: "III" },
  { id: "act-IV-section", label: "Act IV", numeral: "IV" },
];

export default function ActNavSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = acts.findIndex((a) => a.id === entry.target.id);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.3 }
    );

    acts.forEach((act) => {
      const el = document.getElementById(act.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
      {acts.map((act, i) => (
        <button
          key={act.id}
          onClick={() => {
            document.getElementById(act.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative flex items-center cursor-pointer"
          aria-label={`Navigate to ${act.label}`}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {activeIndex === i && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="absolute right-8 text-[9px] uppercase tracking-widest text-zinc-400 font-bold font-sans whitespace-nowrap"
              >
                {act.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Dot */}
          <motion.div
            animate={{
              scale: activeIndex === i ? 1 : 0.6,
              opacity: activeIndex === i ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-3 h-3 rounded-full border transition-colors duration-300 ${
              activeIndex === i
                ? "bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                : "bg-transparent border-zinc-600 group-hover:border-zinc-400"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
