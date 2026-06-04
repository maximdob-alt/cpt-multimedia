"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, MoveHorizontal } from "lucide-react";

interface CarouselItem {
  id: string;
  src: string;
  title: string;
  caption: string;
}

export default function PhotoCarousel() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items: CarouselItem[] = [
    {
      id: "photo1",
      src: "/images/IMG_4006.jpg",
      title: "Photo 1: Low-Angle Road",
      caption: "Illustrates how perspective tricks the traveler into running toward a pre-set horizon."
    },
    {
      id: "photo2",
      src: "/images/IMG_4023.jpg",
      title: "Photo 2: Overhead Archive",
      caption: "Captures the fragmented process of building identity out of unverified authority figures."
    },
    {
      id: "photo3",
      src: "/images/IMG_4013.jpg",
      title: "Photo 3: Silhouette Reflex",
      caption: "Visualizes the chilling psychological alienation of realizing you are perceived as a tool."
    },
    {
      id: "photo4",
      src: "/images/image0.jpg",
      title: "Photo 4: Dutch Angle Gate",
      caption: "Uses a tilted structural horizon line to evoke system-wide unease and confinement."
    },
    {
      id: "photo5",
      src: "/images/IMG_4012.jpg",
      title: "Photo 5: Macro Grip",
      caption: "Isolates human touch to signify holding onto memory despite absolute external limits."
    },
    {
      id: "photo6",
      src: "/images/IMG_4024.jpg",
      title: "Photo 6: Framed Outlook",
      caption: "Places an internal architectural frame around the view to depict the sanctuary within the mind."
    }
  ];

  return (
    <div 
      id="photo-carousel-panel"
      className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-[12px] flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h3 className="text-base font-serif font-medium tracking-wide text-zinc-100">
              Interactive Photo Carousel
            </h3>
            <p className="text-xs text-zinc-500 font-sans tracking-wide mt-0.5">
              Drag horizontally to scroll through the system narrative ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">
          <span>Drag Track</span>
          <MoveHorizontal size={12} className="animate-pulse" />
        </div>
      </div>

      {/* Constraints boundary */}
      <div ref={constraintsRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing py-2 select-none">
        <motion.div
          drag="x"
          dragConstraints={{ left: -750, right: 0 }}
          dragElastic={0.15}
          className="flex gap-6 w-max px-2"
        >
          {items.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative w-64 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-lg flex-shrink-0"
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover filter brightness-90 transition-all duration-500"
                  draggable={false}
                />

                {/* Header tag */}
                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-black/60 border border-white/5 backdrop-blur-sm">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold font-sans">
                    {item.title}
                  </span>
                </div>

                {/* Hover slide-up mask */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", stiffness: 180, damping: 20 }}
                      className="absolute inset-0 bg-black/85 backdrop-blur-[3px] p-5 flex flex-col justify-end border-t border-white/10"
                    >
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-sans mb-1">
                        Perspective Node
                      </span>
                      <p className="text-xs text-zinc-100 font-serif leading-relaxed tracking-wide italic">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
