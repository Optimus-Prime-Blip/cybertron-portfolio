"use client";

import React, { useState } from "react";
import { Terminal, Send, CheckCircle2, Github, Mail, Radio, ShieldAlert } from "lucide-react";
import { cyberAudio } from "@/utils/audio";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function ContactTerminal() {
  const [formData, setFormData] = useState({
    codename: "",
    frequency: "",
    transmission: "",
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { identity, transmission } = PORTFOLIO_DATA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codename || !formData.frequency || !formData.transmission) return;

    setIsTransmitting(true);
    cyberAudio.playCommandConfirm();

    setTimeout(() => {
      setIsTransmitting(false);
      setIsSuccess(true);
      cyberAudio.playEnergonSurge();
    }, 1200);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>ACT IV // TRANSMISSION CONDUIT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase glow-cyan mb-3">
          SECURE COMM FREQUENCY
        </h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-xl mx-auto">
          The Energon Broadsword is anchored in the Cybertronian monolith. Radiant energy fissures power this transmission terminal directly to {identity.callsign}.
        </p>
      </div>

      {/* Terminal Card */}
      <div className="w-full backdrop-blur-2xl bg-black/80 border border-cyan-500/40 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden clip-chamfer">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80" />
            <span className="text-cyan-400 ml-2 font-bold">{transmission.terminalHeader}</span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            FISSURE CONDUIT CHARGED
          </span>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 mb-4 shadow-[0_0_30px_rgba(0,255,255,0.6)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-mono uppercase">
              TRANSMISSION BROADCASTED
            </h3>
            <p className="text-gray-400 text-sm max-w-md font-mono mb-6">
              Your message was encoded across the Autobot relay and routed to {identity.callsign} (<span className="text-cyan-300">{identity.links.email}</span>).
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ codename: "", frequency: "", transmission: "" });
              }}
              className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold transition-all duration-200"
            >
              SEND ANOTHER TRANSMISSION
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Codename */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                  // CODENAME / YOUR IDENTITY
                </label>
                <input
                  type="text"
                  required
                  placeholder={transmission.placeholderCodename}
                  value={formData.codename}
                  onChange={(e) =>
                    setFormData({ ...formData, codename: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
                />
              </div>

              {/* Frequency / Email */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                  // FREQUENCY / CONTACT EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder={transmission.placeholderFrequency}
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Transmission Textarea */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
                // ENCRYPTED TRANSMISSION / MESSAGE
              </label>
              <textarea
                required
                rows={4}
                placeholder={transmission.placeholderTransmission}
                value={formData.transmission}
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                END-TO-END CRYPTOGRAPHICALLY SECURED
              </span>

              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 hover:text-white text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(0,255,255,0.4)] clip-chamfer-sm disabled:opacity-50"
              >
                {isTransmitting ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{transmission.sendButtonText}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Direct Frequencies Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <a
            href={identity.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-3 transition-all duration-200"
          >
            <Github className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-gray-400 text-[10px]">GITHUB REPOSITORY HUB</span>
              <span className="font-bold text-cyan-300">{identity.links.github.replace("https://", "")}</span>
            </div>
          </a>

          <a
            href={`mailto:${identity.links.email}`}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center gap-3 transition-all duration-200"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-gray-400 text-[10px]">DIRECT TRANSMISSION CONDUIT</span>
              <span className="font-bold text-emerald-300">{identity.links.email}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
