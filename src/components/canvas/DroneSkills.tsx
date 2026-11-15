"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { cyberAudio } from "@/utils/audio";
import { SkillDomain } from "@/types";
import { SKILL_DOMAINS } from "@/data/skills";

export { SKILL_DOMAINS };

interface DroneSkillsProps {
  cleaveProgress: number; // 0.0 -> 1.0 (from ScrollTrigger scrub in Act III)
  active: boolean;
  onSelectDomain?: (domain: SkillDomain) => void;
}

interface SingleDroneProps {
  domain: SkillDomain;
  index: number;
  total: number;
  cleaveThreshold: number;
  cleaveProgress: number;
  onSelect: (domain: SkillDomain) => void;
}

function SingleDrone({
  domain,
  index,
  total,
  cleaveThreshold,
  cleaveProgress,
  onSelect,
}: SingleDroneProps) {
  const droneGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const sparksRef = useRef<THREE.Points>(null);

  // Manual cleave override state
  const [manualCleave, setManualCleave] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Stage 2/3: Has blade cleaved through this drone?
  const isCleaved = cleaveProgress >= cleaveThreshold || manualCleave;

  // Stage 4: Have sparks and flying debris settled so the hologram badge materializes?
  const isBadgeVisible = cleaveProgress >= cleaveThreshold + 0.12 || manualCleave;

  // Sound triggering when newly cleaved
  const prevCleavedRef = useRef(false);
  useEffect(() => {
    if (isCleaved && !prevCleavedRef.current) {
      cyberAudio.playDecapitationCrunch();
    }
    prevCleavedRef.current = isCleaved;
  }, [isCleaved]);

  // Compact, centered circular arc positioning guaranteeing all 4 sentinels sit fully on-screen
  const arcRadius = 3.1;
  const angleStep = 0.35;
  const startAngle = -((total - 1) * angleStep) / 2;
  const angle = startAngle + index * angleStep;

  const posX = Math.sin(angle) * arcRadius;
  const posZ = Math.cos(angle) * 1.5 - 1.6;
  const posY = -0.3 + (index % 2 === 0 ? 0.08 : -0.04);

  // Generate deterministic shards for fractured head debris
  const shards = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      offset: [
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.35,
      ] as [number, number, number],
      vel: [
        (Math.random() - 0.5) * 2.5,
        1.2 + Math.random() * 2.2,
        (Math.random() - 0.5) * 2.5,
      ],
      rotVel: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
      scale: 0.07 + Math.random() * 0.08,
    }));
  }, []);

  // Blue / Cyan spark particles generated upon blade strike
  const sparkParticles = useMemo(() => {
    const count = 24;
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      velocities.push({
        x: (Math.random() - 0.5) * 2.0,
        y: 1.0 + Math.random() * 2.5,
        z: (Math.random() - 0.5) * 2.0,
      });
    }
    return { positions, velocities, count };
  }, []);

  useFrame((state, delta) => {
    const drone = droneGroupRef.current;
    if (drone) {
      // Gentle anti-gravity hovering
      const hoverFloat = Math.sin(state.clock.elapsedTime * 2.0 + index * 1.5) * 0.05;
      drone.position.y = posY + hoverFloat;

      // Look toward center / viewer
      drone.lookAt(0, 0, 0);
    }

    const head = headRef.current;
    if (head) {
      if (isCleaved) {
        // Stage 3: Head severed kinematics: launched backwards & tumbling with velocity
        const targetHeadY = 0.95;
        const targetHeadZ = -1.1;
        const targetHeadRotX = -1.6;
        const targetHeadRotZ = 1.0;

        head.position.y = THREE.MathUtils.damp(head.position.y, targetHeadY, 5, delta);
        head.position.z = THREE.MathUtils.damp(head.position.z, targetHeadZ, 5, delta);
        head.rotation.x = THREE.MathUtils.damp(head.rotation.x, targetHeadRotX, 5, delta);
        head.rotation.z = THREE.MathUtils.damp(head.rotation.z, targetHeadRotZ, 5, delta);
      } else {
        head.position.set(0, 0.42, 0);
        head.rotation.set(0, 0, 0);
      }
    }

    // Energon Core pulse inside the severed neck
    if (coreRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 6.0) * 0.8 + 2.8;
      coreRef.current.emissiveIntensity = isCleaved ? pulse * 1.8 : 0.6;
    }

    // Menacing Decepticon sensor eye flicker (Stage 1 pulsing red optics)
    if (eyeMaterialRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 4.0 + index) * 0.5 + 1.5;
      eyeMaterialRef.current.emissiveIntensity = isCleaved ? 0.2 : flicker * 2.5;
    }

    // Sparks simulation
    if (sparksRef.current && isCleaved) {
      const posAttr = sparksRef.current.geometry.attributes.position;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < sparkParticles.count; i++) {
        array[i * 3] += sparkParticles.velocities[i].x * delta * 0.5;
        array[i * 3 + 1] += sparkParticles.velocities[i].y * delta * 0.5;
        array[i * 3 + 2] += sparkParticles.velocities[i].z * delta * 0.5;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group
      ref={droneGroupRef}
      position={[posX, posY, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        setManualCleave((prev) => !prev);
        cyberAudio.playCommandConfirm();
        onSelect(domain);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        cyberAudio.playHoverBlip();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* ==================== DRONE TORSO & PROPULSION ==================== */}
      <group position={[0, 0, 0]}>
        {/* Dark Titanium Stealth Armor Torso */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.45, 0.35]} />
          <meshStandardMaterial
            color="#14171c"
            metalness={0.92}
            roughness={0.25}
          />
        </mesh>
        {/* Chest Plate with Warning Markings */}
        <mesh position={[0, 0.05, 0.18]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.38, 0.22, 0.08]} />
          <meshStandardMaterial
            color="#0d0e12"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Vent Grill Inset */}
        <mesh position={[0, -0.06, 0.19]}>
          <boxGeometry args={[0.26, 0.04, 0.02]} />
          <meshStandardMaterial color="#330066" emissive="#7928ca" emissiveIntensity={1.2} />
        </mesh>

        {/* Dual Anti-Gravity Repulsor Thrusters */}
        <mesh position={[-0.24, -0.28, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
          <meshStandardMaterial color="#1e2229" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0.24, -0.28, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
          <meshStandardMaterial color="#1e2229" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Thruster Jet Plasma Glow */}
        <mesh position={[-0.24, -0.4, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#9333ea" />
        </mesh>
        <mesh position={[0.24, -0.4, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#9333ea" />
        </mesh>
      </group>

      {/* ==================== EXPOSED RADIANT ENERGON CORE (IN SEVERED NECK) ==================== */}
      <group position={[0, 0.26, 0]}>
        {/* Glowing Crystalline Core */}
        <mesh>
          <octahedronGeometry args={[0.16, 1]} />
          <meshStandardMaterial
            ref={coreRef}
            color={domain.primaryColor}
            emissive={domain.primaryColor}
            emissiveIntensity={1.0}
            roughness={0.1}
          />
        </mesh>
        {/* Orbital Containment Ring */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.22, 0.015, 8, 24]} />
          <meshStandardMaterial color="#e8edf2" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>

      {/* ==================== SEVERED DRONE HEAD ==================== */}
      <group ref={headRef} position={[0, 0.42, 0]}>
        {/* Angled Decepticon Insectoid Helmet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.26, 0.32]} />
          <meshStandardMaterial color="#1a1d24" metalness={0.92} roughness={0.22} />
        </mesh>
        {/* Menacing Angular Visor Cheek Horns */}
        <mesh position={[-0.22, 0.06, 0.04]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.08, 0.24, 0.12]} />
          <meshStandardMaterial color="#121316" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.22, 0.06, 0.04]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.08, 0.24, 0.12]} />
          <meshStandardMaterial color="#121316" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Menacing Single Sensor Eye / Optic (Stage 1 pulsing Decepticon red) */}
        <mesh position={[0, 0.02, 0.17]}>
          <boxGeometry args={[0.22, 0.06, 0.02]} />
          <meshStandardMaterial
            ref={eyeMaterialRef}
            color="#ff0044"
            emissive="#ff0033"
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* Stage 3: Voronoi / Fracture Shards when severed */}
        {isCleaved && (
          <group position={[0, -0.15, 0]}>
            {shards.map((shard, sIdx) => (
              <mesh
                key={sIdx}
                position={shard.offset}
                rotation={[shard.rotVel[0], shard.rotVel[1], shard.rotVel[2]]}
              >
                <tetrahedronGeometry args={[shard.scale, 0]} />
                <meshStandardMaterial
                  color="#262930"
                  metalness={0.95}
                  roughness={0.2}
                  emissive={domain.primaryColor}
                  emissiveIntensity={1.2}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* Stage 3: Blue / Cyan spark particles upon impact */}
      {isCleaved && (
        <points ref={sparksRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkParticles.positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            color="#00ffff"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* ==================== STAGE 4: HOLOGRAPHIC SKILL TELEMETRY BADGE ==================== */}
      {/* Renders at opacity: 0 and scale: 0.8, transitioning to opacity: 1 after shatter */}
      {isCleaved && (
        <Html
          position={[0, 0.58, 0]}
          center
          style={{
            pointerEvents: isBadgeVisible ? "auto" : "none",
            opacity: isBadgeVisible ? 1 : 0,
            transform: `scale(${isBadgeVisible ? (hovered ? 1.05 : 1.0) : 0.85})`,
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: hovered ? 50 : 10 + index,
          }}
        >
          <div
            onMouseEnter={() => {
              setHovered(true);
              cyberAudio.playHoverBlip();
            }}
            onMouseLeave={() => setHovered(false)}
            onClick={() => {
              onSelect(domain);
              cyberAudio.playCommandConfirm();
            }}
            className="w-[200px] sm:w-[215px] xl:w-[230px] p-2.5 sm:p-3 rounded-xl backdrop-blur-2xl bg-black/92 border text-left shadow-[0_0_25px_rgba(0,0,0,0.8)] cursor-pointer select-none transition-all duration-200"
            style={{
              borderColor: hovered ? domain.primaryColor : `${domain.primaryColor}55`,
              boxShadow: hovered
                ? `0 0 30px ${domain.primaryColor}60`
                : `0 0 15px ${domain.primaryColor}25`,
            }}
          >
            {/* Header / Callsign */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
              <span className="text-[9px] font-mono tracking-wider text-cyan-400 font-bold uppercase truncate max-w-[120px]">
                {domain.droneName.split(":")[0]}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                CORE REVEALED
              </span>
            </div>

            {/* Title */}
            <h4 className="text-xs font-black text-white tracking-wide truncate mb-0.5">
              {domain.domain}
            </h4>
            <p className="text-[8.5px] text-gray-400 font-mono mb-2 truncate">
              {domain.droneName}
            </p>

            {/* Skills Badges / Spec List */}
            <div className="space-y-1.5 mb-2.5">
              {domain.skills.map((skill, sIdx) => (
                <div key={sIdx} className="px-1.5 py-1 rounded bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-0.5">
                    <span className="text-white font-bold truncate max-w-[105px]">{skill.name}</span>
                    <span className="text-cyan-300 text-[8px] font-semibold px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 whitespace-nowrap ml-1">
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${90 + (sIdx % 3) * 4}%`,
                        backgroundColor: domain.primaryColor,
                        boxShadow: `0 0 6px ${domain.primaryColor}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live Telemetry Footer */}
            {domain.telemetry && (
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/10 text-[8px] font-mono text-center text-gray-400">
                <div>
                  <span className="block text-gray-500 text-[7px]">CORES</span>
                  <span className="text-white font-semibold">{domain.telemetry.coresOnline}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-[7px]">CLOCK</span>
                  <span className="text-cyan-300 font-semibold">{domain.telemetry.clockSpeed}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-[7px]">EFF</span>
                  <span className="text-emerald-400 font-semibold">{domain.telemetry.efficiency}</span>
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function DroneSkills({ cleaveProgress, active, onSelectDomain }: DroneSkillsProps) {
  if (!active && cleaveProgress <= 0.05) return null;

  return (
    <group position={[0, -0.4, 0]}>
      {SKILL_DOMAINS.map((domain, index) => {
        // Drone cleave thresholds distributed across 0.20 to 0.75
        const threshold = 0.22 + (index / (SKILL_DOMAINS.length - 1)) * 0.52;
        return (
          <SingleDrone
            key={domain.droneName}
            domain={domain}
            index={index}
            total={SKILL_DOMAINS.length}
            cleaveThreshold={threshold}
            cleaveProgress={cleaveProgress}
            onSelect={(d) => {
              if (onSelectDomain) onSelectDomain(d);
            }}
          />
        );
      })}
    </group>
  );
}
