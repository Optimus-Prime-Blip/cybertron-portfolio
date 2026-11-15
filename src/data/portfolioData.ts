export interface Project {
  id: string;
  codename: string;
  title: string;
  tagline: string;
  category: "Distributed Systems" | "Agentic AI & OS" | "GIS & Web" | "Dev Tools";
  summary: string;
  metrics: string[];
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  coreColor: string; // Hex color for the 3D rotating Ion Relic
}

export interface SkillCategory {
  domain: string;
  droneName: string;
  skills: { name: string; level: string; icon?: string }[];
}

export const PORTFOLIO_DATA = {
  identity: {
    callsign: "ARNAV YADAV",
    title: "Systems, AI & Distributed Infrastructure Engineer",
    origin: "Ghaziabad, Uttar Pradesh, India",
    institution: "KIET Group of Institutions (B.Tech CSE)",
    bio: "Engineering autonomous agent kernels, distributed local compute meshes, and high-performance WebGL systems. Bridging low-level execution with real-time reactive interfaces.",
    links: {
      github: "https://github.com/arnavyad2008-ux",
      email: "arnavyad2008@gmail.com",
      terminal: "arnav@optimus:~$",
    },
  },

  projects: [
    {
      id: "paavs",
      codename: "PROJECT: PAAVS",
      title: "PAAVS (Peer-to-Peer Accelerated AI Virtual Supercomputer)",
      tagline: "Distributed local compute mesh pooling memory across LAN laptops.",
      category: "Distributed Systems",
      summary:
        "Engineered a distributed compute and memory orchestration layer designed to pool VRAM and RAM across consumer machines over Wi-Fi/LAN, executing quantized LLM parameters without dedicated cluster hardware.",
      metrics: ["Zero-Cloud Reliance", "LAN P2P Memory Pool", "PyTorch / ZeRO-3 Architecture"],
      stack: ["Python", "FastAPI", "PyTorch", "DeepSpeed ZeRO-3", "WebSockets"],
      githubUrl: "https://github.com/arnavyad2008-ux",
      coreColor: "#00ffff", // Cyan Matrix glow
    },
    {
      id: "bhu-drishti",
      codename: "PROJECT: BHU-DRISHTI",
      title: "BHU-DRISHTI (SIH National Finalist)",
      tagline: "Satellite remote sensing and GIS land governance platform.",
      category: "GIS & Web",
      summary:
        "Built as Team Lead & Technical Lead for Team Nexora (Smart India Hackathon, Problem SIH26019) for the Ministry of Rural Development. Integrates multi-spectral satellite imagery and spatial boundary mapping to monitor land parcel changes.",
      metrics: ["Govt / SIH Finalist", "Multi-spectral GIS Overlays", "Vector Boundary Mapping"],
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "GIS / MapLibre", "Supabase"],
      githubUrl: "https://github.com/arnavyad2008-ux",
      coreColor: "#00e5ff",
    },
    {
      id: "local-vitals",
      codename: "TOOL: LOCAL-VITALS-MCP",
      title: "Local Vitals MCP",
      tagline: "Hardware telemetry and zombie process guardrail for AI coding agents.",
      category: "Dev Tools",
      summary:
        "Model Context Protocol (MCP) server that empowers Cursor, Claude Code, and Cline to detect port conflicts (EADDRINUSE), monitor GPU VRAM allocations via nvidia-smi, and eliminate orphan runner processes.",
      metrics: ["Zero-Dependency", "One-line npx execution", "Cross-Platform Process Reaper"],
      stack: ["TypeScript", "Node.js", "MCP SDK", "System Information"],
      githubUrl: "https://github.com/arnavyad2008-ux",
      coreColor: "#ff9900", // Energon Amber
    },
    {
      id: "certichain",
      codename: "PROJECT: CERTICHAIN",
      title: "CertiChain",
      tagline: "Decentralized academic credential verification via Merkle tree proofs.",
      category: "Distributed Systems",
      summary:
        "Designed and presented for Innotech at KIET. Provides instantaneous, tamper-proof academic record verification using cryptographic Merkle tree roots to prevent diploma fraud without expensive on-chain gas costs.",
      metrics: ["O(log N) Cryptographic Proofs", "Sub-second Verification", "Tamper-evident"],
      stack: ["TypeScript", "Cryptography", "Next.js", "Supabase"],
      githubUrl: "https://github.com/arnavyad2008-ux",
      coreColor: "#0055ff",
    },
    {
      id: "campus-ai",
      codename: "PROJECT: CAMPUS-AI",
      title: "CampusAI Co-Pilot",
      tagline: "Air-gapped offline desktop study assistant.",
      category: "Agentic AI & OS",
      summary:
        "Lightweight, local-first desktop study companion running entirely offline with quantized models, offering local semantic search over notes and automated practice quizzes.",
      metrics: ["100% Offline Inference", "Sub-50MB Memory Footprint", "Tauri v2 Native"],
      stack: ["Tauri v2", "llama.cpp", "Next.js", "Tailwind CSS"],
      githubUrl: "https://github.com/arnavyad2008-ux",
      coreColor: "#B11226", // Autobot Crimson
    },
  ] as Project[],

  skills: [
    {
      domain: "Systems & Languages",
      droneName: "SENTINEL 01: CORE RUNTIMES",
      skills: [
        { name: "C++", level: "Low-level / DSA" },
        { name: "Java", level: "OOP / Algorithms" },
        { name: "Python", level: "Scientific / Scripting" },
        { name: "TypeScript", level: "Strict-type Systems" },
        { name: "SQL", level: "Relational Queries" },
      ],
    },
    {
      domain: "Full-Stack Architecture",
      droneName: "SENTINEL 02: APPLICATION MESH",
      skills: [
        { name: "Next.js 15 (App Router)", level: "Production" },
        { name: "React 19", level: "UI Architecture" },
        { name: "Tailwind CSS", level: "Design Systems" },
        { name: "Supabase", level: "Auth & Realtime" },
        { name: "Vercel / Edge Deploy", level: "CI/CD" },
      ],
    },
    {
      domain: "AI & Local Inference Engines",
      droneName: "SENTINEL 03: NEURAL ENGINES",
      skills: [
        { name: "PyTorch & DeepSpeed", level: "Distributed Weights" },
        { name: "Ollama / llama.cpp", level: "Quantized Inference" },
        { name: "FastAPI", level: "High-throughput APIs" },
        { name: "Agent Tooling (MCP)", level: "Protocol Dev" },
        { name: "Playwright Automation", level: "Headless Crawlers" },
      ],
    },
    {
      domain: "Graphics & Interactive 3D",
      droneName: "SENTINEL 04: KINETIC MECHANICS",
      skills: [
        { name: "Three.js / R3F", level: "Shaders & Canvases" },
        { name: "GSAP & ScrollTrigger", level: "Choreography" },
        { name: "Autodesk Fusion (Python)", level: "Parametric CAD" },
        { name: "Web Audio API", level: "Procedural Sound" },
      ],
    },
  ] as SkillCategory[],

  transmission: {
    terminalHeader: "AUTOBOT SECURE TRANSMISSION CONDUIT // FREQ: 142.80 MHz",
    placeholderCodename: "IDENTIFY CALLSIGN (NAME)",
    placeholderFrequency: "UPLINK CHANNEL (EMAIL)",
    placeholderTransmission: "ENCRYPTED MESSAGE (TRANSMISSION PAYLOAD)",
    sendButtonText: "INITIATE TRANSMISSION",
  },
};
