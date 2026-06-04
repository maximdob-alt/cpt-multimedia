"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AmbientVideoProps {
  imageSrc: string;
  altText: string;
  effectType: "fog" | "fracture" | "hands";
}

export default function AmbientVideo({ imageSrc, altText, effectType }: AmbientVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add canvas particle effects to enhance the cinemagraph loop realism
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic mist/smoke particles for the fog effect
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const maxParticles = effectType === "fog" ? 40 : 15;

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: effectType === "fog" ? height * 0.7 + Math.random() * height * 0.3 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4 + (effectType === "fog" ? 0.2 : 0),
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * (effectType === "fog" ? 100 : 3) + 2,
        alpha: Math.random() * 0.15 + 0.05,
        decay: Math.random() * 0.002 + 0.0005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (effectType === "fog") {
        // Draw soft rolling mist particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          // Re-spawn dead particles
          if (p.alpha <= 0 || p.x > width + p.radius) {
            p.x = -p.radius;
            p.y = height * 0.7 + Math.random() * height * 0.3;
            p.alpha = Math.random() * 0.15 + 0.05;
          }

          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          gradient.addColorStop(0.5, `rgba(200, 200, 250, ${p.alpha * 0.4})`);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (effectType === "fracture") {
        // Slow float of microscopic shiny shards/particles in front of the eye
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha += p.decay * (Math.random() > 0.5 ? 1 : -1);

          if (p.alpha > 0.4) p.alpha = 0.4;
          if (p.alpha < 0.02) p.alpha = 0.02;

          // Wrap boundaries
          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (effectType === "hands") {
        // Depth-of-field dust motes floating slowly in the light beam
        particles.forEach((p) => {
          p.y -= 0.15; // float upwards
          p.x += Math.sin(p.y * 0.05) * 0.1;

          if (p.y < -p.radius) {
            p.y = height + p.radius;
            p.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(255, 240, 220, ${p.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effectType]);

  // Determine panning animations based on effect type
  const getPanAnimation = () => {
    switch (effectType) {
      case "fog":
        return {
          animate: {
            scale: [1.05, 1.12, 1.05],
            x: ["-1%", "1%", "-1%"],
            y: ["-0.5%", "0.5%", "-0.5%"],
          },
          transition: {
            duration: 35,
            ease: "easeInOut",
            repeat: Infinity,
          },
        };
      case "fracture":
        return {
          animate: {
            scale: [1.08, 1.03, 1.08],
            rotate: [0, 1.5, 0],
          },
          transition: {
            duration: 25,
            ease: "easeInOut",
            repeat: Infinity,
          },
        };
      case "hands":
        return {
          animate: {
            scale: [1.02, 1.09, 1.02],
            y: ["0%", "-1.5%", "0%"],
          },
          transition: {
            duration: 40,
            ease: "easeInOut",
            repeat: Infinity,
          },
        };
    }
  };

  const panAnim = getPanAnimation();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-zinc-950">
      {/* 16:9 Video component with poster fallback */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none opacity-40 mix-blend-lighten"
        poster={imageSrc}
        muted
        autoPlay
        loop
        playsInline
        aria-hidden="true"
      >
        {/* Safe fallback source that fails gracefully, triggering poster display */}
        <source src={`/video/${effectType}.mp4`} type="video/mp4" />
      </video>

      {/* Cinemagraph motion overlay using the generated images with active Ken Burns effect */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${imageSrc})` }}
        animate={panAnim.animate}
        transition={panAnim.transition as any}
        aria-label={altText}
      />

      {/* Floating Canvas particles overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />

      {/* Premium film grain scanner noise overlay */}
      <div className="absolute inset-0 w-full h-full cinemagraph-noise" />

      {/* Dark editorial vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 pointer-events-none" />
    </div>
  );
}
