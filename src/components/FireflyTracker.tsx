"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function FireflyTracker() {
  const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null);
  const [isSpotlighted, setIsSpotlighted] = useState(false);

  // Position Motion Values
  const fireflyX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const fireflyY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  // Raw scroll/motion data piped through spring configuration (stiffness: 80, damping: 20, mass: 0.5)
  const springX = useSpring(fireflyX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(fireflyY, { stiffness: 80, damping: 20, mass: 0.5 });

  // 1. Mouse Follower Baseline (when no active waypoint is intersected)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeTarget) {
        // Use clientX/clientY for viewport positioning (or transform to absolute document Y)
        fireflyX.set(e.clientX);
        fireflyY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeTarget, fireflyX, fireflyY]);

  // 2. Waypoint Intersection Observer & Spotlighting
  useEffect(() => {
    const waypoints = document.querySelectorAll("[data-waypoint]");
    
    // Observer targeting the middle third of the viewport
    const observerOptions = {
      root: null,
      rootMargin: "-33% 0px -33% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first target that is currently intersecting
      const intersectingEntry = entries.find((entry) => entry.isIntersecting);

      if (intersectingEntry) {
        const target = intersectingEntry.target as HTMLElement;
        setActiveTarget(target);
        setIsSpotlighted(true);
      } else {
        // Check if any waypoint remains in the middle third
        let foundAny = false;
        waypoints.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const midViewport = window.innerHeight / 2;
          // Check if element is in the middle third region
          if (rect.top < midViewport + 100 && rect.bottom > midViewport - 100) {
            setActiveTarget(el as HTMLElement);
            setIsSpotlighted(true);
            foundAny = true;
          }
        });

        if (!foundAny) {
          setActiveTarget(null);
          setIsSpotlighted(false);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    waypoints.forEach((el) => observer.observe(el));

    return () => {
      waypoints.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Update target coordinates dynamically on scroll/resize/frame
  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      if (activeTarget) {
        const rect = activeTarget.getBoundingClientRect();
        // Glide to target element's perimeter center
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        fireflyX.set(targetX);
        fireflyY.set(targetY);
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    if (activeTarget) {
      updatePosition();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTarget, fireflyX, fireflyY]);

  return (
    <motion.div
      id="firefly-particle"
      className="w-2.5 h-2.5 rounded-full bg-[#FFB300] z-50 pointer-events-none transition-all duration-300 firefly-glow"
      animate={{
        scale: isSpotlighted ? 1.4 : 1.0,
      }}
      // Dynamic inline style mapping to adjust position, inertia, and spotlight glow
      style={{
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        position: "fixed",
        boxShadow: isSpotlighted 
          ? "0 0 35px 12px rgba(255,179,0,0.9)" 
          : "0 0 20px 4px rgba(255,179,0,0.6)"
      }}
    />
  );
}
