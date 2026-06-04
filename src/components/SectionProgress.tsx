"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface SectionProgressProps {
  sectionId: string;
}

export default function SectionProgress({ sectionId }: SectionProgressProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  // We use a callback ref approach: find the section by ID
  if (typeof document !== "undefined" && !sectionRef.current) {
    sectionRef.current = document.getElementById(sectionId);
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="section-progress-track w-full mt-4">
      <motion.div className="section-progress-fill" style={{ width }} />
    </div>
  );
}
