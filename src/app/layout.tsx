import "@/utils/react-poly";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arnav Yadav | Optimus Prime Cybertronian Battle Mech Portfolio",
  description:
    "Production-grade, ultra-cinematic 3D personal developer portfolio engineered around an Optimus Prime / Cybertronian Battle Mech aesthetic. Systems architect, distributed P2P swarms, and autonomous AI agents.",
  keywords: [
    "Arnav Yadav",
    "Optimus-Prime-Blip",
    "Creative Technologist",
    "Three.js",
    "WebGL",
    "Next.js 15",
    "Distributed Systems",
    "PAAVS",
    "Local Vitals MCP",
  ],
  authors: [{ name: "Arnav Yadav", url: "https://github.com/Optimus-Prime-Blip" }],
  creator: "Arnav Yadav",
  openGraph: {
    title: "Arnav Yadav // Cybertronian Battle Mech Portfolio",
    description:
      "Ultra-cinematic 3D personal developer portfolio engineered around an Optimus Prime aesthetic. Interactive battle mask deployment, Energon relics, and drone decapitation cleaves.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#04060b] text-[#e6f1ff] antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
