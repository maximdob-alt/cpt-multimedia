"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Maximize2, Play } from "lucide-react";

interface MediaAssetProps {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  title: string;
  onClick?: () => void;
  aspectRatio?: string;
}

export default function MediaAsset({
  id,
  type,
  src,
  alt,
  title,
  onClick,
  aspectRatio = "aspect-video",
}: MediaAssetProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  // #1 — Parallax: media moves slower than scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // #4 — 3D Tilt on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTiltStyle({
      rotateX: (y - 0.5) * -10,
      rotateY: (x - 0.5) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.button
      ref={containerRef}
      id={`media-asset-trigger-${id}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, margin: "-10%" }}
      animate={{
        rotateX: tiltStyle.rotateX,
        rotateY: tiltStyle.rotateY,
      }}
      transition={{
        scale: { type: "spring", stiffness: 100, damping: 22 },
        opacity: { duration: 0.6 },
        rotateX: { type: "spring", stiffness: 300, damping: 20 },
        rotateY: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{ perspective: 800 }}
      className={`relative w-full ${aspectRatio} rounded-xl overflow-hidden group text-left border border-white/10 bg-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-white/40 cursor-crosshair shadow-lg`}
      aria-label={`Open rationale modal for ${title}`}
    >
      {/* Media with parallax offset */}
      {type === "video" ? (
        <motion.video
          className="w-full h-full object-cover pointer-events-none filter brightness-90 group-hover:brightness-100 transition-all duration-500"
          style={{ y: parallaxY }}
          src={src}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <motion.img
          className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500"
          style={{ y: parallaxY }}
          src={src}
          alt={alt}
        />
      )}

      {/* Frosted details overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10 pointer-events-none">
        <div className="backdrop-blur-md bg-black/60 border border-white/10 rounded-lg p-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold font-sans">
              Click to inspect
            </span>
            <span className="text-xs text-white font-serif tracking-wide mt-0.5">
              {title}
            </span>
          </div>
          <div className="text-zinc-400">
            {type === "video" ? <Play size={14} fill="currentColor" /> : <Maximize2 size={14} />}
          </div>
        </div>
      </div>

      {/* Decorative focus frame */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-xl transition-all duration-500 pointer-events-none" />
    </motion.button>
  );
}
