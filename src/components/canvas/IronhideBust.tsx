"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";

interface IronhideBustProps {
  mousePosition: { x: number; y: number };
  activeAct: number;
}

export default function IronhideBust({ mousePosition, activeAct }: IronhideBustProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftOpticRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightOpticRef = useRef<THREE.MeshStandardMaterial>(null);
  const cannonGlowRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);

  // Materials tailored for Ironhide (Specular Dark Titanium + Chrome Heavy Hydraulics)
  const materials = useMemo(() => {
    return {
      darkTitanium: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#1a1e26"),
        metalness: 0.92,
        roughness: 0.26,
        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.6,
      }),
      gunmetalSteel: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#12141a"),
        metalness: 0.94,
        roughness: 0.32,
      }),
      heavyChrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e8edf2"),
        metalness: 0.98,
        roughness: 0.12,
      }),
      cannonAlloy: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#252b36"),
        metalness: 0.9,
        roughness: 0.22,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    const root = rootGroupRef.current;
    if (root) {
      // Flanks Optimus on the right
      let targetX = 2.25;
      let targetY = -0.3;
      let targetZ = -0.3;
      let targetRotY = -0.32; // Angled inward toward Optimus & user
      let targetScale = 0.84;

      if (activeAct === 1) {
        targetX = 2.25;
        targetY = -0.3;
        targetZ = -0.3;
        targetScale = 0.84;
      } else if (activeAct === 2) {
        // Elevated heavy artillery guard behind armory
        targetX = 3.2;
        targetY = 0.8;
        targetZ = -2.2;
        targetScale = 0.74;
      } else if (activeAct === 3) {
        // Flanking combat stance during drone decapitation
        targetX = 2.6;
        targetY = 0.2;
        targetZ = -1.2;
        targetScale = 0.8;
      } else if (activeAct === 4) {
        // Guarding the conduit monolith perimeter
        targetX = 2.2;
        targetY = 0.9;
        targetZ = -1.6;
        targetScale = 0.76;
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
      // Heavy veteran steady tracking
      const targetHeadRotY = mousePosition.x * 0.35 - 0.1;
      const targetHeadRotX = -mousePosition.y * 0.22;
      const targetHeadRollZ = -mousePosition.x * 0.06;

      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetHeadRotY, 4, delta);
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetHeadRotX, 4, delta);
      head.rotation.z = THREE.MathUtils.damp(head.rotation.z, targetHeadRollZ, 4, delta);

      // Heavy breathing sway
      head.position.y = Math.sin(state.clock.elapsedTime * 1.8) * 0.015;
    }

    // Optic flare
    const opticGlow = Math.sin(state.clock.elapsedTime * 4.0) * 0.4 + 2.4;
    if (leftOpticRef.current) leftOpticRef.current.emissiveIntensity = hovered ? 4.2 : opticGlow;
    if (rightOpticRef.current) rightOpticRef.current.emissiveIntensity = hovered ? 4.2 : opticGlow;

    // Cannon energy coil pulse
    if (cannonGlowRef.current) {
      const coilPulse = Math.sin(state.clock.elapsedTime * 6.0) * 0.6 + 2.2;
      cannonGlowRef.current.emissiveIntensity = hovered ? 4.5 : coilPulse;
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[2.25, -0.3, -0.3]}
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
      {/* ==================== IRONHIDE HEAD RIG ==================== */}
      <group ref={headGroupRef}>
        {/* Reinforced Heavy Helmet Cranium (Dark Titanium) */}
        <mesh material={materials.darkTitanium} position={[0, 0.44, 0]}>
          <boxGeometry args={[0.82, 0.52, 0.72]} />
        </mesh>

        {/* Central Reinforced Combat Crest */}
        <mesh material={materials.gunmetalSteel} position={[0, 0.68, 0.05]}>
          <boxGeometry args={[0.22, 0.22, 0.68]} />
        </mesh>
        <mesh material={materials.heavyChrome} position={[0, 0.76, 0.08]}>
          <boxGeometry args={[0.08, 0.06, 0.62]} />
        </mesh>

        {/* Heavy Brow Guard (V-Shield Over Optics) */}
        <group position={[0, 0.34, 0.36]}>
          <mesh material={materials.darkTitanium} position={[-0.18, 0.02, 0]} rotation={[0, 0.16, -0.08]}>
            <boxGeometry args={[0.34, 0.14, 0.16]} />
          </mesh>
          <mesh material={materials.darkTitanium} position={[0.18, 0.02, 0]} rotation={[0, -0.16, 0.08]}>
            <boxGeometry args={[0.34, 0.14, 0.16]} />
          </mesh>
          <mesh material={materials.heavyChrome} position={[0, 0.06, 0.03]}>
            <boxGeometry args={[0.12, 0.18, 0.14]} />
          </mesh>
        </group>

        {/* ==================== DUAL TACTICAL MATRIX CYAN OPTICS ==================== */}
        <group position={[0, 0.22, 0.4]}>
          {/* Left Optic */}
          <mesh position={[-0.16, 0, 0]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.14, 0.075, 0.06]} />
            <meshStandardMaterial
              ref={leftOpticRef}
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={2.5}
            />
          </mesh>
          {/* Right Optic */}
          <mesh position={[0.16, 0, 0]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.14, 0.075, 0.06]} />
            <meshStandardMaterial
              ref={rightOpticRef}
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        {/* ==================== HEAVY JAW BLAST PLATE & INTAKE ==================== */}
        <group position={[0, 0.02, 0.36]}>
          {/* Heavy Jaw Base */}
          <mesh material={materials.gunmetalSteel}>
            <boxGeometry args={[0.38, 0.22, 0.14]} />
          </mesh>
          {/* Dual Slotted Intake Grille */}
          {[-0.05, 0, 0.05].map((y, i) => (
            <mesh key={i} material={materials.heavyChrome} position={[0, y, 0.075]}>
              <boxGeometry args={[0.26, 0.018, 0.015]} />
            </mesh>
          ))}
          {/* Heavy Chin Piston Mount */}
          <mesh material={materials.darkTitanium} position={[0, -0.15, 0]}>
            <boxGeometry args={[0.26, 0.08, 0.14]} />
          </mesh>
        </group>

        {/* Angular Cheek Flanges */}
        <mesh material={materials.darkTitanium} position={[-0.44, 0.12, 0.2]} rotation={[0, 0.28, -0.06]}>
          <boxGeometry args={[0.16, 0.38, 0.32]} />
        </mesh>
        <mesh material={materials.darkTitanium} position={[0.44, 0.12, 0.2]} rotation={[0, -0.28, 0.06]}>
          <boxGeometry args={[0.16, 0.38, 0.32]} />
        </mesh>
      </group>

      {/* ==================== NECK & TORSO CHASSIS ==================== */}
      <group position={[0, -0.34, 0]}>
        {/* Heavy Neck Vertebrae */}
        <mesh material={materials.gunmetalSteel} position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.24, 0.28, 0.24, 16]} />
        </mesh>

        {/* Torso Collar (Dark Titanium & Heavy Gunmetal) */}
        <group position={[0, -0.2, 0]}>
          <mesh material={materials.darkTitanium} position={[0, -0.15, 0]}>
            <boxGeometry args={[1.55, 0.52, 0.8]} />
          </mesh>

          {/* Heavy Chest Blast Plates */}
          <mesh material={materials.gunmetalSteel} position={[-0.38, -0.1, 0.42]} rotation={[0, 0.12, 0]}>
            <boxGeometry args={[0.55, 0.32, 0.06]} />
          </mesh>
          <mesh material={materials.gunmetalSteel} position={[0.38, -0.1, 0.42]} rotation={[0, -0.12, 0]}>
            <boxGeometry args={[0.55, 0.32, 0.06]} />
          </mesh>

          {/* Heavy Pauldrons */}
          <mesh material={materials.darkTitanium} position={[-0.92, -0.08, 0]} rotation={[0, 0, 0.16]}>
            <boxGeometry args={[0.36, 0.48, 0.68]} />
          </mesh>
          <mesh material={materials.darkTitanium} position={[0.92, -0.08, 0]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.36, 0.48, 0.68]} />
          </mesh>

          {/* ==================== SHOULDER HEAVY ION CANNONS ==================== */}
          {/* Right Shoulder Main Heavy Cannon */}
          <group position={[0.98, 0.32, -0.1]} rotation={[-0.2, 0.15, 0]}>
            {/* Cannon Base Pivot */}
            <mesh material={materials.heavyChrome}>
              <cylinderGeometry args={[0.1, 0.1, 0.22, 16]} />
            </mesh>
            {/* Cannon Main Barrel */}
            <mesh material={materials.cannonAlloy} position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 0.65, 16]} />
            </mesh>
            {/* Glowing Ion Energy Coil Rings */}
            {[-0.05, 0.08, 0.22].map((y, i) => (
              <mesh key={i} position={[0, 0.28 + y, 0]}>
                <torusGeometry args={[0.085, 0.015, 8, 16]} />
                <meshStandardMaterial
                  ref={cannonGlowRef}
                  color="#00ffff"
                  emissive="#00e5ff"
                  emissiveIntensity={2.5}
                />
              </mesh>
            ))}
            {/* Muzzle Brake */}
            <mesh material={materials.heavyChrome} position={[0, 0.65, 0]}>
              <cylinderGeometry args={[0.085, 0.075, 0.12, 16]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== HOLOGRAPHIC WEAPONS SPECIALIST TAG ==================== */}
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
        <div className="px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/40 text-left font-mono shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-300 tracking-wider">
              IRONHIDE // VANGUARD-02
            </span>
          </div>
          <span className="text-[9px] text-gray-400 block tracking-widest uppercase">
            HEAVY WEAPONS SPECIALIST
          </span>
        </div>
      </Html>
    </group>
  );
}
