"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PlayCircle, ArrowDown } from "lucide-react";
import AudioOrchestrator from "@/components/AudioOrchestrator";
import MediaAsset from "@/components/MediaAsset";
import ContextModal from "@/components/ContextModal";
import PhotoCarousel from "@/components/PhotoCarousel";
import DualTimelineBackground from "@/components/DualTimelineBackground";
import AccordionSection from "@/components/AccordionSection";
import ActNavSidebar from "@/components/ActNavSidebar";
import TypewriterText from "@/components/TypewriterText";
import SectionProgress from "@/components/SectionProgress";

// Helper component for upscale fade reveal on scroll (translating Y: 30px to 0px)
function ViewportReveal({ children, id, delay = 0 }: { children: React.ReactNode; id: string; delay?: number }) {
  return (
    <motion.div
      id={id}
      initial={{ y: 30, scale: 0.95, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 22,
        delay: delay
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// Asset interface
interface AssetConfig {
  id: string;
  title: string;
  rationale: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  alt: string;
}

// Act section IDs for keyboard navigation (#8)
const ACT_IDS = ["hero-canvas", "act-I-section", "act-II-section", "act-III-section", "act-IV-section"];

export default function Home() {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001
  });

  // #8 — Keyboard navigation between acts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentScroll = window.scrollY + window.innerHeight / 2;
        const sections = ACT_IDS.map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
        }).filter(Boolean) as { id: string; top: number }[];

        let targetId: string | null = null;
        if (e.key === "ArrowDown") {
          const next = sections.find((s) => s.top > currentScroll);
          targetId = next?.id ?? sections[sections.length - 1].id;
        } else {
          const prev = [...sections].reverse().find((s) => s.top < currentScroll - 50);
          targetId = prev?.id ?? sections[0].id;
        }
        if (targetId) document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }
      // Space to toggle current visible audio
      if (e.key === " " && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        const btns = ["play-btn-act-1", "play-btn-act-2", "play-btn-act-3"];
        for (const btnId of btns) {
          const el = document.getElementById(btnId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top > 0 && rect.bottom < window.innerHeight + 300) {
              el.click();
              break;
            }
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const [selectedAsset, setSelectedAsset] = useState<AssetConfig | null>(null);

  const assetsMap: Record<string, AssetConfig> = {
    "Cinematic_mm_film_style_A_s.mp4": {
      id: "Cinematic_mm_film_style_A_s.mp4",
      title: "Act I Backing Film: The Institutional Facade",
      rationale: "The vintage car moving blindly toward a looming, locked institutional facade in the mist.",
      mediaType: "video",
      mediaSrc: "/videos/Cinematic_mm_film_style_A_s.mp4",
      alt: "Vintage film roll showing a car heading into institutional gates under heavy mist."
    },
    "IMG_4006": {
      id: "IMG_4006",
      title: "IMG_4006 — Predetermined Pathway Frame",
      rationale: "Explains low-perspective camera framing emphasizing a predetermined, systemic pathway.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4006.jpg",
      alt: "Low perspective layout of structural linear paths framing visual constraint."
    },
    "IMG_4023": {
      id: "IMG_4023",
      title: "IMG_4023 — Institutional Ledgers",
      rationale: "Explains the Lifesaving swim logs archive acting as an institutional ledger of human grading.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4023.jpg",
      alt: "Scans of typed lifesaving log records indexing graded results."
    },
    "High_end_cinematic_macro_cinem.mp4": {
      id: "High_end_cinematic_macro_cinem.mp4",
      title: "Act II Panel Video: The Fracture Graph",
      rationale: "Explains macro fracture graphics detailing a sudden break in social awareness.",
      mediaType: "video",
      mediaSrc: "/videos/High_end_cinematic_macro_cinem.mp4",
      alt: "Cinematic close-up showing graphical digital textures fracturing."
    },
    "IMG_4013": {
      id: "IMG_4013",
      title: "IMG_4013 — Shadowed Isolation Frame",
      rationale: "Explains dark, shadowed self-portrait framing emphasizing isolation and identity tracking.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4013.jpg",
      alt: "High-contrast dark editorial silhouette of a figure locked in shadows."
    },
    "image0": {
      id: "image0",
      title: "image0 — Entrapment Portals",
      rationale: "Explains the tilted Dutch-angle framing of multi-panel closed doors symbolizing structural entrapment.",
      mediaType: "image",
      mediaSrc: "/images/image0.jpg",
      alt: "Dutch-angle tilted perspective of repetitive paneled wooden doors locked shut."
    },
    "IMG_3986.MP4": {
      id: "IMG_3986.MP4",
      title: "Act III Loop Video: Unalterable Destiny",
      rationale: "Explains raw footage of hands splitting beneath clinical lights as an unalterable destination metaphor.",
      mediaType: "video",
      mediaSrc: "/videos/IMG_3986.MP4",
      alt: "Raw high-definition macro loop of hands slowly dividing under bright overhead studio lights."
    },
    "IMG_4012": {
      id: "IMG_4012",
      title: "IMG_4012 — Grip of Agency",
      rationale: "Explains macro key grip rendering internal defiance and clinging tightly to personal agency.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4012.jpg",
      alt: "Macro focus on hands gripping tight to metallic lines in physical resistance."
    },
    "IMG_4024": {
      id: "IMG_4024",
      title: "IMG_4024 — Border Silhouettes",
      rationale: "Explains silhouette pressed tightly against a screen window boundary separating the inner sanctuary.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4024.jpg",
      alt: "Backlit silhouette pressed against wire screen mesh looking outward."
    }
  };

  const openAssetModal = (key: string) => {
    const config = assetsMap[key];
    if (config) {
      setSelectedAsset(config);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#121212] via-[#121212] to-[#1C1C1E] text-zinc-100 overflow-x-hidden font-sans selection:bg-white/20 selection:text-white cursor-reading">
      
      <motion.div 
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-white origin-left z-50 shadow-md shadow-white/20" 
        style={{ scaleX }}
      />

      {/* #10 — Film Grain */}
      <div className="film-grain" aria-hidden="true" />

      <DualTimelineBackground />

      {/* #2 — Act Navigation Sidebar */}
      <ActNavSidebar />

      <header className="fixed top-6 left-6 z-40 flex flex-col pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold">
          The Pre-Written Map
        </span>
        <span className="text-xs text-zinc-300 font-serif tracking-wide mt-1 italic">
          Finding the Self Within the System
        </span>
      </header>

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-none hidden md:flex flex-col gap-1">
        <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-sans">↑↓ Navigate · Space Play</span>
      </div>

      <main className="relative w-full z-10">
        
        {/* HERO CANVAS */}
        <section 
          id="hero-canvas"
          className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden z-10"
        >
          <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
             <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/Cinematic_mm_film_style_A_s.mp4"
              muted
              autoPlay
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black/90" />
          </div>

          <div className="max-w-4xl flex flex-col items-center z-10 px-6">
            <ViewportReveal id="hero-reveal">
              <span className="fluid-tracking-wide text-xs text-zinc-500 font-bold tracking-[0.3em]">
                Immersive Narrative
              </span>
              <h1 className="editorial-title text-5xl sm:text-7xl md:text-8xl mt-6 text-white font-bold uppercase tracking-tight leading-none">
                The Pre-Written Map
              </h1>
              <h2 className="editorial-title text-2xl sm:text-3xl mt-4 text-zinc-300 font-medium tracking-wide italic">
                Finding the Self Within the System
              </h2>
            </ViewportReveal>

            <ViewportReveal id="hero-button-reveal" delay={0.2}>
              <button 
                onClick={() => {
                  const act1 = document.getElementById("act-I-section");
                  if (act1) {
                    act1.scrollIntoView({ behavior: "smooth" });
                    // Optional: Try to trigger the audio play button if present
                    setTimeout(() => {
                      document.getElementById("play-btn-act-1")?.click();
                    }, 800);
                  }
                }}
                className="mt-12 group flex items-center justify-center gap-3 py-4 px-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-sm text-white uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-300 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                Play Audio Story
              </button>
            </ViewportReveal>

            <ViewportReveal id="hero-scroll-prompt" delay={0.4}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="mt-16 text-zinc-500 cursor-pointer flex flex-col items-center gap-2 hover:text-white transition-colors duration-300"
                onClick={() => {
                  document.getElementById("act-I-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold font-sans">Scroll to Begin</span>
                <ArrowDown size={14} />
              </motion.div>
            </ViewportReveal>
          </div>
        </section>

        {/* ACT I: The Illusion of the Horizon (Asymmetrical Split) */}
        <section id="act-I-section" className="relative w-full py-40 flex items-center justify-center border-b border-white/5 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto z-10 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Glassmorphic blockquote + Circular Audio */}
            <div className="col-span-1 md:col-span-5 flex flex-col gap-10 sticky top-40">
              <ViewportReveal id="act-1-left">
                <div className="glass-panel p-8 sm:p-10 flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act I</span>
                    <h2 className="editorial-title text-3xl sm:text-4xl text-white font-medium">The Illusion of the Horizon</h2>
                  </div>
                  {/* #6 — Section Progress */}
                  <SectionProgress sectionId="act-I-section" />
                  {/* #3 — Typewriter blockquote */}
                  <blockquote className="border-l-2 border-white/20 pl-5 py-2 italic font-serif text-zinc-200 text-xl leading-relaxed">
                    <TypewriterText
                      text="Not all who wander are lost, but many who follow the path were never given a compass."
                      speed={28}
                    />
                  </blockquote>
                  <p className="body-text text-base text-zinc-400">
                    We blindly push ourselves down uncomfortable paths, setting arbitrary personal challenges and operating under the quiet illusion that the horizon belongs entirely to us.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/5">
                    <AudioOrchestrator actIndex={1} title="Act I Ambient Drone" />
                  </div>
                </div>
              </ViewportReveal>
            </div>

            {/* Right Column: Staggered Media Frame Grid */}
            <div className="col-span-1 md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 h-[600px] rounded-xl overflow-hidden border border-white/10 glass-panel">
                 <MediaAsset
                    id="Cinematic_mm_film_style_A_s.mp4"
                    type="video"
                    src="/videos/Cinematic_mm_film_style_A_s.mp4"
                    alt="Institutional Facade Video Loop"
                    title="Act I Video"
                    onClick={() => openAssetModal("Cinematic_mm_film_style_A_s.mp4")}
                 />
              </div>
              <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 glass-panel mt-6 sm:mt-12">
                 <MediaAsset
                    id="IMG_4006"
                    type="image"
                    src="/images/IMG_4006.jpg"
                    alt="Predetermined Pathway Frame"
                    title="IMG_4006"
                    onClick={() => openAssetModal("IMG_4006")}
                    aspectRatio="h-full w-full object-cover"
                 />
              </div>
              <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-white/10 glass-panel">
                 <MediaAsset
                    id="IMG_4023"
                    type="image"
                    src="/images/IMG_4023.jpg"
                    alt="Institutional Ledgers"
                    title="IMG_4023"
                    onClick={() => openAssetModal("IMG_4023")}
                    aspectRatio="h-full w-full object-cover"
                 />
              </div>
            </div>

          </div>
        </section>

        {/* ACT II: The Cold Mirror (Reversed Split) */}
        <section id="act-II-section" className="relative w-full py-40 flex items-center justify-center border-b border-white/5 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto z-10 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Horizontal Macro Video + Photo Grid + Audio */}
            <div className="col-span-1 md:col-span-7 flex flex-col gap-8 order-2 md:order-1">
              <ViewportReveal id="act-2-left">
                <div className="w-full h-64 sm:h-[400px] rounded-xl overflow-hidden border border-white/10 glass-panel">
                  <MediaAsset
                    id="High_end_cinematic_macro_cinem.mp4"
                    type="video"
                    src="/videos/High_end_cinematic_macro_cinem.mp4"
                    alt="Fracture Animation"
                    title="Act II Video"
                    onClick={() => openAssetModal("High_end_cinematic_macro_cinem.mp4")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-xl overflow-hidden border border-white/10 glass-panel">
                    <MediaAsset
                      id="IMG_4013"
                      type="image"
                      src="/images/IMG_4013.jpg"
                      alt="Identity Shadow"
                      title="IMG_4013"
                      onClick={() => openAssetModal("IMG_4013")}
                      aspectRatio="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden border border-white/10 glass-panel">
                    <MediaAsset
                      id="image0"
                      type="image"
                      src="/images/image0.jpg"
                      alt="Locked Door Portals"
                      title="image0"
                      onClick={() => openAssetModal("image0")}
                      aspectRatio="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-2 w-full p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4">
                  <AudioOrchestrator actIndex={2} title="Act II Ambient Drone" />
                </div>
              </ViewportReveal>
            </div>

            {/* Right Column: Massive Typographic Quote Block */}
            <div className="col-span-1 md:col-span-5 flex flex-col gap-6 order-1 md:order-2">
              <ViewportReveal id="act-2-right">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act II</span>
                <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-tight mb-4">
                  The Cold Mirror
                </h2>
                {/* #6 — Section Progress */}
                <SectionProgress sectionId="act-II-section" />
                {/* #3 — Typewriter blockquote */}
                <h3 className="editorial-title text-2xl text-zinc-300 italic mt-6 mb-6">
                  <TypewriterText
                    text="It's like walking past a mirror you've walked past every day of your life, and suddenly it shows you something else…"
                    speed={22}
                  />
                </h3>
                <p className="body-text text-base text-zinc-400">
                  To realize that your life has been quietly decided by a system you did not choose is a deep, heavy trauma. True growth starts not with comfort, but with the uncomfortable, chilling realization of how the world truly operates.
                </p>
              </ViewportReveal>
            </div>

          </div>
        </section>

        {/* ACT III: Halting the Resistance (Cinematic Single Column) */}
        <section id="act-III-section" className="relative w-full py-40 flex flex-col items-center justify-center border-b border-white/5 overflow-hidden">
          <div className="w-full max-w-4xl mx-auto z-10 px-6">
            <ViewportReveal id="act-3-center">
              <div className="glass-panel p-10 sm:p-16 flex flex-col items-center text-center gap-10">
                <div className="flex flex-col items-center gap-4 w-full">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act III</span>
                  <h2 className="editorial-title text-4xl sm:text-6xl text-white font-medium">Halting the Resistance</h2>
                  {/* #6 — Section Progress */}
                  <SectionProgress sectionId="act-III-section" />
                </div>
                
                <div className="w-full h-64 sm:h-[400px] rounded-xl overflow-hidden border border-white/10 mt-4 mb-4 relative">
                   <div className="absolute inset-0 bg-zinc-950 pointer-events-none opacity-25 z-0" />
                   <MediaAsset
                      id="IMG_3986.MP4"
                      type="video"
                      src="/videos/IMG_3986.MP4"
                      alt="Unalterable Destiny Metaphor"
                      title="Act III Video"
                      onClick={() => openAssetModal("IMG_3986.MP4")}
                    />
                </div>

                {/* #3 — Typewriter for Act III quote */}
                <blockquote className="border-l-2 border-white/20 pl-5 py-2 italic font-serif text-zinc-200 text-xl leading-relaxed text-left max-w-xl">
                  <TypewriterText
                    text="The only journey is the one within."
                    speed={40}
                  />
                </blockquote>
                <p className="body-text text-lg sm:text-xl text-zinc-300 max-w-2xl">
                  By accepting our past and refusing to let it define our future capacity to love, we reclaim our humanity. The choice to remain deeply connected to others is the most human—and therefore the most revolutionary—act we can perform.
                </p>

                <div className="w-full max-w-xs mt-6">
                  <AudioOrchestrator actIndex={3} title="Act III Resolved Octave" />
                </div>
              </div>
            </ViewportReveal>
          </div>
        </section>

        {/* ACT IV: The Connected Map (Multi-column Grid Block) */}
        <section id="act-IV-section" className="relative w-full py-40 flex items-center justify-center border-b border-white/5 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto z-10 px-6 sm:px-12 flex flex-col gap-16">
            
            <ViewportReveal id="act-4-header">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/10 pb-8">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act IV</span>
                  <h2 className="editorial-title text-4xl sm:text-5xl text-white font-medium mt-2">The Connected Map</h2>
                </div>
                {/* Stylized Audio Toggle Switch (Placeholder for Act IV Audio) */}
                <button 
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const isPlaying = btn.getAttribute("data-playing") === "true";
                    btn.setAttribute("data-playing", isPlaying ? "false" : "true");
                    btn.innerHTML = isPlaying 
                      ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-circle text-[#FFB300]"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> Initialize Array'
                      : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-circle text-white"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg> Array Active';
                    btn.className = isPlaying
                      ? "flex items-center gap-3 px-5 py-3 rounded-full glass-panel text-xs text-white uppercase tracking-wider font-bold transition-all hover:bg-white/10"
                      : "flex items-center gap-3 px-5 py-3 rounded-full border border-white/40 bg-white/10 text-xs text-white uppercase tracking-wider font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]";
                  }}
                  data-playing="false"
                  className="flex items-center gap-3 px-5 py-3 rounded-full glass-panel text-xs text-white uppercase tracking-wider font-bold transition-all hover:bg-white/10"
                >
                  <PlayCircle size={16} className="text-[#FFB300]" /> Initialize Array
                </button>
              </div>
            </ViewportReveal>

            {/* Three distinct text block columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              
              <ViewportReveal id="act-4-col-1" delay={0.1}>
                <div className="glass-panel p-8 h-full flex flex-col gap-6">
                  <h4 className="font-sans font-semibold text-lg text-white border-b border-white/10 pb-4">
                    Text-to-Self Connections
                  </h4>
                  <p className="body-text text-sm text-zinc-400 leading-relaxed">
                    Reading about Kathy H. resisting the urge to constantly look back at Hailsham connects deeply to how parts of my own past still affect how I think. Trying not to think about a memory or a past chapter can actually make it stay with you more. When Kathy finally stops resisting, it feels like an act of mature acceptance—something I try to practice as I step into heavier, high-stakes adult responsibilities while trying to hold onto the freedom of my youth.
                  </p>
                </div>
              </ViewportReveal>

              <ViewportReveal id="act-4-col-2" delay={0.2}>
                <div className="glass-panel p-8 h-full flex flex-col gap-6">
                  <h4 className="font-sans font-semibold text-lg text-white border-b border-white/10 pb-4">
                    Text-to-World Connections
                  </h4>
                  <p className="body-text text-sm text-zinc-400 leading-relaxed">
                    The central conflict of the novel directly mirrors modern real-world systems. Society frequently praises people for their labor, their output, and what they can produce, while ignoring who they are as individuals. We see this in hyper-competitive corporate structures and gig economies where human beings are treated like functional tools or algorithms rather than complex people. The characters' controlled futures remind us of how easily modern power structures can mask cruelty behind a kind, corporate face.
                  </p>
                </div>
              </ViewportReveal>

              <ViewportReveal id="act-4-col-3" delay={0.3}>
                <div className="glass-panel p-8 h-full flex flex-col gap-6">
                  <h4 className="font-sans font-semibold text-lg text-white border-b border-white/10 pb-4">
                    Text-to-Text Connections
                  </h4>
                  <p className="body-text text-sm text-zinc-400 leading-relaxed">
                    This narrative connects profoundly to other dystopian literature where society decides a citizen's function before they are even born. Just like in stories where children are assigned specific lifelong careers by a ruling council, *Never Let Me Go* shows the tragedy of a life completely mapped out by authority. However, while other books focus on breaking the system through a massive revolution, Ishiguro takes a more realistic, heartbreaking route: showing that when the external line is locked in place, the true rebellion is simply keeping your humanity, your emotions, and your relationships alive.
                  </p>
                </div>
              </ViewportReveal>

            </div>
          </div>
        </section>

        {/* Carousel Segment */}
        <section id="photo-carousel-segment" className="relative w-full py-24 px-6 sm:px-12 md:px-20">
          <div className="w-full max-w-7xl mx-auto z-20">
            <PhotoCarousel />
          </div>
        </section>

        {/* Documentation Segment */}
        <section id="documentation-segment" className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 sm:px-12 md:px-20">
          <div className="w-full max-w-4xl z-20 flex flex-col gap-12">
            <div className="flex flex-col items-center text-center">
              <span className="fluid-tracking-wide text-xs text-zinc-500 font-bold tracking-[0.3em]">
                System Architecture
              </span>
              <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl mt-6 text-white font-light tracking-wide uppercase">
                Technical Documentation
              </h2>
              <div className="w-12 h-[1px] bg-white/20 mt-6" />
            </div>
            <AccordionSection />
          </div>
        </section>

      </main>

      <footer className="relative z-10 w-full py-12 text-center border-t border-white/5 bg-black/50">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-medium">
          The Pre-Written Map © 2026. Design & Architecture Editorial.
        </p>
      </footer>

      <ContextModal
        isOpen={selectedAsset !== null}
        onClose={() => setSelectedAsset(null)}
        assetId={selectedAsset?.id || ""}
        assetTitle={selectedAsset?.title || ""}
        rationale={selectedAsset?.rationale || ""}
        mediaType={selectedAsset?.mediaType || "image"}
        mediaSrc={selectedAsset?.mediaSrc || ""}
      />

    </div>
  );
}
