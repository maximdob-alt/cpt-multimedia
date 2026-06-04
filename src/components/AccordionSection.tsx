"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Camera, Globe } from "lucide-react";

interface AccordionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  content: string;
}

export default function AccordionSection() {
  const [openId, setOpenId] = useState<string | null>("media-integration");

  const items: AccordionItem[] = [
    {
      id: "media-integration",
      icon: <FileText size={18} className="text-zinc-400" />,
      title: "Media Strand Integration",
      subtitle: "Multi-sensory synchronization framework",
      content: 
        "The system architecturally meshes three distinct nodes of HTML5 AudioContext streams with localized sound assets alongside fluid cinemagraph visuals. The synchronization of visual frequency modulations with real-time Web Audio API decibels ensures a multi-sensory synthesis. Each visual backdrop reacts dynamically to the canvas particle drift, reinforcing scroll narrative thresholds. Rather than serving as mere decorations, the audio drones and kinetic visuals form a single, cohesive sensory strand, immersing the user in the atmosphere of each narrative act."
    },
    {
      id: "camera-perspective",
      icon: <Camera size={18} className="text-zinc-400" />,
      title: "Low-Angle Camera Perspective Choices",
      subtitle: "Monumental framing and spatial phenomenology",
      content:
        "Choosing a low-angle camera perspective for the obsidian charcoal environment triggers a sense of monumental gravity. It shifts the user's relationship from a passive observer to an active explorer looking up at towering structures. The shallow focus depth directs optical emphasis toward microscopic tactile movements, making the digital texture feel physical. The resulting composition frames the user interface elements against vast, dark voids, elevating the dark mode visual hierarchy and magnifying the micro-interactions."
    },
    {
      id: "text-to-world",
      icon: <Globe size={18} className="text-zinc-400" />,
      title: "Text-to-World Structural Systems",
      subtitle: "Scroll-linked typography and dimensional layout",
      content:
        "The textual metadata drives the spatial environment. By linking scroll position and velocity directly to Framer Motion parameters, semantic paragraphs transition dynamically from abstract structures to crisp, legible content. This mapping binds reading speed to physical parallax translation, transforming text into a dynamic spatial world. As velocity accelerates, the asymmetrical grid sections toggle orientation, reflecting the kinetic energy of the user's scroll. The text itself behaves as a physical structure, scaling and fading within the viewport."
    }
  ];

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="technical-accordion-container" className="w-full flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={`glass-panel rounded-xl overflow-hidden border transition-all duration-500 ${
              isOpen 
                ? "border-white/20 bg-white/[0.04]" 
                : "border-white/5 hover:border-white/10 bg-transparent"
            }`}
          >
            {/* Header Trigger */}
            <button
              id={`accordion-trigger-${item.id}`}
              onClick={() => handleToggle(item.id)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors duration-300"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg border transition-all duration-500 ${
                  isOpen ? "bg-white text-black border-white" : "bg-white/5 border-white/5"
                }`}>
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                    className: isOpen ? "text-[#121212]" : "text-zinc-400"
                  })}
                </div>
                <div>
                  <h3 className="text-base font-serif font-medium tracking-wide text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans tracking-wide mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-zinc-500"
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            {/* Accordion Content Drawer */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                >
                  <div className="px-6 pb-6 pt-1 border-t border-white/5">
                    <p className="text-sm text-zinc-400 font-sans leading-relaxed tracking-wide pt-4 whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
