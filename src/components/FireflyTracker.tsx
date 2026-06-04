"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function FireflyTracker() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // Find the centermost media asset or audio player
      const targets = Array.from(document.querySelectorAll('.media-asset, .audio-player'));
      
      let closest: Element | null = null;
      let minDistance = Infinity;
      const centerY = window.innerHeight / 2;

      targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - elementCenter);

        // If the element is somewhat in the middle of the screen
        if (distance < window.innerHeight * 0.35 && distance < minDistance) {
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    // Initial check
    setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // When no target, it sits on the right edge showing scroll progress
  const defaultY = useTransform(smoothProgress, [0, 1], ["24px", "calc(100vh - 24px)"]);
  const defaultX = "calc(100vw - 24px)";

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full z-50 pointer-events-none mix-blend-screen"
      style={{
        backgroundColor: "rgba(255,179,0,1)",
        boxShadow: targetRect ? "0 0 40px 10px rgba(255,179,0,0.4)" : "0 0 20px 4px rgba(255,179,0,0.6)",
      }}
      animate={{
        x: targetRect ? targetRect.left - 20 : defaultX, // Hover to the left side of the asset
        y: targetRect ? targetRect.top + targetRect.height / 2 : (defaultY as any),
        width: targetRect ? 35 : 8,
        height: targetRect ? 35 : 8,
        opacity: targetRect ? 0.8 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
      }}
    />
  );
}
