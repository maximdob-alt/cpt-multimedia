"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioOrchestratorProps {
  actIndex: number; // 1, 2, or 3
  title: string;
}

export default function AudioOrchestrator({ actIndex, title }: AudioOrchestratorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Web Audio API states
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Visualizer bar values state
  const [heights, setHeights] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10, 10, 10]);

  useEffect(() => {
    // Create HTML5 audio element
    const audio = new Audio(`/audio/act${actIndex}.mp3`);
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Handle track ended just in case loop is false
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Try to close context on unmount
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, [actIndex]);

  // Pause audio when scrolled out of view
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isPlaying) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isPlaying]);

  // Hook Web Audio API nodes
  const initWebAudio = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      // 1. Create Audio Context Node
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // 2. Create Analyser Node
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small fft for 10 bars
      analyserRef.current = analyser;

      // 3. Create Media Source Node
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current = source;

      // 4. Wire everything
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch (err) {
      console.warn("Web Audio API not fully supported or blocked:", err);
    }
  };

  // Animation loop to read frequency data
  const updateVisuals = () => {
    if (!isPlaying) return;

    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Select 10 bins to display
      const newHeights = Array.from({ length: 10 }, (_, idx) => {
        // Map frequency index
        const dataIdx = Math.floor((idx / 10) * bufferLength);
        const value = dataArray[dataIdx] || 0;
        // Normalize value (0 to 255) to bar height (4px to 48px)
        return Math.max(4, (value / 255) * 44 + 4);
      });
      setHeights(newHeights);
    } else {
      // Synth visualizer fallback if audio context blocked/fails
      setHeights(
        Array.from({ length: 10 }, () => Math.max(4, Math.random() * 40 + 4))
      );
    }

    animationRef.current = requestAnimationFrame(updateVisuals);
  };

  useEffect(() => {
    if (isPlaying) {
      updateVisuals();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Smoothly reset bars to 4px
      setHeights([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    }
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    // Initialize audio context on user interaction
    initWebAudio();

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause all other instances if you want single playback (optional, let's allow it to run)
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div 
      ref={containerRef}
      id={`audio-orchestrator-act-${actIndex}`}
      className="glass-panel flex flex-col md:flex-row items-center justify-between p-4 rounded-xl gap-4 border border-white/5 transition-all duration-300 hover:border-white/15"
    >
      {/* Control Details */}
      <div className="flex items-center gap-4">
        <button
          id={`play-btn-act-${actIndex}`}
          onClick={togglePlay}
          className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${
            isPlaying 
              ? "bg-white text-[#121212] border-white shadow-lg shadow-white/10" 
              : "bg-transparent text-white border-white/20 hover:border-white hover:scale-105"
          }`}
          aria-label={isPlaying ? `Pause Act ${actIndex}` : `Play Act ${actIndex}`}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-1" fill="currentColor" />}
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 font-sans uppercase tracking-widest font-semibold">
            Sound Node — Act {actIndex}
          </span>
          <span className="text-sm text-zinc-100 font-serif font-medium tracking-wide">
            {title}
          </span>
        </div>
      </div>

      {/* SVG Wave Visualizer & Mute controller */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-end">
        {/* SVG Audio Visualizer Wave component */}
        <svg
          id={`visualizer-act-${actIndex}`}
          width="120"
          height="50"
          className="overflow-visible"
          aria-label="Audio Visualizer Wave"
        >
          <g transform="translate(10, 25)">
            {heights.map((h, i) => {
              const xPos = i * 10;
              return (
                <rect
                  key={i}
                  x={xPos}
                  y={-h / 2}
                  width="4"
                  height={h}
                  rx="2"
                  className={`fill-current transition-all duration-75 ${
                    isPlaying 
                      ? "text-white opacity-85" 
                      : "text-zinc-700 opacity-40"
                  }`}
                  style={{
                    // If playing, apply dynamic style derived from Web Audio analyser
                    height: `${h}px`,
                    y: `${-h / 2}px`,
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* Low-profile mute toggle */}
        <button
          id={`mute-btn-act-${actIndex}`}
          onClick={toggleMute}
          disabled={!isPlaying}
          className={`p-2 rounded-lg border transition-all duration-300 ${
            !isPlaying
              ? "text-zinc-600 border-transparent cursor-not-allowed opacity-50"
              : isMuted
              ? "text-red-400 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
              : "text-zinc-400 border-white/5 hover:text-white hover:border-white/20"
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
