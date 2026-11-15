"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Shield, Terminal, Zap, Crosshair, ChevronRight, Activity, Cpu, Swords } from "lucide-react";
import { cyberAudio } from "@/utils/audio";
import { SceneAct } from "@/types";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

interface CyberHUDProps {
  currentAct: SceneAct;
  onNavigateAct: (act: SceneAct) => void;
  maskProgress: number;
  onToggleMask: () => void;
  onTriggerCleave: () => void;
}

export default function CyberHUD({
  currentAct,
  onNavigateAct,
  maskProgress,
  onToggleMask,
  onTriggerCleave,
}: CyberHUDProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    setIsMuted(cyberAudio.getMuted());

    // FPS estimation ticker
    let frameCount = 0;
    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      setFps(Math.min(120, Math.max(58, Math.round(frameCount / delta))));
      frameCount = 0;
      lastTime = now;
    }, 1000);

    const onFrame = () => {
      frameCount++;
      requestAnimationFrame(onFrame);
    };
    const req = requestAnimationFrame(onFrame);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(req);
    };
  }, []);

  const handleMuteToggle = () => {
    const muted = cyberAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      cyberAudio.playCommandConfirm();
    }
  };

  return (
    <nav aria-label="Cybertronian HUD" className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-mono">
      {/* ==================== TOP TELEMETRY STATUS BAR ==================== */}
      <header className="flex items-center justify-between gap-4">
        {/* Left: Autobot Identity Crest */}
        <div className="pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-cyan-500/30 clip-chamfer-sm">
          {/* Animated Autobot Crest Wireframe */}
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
              fill="currentColor"
            >
              <polygon points="50,5 92,30 92,75 50,95 8,75 8,30" fill="none" stroke="currentColor" strokeWidth="4" />
              <polygon points="50,15 80,33 80,70 50,85 20,70 20,33" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
              <circle cx="36" cy="42" r="5" fill="#00ffff" />
              <circle cx="64" cy="42" r="5" fill="#00ffff" />
              <polygon points="42,55 58,55 50,75" fill="#00ffff" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-white">
                {PORTFOLIO_DATA.identity.callsign}
              </span>
              <a
                href={PORTFOLIO_DATA.identity.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-200 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30 transition-colors"
              >
                @arnavyad2008-ux
              </a>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AUTOBOT MATRIX ONLINE
              </span>
              <span className="hidden sm:inline text-cyan-500/70">LATENCY: 1.2ms</span>
            </div>
          </div>
        </div>

        {/* Center: System Telemetry Meters */}
        <div className="hidden md:flex items-center gap-6 bg-black/50 backdrop-blur-md px-5 py-2 rounded-lg border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-gray-400">FPS:</span>
            <span className="font-bold text-white">{fps}</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-gray-400">GPU VRAM:</span>
            <span className="font-bold text-emerald-400">OPTIMAL</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-gray-400">ENERGON:</span>
            <span className="font-bold text-cyan-300">98.4%</span>
          </div>
        </div>

        {/* Right: Sound Toggle & Quick Triggers */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleMuteToggle}
            className={`p-2.5 rounded-lg border backdrop-blur-md transition-all duration-200 flex items-center gap-2 ${
              isMuted
                ? "bg-red-950/40 border-red-500/40 text-red-400"
                : "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.25)]"
            }`}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs hidden sm:inline">{isMuted ? "MUTED" : "SYNTH_ON"}</span>
          </button>
        </div>
      </header>

      {/* ==================== SCREEN CORNER RETICLES & CHEVRONS ==================== */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-500/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-500/40 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-500/40 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-500/40 pointer-events-none" />

      {/* ==================== BOTTOM HUD: SCENE NAVIGATOR & ACTION DOCK ==================== */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Act Anchors */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
          {[
            { act: 1 as SceneAct, label: "01 // HERO MASK", icon: Shield },
            { act: 2 as SceneAct, label: "02 // ARMORY", icon: Zap },
            { act: 3 as SceneAct, label: "03 // CLEAVE", icon: Crosshair },
            { act: 4 as SceneAct, label: "04 // CONDUIT", icon: Terminal },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentAct === item.act;
            return (
              <button
                key={item.act}
                onClick={() => {
                  cyberAudio.playCommandConfirm();
                  onNavigateAct(item.act);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,255,255,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">0{item.act}</span>
              </button>
            );
          })}
        </div>

        {/* Diegetic Interactive Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {currentAct === 1 && (
            <button
              onClick={onToggleMask}
              className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 hover:text-red-200 text-xs font-bold tracking-wider flex items-center gap-2 transition-all duration-200 shadow-[0_0_15px_rgba(177,18,38,0.4)] clip-chamfer-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{maskProgress > 0.5 ? "RETRACT MASK" : "DEPLOY BATTLE MASK"}</span>
            </button>
          )}

          {currentAct === 3 && (
            <button
              onClick={onTriggerCleave}
              className="px-5 py-2 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/45 border border-cyan-400 text-cyan-200 hover:text-white text-xs font-black tracking-wider flex items-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(0,255,255,0.6)] clip-chamfer-sm"
            >
              <Swords className="w-3.5 h-3.5 text-cyan-300" />
              <span>INITIATE COMBAT PROTOCOL / ENGAGE SKILLS</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 px-3 py-2 bg-black/40 rounded-lg border border-white/5">
            <span>SCROLL OR SCRUB</span>
            <ChevronRight className="w-3 h-3 text-cyan-400 animate-pulse" />
          </div>
        </div>
      </footer>
    </nav>
  );
}
