"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";

interface BumblebeeBustProps {
  mousePosition: { x: number; y: number };
  activeAct: number;
}

export default function BumblebeeBust({ mousePosition, activeAct }: BumblebeeBustProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftOpticRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightOpticRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);

  // Materials tailored for Bumblebee (Racing Gold Yellow + Gloss Clearcoat + Onyx Stripes)
  const materials = useMemo(() => {
    return {
      yellowChassis: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f59e0b"),
        metalness: 0.82,
        roughness: 0.22,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.8,
      }),
      onyxStripe: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#111317"),
        metalness: 0.88,
        roughness: 0.25,
      }),
      gunmetalSteel: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1d24"),
        metalness: 0.92,
        roughness: 0.3,
      }),
      specularChrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e8edf2"),
        metalness: 0.98,
        roughness: 0.1,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    const root = rootGroupRef.current;
    if (root) {
      // Dynamic positioning based on scene act
      // Flanks Optimus on the left
      let targetX = -2.25;
      let targetY = -0.3;
      let targetZ = -0.3;
      let targetRotY = 0.32; // Angled inward toward Optimus & user
      let targetScale = 0.82;

      if (activeAct === 1) {
        targetX = -2.25;
        targetY = -0.3;
        targetZ = -0.3;
        targetScale = 0.82;
      } else if (activeAct === 2) {
        // Elevated scout flank behind armory
        targetX = -3.2;
        targetY = 0.8;
        targetZ = -2.2;
        targetScale = 0.72;
      } else if (activeAct === 3) {
        // Combat flanking position during drone decapitation
        targetX = -2.6;
        targetY = 0.2;
        targetZ = -1.2;
        targetScale = 0.78;
      } else if (activeAct === 4) {
        // Standing guard around the ancient monolith
        targetX = -2.2;
        targetY = 0.9;
        targetZ = -1.6;
        targetScale = 0.75;
      }

      root.position.x = THREE.MathUtils.damp(root.position.x, targetX, 5, delta);
      root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 5, delta);
      root.position.z = THREE.MathUtils.damp(root.position.z, targetZ, 5, delta);
      root.rotation.y = THREE.MathUtils.damp(root.rotation.y, targetRotY, 5, delta);

      const s = THREE.MathUtils.lerp(root.scale.x, targetScale, 5 * delta);
      root.scale.set(s, s, s);
    }

    const head = headGroupRef.current;
    if (head) {
      // Agile scout tracking: slightly faster dampening
      const targetHeadRotY = mousePosition.x * 0.4 + 0.1;
      const targetHeadRotX = -mousePosition.y * 0.25;
      const targetHeadRollZ = -mousePosition.x * 0.08;

      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetHeadRotY, 6, delta);
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetHeadRotX, 6, delta);
      head.rotation.z = THREE.MathUtils.damp(head.rotation.z, targetHeadRollZ, 6, delta);

      // Subtle breathing float
      head.position.y = Math.sin(state.clock.elapsedTime * 2.2 + 0.5) * 0.02;
    }

    // Glowing Matrix Cyan Optics pulse
    const opticGlow = Math.sin(state.clock.elapsedTime * 5.0) * 0.5 + 2.5;
    if (leftOpticRef.current) leftOpticRef.current.emissiveIntensity = hovered ? 4.5 : opticGlow;
    if (rightOpticRef.current) rightOpticRef.current.emissiveIntensity = hovered ? 4.5 : opticGlow;
  });

  return (
    <group
      ref={rootGroupRef}
      position={[-2.25, -0.3, -0.3]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        cyberAudio.playHoverBlip();
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        cyberAudio.playCommandConfirm();
      }}
    >
      {/* ==================== BUMBLEBEE HEAD RIG ==================== */}
      <group ref={headGroupRef}>
        {/* Aerodynamic Cranium (Yellow with Central Racing Stripe) */}
        <mesh material={materials.yellowChassis} position={[0, 0.42, 0]}>
          <boxGeometry args={[0.74, 0.48, 0.68]} />
        </mesh>

        {/* Center Onyx Black Racing Stripe */}
        <mesh material={materials.onyxStripe} position={[0, 0.44, 0.02]}>
          <boxGeometry args={[0.2, 0.49, 0.69]} />
        </mesh>

        {/* ==================== DUAL BEE HORNS / ANTENNAE CRESTS ==================== */}
        {/* Left Antenna */}
        <group position={[-0.32, 0.68, -0.05]} rotation={[0.15, 0.1, -0.25]}>
          {/* Base Mount */}
          <mesh material={materials.specularChrome}>
            <cylinderGeometry args={[0.04, 0.06, 0.14, 12]} />
          </mesh>
          {/* Angled Pylon Fin */}
          <mesh material={materials.yellowChassis} position={[0, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.36, 0.12]} />
          </mesh>
          {/* Top Bevel Tip */}
          <mesh material={materials.onyxStripe} position={[0, 0.42, 0]}>
            <coneGeometry args={[0.04, 0.12, 12]} />
          </mesh>
        </group>

        {/* Right Antenna */}
        <group position={[0.32, 0.68, -0.05]} rotation={[0.15, -0.1, 0.25]}>
          <mesh material={materials.specularChrome}>
            <cylinderGeometry args={[0.04, 0.06, 0.14, 12]} />
          </mesh>
          <mesh material={materials.yellowChassis} position={[0, 0.22, 0]}>
            <boxGeometry args={[0.06, 0.36, 0.12]} />
          </mesh>
          <mesh material={materials.onyxStripe} position={[0, 0.42, 0]}>
            <coneGeometry args={[0.04, 0.12, 12]} />
          </mesh>
        </group>

        {/* Forehead Brow Wedge */}
        <group position={[0, 0.32, 0.34]}>
          <mesh material={materials.yellowChassis} position={[-0.16, 0.02, 0]} rotation={[0, 0.2, -0.1]}>
            <boxGeometry args={[0.3, 0.12, 0.14]} />
          </mesh>
          <mesh material={materials.yellowChassis} position={[0.16, 0.02, 0]} rotation={[0, -0.2, 0.1]}>
            <boxGeometry args={[0.3, 0.12, 0.14]} />
          </mesh>
          {/* Center Autobot Keystone */}
          <mesh material={materials.specularChrome} position={[0, 0.06, 0.02]}>
            <boxGeometry args={[0.1, 0.14, 0.12]} />
          </mesh>
        </group>

        {/* ==================== DUAL OPTIC VISORS (CYBERTRONIAN MATRIX CYAN) ==================== */}
        <group position={[0, 0.22, 0.38]}>
          {/* Left Optic */}
          <mesh position={[-0.14, 0, 0]} rotation={[0, 0.12, 0]}>
            <boxGeometry args={[0.12, 0.07, 0.06]} />
            <meshStandardMaterial
              ref={leftOpticRef}
              color="#00e5ff"
              emissive="#00ffff"
              emissiveIntensity={2.5}
            />
          </mesh>
          {/* Right Optic */}
          <mesh position={[0.14, 0, 0]} rotation={[0, -0.12, 0]}>
            <boxGeometry args={[0.12, 0.07, 0.06]} />
            <meshStandardMaterial
              ref={rightOpticRef}
              color="#00e5ff"
              emissive="#00ffff"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        {/* ==================== MOUTHPLATE / CHIN GRILLE ==================== */}
        <group position={[0, 0.04, 0.35]}>
          {/* Chin Shield Faceplate */}
          <mesh material={materials.onyxStripe} position={[0, -0.05, 0]}>
            <boxGeometry args={[0.26, 0.18, 0.1]} />
          </mesh>
          {/* Audio Grille Slits */}
          {[-0.04, 0, 0.04].map((y, i) => (
            <mesh key={i} material={materials.specularChrome} position={[0, y - 0.04, 0.055]}>
              <boxGeometry args={[0.18, 0.015, 0.01]} />
            </mesh>
          ))}
          {/* Lower Jaw Guard */}
          <mesh material={materials.yellowChassis} position={[0, -0.15, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.12]} />
          </mesh>
        </group>

        {/* Aerodynamic Cheek Flutes */}
        <mesh material={materials.yellowChassis} position={[-0.38, 0.12, 0.18]} rotation={[0, 0.25, -0.1]}>
          <boxGeometry args={[0.14, 0.32, 0.26]} />
        </mesh>
        <mesh material={materials.yellowChassis} position={[0.38, 0.12, 0.18]} rotation={[0, -0.25, 0.1]}>
          <boxGeometry args={[0.14, 0.32, 0.26]} />
        </mesh>
      </group>

      {/* ==================== NECK & SHOULDERS ==================== */}
      <group position={[0, -0.32, 0]}>
        {/* Neck Cylinder */}
        <mesh material={materials.gunmetalSteel} position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.22, 16]} />
        </mesh>

        {/* Torso Collar (Racing Yellow & Onyx Stripes) */}
        <group position={[0, -0.18, 0]}>
          <mesh material={materials.yellowChassis} position={[0, -0.15, 0]}>
            <boxGeometry args={[1.35, 0.45, 0.72]} />
          </mesh>
          {/* Center Black Chevron Decal */}
          <mesh material={materials.onyxStripe} position={[0, -0.12, 0.37]}>
            <boxGeometry args={[0.26, 0.36, 0.02]} />
          </mesh>

          {/* Heavy Pauldrons */}
          <mesh material={materials.yellowChassis} position={[-0.78, -0.08, 0]} rotation={[0, 0, 0.18]}>
            <boxGeometry args={[0.32, 0.42, 0.6]} />
          </mesh>
          <mesh material={materials.yellowChassis} position={[0.78, -0.08, 0]} rotation={[0, 0, -0.18]}>
            <boxGeometry args={[0.32, 0.42, 0.6]} />
          </mesh>

          {/* Scout Shoulder Pylon */}
          <mesh material={materials.specularChrome} position={[-0.82, 0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.22, 12]} />
          </mesh>
        </group>
      </group>

      {/* ==================== HOLOGRAPHIC SCOUT TAG ==================== */}
      <Html
        position={[0, 1.05, 0]}
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          opacity: hovered ? 1 : 0.65,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transform: `scale(${hovered ? 1.08 : 0.95})`,
        }}
      >
        <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-left font-mono shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-300 tracking-wider">
              BUMBLEBEE // B-127
            </span>
          </div>
          <span className="text-[9px] text-gray-400 block tracking-widest uppercase">
            AUTOBOT FRONT-LINE SCOUT
          </span>
        </div>
      </Html>
    </group>
  );
}
