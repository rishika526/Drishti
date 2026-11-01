// DRISHTI: FPV Drone Flight 3D Environment & Physics
// Stage 3: Operator Training Experiences

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FPVCheckpointGate } from '../../../types/operatorTraining';
import { Terrain } from '../../world3d/Terrain';
import { Vegetation } from '../../world3d/Vegetation';
import { TacticalCompound } from '../../world3d/TacticalCompound';

interface FPVFlightWorldProps {
  gates: FPVCheckpointGate[];
  activeGateIndex: number;
  isPaused: boolean;
  onGateCleared: (gateIndex: number) => void;
  onTelemetryUpdate: (telemetry: {
    altitude: number;
    speed: number;
    headingDeg: number;
    pitchDeg: number;
    rollDeg: number;
    throttlePct: number;
    dronePos: [number, number, number];
    collisionWarning: boolean;
  }) => void;
}

// 3D Gate Component
const GateMesh: React.FC<{
  gate: FPVCheckpointGate;
  isActive: boolean;
  isCleared: boolean;
}> = ({ gate, isActive, isCleared }) => {
  const ringColor = isCleared
    ? '#10B981' // Green
    : isActive
    ? '#34D399' // Bright Emerald Green
    : '#F59E0B'; // Amber for future gates

  return (
    <group position={gate.position} rotation={[0, gate.rotationY, 0]}>
      {/* Support Pylons Left & Right */}
      <mesh position={[-3, -gate.position[1] / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, gate.position[1], 12]} />
        <meshStandardMaterial color="#374151" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[3, -gate.position[1] / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, gate.position[1], 12]} />
        <meshStandardMaterial color="#374151" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Main Square/Circular Luminous Gate Arch */}
      <mesh>
        <torusGeometry args={[3, 0.2, 16, 32]} />
        <meshStandardMaterial
          color={ringColor}
          emissive={ringColor}
          emissiveIntensity={isActive ? 1.8 : isCleared ? 0.8 : 0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Active Inner Beacon Indicator */}
      {isActive && (
        <pointLight color="#34D399" intensity={3} distance={10} />
      )}

      {/* Gate Label Banner */}
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[2.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
};

