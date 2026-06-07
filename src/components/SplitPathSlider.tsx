"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

export default function SplitPathSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dragX = useMotionValue(0); // Will range from 0 to containerWidth

  // We set the initial drag position to 50% of the container once it's measured
  useEffect(() => {
    if (containerWidth > 0 && dragX.get() === 0) {
      dragX.set(containerWidth / 2);
    }
  }, [containerWidth, dragX]);

  // Convert dragX to a percentage for the clip-path
  const clipPathPercentage = useTransform(dragX, [0, containerWidth || 1000], [0, 100]);
  const clipPathValue = useTransform(clipPathPercentage, (val) => `inset(0 ${100 - val}% 0 0)`);

  const systemNodes = ["Get Born", "Go to School", "Get a Job", "Work 9 to 5", "Retire"];
  const humanNodes = ["Get Born", "Go to School", "Learn a New Skill", "Start a Business", "Fail / Succeed", "Family Vacations / Be Happy"];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20 relative select-none" ref={containerRef}>
      <div className="w-full h-[400px] sm:h-[500px] relative rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl">
        
        {/* Right Panel Element: "The Life I Want to Live" (Organic Loop) - Rendered underneath */}
        <div className="absolute inset-0 w-full h-full bg-[#1C1C1E] flex flex-col justify-center relative overflow-hidden p-8">
          <div className="absolute inset-0 opacity-40">
            {/* Organic, winding SVG path */}
            <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none" className="absolute inset-0">
              <path
                d="M -50 250 C 150 100, 200 450, 400 300 C 600 150, 700 450, 850 200 C 950 50, 1050 250, 1050 250"
                fill="none"
                stroke="rgba(255, 179, 0, 0.4)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="relative z-10 w-full h-full flex items-center">
            {/* Fluid Nodes positioned across the organic path visually */}
            {humanNodes.map((node, i) => (
              <div 
                key={i} 
                className="absolute flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${(i / (humanNodes.length - 1)) * 90 + 5}%`, 
                  top: i % 2 === 0 ? "35%" : "65%" 
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[rgba(255,179,0,0.8)] shadow-[0_0_12px_rgba(255,179,0,0.6)]" />
                <span className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 whitespace-nowrap bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                  {node}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 right-6 z-10">
            <span className="text-sm font-serif italic text-[rgba(255,179,0,0.8)] tracking-wide">
              The Life I Want to Live
            </span>
          </div>
        </div>

        {/* Left Panel Element: "The Line Determined by the System" (Rigid Axis) - Rendered on top and clipped */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-[#121212] flex flex-col justify-center items-center border-r border-white/20"
          style={{ clipPath: clipPathValue }}
        >
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-zinc-600 transform -translate-y-1/2" />
          <div className="relative w-full h-full flex justify-between items-center px-10">
            {systemNodes.map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-3 h-3 bg-zinc-400 border-[3px] border-[#121212] rounded-sm transform rotate-45" />
                <span className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap bg-[#121212] px-2">
                  {node}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-6 left-6 z-10">
            <span className="text-sm font-serif italic text-zinc-400 tracking-wide">
              The Line Determined by the System
            </span>
          </div>
        </motion.div>

        {/* Drag Handle Overlay */}
        <motion.div
          className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize z-20 group"
          style={{ x: dragX }}
          drag="x"
          dragConstraints={{ left: 0, right: containerWidth }}
          dragElastic={0}
          dragMomentum={false}
        >
          {/* Vertical line connecting the handle */}
          <div className="absolute inset-y-0 w-px bg-white/40 group-hover:bg-white/80 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          {/* The handle button */}
          <div className="relative w-8 h-12 bg-zinc-800 rounded-md border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <MoveHorizontal size={16} className="text-zinc-300" />
          </div>
        </motion.div>
        
      </div>
      
      {/* Helper text below slider */}
      <div className="mt-4 flex justify-center text-center">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold animate-pulse flex items-center gap-2">
          <MoveHorizontal size={12} /> Drag to Compare Paths
        </span>
      </div>
    </div>
  );
}
