"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export default function FireflyTracker({ visible }: { visible: boolean }) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const targets = Array.from(
        document.querySelectorAll(".media-asset, .audio-player")
      );

      let closest: Element | null = null;
      let minDistance = Infinity;
      const centerY = window.innerHeight / 2;

      const topThird = window.innerHeight / 3;
      const bottomThird = window.innerHeight * (2 / 3);

      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - elementCenter);

        if (elementCenter > topThird && elementCenter < bottomThird && distance < minDistance) {
          minDistance = distance;
          closest = target;
        }
      });

      if (closest) {
        setTargetRect((closest as Element).getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollFraction = smoothProgress as any;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="firefly"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: targetRect ? targetRect.left - 24 : "calc(100vw - 32px)",
            y: targetRect
              ? targetRect.top + targetRect.height / 2
              : `calc(${scrollFraction} * (100vh - 48px) + 24px)`,
            width: targetRect ? 35 : 8,
            height: targetRect ? 35 : 8,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="fixed top-0 left-0 rounded-full z-50 pointer-events-none mix-blend-screen"
          style={{
            backgroundColor: "rgba(255,179,0,1)",
            boxShadow: targetRect
              ? "0 0 40px 12px rgba(255,179,0,0.5)"
              : "0 0 20px 4px rgba(255,179,0,0.6)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
