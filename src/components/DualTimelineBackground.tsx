"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function DualTimelineBackground() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden">
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="w-full h-full opacity-[0.15]"
      >
        {/* Track 1: System Timeline (Horizontal axis through the top half) */}
        <motion.line
          x1="0"
          y1="250"
          x2="1000"
          y2="250"
          stroke="#F5F5F7"
          strokeWidth="1"
          strokeDasharray="4 12"
          style={{ pathLength: smoothProgress }}
        />
        <motion.line
          x1="0"
          y1="250"
          x2="1000"
          y2="250"
          stroke="#F5F5F7"
          strokeWidth="0.3"
          style={{ pathLength: smoothProgress }}
        />

        {/* Track 2: Human Timeline (Fluid, breaks away, chaotic loops, settles at bottom footer) */}
        <motion.path
          d="
            M 0,250 
            C 100,250 150,150 200,300 
            S 250,450 300,200 
            S 350,100 400,400 
            C 450,700 500,50 550,500 
            S 600,800 650,400
            S 700,200 750,700
            C 780,950 820,800 850,850
          "
          stroke="#F5F5F7"
          strokeWidth="2"
          fill="none"
          style={{ pathLength: smoothProgress }}
        />

        {/* Geometric Node Web (End State at bottom footer) */}
        <motion.g style={{ opacity: smoothProgress }}>
          {/* Main web lines from the end of the human path (850, 850) */}
          <path d="M 850,850 L 900,800 L 950,880 L 1000,850" stroke="#F5F5F7" strokeWidth="1" fill="none" opacity="0.6"/>
          <path d="M 850,850 L 880,920 L 960,950 L 1000,900" stroke="#F5F5F7" strokeWidth="1" fill="none" opacity="0.5"/>
          <path d="M 900,800 L 920,850 L 880,920" stroke="#F5F5F7" strokeWidth="0.5" fill="none" opacity="0.4"/>
          <path d="M 950,880 L 960,950" stroke="#F5F5F7" strokeWidth="0.5" fill="none" opacity="0.4"/>
          <path d="M 920,850 L 980,820 L 1000,850" stroke="#F5F5F7" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <path d="M 880,920 L 900,980 L 960,950" stroke="#F5F5F7" strokeWidth="0.5" fill="none" opacity="0.3"/>
          
          {/* Intersection Nodes */}
          <circle cx="850" cy="850" r="4" fill="#F5F5F7" />
          <circle cx="900" cy="800" r="3" fill="#F5F5F7" />
          <circle cx="950" cy="880" r="3" fill="#F5F5F7" />
          <circle cx="880" cy="920" r="3.5" fill="#F5F5F7" />
          <circle cx="960" cy="950" r="2.5" fill="#F5F5F7" />
          <circle cx="920" cy="850" r="2" fill="#F5F5F7" />
          <circle cx="980" cy="820" r="2" fill="#F5F5F7" />
          <circle cx="900" cy="980" r="2" fill="#F5F5F7" />
        </motion.g>
      </svg>
    </div>
  );
}
