"use client";

import React from "react";
import { PORTFOLIO_DATA, Project } from "@/data/portfolioData";
import { ExternalLink, Github, Cpu, ShieldCheck, Activity, Terminal, Layers } from "lucide-react";
import { cyberAudio } from "@/utils/audio";

interface ProjectSectionProps {
  selectedIndex: number;
  onSelectProject: (index: number) => void;
}

export default function ProjectSection({
  selectedIndex,
  onSelectProject,
}: ProjectSectionProps) {
  const projects = PORTFOLIO_DATA.projects;
  const activeProject: Project = projects[selectedIndex] || projects[0];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>ACT II // CYBERTRONIAN ARMORY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase glow-cyan mb-3">
          ION RELICS & INNOVATIONS
        </h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-2xl mx-auto">
          Hover or select a 3D Energon Core to inspect system architecture, sharded tensor parallel pipelines, and cryptographic verification metrics.
        </p>
      </div>

      {/* Relic Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 w-full">
        {projects.map((project, idx) => {
          const isSelected = idx === selectedIndex;
          const shortTitle = project.title.split("(")[0].trim();
          return (
            <button
              key={project.id}
              onClick={() => {
                cyberAudio.playCommandConfirm();
                onSelectProject(idx);
              }}
              onMouseEnter={() => cyberAudio.playHoverBlip()}
              className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-300 clip-chamfer-sm flex items-center gap-2 border ${
                isSelected
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                  : "bg-black/50 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/30"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.coreColor }}
              />
              <span className="font-bold">{shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Relic Card (Chamfered Glass HUD) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Primary Relic Specifications */}
        <div className="lg:col-span-7 backdrop-blur-xl bg-black/70 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden clip-chamfer">
          {/* Subtle Background Accent */}
          <div
            className="absolute top-0 right-0 w-64 h-64 blur-3xl opacity-15 pointer-events-none rounded-full"
            style={{ backgroundColor: activeProject.coreColor }}
          />

          <div>
            {/* Top Telemetry Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4 font-mono text-xs">
              <span className="text-cyan-400 font-bold tracking-wider">
                {activeProject.codename}
              </span>
              <span className="text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                {activeProject.category}
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1">
              {activeProject.title}
            </h3>
            <h4 className="text-sm font-mono text-cyan-300 mb-4 font-medium">
              {activeProject.tagline}
            </h4>

            {/* Summary */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              {activeProject.summary}
            </p>

            {/* Tech Stack Pills */}
            <div className="mb-6">
              <h5 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>CORE TECHNOLOGIES & RUNTIMES</span>
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.stack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            {activeProject.githubUrl && (
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-2 border border-white/20 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                <span>SOURCE_CODE</span>
              </a>
            )}
            {activeProject.liveUrl && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-mono text-xs font-bold flex items-center gap-2 transition-all duration-200 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>LIVE_DEMO</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Key Architectural Metrics & HUD Gauges */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="backdrop-blur-xl bg-black/70 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-xl flex-1 clip-chamfer flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>KEY ARCHITECTURAL BENCHMARKS</span>
              </h4>

              {/* Metrics Grid */}
              <div className="space-y-3 mb-6">
                {activeProject.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between font-mono"
                  >
                    <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="text-cyan-400">▶</span>
                      <span>METRIC 0{mIdx + 1}</span>
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white glow-cyan text-right">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrity Status Indicator */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3 text-xs font-mono mt-auto">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-white font-bold block">CRYPTOGRAPHIC INTEGRITY: 100%</span>
                <span className="text-gray-400 text-[10px]">Deterministic local testing verified zero memory leaks.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