// Internal FPV Drone Controller Hook & Physics Component
const DroneFPVController: React.FC<{
  gates: FPVCheckpointGate[];
  activeGateIndex: number;
  isPaused: boolean;
  onGateCleared: (index: number) => void;
  onTelemetryUpdate: FPVFlightWorldProps['onTelemetryUpdate'];
}> = ({ gates, activeGateIndex, isPaused, onGateCleared, onTelemetryUpdate }) => {
  const { camera } = useThree();

  // Drone State
  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.5, 0));
  const velRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);
  const rollRef = useRef<number>(0);

  // Active Keys Map
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (isPaused) return;

    const dt = Math.min(delta, 0.1);
    const keys = keysRef.current;

    // 1. Rotation (Yaw)
    const yawSpeed = 1.6;
    if (keys['KeyQ'] || keys['ArrowLeft']) {
      yawRef.current += yawSpeed * dt;
    }
    if (keys['KeyE'] || keys['ArrowRight']) {
      yawRef.current -= yawSpeed * dt;
    }

    // 2. Translational Acceleration
    const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawRef.current
    );
    const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawRef.current
    );

    const accel = 20.0;
    let targetPitch = 0;
    let targetRoll = 0;
    let throttlePct = 45; // Hover baseline

    if (keys['KeyW'] || keys['ArrowUp']) {
      velRef.current.addScaledVector(forwardVec, accel * dt);
      targetPitch = -12; // Nose down
      throttlePct += 25;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      velRef.current.addScaledVector(forwardVec, -accel * 0.7 * dt);
      targetPitch = 10; // Nose up
      throttlePct -= 15;
    }
    if (keys['KeyA']) {
      velRef.current.addScaledVector(rightVec, -accel * 0.7 * dt);
      targetRoll = -15; // Bank left
    }
    if (keys['KeyD']) {
      velRef.current.addScaledVector(rightVec, accel * 0.7 * dt);
      targetRoll = 15; // Bank right
    }

    // Vertical Throttle (Ascend / Descend)
    const vertAccel = 16.0;
    if (keys['Space']) {
      velRef.current.y += vertAccel * dt;
      throttlePct += 30;
    }
    if (keys['ShiftLeft'] || keys['ShiftRight']) {
      velRef.current.y -= vertAccel * dt;
      throttlePct -= 30;
    }

    // Smooth Pitch & Roll interpolation
    pitchRef.current += (targetPitch - pitchRef.current) * 8 * dt;
    rollRef.current += (targetRoll - rollRef.current) * 8 * dt;

    // Apply Drag / Inertia Damping
    velRef.current.x *= Math.pow(0.92, dt * 60);
    velRef.current.y *= Math.pow(0.88, dt * 60);
    velRef.current.z *= Math.pow(0.92, dt * 60);

    // Integrate Position
    posRef.current.addScaledVector(velRef.current, dt);

    // Terrain Collision Floor Clamp (y >= 1.2m)
    let collisionWarning = false;
    if (posRef.current.y < 1.4) {
      posRef.current.y = 1.4;
      if (velRef.current.y < 0) velRef.current.y = 0;
      collisionWarning = true;
    }

    // Ceiling clamp (y <= 30m)
    if (posRef.current.y > 30) {
      posRef.current.y = 30;
      if (velRef.current.y > 0) velRef.current.y = 0;
    }

    // 3. Update Camera Position & Rotation to Match FPV Drone Perspective
    camera.position.copy(posRef.current);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yawRef.current;
    camera.rotation.x = THREE.MathUtils.degToRad(pitchRef.current);
    camera.rotation.z = THREE.MathUtils.degToRad(rollRef.current);

    // 4. Checkpoint Detection: Distance to Active Gate
    const activeGate = gates[activeGateIndex];
    if (activeGate && !activeGate.cleared) {
      const dist = posRef.current.distanceTo(
        new THREE.Vector3(...activeGate.position)
      );
      if (dist < 3.2) {
        onGateCleared(activeGateIndex);
      }
    }

    // 5. Stream Telemetry to React HUD
    const speed = velRef.current.length();
    const headingDeg = THREE.MathUtils.radToDeg(-yawRef.current) % 360;

    onTelemetryUpdate({
      altitude: posRef.current.y,
      speed,
      headingDeg,
      pitchDeg: pitchRef.current,
      rollDeg: rollRef.current,
      throttlePct: Math.min(100, Math.max(10, throttlePct)),
      dronePos: [posRef.current.x, posRef.current.y, posRef.current.z],
      collisionWarning,
    });
  });

  return null;
};

export const FPVFlightWorld: React.FC<FPVFlightWorldProps> = ({
  gates,
  activeGateIndex,
  isPaused,
  onGateCleared,
  onTelemetryUpdate,
}) => {
  return (
    <div className="w-full h-full relative bg-[#060A06]">
      <Canvas
        shadows
        camera={{ position: [0, 3.5, 0], fov: 75, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Natural Sun & Atmospheric Lighting */}
        <ambientLight intensity={0.65} color="#DDE8DD" />
        <directionalLight
          position={[50, 80, 40]}
          intensity={1.8}
          color="#FFF8E7"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Tactical Base World: Terrain, Vegetation & Outpost Structures */}
        <Terrain />
        <Vegetation />
        <TacticalCompound />

        {/* 5 Illuminated Checkpoint Gates */}
        {gates.map((gate, idx) => (
          <GateMesh
            key={gate.id}
            gate={gate}
            isActive={idx === activeGateIndex}
            isCleared={gate.cleared}
          />
        ))}

        {/* FPV Drone Flight Physics & Camera Binding */}
        <DroneFPVController
          gates={gates}
          activeGateIndex={activeGateIndex}
          isPaused={isPaused}
          onGateCleared={onGateCleared}
          onTelemetryUpdate={onTelemetryUpdate}
        />
      </Canvas>
    </div>
  );
};
