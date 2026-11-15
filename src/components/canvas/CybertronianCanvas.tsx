"use client";

import "@/utils/react-poly";
import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import OptimusBust from "./OptimusBust";
import BumblebeeBust from "./BumblebeeBust";
import IronhideBust from "./IronhideBust";
import EnergonSword from "./EnergonSword";
import DroneSkills from "./DroneSkills";
import StoneConduit from "./StoneConduit";
import ArmoryCores from "./ArmoryCores";
import { SceneAct, SkillDomain } from "@/types";

interface CybertronianCanvasProps {
  currentAct: SceneAct;
  maskProgress: number;
  cleaveProgress: number;
  impactProgress: number;
  selectedProjectIndex: number;
  onSelectProject: (index: number) => void;
  onSelectSkillDomain?: (domain: SkillDomain) => void;
}

// High-Performance Instanced Energon Dust Particles
function EnergonDust() {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        pos: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 12,
        ] as [number, number, number],
        vel: [
          (Math.random() - 0.5) * 0.2,
          0.1 + Math.random() * 0.25,
          (Math.random() - 0.5) * 0.2,
        ],
        scale: 0.02 + Math.random() * 0.04,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    particles.forEach((p, i) => {
      p.pos[1] += p.vel[1] * delta;
      p.pos[0] += p.vel[0] * delta;
      p.pos[2] += p.vel[2] * delta;

      if (p.pos[1] > 5) p.pos[1] = -5;
      if (p.pos[0] > 8) p.pos[0] = -8;
      if (p.pos[0] < -8) p.pos[0] = 8;

      dummy.position.set(p.pos[0], p.pos[1], p.pos[2]);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.65} />
    </instancedMesh>
  );
}

// Dynamic Camera Controller for Scene Act choreography
function CameraRig({
  currentAct,
  cleaveProgress,
  mousePosition,
}: {
  currentAct: SceneAct;
  cleaveProgress: number;
  mousePosition: { x: number; y: number };
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    let targetPos = new THREE.Vector3(0, 0, 3.8);
    let targetLook = new THREE.Vector3(0, 0, 0);

    // Dynamic camera coordinates tailored to each scene act
    if (currentAct === 1) {
      // Act I: Focus on Optimus Prime Bust
      targetPos.set(mousePosition.x * 0.35, mousePosition.y * 0.25, 3.4);
      targetLook.set(0, 0.05, 0);
    } else if (currentAct === 2) {
      // Act II: Armory view, elevated slightly to survey the floating relics
      targetPos.set(0, 0.2, 3.8);
      targetLook.set(0, -0.1, 0);
    } else if (currentAct === 3) {
      // Act III: Balanced wide framing ensuring all 4 sentinels and HUD stay fully on screen
      const camPanX = THREE.MathUtils.lerp(0.15, -0.15, cleaveProgress);
      const camZoomZ = THREE.MathUtils.lerp(5.2, 4.8, Math.sin(cleaveProgress * Math.PI));
      targetPos.set(camPanX, 0.22, camZoomZ);
      targetLook.set(0, -0.15, 0);
    } else if (currentAct === 4) {
      // Act IV: Low dramatic upward perspective on the embedded sword & stone monolith
      targetPos.set(0, -0.2, 3.2);
      targetLook.set(0, -0.4, 0);
    }

    camera.position.lerp(targetPos, 4 * delta);
    camera.lookAt(targetLook);
  });

  return null;
}

