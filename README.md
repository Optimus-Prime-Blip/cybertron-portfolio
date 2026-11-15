# ⚡ OPTIMUS PRIME // CYBERTRONIAN BATTLE MECH 3D PORTFOLIO
**Engineered for Arnav Yadav (`@Optimus-Prime-Blip`)**

> Production-grade, ultra-cinematic 3D personal developer portfolio engineered around an "Optimus Prime / Cybertronian Battle Mech" aesthetic. Built with Next.js 15, Three.js, React Three Fiber, GSAP ScrollTrigger, Lenis smooth scrolling, and procedural Web Audio API synthesis.

---

## 🚀 Quick Start

```bash
# Navigate to project directory
cd cybertron-portfolio

# Start development server
npm run dev

# Or build and run production server
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to enter the Cybertronian Matrix.

---

## 🛡️ The 4 Cinematic Scene Acts

### ACT I: The Hero & Dynamic Battle Mask Deployment
- **Optimus Prime Mechanical Bust:** Procedural 3D model with Optimus Chassis Crimson (`#B11226`), Anodized Cobalt Blue (`#003399`), Polished Gunmetal & Chrome, and Matrix Cyan optics.
- **Inertial Tracking:** Real-time smooth head tracking toward cursor position with spring damping (`MathUtils.damp`).
- **Kinematic Battle Mask Scrub (0.0 -> 0.25):** 
  - Mouthplate starts retracted, exposing inner mouth servos, speaker grilles, and hydraulic pistons.
  - As the user scrolls down, cheek armor plates slide forward along angular tracks.
  - The battle mask rises and snaps flush into combat mode.
  - Dual eye optics flare from idle glow to piercing Matrix Cyan.
  - **Procedural Sound Trigger:** Dual-stage mechanical clamp (`psshhh-clack`).

### ACT II: Cybertronian Armory (Ion Relics & Projects)
- **3D Ion Relics:** Rotating multi-faceted Energon crystalline cores nested within orbiting Autobot titanium gimbal rings.
- **Interactive Inspection:** Hovering or selecting a relic elevates the core, accelerates ring rotation, projects wireframe edge glow, and reveals holographic HUD telemetry.
- **Featured Systems:**
  1. **PAAVS:** Peer-to-Peer Accelerated AI Virtual Supercomputer (distributed LAN laptop memory pooling).
  2. **BHU-DRISHTI:** Satellite remote sensing & GIS land governance engine (Ministry of Rural Development).
  3. **Local Vitals MCP:** GPU VRAM and zombie process diagnostic server for AI coding agents.
  4. **CertiChain:** Cryptographic Merkle tree academic credential verification.
  5. **CampusAI Co-Pilot:** Offline Tauri v2 desktop study co-pilot with quantized local LLMs.

### ACT III: The Decapitation & Skill Cleave
- **Decepticon Drone Sentinels:** Four dark-steel titanium drones encircling the arena representing core engineering domains (Systems & Languages, Full-Stack, AI Swarms, CAD & Shaders).
- **Energon Broadsword Arc:** Full-scale broadsword featuring etched Autobot runes, chrome quillons, and pulsating dual plasma cutting edges.
- **The Cleave:** High-velocity radial sword swing sweeps across the drones, cleaving off heads into tumbling Voronoi debris fragments, revealing radiant internal Energon cores, and expanding 3D holographic skill badges.
- **Diegetic Sound:** Unsheathing ring (`shing`), plasma swing whoosh, and metallic shatter crunch.

### ACT IV: Sword into Stone & Transmission Conduit
- **Monolith Strike:** The broadsword is driven deep into an ancient Cybertronian cracked stone monolith, generating floating rock debris and a kinetic shockwave.
- **Spiderwebbing Fissures:** Glowing Matrix Cyan fissure veins spiderweb across the floor, powering the Transmission Terminal.
- **Transmission Terminal:** End-to-end secured contact frequency connecting recruiters and collaborators directly to Arnav Yadav (`arnavyad2008@gmail.com`).
- **60Hz Hum:** The embedded blade subtly vibrates in real-time with an electrical charging surge.

---

## 🔊 Diegetic Web Audio API Engine (`src/utils/audio.ts`)
- **Zero External Assets:** 100% synthesized in real time via Web Audio API nodes:
  - `playHydraulicSound()`: Swept bandpass filtered noise hiss.
  - `playMetallicLock()`: Dual FM bell-strike titanium clamp.
  - `playSwordSlash()`: High-frequency swept oscillator and plasma whoosh.
  - `playDecapitationCrunch()`: Distortion sawtooth crunch + high-Q shrapnel pings.
  - `playStoneImpact()`: 48Hz->18Hz sub-bass seismic boom + rock crumble noise.
  - `playEnergonSurge()`: 60Hz ambient charging surge.
- **Global Sound Toggle:** State persisted across sessions with `localStorage`.

---

## ⚡ Performance Guardrails (60–120 FPS on RTX 3050 Laptop / 6GB VRAM)
- Decoupled R3F canvas (`fixed inset-0 pointer-events-none`).
- Zero React re-renders during 3D animations: all frame mutations executed strictly in `useFrame` via refs.
- Instanced Energon dust particles (`InstancedMesh`).
- Post-processing pipeline optimized with mipmap blur and targeted luminance thresholds.
