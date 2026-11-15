"use client";

import "@/utils/react-poly";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import CyberHUD from "@/components/ui/CyberHUD";
import ProjectSection from "@/components/ui/ProjectSection";
import ContactTerminal from "@/components/ui/ContactTerminal";
import { SceneAct, SkillDomain } from "@/types";
import { cyberAudio } from "@/utils/audio";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { Shield, Crosshair, ChevronDown, Swords, MapPin, GraduationCap, Github, Mail, Terminal as TerminalIcon } from "lucide-react";

// Dynamically import 3D Canvas with ssr disabled to prevent WebGL SSR mismatch
const CybertronianCanvas = dynamic(
  () => import("@/components/canvas/CybertronianCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 flex items-center justify-center bg-[#04060b] z-0 font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-cyan-400 tracking-widest uppercase animate-pulse">
            INITIALIZING CYBERTRONIAN MATRIX...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [currentAct, setCurrentAct] = useState<SceneAct>(1);
  const [maskProgress, setMaskProgress] = useState<number>(0);
  const [cleaveProgress, setCleaveProgress] = useState<number>(0);
  const [impactProgress, setImpactProgress] = useState<number>(0);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [, setSelectedSkillDomain] = useState<SkillDomain | null>(null);

  const lenisRef = useRef<Lenis | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);
  const act4Ref = useRef<HTMLDivElement>(null);

  // Manual deployment override toggle
  const handleToggleMask = () => {
    const target = maskProgress > 0.5 ? 0 : 1;
    gsap.to(
      { val: maskProgress },
      {
        val: target,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          setMaskProgress(this.targets()[0].val);
        },
      }
    );
  };

  // Cinematic Combat Cleave Execution (Click-to-Play Fallback)
  const handleTriggerCleave = () => {
    setCurrentAct(3);
    cyberAudio.playSwordSlash();

    // Scroll smoothly to Act III if not already there
    if (act3Ref.current && lenisRef.current) {
      lenisRef.current.scrollTo(act3Ref.current, { offset: 0, duration: 0.8 });
    }

    gsap.fromTo(
      { val: 0 },
      { val: 1 },
      {
        val: 1,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function () {
          setCleaveProgress(this.targets()[0].val);
        },
      }
    );
  };

  // Smooth scroll navigation to specific Act
  const handleNavigateAct = (act: SceneAct) => {
    setCurrentAct(act);
    const targetRefs: Record<SceneAct, React.RefObject<HTMLDivElement | null>> = {
      1: act1Ref,
      2: act2Ref,
      3: act3Ref,
      4: act4Ref,
    };

    const targetEl = targetRefs[act]?.current;
    if (targetEl && lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, { offset: 0, duration: 1.5 });
    }
  };

  // Initialize Lenis Inertial Smooth Scrolling & GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Setup Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Act I: Hero Battle Mask Scrub (0 -> 1 over Act I scroll)
    if (act1Ref.current) {
      ScrollTrigger.create({
        trigger: act1Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          setMaskProgress(self.progress);
          if (self.progress < 0.8) {
            setCurrentAct(1);
          }
        },
      });
    }

    // Act II: Armory Section
    if (act2Ref.current) {
      ScrollTrigger.create({
        trigger: act2Ref.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setCurrentAct(2),
        onEnterBack: () => setCurrentAct(2),
      });
    }

    // Act III: Drone Skills & Cleave Arc - PINNED during animation
    if (act3Ref.current) {
      ScrollTrigger.create({
        trigger: act3Ref.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        onEnter: () => setCurrentAct(3),
        onEnterBack: () => setCurrentAct(3),
        onUpdate: (self) => {
          setCleaveProgress(self.progress);
        },
      });
    }

    // Act IV: Stone Impact & Transmission Conduit
    if (act4Ref.current) {
      ScrollTrigger.create({
        trigger: act4Ref.current,
        start: "top 75%",
        end: "bottom bottom",
        scrub: 0.5,
        onEnter: () => setCurrentAct(4),
        onEnterBack: () => setCurrentAct(4),
        onUpdate: (self) => {
          setImpactProgress(self.progress);
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={containerRef} className="relative w-full min-h-screen bg-[#04060b] text-white">
      {/* ==================== 3D CYBERTRONIAN CANVAS (BACKGROUND LAYER) ==================== */}
      <CybertronianCanvas
        currentAct={currentAct}
        maskProgress={maskProgress}
        cleaveProgress={cleaveProgress}
        impactProgress={impactProgress}
        selectedProjectIndex={selectedProjectIndex}
        onSelectProject={(idx) => setSelectedProjectIndex(idx)}
        onSelectSkillDomain={(domain) => setSelectedSkillDomain(domain)}
      />

      {/* ==================== CYBER HUD OVERLAYS ==================== */}
      <CyberHUD
        currentAct={currentAct}
        onNavigateAct={handleNavigateAct}
        maskProgress={maskProgress}
        onToggleMask={handleToggleMask}
        onTriggerCleave={handleTriggerCleave}
      />

      {/* ==================== SCROLLABLE HTML SECTIONS ==================== */}

      {/* -------------------- ACT I: THE HERO & BATTLE MASK -------------------- */}
      <section
        ref={act1Ref}
        className="relative min-h-[140vh] flex flex-col justify-between items-center px-4 pt-28 pb-16 z-10 pointer-events-none"
      >
        {/* Top Hero Text */}
        <div className="text-center max-w-3xl pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
            <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ACT I // COMBAT BATTLE MASK PROTOCOL</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_25px_rgba(0,255,255,0.3)] mb-3">
            {PORTFOLIO_DATA.identity.callsign}
          </h1>

          <p className="text-sm sm:text-lg font-mono text-cyan-300 font-semibold mb-3 tracking-wide">
            {PORTFOLIO_DATA.identity.title}
          </p>

          {/* Academic & Geographic Telemetry */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-gray-300 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{PORTFOLIO_DATA.identity.institution}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{PORTFOLIO_DATA.identity.origin}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-xl mx-auto leading-relaxed mb-6">
            {PORTFOLIO_DATA.identity.bio}
          </p>

          {/* Terminal Frequency & Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="px-3.5 py-1.5 rounded-lg bg-black/70 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{PORTFOLIO_DATA.identity.links.terminal}</span>
            </span>
            <a
              href={PORTFOLIO_DATA.identity.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-white font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span>GITHUB</span>
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.identity.links.email}`}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-white font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>EMAIL</span>
            </a>
          </div>

          {/* Mask Status Telemetry Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/60 border border-cyan-500/30 backdrop-blur-md text-xs font-mono">
            <span className="text-gray-400">CHASSIS FACEPLATE:</span>
            <span
              className={`font-bold uppercase ${
                maskProgress > 0.6 ? "text-cyan-400" : "text-amber-400"
              }`}
            >
              {maskProgress > 0.6 ? "COMBAT MODE [SEALED]" : "IDLE OPEN [RETRACTED]"}
            </span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-100"
                style={{ width: `${Math.round(maskProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="text-center pointer-events-auto flex flex-col items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">
            SCROLL DOWN TO DEPLOY COMBAT MASK & ENTER ARMORY
          </span>
          <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-bounce bg-black/40 backdrop-blur-sm">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* -------------------- ACT II: CYBERTRONIAN ARMORY -------------------- */}
      <section
        ref={act2Ref}
        className="relative min-h-screen py-24 z-10 pointer-events-auto flex items-center justify-center"
      >
        <ProjectSection
          selectedIndex={selectedProjectIndex}
          onSelectProject={(idx) => setSelectedProjectIndex(idx)}
        />
      </section>

      {/* -------------------- ACT III: THE DECAPITATION & SKILL CLEAVE (PINNED STAGE) -------------------- */}
      <section
        ref={act3Ref}
        className="relative h-screen w-full z-10 pointer-events-none flex flex-col justify-between items-center px-4 pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden"
      >
        {/* Sleek Top-Docked Banner: Never obscures the 3D Decepticon Drones */}
        <div className="text-center max-w-xl pointer-events-auto backdrop-blur-md bg-black/60 p-3 sm:p-4 rounded-xl border border-cyan-500/30 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-1.5">
            <Crosshair className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>ACT III // THE DECAPITATION & SKILL CLEAVE</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight glow-cyan mb-1.5">
            TECHNICAL ARSENAL CLEAVE
          </h2>

          <p className="text-gray-400 font-mono text-[10px] sm:text-xs leading-relaxed mb-2.5 max-w-lg mx-auto">
            Scroll through this pinned arena or engage the protocol to cleave the 4 sentinels and reveal internal skill cores.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Prominent Click-to-Play Combat Protocol Button */}
            <button
              onClick={handleTriggerCleave}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/25 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-200 hover:text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(0,255,255,0.5)] clip-chamfer-sm"
            >
              <Swords className="w-4 h-4 text-cyan-300" />
              <span>INITIATE COMBAT PROTOCOL / ENGAGE SKILLS</span>
            </button>

            {/* Cleave Stage Readout */}
            <div className="px-3.5 py-2 rounded-xl bg-black/70 border border-white/10 text-[11px] font-mono text-gray-300 flex items-center gap-2">
              <span className="text-gray-400">STAGE:</span>
              <span className="text-cyan-400 font-bold">
                {cleaveProgress < 0.2
                  ? "01: TARGET ACQUISITION"
                  : cleaveProgress < 0.7
                  ? "02: PLASMA STRIKE & SHATTER"
                  : "03: CORES REVEALED"}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-cyan-300 font-bold">{Math.round(cleaveProgress * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Subtext */}
        <div className="text-center font-mono text-[11px] text-gray-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          <span>SCROLL DOWN TO ADVANCE RADIAL CLEAVE OR CLICK ANY DRONE TO TOGGLE</span>
        </div>
      </section>

      {/* -------------------- ACT IV: SWORD INTO STONE & TRANSMISSION -------------------- */}
      <section
        ref={act4Ref}
        className="relative min-h-screen py-24 z-10 pointer-events-auto flex items-center justify-center"
      >
        <ContactTerminal />
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 py-8 border-t border-white/10 bg-black/90 backdrop-blur-md text-center font-mono text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-400 font-bold">AUTOBOT BATTLE MECH SYSTEMS</span>
            <span>// DESIGNED & CODED BY {PORTFOLIO_DATA.identity.callsign}</span>
          </div>
          <div>
            <span>AUTONOMOUS CYBERTRONIAN MATRIX • 60–120 FPS OPTIMIZED</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