// Scene Orchestrator that positions each 3D entity based on active Act
function SceneContent({
  currentAct,
  maskProgress,
  cleaveProgress,
  impactProgress,
  selectedProjectIndex,
  onSelectProject,
  onSelectSkillDomain,
  mousePosition,
}: CybertronianCanvasProps & { mousePosition: { x: number; y: number } }) {
  const bustRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const bust = bustRef.current;
    if (!bust) return;

    let targetBustPos = new THREE.Vector3(0, 0, 0);
    let targetBustScale = 1.0;

    if (currentAct === 1) {
      targetBustPos.set(0, 0, 0);
      targetBustScale = 1.0;
    } else if (currentAct === 2) {
      // Relocate bust behind / above armory as an observing colossus
      targetBustPos.set(0, 1.2, -1.8);
      targetBustScale = 0.85;
    } else if (currentAct === 3) {
      // Centered in battle stance behind the drones
      targetBustPos.set(0, 0.1, -0.6);
      targetBustScale = 0.95;
    } else if (currentAct === 4) {
      // Positioned above the monolith
      targetBustPos.set(0, 1.6, -1.2);
      targetBustScale = 0.8;
    }

    bust.position.lerp(targetBustPos, 5 * delta);
    const newScale = THREE.MathUtils.lerp(bust.scale.x, targetBustScale, 5 * delta);
    bust.scale.set(newScale, newScale, newScale);
  });

  return (
    <>
      <CameraRig
        currentAct={currentAct}
        cleaveProgress={cleaveProgress}
        mousePosition={mousePosition}
      />

      {/* ==================== STUDIO-GRADE MECH LIGHTING RIG ==================== */}
      {/* 0. Ambient shadow tone for deep contrast */}
      <ambientLight intensity={0.35} color="#001a4d" />

      {/* 1. Key Light (Top-Front Right): Sharp direct white light catching red helmet and chrome bevels */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />

      {/* 2. Fill & Atmosphere Light (Top-Left): Deep royal blue tint */}
      <directionalLight
        position={[-6, 4, 2]}
        intensity={1.5}
        color="#0044ff"
      />

      {/* 3. Rim / Edge Kicker (Rear Silhouette): Sharp, bright cyan silhouette pulling mech from dark background */}
      <directionalLight
        position={[0, 6, -8]}
        intensity={5.0}
        color="#00e5ff"
      />

      {/* 4. Ground Under-Glow (Warm bounce): Upward red glow catching chin hydraulics and collar */}
      <pointLight
        position={[0, -3, 2]}
        intensity={1.8}
        color="#ff1a1a"
        distance={8}
      />

      {/* Matrix Cyan core fill */}
      <pointLight
        position={[0, 1, 2.5]}
        intensity={1.5}
        color="#00ffff"
        distance={6}
      />

      {/* Energon Dust Particles */}
      <EnergonDust />

      {/* ACT I: Optimus Prime Bust */}
      <group ref={bustRef}>
        <OptimusBust maskProgress={maskProgress} mousePosition={mousePosition} />
      </group>

      {/* Flanking Autobot Squad: Bumblebee on Left, Ironhide on Right */}
      <BumblebeeBust mousePosition={mousePosition} activeAct={currentAct} />
      <IronhideBust mousePosition={mousePosition} activeAct={currentAct} />

      {/* ACT II: Cybertronian Armory Relics */}
      <ArmoryCores
        selectedIndex={selectedProjectIndex}
        onSelectProject={onSelectProject}
        active={currentAct === 2}
      />

      {/* ACT III: Energon Broadsword & Decepticon Drone Decapitation */}
      <EnergonSword
        swingProgress={cleaveProgress}
        active={currentAct === 3}
      />
      <DroneSkills
        cleaveProgress={cleaveProgress}
        active={currentAct === 3}
        onSelectDomain={onSelectSkillDomain}
      />

      {/* ACT IV: Sword Embedded in Stone Monolith & Energon Conduit */}
      <StoneConduit
        impactProgress={impactProgress}
        active={currentAct === 4}
      />
    </>
  );
}

export default function CybertronianCanvas({
  currentAct,
  maskProgress,
  cleaveProgress,
  impactProgress,
  selectedProjectIndex,
  onSelectProject,
  onSelectSkillDomain,
}: CybertronianCanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden">
      {/* Background radial gradient: Deep Royal Blue to Void Black */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 20%, #001a4d 0%, #000c26 40%, #04060b 85%)",
        }}
      />

      {/* Parallax Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />

      {/* High-DPI, Pin-Sharp Canvas Configuration with ACESFilmic Tone Mapping */}
      <Canvas
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3.8]} fov={45} />
        
        <SceneContent
          currentAct={currentAct}
          maskProgress={maskProgress}
          cleaveProgress={cleaveProgress}
          impactProgress={impactProgress}
          selectedProjectIndex={selectedProjectIndex}
          onSelectProject={onSelectProject}
          onSelectSkillDomain={onSelectSkillDomain}
          mousePosition={mousePos}
        />

        {/* Post-Processing Pipeline: Crisp High-Threshold Bloom (only optics/sword edge, no body blur) */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.88}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.4}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette
            offset={0.3}
            darkness={0.7}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
