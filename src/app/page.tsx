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
import PhotoCarousel from "@/components/PhotoCarousel";

// Helper component for fade+lift reveal on scroll
function ViewportReveal({
  children,
  id,
  delay = 0,
}: {
  children: React.ReactNode;
  id: string;
  delay?: number;
}) {
  return (
    <motion.div
      id={id}
      initial={{ y: 30, scale: 0.97, opacity: 0 }}
      whileInView={{ y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: false, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 100, damping: 22, delay }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

// Italic stage marker
function StageMarker({ text }: { text: string }) {
  return (
    <p className="text-sm text-zinc-500 italic font-sans leading-relaxed border-l-2 border-white/10 pl-4">
      {text}
    </p>
  );
}

// Small interplay caption below media
function InterplayCaption({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-zinc-600 font-sans tracking-wide mt-3 px-1 text-center">
      {text}
    </p>
  );
}

function ClickPrompt() {
  return (
    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold text-center mt-2">
      [ Click any asset to reveal its rationale ]
    </p>
  );
}

interface AssetConfig {
  id: string;
  title: string;
  rationale: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  alt: string;
}

const ACT_IDS = ["hero-canvas", "act-I-section", "act-II-section", "act-III-section"];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001,
  });

  // Firefly toggle state
  const [fireflyOn, setFireflyOn] = useState(true);

  // Keyboard navigation
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
      if (e.key === " " && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        for (const btnId of ["play-btn-act-1", "play-btn-act-2", "play-btn-act-3"]) {
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
      title: "The Institutional Facade",
      rationale:
        "I chose this video of a vintage car moving blindly toward a looming, locked institutional building in the mist because it physically represents our early journeys in life. We move down paths made by outside systems before we even understand who we are or where we are going.",
      mediaType: "video",
      mediaSrc: "/videos/Cinematic_mm_film_style_A_s.mp4",
      alt: "Vintage car driving into a locked institutional gate in the mist.",
    },
    "IMG_4006": {
      id: "IMG_4006",
      title: "Predetermined Pathway",
      rationale:
        "I chose this photo of an empty street because it was taken from a very low angle right on the ground. This viewpoint forces your eyes to look straight down the yellow line toward a fixed point on the horizon. It represents how our early lives can feel completely set up for us. It feels like there is only one straight path we are allowed to walk down, and we can't see what's off to the sides.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4006.jpg",
      alt: "Low-angle street view forcing eyes to a fixed horizon point.",
    },
    "IMG_4023": {
      id: "IMG_4023",
      title: "Institutional Ledgers",
      rationale:
        "I chose this photo of my swim instructor manuals, progress sheets, and markers because it connects directly to the book. In the novel, the clones are constantly tracked, graded, and checked by the guardians. This photo shows how real-world systems do the exact same thing. We are constantly being tested, categorized, and valued based on how well we follow a manual or a rubric, rather than who we are as people.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4023.jpg",
      alt: "Swim instructor manuals and graded progress sheets.",
    },
    "High_end_cinematic_macro_cinem.mp4": {
      id: "High_end_cinematic_macro_cinem.mp4",
      title: "The Fracture",
      rationale:
        "I chose this macro cinematic video of a mirror cleanly cracking across a human eye reflection to represent the painful shock of self-awareness. It is the precise moment when the illusions of childhood break, forcing you to look at reality clearly for the first time.",
      mediaType: "video",
      mediaSrc: "/videos/High_end_cinematic_macro_cinem.mp4",
      alt: "Cinematic close-up of fracturing digital textures.",
    },
    "IMG_4013": {
      id: "IMG_4013",
      title: "Shadowed Identity",
      rationale:
        "I chose this photo because it's a very dark, shadowed self-portrait in a mirror where you can barely see my face. This represents the feeling of losing your identity when you realize you are just a number in a system. The darkness shows the confusion and the chilling feeling of looking at yourself and wondering who you actually are once the illusions are gone.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4013.jpg",
      alt: "Dark shadowed self-portrait where the face is barely visible.",
    },
    "image0": {
      id: "image0",
      title: "Entrapment Portals",
      rationale:
        "I took this photo of a hallway with closed doors at a tilted, crooked angle. I chose it because the tilted view makes you feel uneasy and uncomfortable just looking at it. The long line of closed white doors represents feeling trapped and locked out of choices. It shows that the path we are walking down has walls on both sides and no easy exits.",
      mediaType: "image",
      mediaSrc: "/images/image0.jpg",
      alt: "Tilted hallway of closed white doors.",
    },
    "IMG_3986.MP4": {
      id: "IMG_3986.MP4",
      title: "Letting Go",
      rationale:
        "This video shows two hands holding together tightly before they slowly and smoothly drift apart. I used this because it is a simple, powerful symbol of time running out. It shows how hard it is to hold onto the people we care about when life or outside systems inevitably force us apart. It represents the beautiful but sad reality of trying to stay connected as things fade away.",
      mediaType: "video",
      mediaSrc: "/videos/IMG_3986.MP4",
      alt: "Two hands holding then drifting apart.",
    },
    "IMG_4012": {
      id: "IMG_4012",
      title: "Grip of Agency",
      rationale:
        "This is a super close-up photo of a hand squeezing a metal key tightly. I chose this because a key represents access, control, and ownership. Squeezing it as hard as possible shows the human urge to hold onto your own personal power and agency, refusing to let go of the things that make you an individual.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4012.jpg",
      alt: "Hand squeezing a metal key tightly.",
    },
    "IMG_4024": {
      id: "IMG_4024",
      title: "Looking Outward",
      rationale:
        "This photo shows a person standing inside a dark room with their hands pressed against a bright window screen, looking outside at nature. I chose this because the window frame acts like a physical border. It represents being physically trapped inside a boundary, but mentally looking outward toward freedom. It shows that even if you are confined, your inner mind is still looking out at a bigger world.",
      mediaType: "image",
      mediaSrc: "/images/IMG_4024.jpg",
      alt: "Person pressing hands against a window screen looking outward.",
    },
  };

  const openAssetModal = (key: string) => {
    const config = assetsMap[key];
    if (config) setSelectedAsset(config);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#121212] text-zinc-100 overflow-x-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* Top scroll progress bar */}
      <motion.div
        id="scroll-progress"
        className="fixed top-0 left-0 right-0 h-[3px] bg-white origin-left z-50 shadow-md shadow-white/20"
        style={{ scaleX }}
      />

      {/* Ambient Firefly Tracker */}
      <FireflyTracker visible={fireflyOn} />

      {/* Firefly ON/OFF Toggle */}
      <button
        onClick={() => setFireflyOn((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest border transition-all duration-300 ${
          fireflyOn
            ? "border-[rgba(255,179,0,0.4)] bg-[rgba(255,179,0,0.08)] text-[rgba(255,179,0,0.9)] shadow-[0_0_12px_rgba(255,179,0,0.2)]"
            : "border-white/10 bg-white/5 text-zinc-500"
        }`}
        aria-label="Toggle firefly particle"
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            fireflyOn ? "bg-[rgba(255,179,0,0.9)]" : "bg-zinc-600"
          }`}
        />
        Firefly: {fireflyOn ? "ON" : "OFF"}
      </button>

      {/* Film Grain */}
      <div className="film-grain" aria-hidden="true" />

      <DualTimelineBackground />
      <ActNavSidebar />

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-none hidden md:flex">
        <span className="text-[8px] uppercase tracking-widest text-zinc-700 font-sans">
          ↑↓ Navigate · Space Play
        </span>
      </div>

      {/* Text Carousel pinned to top */}
      <div className="fixed top-0 left-0 right-0 z-40 pt-[3px]">
        <TextCarousel />
      </div>

      <main className="relative w-full z-10 pt-10">

        {/* HERO */}
        <section
          id="hero-canvas"
          className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/Cinematic_mm_film_style_A_s.mp4"
              muted autoPlay loop playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/30 via-transparent to-[#121212]" />
          </div>

          <div className="max-w-4xl flex flex-col items-center z-10 px-6">
            <ViewportReveal id="hero-reveal">
              <span className="text-xs text-zinc-500 font-bold tracking-[0.3em] uppercase font-sans">
                Interactive Installation
              </span>
              <h1 className="editorial-title text-5xl sm:text-7xl md:text-8xl mt-6 text-white font-bold uppercase tracking-tight leading-none">
                The Pre-Written Map
              </h1>
              <h2 className="editorial-title text-2xl sm:text-3xl mt-4 text-zinc-300 font-medium tracking-wide italic">
                Finding the Self Within the System
              </h2>
            </ViewportReveal>

            <ViewportReveal id="hero-cta" delay={0.2}>
              <button
                onClick={() => {
                  document.getElementById("act-I-section")?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => document.getElementById("play-btn-act-1")?.click(), 800);
                }}
                className="mt-12 group flex items-center gap-3 py-4 px-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-sm text-white uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-300 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                Begin the Story
              </button>
            </ViewportReveal>

            <ViewportReveal id="hero-scroll" delay={0.4}>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="mt-16 text-zinc-600 cursor-pointer flex flex-col items-center gap-2 hover:text-zinc-400 transition-colors"
                onClick={() => document.getElementById("act-I-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="text-[10px] uppercase tracking-widest font-bold font-sans">Scroll to Begin</span>
                <ArrowDown size={14} />
              </motion.div>
            </ViewportReveal>
          </div>
        </section>

        {/* ── ACT 1 ── */}
        <section
          id="act-I-section"
          className="relative w-full py-40 border-b border-white/5 bg-gradient-to-b from-[#121212] to-[#1C1C1E]"
        >
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Text Column */}
            <div className="col-span-1 md:col-span-6 flex flex-col gap-8 sticky top-40">
              <ViewportReveal id="act-1-text">
                <div className="glass-panel p-8 sm:p-10 flex flex-col gap-6 backdrop-blur-md border border-white/10 rounded-2xl bg-[#1C1C1E]/60">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act I</span>
                    <h2 className="editorial-title text-3xl sm:text-4xl text-white font-medium mt-1">
                      The Illusion of the Horizon
                    </h2>
                  </div>

                  <SectionProgress sectionId="act-I-section" />

                  <StageMarker text="This is the part of the journey where I thought I was choosing everything, but I was really just following the map handed to me." />

                  <blockquote className="border-l-2 border-white/20 pl-5 py-1 italic font-serif text-zinc-200 text-xl leading-relaxed">
                    <TypewriterText text="Every journey starts in the fog." speed={30} />
                  </blockquote>

                  <p className="text-base text-zinc-400 font-sans leading-[1.6]">
                    When I was younger, I didn't really think about where I was going. My life was mostly built around expectations I didn't question. I just followed the rules, listened to what adults told me, and accepted whatever labels were given to me by my school or my parents. We are told we are special, but we don't realize that schools and systems often care more about what we can produce or achieve than who we actually are. In Grade 9, I picked all the hardest academic courses because that's what I was 'supposed' to do, without ever asking if it was what I actually wanted. Looking back, I see how much of my own life has been spent following templates provided by institutions instead of making my own choices from the day I started.
                  </p>

                  <ExpandableText content="Act 1 is all about the beginning of life where we are blind to how the world works. In the book Never Let Me Go, the clones at Hailsham think they are living a normal childhood, but they are actually being raised for a dark purpose they have no control over. This section shows how we all start out following a pre-written map made by society before we grow up enough to question it." />

                  <div className="mt-2 rounded-xl bg-black/20 border border-white/5 audio-player">
                    <AudioOrchestrator actIndex={1} title="Act I Ambient Drone" />
                  </div>
                </div>
              </ViewportReveal>
            </div>

            {/* Media Column */}
            <div className="col-span-1 md:col-span-6 flex flex-col gap-6">
              <div className="h-[500px] rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("Cinematic_mm_film_style_A_s.mp4")}>
                <MediaAsset
                  id="Cinematic_mm_film_style_A_s.mp4"
                  type="video"
                  src="/videos/Cinematic_mm_film_style_A_s.mp4"
                  alt="Institutional Facade Video Loop"
                  title="Act I Video"
                />
              </div>
              <div className="h-60 rounded-xl overflow-hidden border border-white/10 media-asset mt-4 cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_4006")}>
                <MediaAsset
                  id="IMG_4006"
                  type="image"
                  src="/images/IMG_4006.jpg"
                  alt="Predetermined Pathway"
                  title="IMG_4006"
                  aspectRatio="h-full w-full object-cover"
                />
              </div>
              <div className="h-60 rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_4023")}>
                <MediaAsset
                  id="IMG_4023"
                  type="image"
                  src="/images/IMG_4023.jpg"
                  alt="Institutional Ledgers"
                  title="IMG_4023"
                  aspectRatio="h-full w-full object-cover"
                />
              </div>
              <InterplayCaption text="The blurred, foggy background and path lines in Act I represent that phase of life where I thought I was choosing everything, but I was really just blindly moving along a pre-written map." />
              <ClickPrompt />
            </div>

          </div>
        </section>

        {/* ── ACT 2 ── */}
        <section
          id="act-II-section"
          className="relative w-full py-40 border-b border-white/5 bg-[#1C1C1E]"
        >
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Media Column (left) */}
            <div className="col-span-1 md:col-span-6 flex flex-col gap-6 order-2 md:order-1">
              <div className="h-64 sm:h-[380px] rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("High_end_cinematic_macro_cinem.mp4")}>
                <MediaAsset
                  id="High_end_cinematic_macro_cinem.mp4"
                  type="video"
                  src="/videos/High_end_cinematic_macro_cinem.mp4"
                  alt="Fracture Animation"
                  title="Act II Video"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_4013")}>
                  <MediaAsset
                    id="IMG_4013"
                    type="image"
                    src="/images/IMG_4013.jpg"
                    alt="Shadowed Identity"
                    title="IMG_4013"
                    aspectRatio="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border border-white/10 media-asset mt-10 cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("image0")}>
                  <MediaAsset
                    id="image0"
                    type="image"
                    src="/images/image0.jpg"
                    alt="Entrapment Portals"
                    title="image0"
                    aspectRatio="h-full w-full object-cover"
                  />
                </div>
              </div>
              <InterplayCaption text="The sharp, cold visuals and the dark, off-center reflection in this section matter—they represent the exact feeling of looking at your student dashboard or a spreadsheet and feeling like you've been turned into a number." />
              <ClickPrompt />
            </div>

            {/* Text Column (right) */}
            <div className="col-span-1 md:col-span-6 flex flex-col gap-8 order-1 md:order-2 sticky top-40">
              <ViewportReveal id="act-2-text">
                <div className="glass-panel p-8 sm:p-10 flex flex-col gap-6 backdrop-blur-md border border-white/10 rounded-2xl bg-[#121212]/60">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act II</span>
                    <h2 className="editorial-title text-4xl sm:text-5xl text-white font-medium leading-tight mt-1">
                      The Cold Mirror
                    </h2>
                  </div>

                  <SectionProgress sectionId="act-II-section" />

                  <StageMarker text="This is where the journey turns cold—when I finally see how the system sees me." />

                  <h3 className="editorial-title text-xl text-zinc-300 italic">
                    <TypewriterText
                      text="It is the exact moment you walk past a mirror you have seen every single day, but suddenly you notice something completely different."
                      speed={20}
                    />
                  </h3>

                  <p className="text-base text-zinc-400 font-sans leading-[1.6]">
                    Growing up hits you hard when you finally realize how the outside world actually sees you. It's like looking into a mirror you've used your whole life, but suddenly noticing a completely different, uncomfortable reflection. You realize the world doesn't always see you as an individual with your own goals. Sometimes, it feels like institutions just view you as a resource or a replaceable part of a bigger machine. I remember looking at my student dashboard and feeling like I was just another number in a spreadsheet, where the system only cared about my grades, not how I was actually doing. Realizing that your life and choices have been quietly decided by a system you never picked is a really heavy thing to deal with. Sadly, most people only realize how valuable their freedom was after the chance to change their destination has already passed. Waking up to how things actually work is a frustrating realization, but it is the first real step to figuring out who you are.
                  </p>

                  <ExpandableText content="Act 2 focuses on the turning point of the project: the shock of self-awareness. It represents the painful moment when the main characters in the book, and people in the real world, finally see through the illusions they were told as kids. It is about the loss of innocence and the heavy feeling of finding out you are trapped inside a system." />

                  <div className="mt-2 rounded-xl bg-black/20 border border-white/5 audio-player">
                    <AudioOrchestrator actIndex={2} title="Act II Ambient Drone" />
                  </div>
                </div>
              </ViewportReveal>
            </div>

          </div>
        </section>

        {/* ── ACT 3 ── */}
        <section
          id="act-III-section"
          className="relative w-full py-40 bg-gradient-to-t from-[#121212] to-[#1C1C1E]"
        >
          <div className="w-full max-w-5xl mx-auto px-6">
            <ViewportReveal id="act-3-center">
              <div className="glass-panel p-10 sm:p-16 flex flex-col items-center text-center gap-10 backdrop-blur-md border border-white/10 rounded-2xl bg-[#1C1C1E]/60">

                <div className="flex flex-col items-center gap-4 w-full">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Act III</span>
                  <h2 className="editorial-title text-4xl sm:text-6xl text-white font-medium">
                    Protecting the Mind
                  </h2>
                  <SectionProgress sectionId="act-III-section" />
                  <StageMarker text="Here, the journey moves inward. Even if the system controls my path, it doesn't own my mind." />
                </div>

                {/* Centerpiece Video */}
                <div className="w-full h-64 sm:h-[480px] rounded-xl overflow-hidden border border-white/10 relative media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_3986.MP4")}>
                  <MediaAsset
                    id="IMG_3986.MP4"
                    type="video"
                    src="/videos/IMG_3986.MP4"
                    alt="Two hands drifting apart"
                    title="Act III Video"
                  />
                </div>

                {/* Two images beneath */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_4012")}>
                    <MediaAsset
                      id="IMG_4012"
                      type="image"
                      src="/images/IMG_4012.jpg"
                      alt="Hand squeezing a key"
                      title="IMG_4012"
                      aspectRatio="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 media-asset cursor-pointer transition-transform hover:scale-[1.01]" onClick={() => openAssetModal("IMG_4024")}>
                    <MediaAsset
                      id="IMG_4024"
                      type="image"
                      src="/images/IMG_4024.jpg"
                      alt="Person looking through window screen"
                      title="IMG_4024"
                      aspectRatio="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-center">
                  <InterplayCaption text="The warm, resolved sound in Act III shows the shift to protecting the sanctuary of my mind." />
                  <ClickPrompt />
                </div>

                <blockquote className="border-l-2 border-white/20 pl-5 py-1 italic font-serif text-zinc-200 text-xl leading-relaxed text-left max-w-3xl mt-4">
                  <TypewriterText
                    text="So, how do you keep moving forward when you know you cannot change the final destination?"
                    speed={35}
                  />
                </blockquote>

                <p className="text-lg text-zinc-300 font-sans leading-[1.6] max-w-3xl text-left">
                  I’ve learned that there's no point in looking back with bitterness or trying to fight things I can't change. I have to accept where I started. My background sets up my first steps, but it doesn't have to dictate where my thoughts go. When outside forces have total control over our physical lives, our internal thoughts and choices become our only true safe haven. For me, the only thing I can truly control is how I treat my family, my friends, and the athletes I work with, even if the school system controls my schedule and my future. We have to build our own meaning out of our relationships and our memories. Even if outside systems get to dictate my schedule or where I have to be physically, my inner mind is the one space where I am completely free. By accepting our history but refusing to let it ruin our ability to care for others, we save our internal freedom.
                </p>

                <ExpandableText content="Act 3 is about finding peace and taking back your power from within. Even though the characters in Never Let Me Go don't change their medical fate, they choose to spend their remaining time loving each other and remembering Hailsham. This section shows that when you can't change the system outside, you find freedom by protecting your own heart and your memories." />

                <div className="w-full max-w-sm audio-player">
                  <AudioOrchestrator actIndex={3} title="Act III Resolved Octave" />
                </div>

              </div>
            </ViewportReveal>
          </div>
        </section>

        {/* ── PHOTO CAROUSEL ── */}
        <section className="relative w-full py-20 bg-[#121212] flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12">
            <PhotoCarousel />
          </div>
        </section>

      </main>

      <footer className="relative z-10 w-full py-12 text-center border-t border-white/5 bg-[#121212]">
        <p className="text-[10px] text-zinc-600 tracking-wide font-sans px-6">
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
