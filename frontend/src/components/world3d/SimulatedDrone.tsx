// DRISHTI: High-Fidelity Simulated Drone Model
// Stage 1: Visual Foundation & 3D World

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SimulatedDroneProps {
  position?: [number, number, number];
  altitude?: number;
  onPositionUpdate?: (pos: [number, number, number]) => void;
}

export const SimulatedDrone: React.FC<SimulatedDroneProps> = ({
  position = [0, 18, 0],
  altitude = 18,
  onPositionUpdate,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const droneMeshRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const gimbalRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // High-speed rotor spin (40 rad/s)
    rotorsRef.current.forEach((rotor, idx) => {
      if (rotor) {
        // Alternate clockwise / counter-clockwise like real quadcopters
        const dir = idx % 2 === 0 ? 1 : -1;
        rotor.rotation.y += dir * 0.7;
      }
    });

    // Realistic aerodynamic hover oscillation
    if (droneMeshRef.current) {
      // Gentle vertical hover breathing
      const hoverY = Math.sin(t * 1.6) * 0.18 + Math.cos(t * 3.2) * 0.04;
      // Gentle atmospheric roll / pitch micro-adjustments
      const microRoll = Math.sin(t * 1.2) * 0.025;
      const microPitch = Math.cos(t * 1.4) * 0.03;
      // Gentle lazy yaw drift
      const lazyYaw = Math.sin(t * 0.3) * 0.15;

      droneMeshRef.current.position.y = hoverY;
      droneMeshRef.current.rotation.x = microPitch;
      droneMeshRef.current.rotation.z = microRoll;
      droneMeshRef.current.rotation.y = lazyYaw;

      // Update gimbal counter-stabilization (keeps camera locked forward-down)
      if (gimbalRef.current) {
        gimbalRef.current.rotation.x = -microPitch - 0.25; // Constant slight downward look
        gimbalRef.current.rotation.z = -microRoll;
      }
    }

    // Report global position for camera tracking
    if (rootGroupRef.current && onPositionUpdate) {
      const worldPos = new THREE.Vector3();
      rootGroupRef.current.getWorldPosition(worldPos);
      onPositionUpdate([worldPos.x, worldPos.y, worldPos.z]);
    }
  });

  // Rotor arm positions ([x, z, angle])
  const arms: [number, number, number][] = [
    [1.4, 1.4, Math.PI / 4],      // Front Right
    [-1.4, 1.4, (3 * Math.PI) / 4], // Front Left
    [-1.4, -1.4, (5 * Math.PI) / 4], // Rear Left
    [1.4, -1.4, (7 * Math.PI) / 4],  // Rear Right
  ];

  return (
    <group ref={rootGroupRef} position={[position[0], altitude, position[2]]}>
      
      {/* Visual Drone Group with Aerodynamic Micro-Motion */}
      <group ref={droneMeshRef}>
        
        {/* Central Core Chassis (Carbon Fiber & Matte Military Olive) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.45, 1.8]} />
          <meshStandardMaterial
            color="#222823"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Top Canopy Cover (Olive Green Shield) */}
        <mesh position={[0, 0.28, -0.05]} castShadow>
          <boxGeometry args={[1.2, 0.22, 1.4]} />
          <meshStandardMaterial
            color="#384335"
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>

        {/* GNSS / GPS Dome Antenna */}
        <mesh position={[0, 0.45, -0.4]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.15, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 4 Carbon Fiber Motor Arms */}
        {arms.map(([ax, az, angle], i) => (
          <group key={`arm-${i}`} position={[0, 0, 0]}>
            {/* Tubular Arm Spar */}
            <mesh position={[ax * 0.5, 0.05, az * 0.5]} rotation={[0, -angle, 0]} castShadow>
              <boxGeometry args={[0.18, 0.14, 1.8]} />
              <meshStandardMaterial color="#1A1F1B" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Motor Pod Cylinder */}
            <mesh position={[ax, 0.15, az]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.4, 16]} />
              <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Motor Bell Top (Brushed Metal) */}
            <mesh position={[ax, 0.38, az]} castShadow>
              <cylinderGeometry args={[0.24, 0.28, 0.1, 16]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Spinning Propeller Blades */}
            <group
              position={[ax, 0.44, az]}
              ref={(el) => {
                if (el) rotorsRef.current[i] = el;
              }}
            >
              {/* Blade 1 & Blade 2 */}
              <mesh castShadow>
                <boxGeometry args={[2.4, 0.02, 0.18]} />
                <meshStandardMaterial
                  color="#1E293B"
                  transparent
                  opacity={0.85}
                  roughness={0.3}
                />
              </mesh>
              {/* Center Prop Hub */}
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
                <meshStandardMaterial color="#C97708" metalness={0.9} />
              </mesh>
            </group>

            {/* Navigation LED at Motor Tip */}
            <mesh position={[ax * 1.1, 0, az * 1.1]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color={
                  i === 1
                    ? '#EF4444' // Port Left Front = Red
                    : i === 0
                    ? '#22C55E' // Starboard Right Front = Green
                    : '#F59E0B' // Rear = Amber
                }
                emissive={
                  i === 1 ? '#EF4444' : i === 0 ? '#22C55E' : '#F59E0B'
                }
                emissiveIntensity={1.4}
              />
            </mesh>
          </group>
        ))}

        {/* Dual Landing Skids */}
        {[-0.65, 0.65].map((sx, idx) => (
          <group key={`skid-${idx}`} position={[sx, -0.4, 0]}>
            {/* Front Leg */}
            <mesh position={[0, 0.15, 0.6]} rotation={[0.25, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1F2937" metalness={0.8} />
            </mesh>
            {/* Rear Leg */}
            <mesh position={[0, 0.15, -0.6]} rotation={[-0.25, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
              <meshStandardMaterial color="#1F2937" metalness={0.8} />
            </mesh>
            {/* Skid Tube Bar */}
            <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.9, 8]} />
              <meshStandardMaterial color="#374151" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* 2-Axis Stabilized Optical Gimbal Camera (Under Fuselage) */}
        <group position={[0, -0.3, 0.55]} ref={gimbalRef}>
          {/* Gimbal Yoke */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
            <meshStandardMaterial color="#111827" metalness={0.8} />
          </mesh>
          {/* Spherical Camera Housing */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial color="#1F2937" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Optical Camera Lens Aperture */}
          <mesh position={[0, -0.22, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#0284C7" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

      </group>

      {/* Downward Laser Rangefinder Indicator (Subtle guide to ground) */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            self.setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, -altitude, 0),
            ]);
          }}
        />
        <lineDashedMaterial
          attach="material"
          color="#C97708"
          dashSize={0.8}
          gapSize={0.8}
          opacity={0.35}
          transparent
        />
      </line>

      {/* Ground Projection Ring */}
      <mesh position={[0, -altitude + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 2.1, 32]} />
        <meshBasicMaterial color="#C97708" opacity={0.4} transparent />
      </mesh>
    </group>
  );
};
