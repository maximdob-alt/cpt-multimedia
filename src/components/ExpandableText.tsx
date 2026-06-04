"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  content: string;
}

export default function ExpandableText({ content }: ExpandableTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-start gap-4 mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md text-xs text-white uppercase tracking-wider font-sans font-bold transition-all duration-300"
      >
        Read full paragraph
        {isOpen ? (
          <ChevronUp size={14} className="text-zinc-400 group-hover:text-white" />
        ) : (
          <ChevronDown size={14} className="text-zinc-400 group-hover:text-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="overflow-hidden w-full"
          >
            <div className="p-6 rounded-xl border border-white/5 bg-[#1C1C1E]/60 backdrop-blur-md">
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
