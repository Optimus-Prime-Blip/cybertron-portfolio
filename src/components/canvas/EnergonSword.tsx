"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";

interface EnergonSwordProps {
  swingProgress: number; // 0.0 = resting, 0.1 -> 1.0 = executing cleave arc
  active: boolean;
  onCleaveImpact?: (index: number) => void;
}

export default function EnergonSword({ swingProgress, active }: EnergonSwordProps) {
  const swordGroupRef = useRef<THREE.Group>(null);
  const plasmaEdgeRef = useRef<THREE.MeshStandardMaterial>(null);
  const plasmaCoreRef = useRef<THREE.MeshStandardMaterial>(null);
  const trailMeshRef = useRef<THREE.Mesh>(null);

  const prevSwing = useRef<number>(0);

  // Cybertronian materials
  const materials = useMemo(() => {
    return {
      bladeSpine: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1e2329"),
        metalness: 0.95,
        roughness: 0.18,
      }),
      chromeHilt: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#dbe2e8"),
        metalness: 0.98,
        roughness: 0.12,
      }),
      autobotCrimson: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#B11226"),
        metalness: 0.88,
        roughness: 0.2,
      }),
      gripWrap: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0c0d10"),
        metalness: 0.4,
        roughness: 0.8,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    const sword = swordGroupRef.current;
    if (!sword) return;

    // Trigger audio slash when swing initiates
    if (swingProgress > 0.15 && prevSwing.current <= 0.15 && active) {
      cyberAudio.playSwordSlash();
    }
    prevSwing.current = swingProgress;

    // Energon plasma edge pulsating luminescence
    const plasmaPulse = Math.sin(state.clock.elapsedTime * 8.0) * 0.5 + 2.5;
    if (plasmaEdgeRef.current) {
      plasmaEdgeRef.current.emissiveIntensity = active ? plasmaPulse * 1.5 : 1.2;
    }
    if (plasmaCoreRef.current) {
      plasmaCoreRef.current.emissiveIntensity = active ? plasmaPulse * 1.8 : 1.5;
    }

    if (active) {
      // Kinematic swing arc across the Decepticon drones
      // Swing arc sweeps from right-back to front-left in a dynamic slashing spiral
      const angle = swingProgress * Math.PI * 1.3 - 0.6;
      const radius = 2.4;

      const targetX = Math.sin(angle) * radius;
      const targetZ = Math.cos(angle) * (radius * 0.8) - 0.5;
      const targetY = -0.2 - Math.sin(swingProgress * Math.PI) * 0.6;

      sword.position.x = THREE.MathUtils.damp(sword.position.x, targetX, 14, delta);
      sword.position.y = THREE.MathUtils.damp(sword.position.y, targetY, 14, delta);
      sword.position.z = THREE.MathUtils.damp(sword.position.z, targetZ, 14, delta);

      // Sword orientation following the cutting tangent
      sword.rotation.z = THREE.MathUtils.damp(sword.rotation.z, -angle - 0.4, 14, delta);
      sword.rotation.x = THREE.MathUtils.damp(sword.rotation.x, 0.4 + Math.sin(swingProgress * Math.PI) * 0.8, 14, delta);
      sword.rotation.y = THREE.MathUtils.damp(sword.rotation.y, angle * 0.8, 14, delta);

      // Trail opacity
      if (trailMeshRef.current) {
        const mat = trailMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(swingProgress * Math.PI) * 0.65;
      }
    } else {
      // Idle resting position behind Optimus's right shoulder
      sword.position.set(1.1, 0.4, -0.6);
      sword.rotation.set(-0.35, -0.2, -0.45);
      if (trailMeshRef.current) {
        (trailMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  return (
    <group ref={swordGroupRef} position={[1.1, 0.4, -0.6]} rotation={[-0.35, -0.2, -0.45]}>
      {/* ==================== HILT & POMMEL ==================== */}
      {/* Pommel Energon Gem */}
      <mesh position={[0, -1.35, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          ref={plasmaCoreRef}
          color="#00ffff"
          emissive="#00e5ff"
          emissiveIntensity={2.5}
        />
      </mesh>
      {/* Pommel Chrome Cap */}
      <mesh material={materials.chromeHilt} position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.1, 16]} />
      </mesh>

      {/* Two-Handed Cyber Hilt Grip */}
      <mesh material={materials.gripWrap} position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.045, 0.048, 0.7, 16]} />
      </mesh>
      {/* Hilt Rings */}
      {[-1.1, -0.95, -0.8, -0.65].map((y, i) => (
        <mesh key={i} material={materials.chromeHilt} position={[0, y, 0]}>
          <torusGeometry args={[0.052, 0.012, 8, 16]} />
        </mesh>
      ))}

      {/* ==================== AUTOBOT CROSSGUARD ==================== */}
      <group position={[0, -0.45, 0]}>
        {/* Central Crossguard Block */}
        <mesh material={materials.autobotCrimson}>
          <boxGeometry args={[0.26, 0.14, 0.14]} />
        </mesh>
        {/* Left Quillon Wing */}
        <mesh material={materials.bladeSpine} position={[-0.24, 0.04, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.28, 0.08, 0.1]} />
        </mesh>
        {/* Right Quillon Wing */}
        <mesh material={materials.bladeSpine} position={[0.24, 0.04, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.28, 0.08, 0.1]} />
        </mesh>
        {/* Guard Hydraulic Cylinders */}
        <mesh material={materials.chromeHilt} position={[-0.14, -0.06, 0.04]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 12]} />
        </mesh>
        <mesh material={materials.chromeHilt} position={[0.14, -0.06, 0.04]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 12]} />
        </mesh>
      </group>

      {/* ==================== BLADE SPINE & FULLER ==================== */}
      {/* Heavy Steel Blade Spine */}
      <mesh material={materials.bladeSpine} position={[0, 0.65, 0]}>
        <boxGeometry args={[0.14, 2.1, 0.06]} />
      </mesh>

      {/* Center Fuller Glowing Energon Runes Conduit */}
      <mesh position={[0, 0.65, 0.035]}>
        <boxGeometry args={[0.035, 1.9, 0.01]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00e5ff"
          emissiveIntensity={3.2}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.65, -0.035]}>
        <boxGeometry args={[0.035, 1.9, 0.01]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00e5ff"
          emissiveIntensity={3.2}
          roughness={0.1}
        />
      </mesh>

      {/* ==================== DUAL PLASMA CUTTING EDGES ==================== */}
      {/* Left Plasma Cutting Edge */}
      <mesh position={[-0.11, 0.65, 0]}>
        <boxGeometry args={[0.07, 2.05, 0.02]} />
        <meshStandardMaterial
          ref={plasmaEdgeRef}
          color="#00e5ff"
          emissive="#00ffff"
          emissiveIntensity={2.8}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Right Plasma Cutting Edge */}
      <mesh position={[0.11, 0.65, 0]}>
        <boxGeometry args={[0.07, 2.05, 0.02]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00ffff"
          emissiveIntensity={2.8}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Blade Tip Point */}
      <mesh material={materials.bladeSpine} position={[0, 1.82, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.16, 0.16, 0.05]} />
      </mesh>

      {/* ==================== PLASMA SWING TRAIL ARC ==================== */}
      <mesh ref={trailMeshRef} position={[-0.6, 0.65, 0]} rotation={[0, 0, 0.2]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
