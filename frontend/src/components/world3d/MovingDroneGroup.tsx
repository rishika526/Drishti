// DRISHTI: Dynamic 3D Moving Drone Targets with Path Splines & Kinematics
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulatedTargetDef } from '../../types/simulation';

interface MovingDroneGroupProps {
  targets: SimulatedTargetDef[];
  elapsedTimeSec: number;
  isDetected: boolean;
  onDetectTarget?: (targetId: string) => void;
  onLeadDronePosition?: (pos: [number, number, number]) => void;
}

// Single Moving Drone Along Trajectory
const DynamicDroneUnit: React.FC<{
  target: SimulatedTargetDef;
  elapsedTimeSec: number;
  isDetected: boolean;
  isLead: boolean;
  onDetectTarget?: (id: string) => void;
  onPositionUpdate?: (pos: [number, number, number]) => void;
}> = ({ target, elapsedTimeSec, isDetected, isLead, onDetectTarget, onPositionUpdate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const meshRef = useRef<THREE.Group>(null);

  // Build CatmullRom Curve from waypoints
  const { curve, totalDistance } = useMemo(() => {
    const points = target.path.map((wp) => new THREE.Vector3(...wp.pos));
    const c = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
    const len = c.getLength();
    return { curve: c, totalDistance: len };
  }, [target.path]);

  // Average speed
  const avgSpeed = useMemo(() => {
    const totalSpeed = target.path.reduce((acc, wp) => acc + wp.speedMs, 0);
    return totalSpeed / Math.max(1, target.path.length);
  }, [target.path]);

  useFrame(({ clock }) => {
    const activeTime = Math.max(0, elapsedTimeSec - target.spawnDelaySec);
    // Normalized distance along path [0, 1]
    const loopDuration = Math.max(10, totalDistance / Math.max(5, avgSpeed));
    // Smooth ping-pong or continuous loop
    const tNorm = (activeTime % loopDuration) / loopDuration;

    if (groupRef.current && curve) {
      const pos = curve.getPointAt(tNorm);
      const tangent = curve.getTangentAt(tNorm);

      groupRef.current.position.copy(pos);

      // Compute banking and heading based on tangent
      const lookTarget = pos.clone().add(tangent);
      groupRef.current.lookAt(lookTarget);

      // Report lead position to CameraController
      if (isLead && onPositionUpdate) {
        onPositionUpdate([pos.x, pos.y, pos.z]);
      }
    }

    // High speed spinning propellers
    const t = clock.getElapsedTime();
    rotorsRef.current.forEach((r, idx) => {
      if (r) {
        const dir = idx % 2 === 0 ? 1 : -1;
        r.rotation.y += dir * 0.75;
      }
    });

    // Aerodynamic hovering micro-sway
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 3.5 + target.spawnDelaySec) * 0.08;
    }
  });

  const isFixedWing = target.modelType === 'fixed_wing';
  const isMicroBoid = target.modelType === 'micro_boid';

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (onDetectTarget) onDetectTarget(target.id);
      }}
    >
      {/* Visual Airframe Subtree */}
      <group ref={meshRef}>
        
        {isFixedWing ? (
          // 1. Fixed-Wing Long-Range Reconnaissance Model
          <group scale={[1.4, 1.4, 1.4]}>
            {/* Main Fuselage */}
            <mesh castShadow>
              <cylinderGeometry args={[0.22, 0.35, 3.2, 12]} />
              <meshStandardMaterial color={target.visualColor} roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Nose Radome */}
            <mesh position={[0, 0, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.22, 0.6, 16]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            {/* Swept Main Wings */}
            <mesh position={[0, 0.05, 0.2]} castShadow>
              <boxGeometry args={[4.4, 0.06, 0.7]} />
              <meshStandardMaterial color={target.visualColor} roughness={0.5} />
            </mesh>
            {/* Twin Boom Fins */}
            {[-0.8, 0.8].map((bx, idx) => (
              <group key={`boom-${idx}`} position={[bx, 0.1, -1.1]}>
                <mesh castShadow>
                  <boxGeometry args={[0.08, 0.65, 0.4]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
              </group>
            ))}
            {/* Horizontal Stabilizer */}
            <mesh position={[0, 0.38, -1.2]} castShadow>
              <boxGeometry args={[1.8, 0.04, 0.35]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {/* Wingtip Flashing Strobes */}
            {[-2.2, 2.2].map((wx, idx) => (
              <mesh key={`strobe-${idx}`} position={[wx, 0.06, 0.2]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
              </mesh>
            ))}
          </group>
        ) : isMicroBoid ? (
          // 2. Micro-Boid Swarm Node Model (Compact, Agile)
          <group scale={[0.85, 0.85, 0.85]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.2, 0.7]} />
              <meshStandardMaterial color="#0F766E" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Swarm Sensor LED */}
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={2.0} />
            </mesh>
            {/* 4 Micro Propellers */}
            {[
              [-0.45, 0.1, -0.45],
              [0.45, 0.1, -0.45],
              [-0.45, 0.1, 0.45],
              [0.45, 0.1, 0.45],
            ].map(([px, py, pz], idx) => (
              <group
                key={`prop-${idx}`}
                position={[px, py, pz]}
                ref={(el) => {
                  if (el) rotorsRef.current[idx] = el;
                }}
              >
                <mesh>
                  <boxGeometry args={[0.8, 0.02, 0.1]} />
                  <meshBasicMaterial color="#042F2E" transparent opacity={0.7} />
                </mesh>
              </group>
            ))}
          </group>
        ) : (
          // 3. Heavy-Duty Multirotor Quadcopter Model
          <group scale={[1.2, 1.2, 1.2]}>
            {/* Chassis Body */}
            <mesh castShadow>
              <boxGeometry args={[1.4, 0.45, 1.6]} />
              <meshStandardMaterial color={target.visualColor} roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Top Plate */}
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[1.1, 0.18, 1.3]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            {/* 4 Motor Arms */}
            {[
              [1.2, 1.2],
              [-1.2, 1.2],
              [-1.2, -1.2],
              [1.2, -1.2],
            ].map(([ax, az], i) => (
              <group key={`quad-arm-${i}`}>
                <mesh position={[ax * 0.5, 0.05, az * 0.5]}>
                  <boxGeometry args={[0.16, 0.12, 1.5]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} />
                </mesh>
                <mesh position={[ax, 0.18, az]}>
                  <cylinderGeometry args={[0.26, 0.26, 0.35, 12]} />
                  <meshStandardMaterial color="#4B5563" metalness={0.9} />
                </mesh>
                {/* Propeller */}
                <group
                  position={[ax, 0.4, az]}
                  ref={(el) => {
                    if (el) rotorsRef.current[i] = el;
                  }}
                >
                  <mesh>
                    <boxGeometry args={[2.0, 0.02, 0.16]} />
                    <meshBasicMaterial color="#111827" transparent opacity={0.8} />
                  </mesh>
                </group>
                {/* Arm Navigation LEDs */}
                <mesh position={[ax * 1.08, 0, az * 1.08]}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                  <meshStandardMaterial
                    color={i === 1 ? '#EF4444' : i === 0 ? '#22C55E' : '#F59E0B'}
                    emissive={i === 1 ? '#EF4444' : i === 0 ? '#22C55E' : '#F59E0B'}
                    emissiveIntensity={1.8}
                  />
                </mesh>
              </group>
            ))}
            {/* Slung Payload Box (for suspicious drone) */}
            {target.visualColor === '#1E293B' && (
              <mesh position={[0, -0.45, 0]} castShadow>
                <boxGeometry args={[0.7, 0.45, 0.9]} />
                <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
              </mesh>
            )}
          </group>
        )}

        {/* Tactical Lock Reticle (Visible when detected) */}
        {isDetected && (
          <group position={[0, 0, 0]}>
            <mesh>
              <ringGeometry args={[2.8, 3.1, 24]} />
              <meshBasicMaterial color="#22C55E" opacity={0.8} transparent />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[2.8, 3.1, 24]} />
              <meshBasicMaterial color="#22C55E" opacity={0.4} transparent />
            </mesh>
          </group>
        )}

      </group>
    </group>
  );
};

export const MovingDroneGroup: React.FC<MovingDroneGroupProps> = ({
  targets,
  elapsedTimeSec,
  isDetected,
  onDetectTarget,
  onLeadDronePosition,
}) => {
  return (
    <group>
      {targets.map((target, idx) => (
        <DynamicDroneUnit
          key={target.id}
          target={target}
          elapsedTimeSec={elapsedTimeSec}
          isDetected={isDetected}
          isLead={idx === 0}
          onDetectTarget={onDetectTarget}
          onPositionUpdate={idx === 0 ? onLeadDronePosition : undefined}
        />
      ))}
    </group>
  );
};
