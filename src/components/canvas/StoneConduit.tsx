"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";

interface StoneConduitProps {
  impactProgress: number; // 0.0 to 1.0
  active: boolean;
}

export default function StoneConduit({ impactProgress, active }: StoneConduitProps) {
  const monolithGroupRef = useRef<THREE.Group>(null);
  const swordRef = useRef<THREE.Group>(null);
  const fissureMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const shockwaveRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const prevImpactRef = useRef<number>(0);

  // Audio trigger on kinetic stone strike
  useEffect(() => {
    if (impactProgress > 0.3 && prevImpactRef.current <= 0.3 && active) {
      cyberAudio.playStoneImpact();
    }
    prevImpactRef.current = impactProgress;
  }, [impactProgress, active]);

  // Floating shattered stone debris surrounding the impact crater
  const debris = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 0.6 + Math.random() * 1.2;
      return {
        x: Math.cos(angle) * dist,
        y: 0.1 + Math.random() * 0.6,
        z: Math.sin(angle) * dist,
        scale: 0.06 + Math.random() * 0.12,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        floatSpeed: 1.5 + Math.random() * 2,
      };
    });
  }, []);

  // Spiderwebbing fissure branches radiating outward
  const fissureBranches = useMemo(() => {
    const branches = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const length = 2.5 + Math.random() * 1.5;
      branches.push({
        angle,
        length,
        posX: Math.cos(angle) * (length / 2),
        posZ: Math.sin(angle) * (length / 2),
      });
    }
    return branches;
  }, []);

  // Cybertronian materials
  const materials = useMemo(() => {
    return {
      monolithStone: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0c0e14"),
        metalness: 0.2,
        roughness: 0.9,
      }),
      stoneAccent: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#181d26"),
        metalness: 0.7,
        roughness: 0.4,
      }),
      swordSpine: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#161a20"),
        metalness: 0.96,
        roughness: 0.15,
      }),
      swordChrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e8edf2"),
        metalness: 0.98,
        roughness: 0.1,
      }),
      swordRed: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#B11226"),
        metalness: 0.88,
        roughness: 0.2,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    // 60Hz ambient vibration on the embedded sword
    const sword = swordRef.current;
    if (sword && active) {
      // 60Hz micro-oscillation (Math.sin at high frequency)
      const microVibe = Math.sin(state.clock.elapsedTime * 60.0) * 0.003;
      sword.position.x = microVibe;
      sword.position.z = microVibe * 0.8;
      sword.rotation.z = -0.05 + Math.sin(state.clock.elapsedTime * 30.0) * 0.004;
    }

    // Energon fissure glowing energy wave
    if (fissureMatRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4.0) * 0.8 + 2.8;
      const intensity = THREE.MathUtils.lerp(0.5, pulse, active ? 1.0 : 0.2);
      fissureMatRef.current.emissiveIntensity = intensity;
    }

    // Expanding shockwave ring on impact
    if (shockwaveRingRef.current && active) {
      const wave = (state.clock.elapsedTime * 0.8) % 1.0;
      shockwaveRingRef.current.scale.set(1 + wave * 3.5, 1 + wave * 3.5, 1);
      (shockwaveRingRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - wave) * 0.6;
    }
  });

  if (!active && impactProgress <= 0.05) return null;

  return (
    <group ref={monolithGroupRef} position={[0, -1.1, 0]}>
      {/* ==================== ANCIENT CYBERTRONIAN STONE MONOLITH ==================== */}
      <group position={[0, 0, 0]}>
        {/* Main Fractured Base Monolith */}
        <mesh material={materials.monolithStone} position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.9, 1.35, 0.9, 8]} />
        </mesh>
        {/* Tier 2 Stepped Octagonal Plinth */}
        <mesh material={materials.stoneAccent} position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.65, 0.9, 0.35, 8]} />
        </mesh>

        {/* Cybertronian Carved Rune Bands */}
        {[-0.2, 0.1, 0.4].map((y, i) => (
          <mesh key={i} position={[0, 0.45 + y, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
            <torusGeometry args={[0.92 + y * 0.15, 0.015, 6, 8]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={2.2}
            />
          </mesh>
        ))}

        {/* Central Impact Crater Fissure Opening */}
        <mesh position={[0, 1.13, 0]}>
          <ringGeometry args={[0.02, 0.25, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={4.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ==================== EMBEDDED ENERGON BROADSWORD ==================== */}
      <group ref={swordRef} position={[0, 1.1, 0]} rotation={[0.05, 0.1, -0.05]}>
        {/* Blade Section Emerging From the Stone */}
        <mesh material={materials.swordSpine} position={[0, 0.7, 0]}>
          <boxGeometry args={[0.13, 1.4, 0.055]} />
        </mesh>

        {/* Center Glowing Rune Fuller */}
        <mesh position={[0, 0.7, 0.032]}>
          <boxGeometry args={[0.035, 1.3, 0.01]} />
          <meshStandardMaterial
            ref={fissureMatRef}
            color="#00ffff"
            emissive="#00e5ff"
            emissiveIntensity={3.5}
          />
        </mesh>
        <mesh position={[0, 0.7, -0.032]}>
          <boxGeometry args={[0.035, 1.3, 0.01]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00e5ff"
            emissiveIntensity={3.5}
          />
        </mesh>

        {/* Dual Plasma Glowing Edges */}
        <mesh position={[-0.09, 0.7, 0]}>
          <boxGeometry args={[0.05, 1.35, 0.02]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00ffff"
            emissiveIntensity={3.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0.09, 0.7, 0]}>
          <boxGeometry args={[0.05, 1.35, 0.02]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00ffff"
            emissiveIntensity={3.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Autobot Red Crossguard */}
        <group position={[0, 1.45, 0]}>
          <mesh material={materials.swordRed}>
            <boxGeometry args={[0.26, 0.12, 0.12]} />
          </mesh>
          <mesh material={materials.swordChrome} position={[-0.22, 0.02, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.24, 0.07, 0.08]} />
          </mesh>
          <mesh material={materials.swordChrome} position={[0.22, 0.02, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.24, 0.07, 0.08]} />
          </mesh>
        </group>

        {/* Hilt and Pommel */}
        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.04, 0.045, 0.68, 16]} />
          <meshStandardMaterial color="#0c0d10" metalness={0.6} roughness={0.7} />
        </mesh>
        {/* Pommel Gem */}
        <mesh position={[0, 2.25, 0]}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3.5} />
        </mesh>
      </group>

      {/* ==================== SPIDERWEBBING GROUND FISSURES ==================== */}
      <group position={[0, 0.02, 0]}>
        {fissureBranches.map((b, i) => (
          <mesh
            key={i}
            position={[b.posX, 0, b.posZ]}
            rotation={[-Math.PI / 2, 0, b.angle]}
          >
            <planeGeometry args={[b.length, 0.04]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={3.0}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== KINETIC SHOCKWAVE RING ==================== */}
      <mesh
        ref={shockwaveRingRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.8, 0.95, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ==================== FLOATING ROCK DEBRIS SHARDS ==================== */}
      <group>
        {debris.map((shard, idx) => (
          <mesh
            key={idx}
            position={[shard.x, shard.y, shard.z]}
            rotation={shard.rot}
          >
            <dodecahedronGeometry args={[shard.scale, 0]} />
            <meshStandardMaterial
              color="#1a1e27"
              metalness={0.3}
              roughness={0.8}
              emissive="#00ffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
