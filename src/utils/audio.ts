/**
 * Procedural Web Audio API Synthesizer
 * 
 * Zero external audio assets required. Synthesizes diegetic Cybertronian 
 * mechanical clamps, hydraulic hisses, plasma blade swooshes, and seismic stone impacts.
 */

class CybertronAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientHumNode: OscillatorNode | null = null;
  private ambientHumGain: GainNode | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cybertron_audio_muted");
      this.isMuted = saved === "true";
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("cybertron_audio_muted", String(this.isMuted));
    }
    if (this.isMuted && this.ambientHumGain) {
      this.ambientHumGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("cybertron_audio_muted", String(this.isMuted));
    }
  }

  /**
   * ACT I: Dual-stage hydraulic pneumatic hiss (psshhh) followed by mechanical clamp (clack)
   */
  public playHydraulicSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Stage 1: Pneumatic Air Hiss (filtered noise)
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + 0.4);
    filter.Q.setValueAtTime(4.5, t);

    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.01, t);
    hissGain.gain.linearRampToValueAtTime(0.35, t + 0.08);
    hissGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    whiteNoise.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(ctx.destination);
    whiteNoise.start(t);

    // Stage 2: Mechanical Lock Clank at 0.35s
    setTimeout(() => {
      this.playMetallicLock();
    }, 320);
  }

  /**
   * Heavy mechanical faceplate lock / clamp
   */
  public playMetallicLock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Dual ringing metallic tones
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lockGain = ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(820, t);
    osc1.frequency.exponentialRampToValueAtTime(140, t + 0.18);

    osc2.frequency.setValueAtTime(1640, t);
    osc2.frequency.exponentialRampToValueAtTime(220, t + 0.12);

    lockGain.gain.setValueAtTime(0.4, t);
    lockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(lockGain);
    osc2.connect(lockGain);
    lockGain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  /**
   * ACT III: Energon Broadsword high-velocity plasma cleave swing
   * Unsheathing metallic ring ("shing") + high-energy plasma whoosh
   */
  public playSwordSlash() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Metallic blade ring ("shiiing")
    const ringOsc = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ringOsc.type = "sine";
    ringOsc.frequency.setValueAtTime(2400, t);
    ringOsc.frequency.exponentialRampToValueAtTime(1800, t + 0.35);

    ringGain.gain.setValueAtTime(0.25, t);
    ringGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    ringOsc.connect(ringGain);
    ringGain.connect(ctx.destination);
    ringOsc.start(t);
    ringOsc.stop(t + 0.35);

    // Plasma whoosh: swept low-pass noise + frequency-modulated oscillator
    const bufferSize = Math.floor(ctx.sampleRate * 0.5);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(300, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(3200, t + 0.15);
    noiseFilter.frequency.exponentialRampToValueAtTime(180, t + 0.45);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.01, t);
    whooshGain.gain.linearRampToValueAtTime(0.5, t + 0.15);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    noise.start(t);
  }

  /**
   * ACT III Drone Decapitation: Explosive metal crunch & spark shatter
   */
  public playDecapitationCrunch() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Heavy distortion crunch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.3);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);

    // High frequency metal shrapnel ping
    const ping = ctx.createOscillator();
    const pingGain = ctx.createGain();
    ping.type = "triangle";
    ping.frequency.setValueAtTime(3800, t + 0.05);
    ping.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
    pingGain.gain.setValueAtTime(0.3, t + 0.05);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    ping.connect(pingGain);
    pingGain.connect(ctx.destination);
    ping.start(t + 0.05);
    ping.stop(t + 0.28);
  }

  /**
   * ACT IV: Kinetic impact boom (BOOM-krrrksh) followed by electrical charging hum
   */
  public playStoneImpact() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Sub-bass kinetic seismic boom (48Hz -> 18Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(75, t);
    subOsc.frequency.exponentialRampToValueAtTime(22, t + 0.65);

    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.75);

    // Stone fracture crunch noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const crunchNoise = ctx.createBufferSource();
    crunchNoise.buffer = noiseBuffer;

    const crunchFilter = ctx.createBiquadFilter();
    crunchFilter.type = "bandpass";
    crunchFilter.frequency.setValueAtTime(850, t);
    crunchFilter.Q.setValueAtTime(2.0, t);

    const crunchGain = ctx.createGain();
    crunchGain.gain.setValueAtTime(0.6, t);
    crunchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    crunchNoise.connect(crunchFilter);
    crunchFilter.connect(crunchGain);
    crunchGain.connect(ctx.destination);
    crunchNoise.start(t);

    // Charging electrical hum after impact
    setTimeout(() => {
      this.playEnergonSurge();
    }, 280);
  }

  /**
   * Glowing Energon surge / recharge hum
   */
  public playEnergonSurge() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const hum = ctx.createOscillator();
    const humGain = ctx.createGain();

    hum.type = "sawtooth";
    hum.frequency.setValueAtTime(60, t);
    hum.frequency.linearRampToValueAtTime(120, t + 0.4);
    hum.frequency.linearRampToValueAtTime(60, t + 0.8);

    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(280, t);

    humGain.gain.setValueAtTime(0.001, t);
    humGain.gain.linearRampToValueAtTime(0.2, t + 0.3);
    humGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    hum.connect(lpf);
    lpf.connect(humGain);
    humGain.connect(ctx.destination);

    hum.start(t);
    hum.stop(t + 0.95);
  }

  /**
   * UI Telemetry chirps & hovers
   */
  public playHoverBlip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(2200, t + 0.04);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * UI Button Click / Execution
   */
  public playCommandConfirm() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(440, t);
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    osc2.frequency.setValueAtTime(880, t);
    osc2.frequency.exponentialRampToValueAtTime(1760, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.13);
    osc2.stop(t + 0.13);
  }
}

export const cyberAudio = new CybertronAudioEngine();
