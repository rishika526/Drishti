// DRISHTI: Tactical Outpost & Compound Architectural Structures
// Stage 1: Visual Foundation & 3D World

import React from 'react';

export const TacticalCompound: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Operations & Command Shelter (x: -14, z: -10) */}
      <group position={[-14, 0, -10]}>
        {/* Foundation & Walls */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 4.4, 7]} />
          <meshStandardMaterial color="#6B6E68" roughness={0.78} metalness={0.15} />
        </mesh>
        {/* Flat Roof Trim */}
        <mesh position={[0, 4.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.6, 0.3, 7.6]} />
          <meshStandardMaterial color="#4A4E48" roughness={0.7} />
        </mesh>
        {/* Reinforced Blast Windows */}
        <mesh position={[0, 2.4, 3.52]}>
          <boxGeometry args={[6.5, 1.2, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Entry Doorway */}
        <mesh position={[3.2, 1.3, 3.52]}>
          <boxGeometry args={[1.6, 2.6, 0.1]} />
          <meshStandardMaterial color="#374151" roughness={0.5} />
        </mesh>
        {/* Roof HVAC / Air Scrubbers */}
        <mesh position={[-2, 4.9, 0]} castShadow>
          <boxGeometry args={[2.4, 0.8, 2.0]} />
          <meshStandardMaterial color="#555953" roughness={0.6} />
        </mesh>
      </group>

      {/* 2. Elevated Sector Watchtower (x: 15, z: -12) */}
      <group position={[15, 0, -12]}>
        {/* 4 Steel Truss Legs */}
        {[
          [-1.4, -1.4],
          [1.4, -1.4],
          [-1.4, 1.4],
          [1.4, 1.4],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 5.5, lz]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 11, 6]} />
            <meshStandardMaterial color="#3E443F" roughness={0.6} metalness={0.8} />
          </mesh>
        ))}
        {/* Tower Cross Bracing Rings */}
        <mesh position={[0, 3.8, 0]}>
          <boxGeometry args={[2.9, 0.1, 2.9]} />
          <meshStandardMaterial color="#4A524C" roughness={0.6} metalness={0.8} />
        </mesh>
        <mesh position={[0, 7.5, 0]}>
          <boxGeometry args={[2.9, 0.1, 2.9]} />
          <meshStandardMaterial color="#4A524C" roughness={0.6} metalness={0.8} />
        </mesh>
        {/* Observation Platform Deck */}
        <mesh position={[0, 11, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.35, 4.2]} />
          <meshStandardMaterial color="#565D57" roughness={0.7} />
        </mesh>
        {/* Enclosed Observation Cabin */}
        <mesh position={[0, 12.4, 0]} castShadow>
          <boxGeometry args={[3.2, 2.4, 3.2]} />
          <meshStandardMaterial color="#3B423D" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Panoramic Tinted Viewing Band */}
        <mesh position={[0, 12.6, 0]}>
          <boxGeometry args={[3.25, 0.8, 3.25]} />
          <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Roof & Radar Dish Mast */}
        <mesh position={[0, 13.8, 0]} castShadow>
          <boxGeometry args={[3.6, 0.25, 3.6]} />
          <meshStandardMaterial color="#2B312D" />
        </mesh>
        <mesh position={[0, 15.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.6, 6]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
        {/* Small Parabolic Dish */}
        <mesh position={[0, 15.6, 0.3]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* 3. Field Maintenance Hangar / Equipment Bay (x: -12, z: 12) */}
      <group position={[-12, 0, 12]}>
        {/* Arching Quonset-Style or Sloped Bay */}
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 5.2, 11]} />
          <meshStandardMaterial color="#5E635C" roughness={0.8} metalness={0.3} />
        </mesh>
        {/* Large Roll-up Hangar Door */}
        <mesh position={[4.28, 2.2, 0]}>
          <boxGeometry args={[0.1, 4.4, 7.5]} />
          <meshStandardMaterial color="#383D37" roughness={0.6} />
        </mesh>
      </group>

      {/* 4. Telemetry Sensor Mast (x: 18, z: 10) */}
      <group position={[18, 0, 10]}>
        {/* Base Pillar */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.2, 8]} />
          <meshStandardMaterial color="#525852" />
        </mesh>
        {/* Mast Lattice Tower */}
        <mesh position={[0, 8, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.35, 15, 6]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Cross Arms with Anemometer & Antennas */}
        <mesh position={[0, 14.5, 0]}>
          <boxGeometry args={[2.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>
        {/* Red Obstruction Beacon */}
        <mesh position={[0, 15.6, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 5. Compound Perimeter Floodlights / Markers */}
      {[
        [-20, 20],
        [20, 20],
        [-20, -20],
        [20, -20],
      ].map(([px, pz], i) => (
        <group key={`light-${i}`} position={[px, 0, pz]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 5, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh position={[0, 5.1, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.3]} />
            <meshStandardMaterial color="#94A3B8" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
