"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface ContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
  assetTitle: string;
  rationale: string;
  mediaType: "image" | "video";
  mediaSrc: string;
}

export default function ContextModal({
  isOpen,
  onClose,
  assetId,
  assetTitle,
  rationale,
  mediaType,
  mediaSrc,
}: ContextModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Pause structural document scroll velocity when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Cancel speech on close
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    }

    return () => {
      document.body.style.overflow = "";
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSupported(!!window.speechSynthesis);
    }
  }, []);

  const handleAudioToggle = () => {
    if (!speechSupported) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      synth.cancel(); // Clear any queued speech

      const utterance = new SpeechSynthesisUtterance(rationale);
      utteranceRef.current = utterance;

      // Select a premium sounding voice if available
      const voices = synth.getVoices();
      // Prefer Google US English, Natural, or Microsoft voices
      const enVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en-"));
      
      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.rate = 0.95; // Slightly slower, elegant editorial pace
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      synth.speak(utterance);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Full-screen Lightbox Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-y-auto overflow-x-hidden shadow-2xl flex flex-col z-10"
            id={`modal-panel-${assetId}`}
          >
            {/* Close trigger button */}
            <button
              id={`modal-close-trigger-${assetId}`}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/45 border border-white/5 text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Visual Header */}
            <div className="relative w-full aspect-video md:h-64 bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-white/5">
              {mediaType === "video" ? (
                <video
                  className="w-full h-full object-cover pointer-events-none"
                  src={mediaSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={mediaSrc}
                  alt={assetTitle}
                />
              )}
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">
                  Documentary Asset Rationale
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-medium tracking-wide text-white">
                  {assetTitle}
                </h3>
              </div>

              {/* Rationale Text */}
              <p className="body-text text-sm md:text-base leading-relaxed text-zinc-300 tracking-wide font-sans">
                {rationale}
              </p>

              {/* Audio controller interface panel */}
              <div className="mt-4 flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <button
                    id={`modal-audio-btn-${assetId}`}
                    onClick={handleAudioToggle}
                    disabled={!speechSupported}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isPlaying
                        ? "bg-white text-[#1C1C1E] scale-105"
                        : "bg-white/5 border border-white/10 text-white hover:border-white hover:scale-105"
                    } ${!speechSupported ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    aria-label={isPlaying ? "Pause Voice Guide" : "Play Voice Guide"}
                  >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-sans">
                      Audio Voice Track
                    </span>
                    <span className="text-xs text-zinc-400 font-sans tracking-wide">
                      {isPlaying ? "Streaming Rationale Guide..." : speechSupported ? "Listen to voice guide narration" : "Audio synthesis unavailable"}
                    </span>
                  </div>
                </div>

                {/* Pulsing state visual indicator */}
                {isPlaying && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] uppercase tracking-widest text-green-400 font-bold font-sans">
                      Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
