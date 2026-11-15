"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";
import { Project } from "@/types";
import { FEATURED_PROJECTS } from "@/data/projects";

export { FEATURED_PROJECTS };

interface ArmoryCoresProps {
  selectedIndex: number;
  onSelectProject: (index: number) => void;
  active: boolean;
}

interface CoreRelicProps {
  project: Project;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
}

function CoreRelic({ project, index, total, isSelected, onSelect }: CoreRelicProps) {
  const relicRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);

  // Position relics in an elegant horizontal Cybertronian hangar array
  const spacing = 2.4;
  const startX = -((total - 1) * spacing) / 2;
  const posX = startX + index * spacing;

  useFrame((state, delta) => {
    const relic = relicRef.current;
    if (relic) {
      // Hovering or selecting raises the relic and increases rotation
      const targetY = isSelected ? 0.35 : hovered ? 0.15 : 0.0;
      relic.position.y = THREE.MathUtils.damp(relic.position.y, targetY, 6, delta);

      // Subtle vertical floating sine wave
      const float = Math.sin(state.clock.elapsedTime * 2.0 + index) * 0.04;
      relic.position.y += float * delta;
    }

    const speedMultiplier = isSelected ? 3.5 : hovered ? 2.0 : 1.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += 0.8 * delta * speedMultiplier;
      outerRingRef.current.rotation.y += 0.5 * delta * speedMultiplier;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= 1.1 * delta * speedMultiplier;
      innerRingRef.current.rotation.z += 0.7 * delta * speedMultiplier;
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += 1.4 * delta * speedMultiplier;
      coreMeshRef.current.rotation.x -= 0.6 * delta * speedMultiplier;
    }

    if (coreMatRef.current) {
      const baseEmissive = isSelected ? 3.8 : hovered ? 2.5 : 1.4;
      const pulse = Math.sin(state.clock.elapsedTime * 4.0) * 0.5;
      coreMatRef.current.emissiveIntensity = baseEmissive + pulse;
    }
  });

  return (
    <group
      ref={relicRef}
      position={[posX, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        cyberAudio.playCommandConfirm();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        cyberAudio.playHoverBlip();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* ==================== AUTOBOT TITANIUM GIMBAL RINGS ==================== */}
      {/* Outer Gimbal Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[0.78, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#22272e"
          metalness={0.95}
          roughness={0.15}
          wireframe={hovered || isSelected}
        />
      </mesh>

      {/* Inner Gimbal Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.58, 0.024, 16, 48]} />
        <meshStandardMaterial
          color="#38404a"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* ==================== MULTI-FACETED ENERGON CRYSTAL CORE ==================== */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color={project.coreColor}
          emissive={project.coreColor}
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Crystalline Wireframe Cage Overlay */}
      <mesh>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial
          color={project.coreColor}
          wireframe
          transparent
          opacity={isSelected ? 0.8 : hovered ? 0.5 : 0.25}
        />
      </mesh>

      {/* Ground Projection Ring Base */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial
          color={project.coreColor}
          transparent
          opacity={isSelected ? 0.7 : hovered ? 0.4 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ArmoryCores({
  selectedIndex,
  onSelectProject,
  active,
}: ArmoryCoresProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (group && active) {
      // Focus camera view towards selected relic
      const spacing = 2.4;
      const targetCenterOffset = -selectedIndex * spacing + ((FEATURED_PROJECTS.length - 1) * spacing) / 2;
      group.position.x = THREE.MathUtils.damp(group.position.x, targetCenterOffset * 0.45, 4, delta);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[0, -0.2, 0.5]}>
      {FEATURED_PROJECTS.map((proj, idx) => (
        <CoreRelic
          key={proj.id}
          project={proj}
          index={idx}
          total={FEATURED_PROJECTS.length}
          isSelected={idx === selectedIndex}
          onSelect={() => onSelectProject(idx)}
        />
      ))}
    </group>
  );
}
