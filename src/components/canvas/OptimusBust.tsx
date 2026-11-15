"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";

interface OptimusBustProps {
  maskProgress: number; // 0.0 = open/retracted, 1.0 = sealed/combat
  mousePosition: { x: number; y: number };
}

export default function OptimusBust({ maskProgress, mousePosition }: OptimusBustProps) {
  // References for animating nodes without triggering React re-renders
  const headGroupRef = useRef<THREE.Group>(null);
  const neckGroupRef = useRef<THREE.Group>(null);
  const battleMaskRef = useRef<THREE.Group>(null);
  const leftCheekRef = useRef<THREE.Group>(null);
  const rightCheekRef = useRef<THREE.Group>(null);
  const leftOpticRef = useRef<THREE.MeshStandardMaterial>(null);
  const rightOpticRef = useRef<THREE.MeshStandardMaterial>(null);
  const matrixCoreRef = useRef<THREE.MeshStandardMaterial>(null);

  // Audio trigger tracking ref to prevent multiple triggers in same state
  const lastMaskState = useRef<number>(0);

  // Sound triggering on mask threshold
  useEffect(() => {
    if (maskProgress > 0.6 && lastMaskState.current <= 0.6) {
      cyberAudio.playHydraulicSound();
    } else if (maskProgress < 0.3 && lastMaskState.current >= 0.3) {
      cyberAudio.playHydraulicSound();
    }
    lastMaskState.current = maskProgress;
  }, [maskProgress]);

  // Studio-grade Cybertronian Material Finishes with Crisp Specular Glints
  const materials = useMemo(() => {
    return {
      // Optimus Chassis Crimson: Automotive metallic gloss red (#B11226) with rich clearcoat
      crimson: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#B11226"),
        metalness: 0.88,
        roughness: 0.24,
        clearcoat: 0.75,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.8,
      }),
      // Anodized Cobalt Blue (#003399) with sharp specular highlights
      cobalt: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#003399"),
        metalness: 0.90,
        roughness: 0.24,
        envMapIntensity: 1.6,
      }),
      // Polished Gunmetal Steel (#16181b)
      gunmetal: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#16181b"),
        metalness: 0.92,
        roughness: 0.28,
      }),
      // High-Gloss Chrome (#e8edf2) for pistons and chamfers
      chrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#e8edf2"),
        metalness: 0.98,
        roughness: 0.12,
      }),
      // Translucent Cab Glass with Matrix glow
      windshield: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#002244"),
        transmission: 0.65,
        opacity: 0.85,
        transparent: true,
        roughness: 0.15,
        ior: 1.5,
      }),
    };
  }, []);

  // Frame tick: smooth mouse inertia tracking and battle mask kinematics
  useFrame((state, delta) => {
    const head = headGroupRef.current;
    if (head) {
      // Subtle mouse tracking with inertia damping
      const targetRotY = mousePosition.x * 0.45;
      const targetRotX = -mousePosition.y * 0.3;
      const targetRollZ = -mousePosition.x * 0.1;

      head.rotation.y = THREE.MathUtils.damp(head.rotation.y, targetRotY, 4, delta);
      head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetRotX, 4, delta);
      head.rotation.z = THREE.MathUtils.damp(head.rotation.z, targetRollZ, 4, delta);

      // Subtle breathing / idle hydraulic sway
      const idle = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      head.position.y = idle;
    }

    // Battle Mask Deployment Kinematics (0 = open, 1 = sealed)
    const mask = battleMaskRef.current;
    if (mask) {
      // When retracted (0): Y = -0.32, rotX = -0.35
      // When sealed (1): Y = 0.0, rotX = 0.0
      const targetMaskY = THREE.MathUtils.lerp(-0.32, 0.0, maskProgress);
      const targetMaskZ = THREE.MathUtils.lerp(-0.06, 0.0, maskProgress);
      const targetMaskRotX = THREE.MathUtils.lerp(-0.35, 0.0, maskProgress);

      mask.position.y = THREE.MathUtils.damp(mask.position.y, targetMaskY, 10, delta);
      mask.position.z = THREE.MathUtils.damp(mask.position.z, targetMaskZ, 10, delta);
      mask.rotation.x = THREE.MathUtils.damp(mask.rotation.x, targetMaskRotX, 10, delta);
    }

    // Cheek Armor sliding tracks
    const leftCheek = leftCheekRef.current;
    const rightCheek = rightCheekRef.current;
    if (leftCheek && rightCheek) {
      const cheekSlideZ = THREE.MathUtils.lerp(-0.08, 0.04, maskProgress);
      const cheekSlideX = THREE.MathUtils.lerp(0.04, 0.0, maskProgress);

      leftCheek.position.z = THREE.MathUtils.damp(leftCheek.position.z, cheekSlideZ, 8, delta);
      leftCheek.position.x = THREE.MathUtils.damp(leftCheek.position.x, -0.48 - cheekSlideX, 8, delta);

      rightCheek.position.z = THREE.MathUtils.damp(rightCheek.position.z, cheekSlideZ, 8, delta);
      rightCheek.position.x = THREE.MathUtils.damp(rightCheek.position.x, 0.48 + cheekSlideX, 8, delta);
    }

    // Optic Eye flare intensity modulation
    const baseOpticIntensity = THREE.MathUtils.lerp(1.8, 5.2, maskProgress);
    const opticPulse = Math.sin(state.clock.elapsedTime * 4.0) * 0.4;
    const finalIntensity = baseOpticIntensity + opticPulse;

    if (leftOpticRef.current) {
      leftOpticRef.current.emissiveIntensity = finalIntensity;
    }
    if (rightOpticRef.current) {
      rightOpticRef.current.emissiveIntensity = finalIntensity;
    }
    if (matrixCoreRef.current) {
      matrixCoreRef.current.emissiveIntensity = 2.5 + Math.sin(state.clock.elapsedTime * 2.0) * 0.8;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* ==================== HEAD RIG (ROTATABLE BY MOUSE) ==================== */}
      <group ref={headGroupRef}>
        {/* Central Crown & Mohawk Crest */}
        <group position={[0, 0.65, 0]}>
          {/* Main Crest Fin */}
          <mesh material={materials.cobalt} position={[0, 0.12, 0.05]}>
            <boxGeometry args={[0.16, 0.34, 0.82]} />
          </mesh>
          {/* Cyan Luminous Ridge along crest */}
          <mesh position={[0, 0.3, 0.05]}>
            <boxGeometry args={[0.04, 0.04, 0.78]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={3.0}
            />
          </mesh>
          {/* Angled Crest Bevel Cap */}
          <mesh material={materials.chrome} position={[0, 0.24, -0.32]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.18, 0.16, 0.2]} />
          </mesh>
        </group>

        {/* Main Helmet Cranium (Cobalt Blue & Gunmetal Chamfers) */}
        <mesh material={materials.cobalt} position={[0, 0.45, -0.05]}>
          <boxGeometry args={[0.88, 0.52, 0.78]} />
        </mesh>
        <mesh material={materials.gunmetal} position={[0, 0.48, -0.42]}>
          <boxGeometry args={[0.76, 0.42, 0.12]} />
        </mesh>

        {/* Dual Ear Antennae / Comms Pylons */}
        {/* Left Pylon */}
        <group position={[-0.52, 0.5, -0.02]}>
          {/* Stepped Base Joint */}
          <mesh material={materials.chrome} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
          </mesh>
          {/* Vertical Pylon Blade */}
          <mesh material={materials.cobalt} position={[0, 0.42, 0]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[0.08, 0.75, 0.18]} />
          </mesh>
          {/* Glowing Beacon Tip */}
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Right Pylon */}
        <group position={[0.52, 0.5, -0.02]}>
          <mesh material={materials.chrome} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.18, 16]} />
          </mesh>
          <mesh material={materials.cobalt} position={[0, 0.42, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.08, 0.75, 0.18]} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3.5} />
          </mesh>
        </group>

        {/* Forehead Brow Guard (Heavy Cobalt Blue V-Shape) */}
        <group position={[0, 0.32, 0.38]}>
          {/* Left Brow Wedge */}
          <mesh material={materials.cobalt} position={[-0.2, 0.02, 0]} rotation={[0, 0.18, -0.12]}>
            <boxGeometry args={[0.38, 0.14, 0.18]} />
          </mesh>
          {/* Right Brow Wedge */}
          <mesh material={materials.cobalt} position={[0.2, 0.02, 0]} rotation={[0, -0.18, 0.12]}>
            <boxGeometry args={[0.38, 0.14, 0.18]} />
          </mesh>
          {/* Center Autobot Forehead Crest Keystone */}
          <mesh material={materials.chrome} position={[0, 0.06, 0.04]}>
            <boxGeometry args={[0.12, 0.18, 0.14]} />
          </mesh>
        </group>

        {/* ==================== DUAL OPTIC EYES (MATRIX CYAN) ==================== */}
        <group position={[0, 0.22, 0.42]}>
          {/* Left Eye */}
          <mesh position={[-0.18, 0, 0]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.15, 0.075, 0.08]} />
            <meshStandardMaterial
              ref={leftOpticRef}
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>
          {/* Right Eye */}
          <mesh position={[0.18, 0, 0]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.15, 0.075, 0.08]} />
            <meshStandardMaterial
              ref={rightOpticRef}
              color="#00ffff"
              emissive="#00e5ff"
              emissiveIntensity={2.0}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* ==================== INNER MOUTH ASSEMBLY (EXPOSED WHEN RETRACTED) ==================== */}
        <group position={[0, 0.02, 0.36]}>
          {/* Inner Acoustic Speaker Grille */}
          <mesh material={materials.gunmetal} position={[0, 0, 0]}>
            <boxGeometry args={[0.36, 0.22, 0.12]} />
          </mesh>
          {/* Horizontal Speaker Slits */}
          {[-0.06, -0.02, 0.02, 0.06].map((y, i) => (
            <mesh key={i} material={materials.chrome} position={[0, y, 0.065]}>
              <boxGeometry args={[0.28, 0.015, 0.02]} />
            </mesh>
          ))}
          {/* Left Hydraulic Mouth Piston */}
          <group position={[-0.18, -0.04, 0.05]} rotation={[0, 0, -0.2]}>
            <mesh material={materials.chrome}>
              <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
            </mesh>
            <mesh material={materials.gunmetal} position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
            </mesh>
          </group>
          {/* Right Hydraulic Mouth Piston */}
          <group position={[0.18, -0.04, 0.05]} rotation={[0, 0, 0.2]}>
            <mesh material={materials.chrome}>
              <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
            </mesh>
            <mesh material={materials.gunmetal} position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
            </mesh>
          </group>
          {/* Mechanical Chin Base Pivot */}
          <mesh material={materials.gunmetal} position={[0, -0.16, 0.02]}>
            <boxGeometry args={[0.22, 0.1, 0.14]} />
          </mesh>
        </group>

        {/* ==================== CHEEK ARMOR PLATES (SLIDING TRACKS) ==================== */}
        {/* Left Cheek */}
        <group ref={leftCheekRef} position={[-0.48, 0.06, 0.22]} rotation={[0, 0.3, -0.08]}>
          <mesh material={materials.cobalt}>
            <boxGeometry args={[0.18, 0.44, 0.34]} />
          </mesh>
          {/* Crimson Bevel Inset */}
          <mesh material={materials.crimson} position={[0.02, 0, 0.16]} rotation={[0, -0.2, 0]}>
            <boxGeometry args={[0.04, 0.36, 0.12]} />
          </mesh>
        </group>

        {/* Right Cheek */}
        <group ref={rightCheekRef} position={[0.48, 0.06, 0.22]} rotation={[0, -0.3, 0.08]}>
          <mesh material={materials.cobalt}>
            <boxGeometry args={[0.18, 0.44, 0.34]} />
          </mesh>
          <mesh material={materials.crimson} position={[-0.02, 0, 0.16]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.36, 0.12]} />
          </mesh>
        </group>

        {/* ==================== RETRACTABLE BATTLE MASK (ACT I HERO DEPLOYMENT) ==================== */}
        <group ref={battleMaskRef} position={[0, 0, 0.42]}>
          {/* Main Angular Faceplate V-Shield */}
          <group position={[0, 0.03, 0.06]}>
            {/* Center Vertical Keel */}
            <mesh material={materials.cobalt} position={[0, 0, 0.03]}>
              <boxGeometry args={[0.06, 0.28, 0.08]} />
            </mesh>
            {/* Left Angled Flange */}
            <mesh material={materials.cobalt} position={[-0.14, 0, 0]} rotation={[0, 0.42, 0]}>
              <boxGeometry args={[0.24, 0.28, 0.06]} />
            </mesh>
            {/* Right Angled Flange */}
            <mesh material={materials.cobalt} position={[0.14, 0, 0]} rotation={[0, -0.42, 0]}>
              <boxGeometry args={[0.24, 0.28, 0.06]} />
            </mesh>
            {/* Ventilation Slits */}
            {[-0.06, 0, 0.06].map((y, i) => (
              <mesh key={i} material={materials.gunmetal} position={[0, y, 0.065]}>
                <boxGeometry args={[0.18, 0.015, 0.03]} />
              </mesh>
            ))}
            {/* Lower Chin Clamp */}
            <mesh material={materials.chrome} position={[0, -0.16, 0.02]}>
              <boxGeometry args={[0.24, 0.08, 0.1]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== ARTICULATED NECK & TORSO CHASSIS ==================== */}
      <group ref={neckGroupRef} position={[0, -0.42, 0]}>
        {/* Heavy Neck Vertebrae */}
        <mesh material={materials.gunmetal} position={[0, 0.12, -0.05]}>
          <cylinderGeometry args={[0.26, 0.32, 0.28, 16]} />
        </mesh>
        {/* Dual Neck Heavy Pistons */}
        <mesh material={materials.chrome} position={[-0.24, 0.12, 0.08]} rotation={[0.2, 0, -0.15]}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
        </mesh>
        <mesh material={materials.chrome} position={[0.24, 0.12, 0.08]} rotation={[0.2, 0, 0.15]}>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
        </mesh>

        {/* Torso Collar / Upper Chassis */}
        <group position={[0, -0.22, 0]}>
          {/* Main Autobot Red Chassis Chest */}
          <mesh material={materials.crimson} position={[0, -0.25, 0]}>
            <boxGeometry args={[1.72, 0.65, 0.85]} />
          </mesh>

          {/* Dual Iconic Cab Windows (Windshields) */}
          <group position={[0, -0.15, 0.44]}>
            {/* Left Window */}
            <mesh material={materials.windshield} position={[-0.42, 0, 0]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.62, 0.38, 0.05]} />
            </mesh>
            {/* Chrome Frame Left */}
            <mesh material={materials.chrome} position={[-0.42, 0, 0.01]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.66, 0.42, 0.03]} />
            </mesh>

            {/* Right Window */}
            <mesh material={materials.windshield} position={[0.42, 0, 0]} rotation={[0, -0.15, 0]}>
              <boxGeometry args={[0.62, 0.38, 0.05]} />
            </mesh>
            {/* Chrome Frame Right */}
            <mesh material={materials.chrome} position={[0.42, 0, 0.01]} rotation={[0, -0.15, 0]}>
              <boxGeometry args={[0.66, 0.42, 0.03]} />
            </mesh>

            {/* Internal Matrix of Leadership Core visible through windows */}
            <mesh position={[0, -0.05, -0.18]}>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial
                ref={matrixCoreRef}
                color="#00ffff"
                emissive="#00e5ff"
                emissiveIntensity={2.5}
                roughness={0.1}
              />
            </mesh>
          </group>

          {/* Heavy Shoulder Pauldron Mounts */}
          <mesh material={materials.crimson} position={[-0.98, -0.12, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.38, 0.52, 0.72]} />
          </mesh>
          <mesh material={materials.crimson} position={[0.98, -0.12, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.38, 0.52, 0.72]} />
          </mesh>
          {/* Gunmetal Shoulder Joints */}
          <mesh material={materials.gunmetal} position={[-1.02, -0.12, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.34, 16]} />
          </mesh>
          <mesh material={materials.gunmetal} position={[1.02, -0.12, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.34, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
