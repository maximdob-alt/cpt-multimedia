"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PlayCircle, ArrowDown } from "lucide-react";
import AudioOrchestrator from "@/components/AudioOrchestrator";
import MediaAsset from "@/components/MediaAsset";
import ContextModal from "@/components/ContextModal";
import DualTimelineBackground from "@/components/DualTimelineBackground";
import ActNavSidebar from "@/components/ActNavSidebar";
import TypewriterText from "@/components/TypewriterText";
import SectionProgress from "@/components/SectionProgress";
import TextCarousel from "@/components/TextCarousel";
import FireflyTracker from "@/components/FireflyTracker";
import ExpandableText from "@/components/ExpandableText";

// Helper component for upscale fade reveal on scroll
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

// Act section IDs for keyboard navigation
const ACT_IDS = ["hero-canvas", "act-I-section", "act-II-section", "act-III-section"];

export default function Home() {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001
  });

  // Keyboard navigation between acts
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

  // Reconfigured completely with the exact rationale strings provided
  const assetsMap: Record<string, AssetConfig> = {
    "Cinematic_mm_film_style_A_s.mp4": {
      id: "Cinematic_mm_film_style_A_s.mp4",
      title: "The Illusion of the Horizon",
      rationale: "Act 1 ambient loop representing the fog of institutional direction.",
      mediaType: "video",
      mediaSrc: "/videos/Cinematic_mm_film_style_A_s.mp4",
      alt: "Vintage film roll showing a car heading into institutional gates under heavy mist."
    },
    "IMG_4006": {
      id: "IMG_4006",
      title: "Predetermined Pathway",
      rationale: "I chose this photo of an empty street because it was taken from a very low angle right on the ground. This viewpoint forces your eyes to look straight down the yellow line toward a fixed point on the horizon. It represents how our early lives can feel completely set up for us. It feels like there is only one straight path we are allowed to walk down, and we can't see what's off to the sides.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4006.jpg",
      alt: "Low perspective layout of structural linear paths framing visual constraint."
    },
    "IMG_4023": {
      id: "IMG_4023",
      title: "Institutional Ledgers",
      rationale: "I chose this photo of my swim instructor manuals, progress sheets, and markers because it connects directly to the book. In the novel, the clones are constantly tracked, graded, and checked by the guardians. This photo shows how real-world systems do the exact same thing. We are constantly being tested, categorized, and valued based on how well we follow a manual or a rubric, rather than who we are as people.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4023.jpg",
      alt: "Scans of typed lifesaving log records indexing graded results."
    },
    "High_end_cinematic_macro_cinem.mp4": {
      id: "High_end_cinematic_macro_cinem.mp4",
      title: "The Cold Mirror",
      rationale: "Act 2 ambient loop showing structural fracturing and deep realization.",
      mediaType: "video",
      mediaSrc: "/videos/High_end_cinematic_macro_cinem.mp4",
      alt: "Cinematic close-up showing graphical digital textures fracturing."
    },
    "IMG_4013": {
      id: "IMG_4013",
      title: "Shadowed Isolation",
      rationale: "I chose this photo because it's a very dark, shadowed self-portrait in a mirror where you can barely see my face. This represents the feeling of losing your identity when you realize you are just a number in a system. The darkness shows the confusion and the chilling feeling of looking at yourself and wondering who you actually are once the illusions are gone.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4013.jpg",
      alt: "High-contrast dark editorial silhouette of a figure locked in shadows."
    },
    "image0": {
      id: "image0",
      title: "Entrapment Portals",
      rationale: "I took this photo of a hallway with closed doors at a tilted, crooked angle. I chose it because the tilted view makes you feel uneasy and uncomfortable just looking at it. The long line of closed white doors represents feeling trapped and locked out of choices. It shows that the path we are walking down has walls on both sides and no easy exits.",
      mediaType: "image",
      mediaSrc: "/images/image0.jpg",
      alt: "Dutch-angle tilted perspective of repetitive paneled wooden doors locked shut."
    },
    "IMG_3986.MP4": {
      id: "IMG_3986.MP4",
      title: "Unalterable Destiny",
      rationale: "This video shows two hands holding together tightly before they slowly and smoothly drift apart. I used this because it is a simple, powerful symbol of time running out. It shows how hard it is to hold onto the people we care about when life or outside systems inevitably force us apart. It represents the beautiful but sad reality of trying to stay connected as things fade away.",
      mediaType: "video",
      mediaSrc: "/videos/IMG_3986.MP4",
      alt: "Raw high-definition macro loop of hands slowly dividing under bright overhead studio lights."
    },
    "IMG_4012": {
      id: "IMG_4012",
      title: "Grip of Agency",
      rationale: "This is a super close-up photo of a hand squeezing a metal key tightly. I chose this because a key represents access, control, and ownership. Squeezing it as hard as possible shows the human urge to hold onto your own personal power and agency, refusing to let go of the things that make you an individual.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4012.jpg",
      alt: "Macro focus on hands gripping tight to metallic lines in physical resistance."
    },
    "IMG_4024": {
      id: "IMG_4024",
      title: "Border Silhouettes",
      rationale: "This photo shows a person standing inside a dark room with their hands pressed against a bright window screen, looking outside at nature. I chose this because the window frame acts like a physical border. It represents being physically trapped inside a boundary, but mentally looking outward toward freedom. It shows that even if you are confined, your inner mind is still looking out at a bigger world.",
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
    <div className="relative w-full min-h-screen bg-[#121212] text-zinc-100 overflow-x-hidden font-sans selection:bg-white/20 selection:text-white cursor-reading">
      
      {/* Top progress bar */}
      <motion.div 
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-white origin-left z-50 shadow-md shadow-white/20" 
        style={{ scaleX }}
      />

      {/* Ambient Firefly Tracker */}
      <FireflyTracker />

      {/* Film Grain */}
      <div className="film-grain" aria-hidden="true" />

      <DualTimelineBackground />

      <ActNavSidebar />

      <header className="fixed top-4 left-0 right-0 z-40 flex flex-col pointer-events-none">
        <TextCarousel />
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
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#121212]/80 to-[#121212]" />
          </div>

          <div className="max-w-4xl flex flex-col items-center z-10 px-6">
            <ViewportReveal id="hero-reveal">
              <span className="fluid-tracking-wide text-xs text-zinc-500 font-bold tracking-[0.3em]">
                Interactive Installation
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

        {/* ACT 1: THE ILLUSION OF THE HORIZON */}
        <section id="act-I-section" className="relative w-full py-40 flex items-center justify-center border-b border-white/5 overflow-hidden bg-gradient-to-b from-[#121212] to-[#1C1C1E]">
          <div className="w-full max-w-7xl mx-auto z-10 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            <div className="col-span-1 md:col-span-6 flex flex-col gap-10 sticky top-40">
              <ViewportReveal id="act-1-left">
                <div className="glass-panel p-8 sm:p-10 flex flex-col gap-6 backdrop-blur-md border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act 1</span>
                    <h2 className="editorial-title text-3xl sm:text-4xl text-white font-medium">The Illusion of the Horizon</h2>
                  </div>
                  
                  <SectionProgress sectionId="act-I-section" />
                  
                  <blockquote className="border-l-2 border-white/20 pl-5 py-2 italic font-serif text-zinc-200 text-xl leading-relaxed">
                    <TypewriterText
                      text="Every journey starts in the fog."
                      speed={28}
                    />
                  </blockquote>

                  <p className="body-text text-base text-zinc-400">
                    When we are young, our lives are mostly built around what other people tell us. We listen to small things we overhear, follow rules we don't fully understand, and accept labels from parents or teachers. We are told we are special, but we don't realize that schools and systems often care more about what we can produce or achieve than who we actually are. We push ourselves down paths that make us uncomfortable, taking on hard challenges just to prove something, thinking we are completely in control of our own future. This matches our real world. We are constantly pushed into paths—like career goals, school pressures, or digital metrics—that feel like our own choices but were actually set up for us by someone else. Looking back, I see how much of my own life has been spent following templates provided by institutions instead of making my own choices from the day I started.
                  </p>
                  
                  <ExpandableText content="Act 1 is all about the beginning of life where we are blind to how the world works. In the book Never Let Me Go, the clones at Hailsham think they are living a normal childhood, but they are actually being raised for a dark purpose they have no control over. This section shows how we all start out following a pre-written map made by society before we grow up enough to question it." />
                  
                  <div className="mt-4 p-4 rounded-xl bg-[#1C1C1E]/50 border border-white/5 audio-player">
                    <AudioOrchestrator actIndex={1} title="Act I Ambient Drone" />
                  </div>
                </div>
              </ViewportReveal>
            </div>

            <div className="col-span-1 md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 h-[600px] rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
                 <MediaAsset
                    id="Cinematic_mm_film_style_A_s.mp4"
                    type="video"
                    src="/videos/Cinematic_mm_film_style_A_s.mp4"
                    alt="Institutional Facade Video Loop"
                    title="Act I Video"
                    onClick={() => openAssetModal("Cinematic_mm_film_style_A_s.mp4")}
                 />
              </div>
              <div className="h-64 sm:h-80 rounded-xl overflow-hidden glass-panel border-white/10 mt-6 sm:mt-12 media-asset">
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
              <div className="h-64 sm:h-80 rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
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

        {/* ACT 2: THE COLD MIRROR */}
        <section id="act-II-section" className="relative w-full py-40 flex items-center justify-center border-b border-white/5 overflow-hidden bg-[#1C1C1E]">
          <div className="w-full max-w-7xl mx-auto z-10 px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            <div className="col-span-1 md:col-span-6 flex flex-col gap-8 order-2 md:order-1">
              <ViewportReveal id="act-2-left">
                <div className="w-full h-64 sm:h-[400px] rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
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
                  <div className="aspect-square rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
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
                  <div className="aspect-square rounded-xl overflow-hidden glass-panel border-white/10 media-asset mt-12">
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
              </ViewportReveal>
            </div>

            <div className="col-span-1 md:col-span-6 flex flex-col gap-6 order-1 md:order-2 sticky top-40">
              <ViewportReveal id="act-2-right">
                <div className="glass-panel p-8 sm:p-10 flex flex-col gap-6 backdrop-blur-md border-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act 2</span>
                    <h2 className="editorial-title text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-tight mb-4">
                      The Cold Mirror
                    </h2>
                  </div>
                  
                  <SectionProgress sectionId="act-II-section" />
                  
                  <h3 className="editorial-title text-2xl text-zinc-300 italic mt-6 mb-2">
                    <TypewriterText
                      text="It is the exact moment you walk past a mirror you have seen every single day, but suddenly you notice something completely different."
                      speed={22}
                    />
                  </h3>
                  <p className="body-text text-base text-zinc-400">
                    The biggest shift in growing up is always a cold, harsh moment. You realize how society actually looks at you. You see that the world doesn’t look at you as a unique person with a bright future—it looks at you like a tool or an asset to be used up. Realizing that your life and choices have been quietly decided by a system you never picked is a really heavy thing to deal with. Sadly, most people only realize how valuable their freedom was after the chance to change their destination has already passed. This moment hurts, but it is the price of finally waking up. In the real world, this happens when we realize that big structures—like corporations or social hierarchies—treat people as replaceable parts. Kathy’s discovery in the book hurts because she realizes her 'special' childhood was just a lie to keep her behaving well. True growth doesn't start when we are comfortable; it starts when we face the chilling truth of how the world actually runs.
                  </p>
                  
                  <ExpandableText content="Act 2 focuses on the turning point of the project: the shock of self-awareness. It represents the painful moment when the main characters in the book, and people in the real world, finally see through the illusions they were told as kids. It is about the loss of innocence and the heavy feeling of finding out you are trapped inside a system." />
                  
                  <div className="mt-4 p-4 rounded-xl bg-[#121212]/50 border border-white/5 audio-player">
                    <AudioOrchestrator actIndex={2} title="Act II Ambient Drone" />
                  </div>
                </div>
              </ViewportReveal>
            </div>

          </div>
        </section>

        {/* ACT 3: HALTING THE RESISTANCE */}
        <section id="act-III-section" className="relative w-full py-40 flex flex-col items-center justify-center border-b border-white/5 overflow-hidden bg-gradient-to-t from-[#121212] to-[#1C1C1E]">
          <div className="w-full max-w-5xl mx-auto z-10 px-6">
            <ViewportReveal id="act-3-center">
              <div className="glass-panel p-10 sm:p-16 flex flex-col items-center text-center gap-10 backdrop-blur-md border-white/10">
                <div className="flex flex-col items-center gap-4 w-full">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act 3</span>
                  <h2 className="editorial-title text-4xl sm:text-6xl text-white font-medium">Halting the Resistance</h2>
                  <SectionProgress sectionId="act-III-section" />
                </div>
                
                <div className="w-full h-64 sm:h-[500px] rounded-xl overflow-hidden border border-white/10 relative media-asset">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
                     <MediaAsset
                        id="IMG_4012"
                        type="image"
                        src="/images/IMG_4012.jpg"
                        alt="Grip of Agency"
                        title="IMG_4012"
                        onClick={() => openAssetModal("IMG_4012")}
                        aspectRatio="h-full w-full object-cover"
                     />
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden glass-panel border-white/10 media-asset">
                     <MediaAsset
                        id="IMG_4024"
                        type="image"
                        src="/images/IMG_4024.jpg"
                        alt="Border Silhouettes"
                        title="IMG_4024"
                        onClick={() => openAssetModal("IMG_4024")}
                        aspectRatio="h-full w-full object-cover"
                     />
                  </div>
                </div>

                <blockquote className="border-l-2 border-white/20 pl-5 py-2 italic font-serif text-zinc-200 text-xl leading-relaxed text-left max-w-3xl mt-8">
                  <TypewriterText
                    text="So, how do you keep moving forward when you know you cannot change the final destination?"
                    speed={40}
                  />
                </blockquote>
                
                <p className="body-text text-lg sm:text-xl text-zinc-300 max-w-3xl text-left">
                  You have to stop fighting the past and stop looking backward with bitterness. We have to accept where we come from, knowing that our background shapes our first steps, but it doesn't have to lock down our minds. When outside forces have total control over our physical lives, our internal thoughts and choices become our only true safe haven. We have to build our own meaning out of love, out of memories, and out of the desperate, beautiful human instinct to hold onto the people we care about and say, 'Never let me go.' If the system gets to dictate where our bodies go, our inner mind is the only place left where we are completely free. By accepting our history but refusing to let it ruin our ability to care for others, we save our humanity. Even when everything else is stolen from us, choosing to stay deeply connected to the people we love is the most powerful thing a human can do.
                </p>

                <ExpandableText content="Act 3 is about finding peace and taking back your power from within. Even though the characters in Never Let Me Go don't change their medical fate, they choose to spend their remaining time loving each other and remembering Hailsham. This section shows that when you can't change the system outside, you find freedom by protecting your own heart and your memories." />

                <div className="w-full max-w-sm mt-6 audio-player">
                  <AudioOrchestrator actIndex={3} title="Act III Resolved Octave" />
                </div>
              </div>
            </ViewportReveal>
          </div>
        </section>

      </main>

      <footer className="relative z-10 w-full py-12 text-center border-t border-white/5 bg-[#121212]">
        <p className="text-[10px] text-zinc-500 tracking-wider font-sans font-medium px-6">
          This interactive multimedia installation was built using Next.js, styled with Tailwind CSS, and animated using Framer Motion to explore text-to-world structural connections.
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
