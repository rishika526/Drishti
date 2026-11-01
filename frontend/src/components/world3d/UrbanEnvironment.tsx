// DRISHTI: Urban Training Sector with Realistic Buildings & Sightline Obstructions
// Stage 2: Core Counter-Drone Threat Simulation (Scenario 2)

import React from 'react';

export const UrbanEnvironment: React.FC = () => {
  // Building blocks definition: [x, z, width, depth, height, color]
  const buildings: [number, number, number, number, number, string][] = [
    // West District
    [-45, -35, 22, 28, 26, '#475569'],
    [-50, 25, 24, 30, 22, '#334155'],
    [-80, -20, 26, 35, 34, '#1E293B'],
    [-85, 35, 28, 26, 28, '#3F3F46'],

    // East District
    [45, -45, 24, 32, 30, '#334155'],
    [50, 25, 26, 28, 24, '#475569'],
    [85, -30, 30, 30, 38, '#1E293B'],
    [80, 40, 28, 34, 26, '#3F3F46'],

    // North-East Substation Compound
    [25, -85, 35, 25, 14, '#52525B'],
    [-25, -90, 30, 22, 16, '#64748B'],
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Asphalt Ground Plane & Street Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[320, 320]} />
        <meshStandardMaterial color="#2B303A" roughness={0.9} />
      </mesh>

      {/* Main Street Road Lines (North-South Boulevard & East-West Crossways) */}
      <group position={[0, 0.07, 0]}>
        {/* N-S Boulevard (Width 18m) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 300]} />
          <meshStandardMaterial color="#1E232A" roughness={0.8} />
        </mesh>
        {/* Yellow Centerline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[0.3, 280]} />
          <meshBasicMaterial color="#EAB308" />
        </mesh>

        {/* E-W Crossway (Width 16m) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[300, 16]} />
          <meshStandardMaterial color="#1E232A" roughness={0.8} />
        </mesh>
        {/* E-W Centerline */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <planeGeometry args={[280, 0.3]} />
          <meshBasicMaterial color="#EAB308" />
        </mesh>
      </group>

      {/* 2. Concrete Sidewalks & Curbs */}
      {[
        [-25, -25, 40, 40],
        [25, -25, 40, 40],
        [-25, 25, 40, 40],
        [25, 25, 40, 40],
      ].map(([cx, cz, w, d], i) => (
        <mesh
          key={`sidewalk-${i}`}
          position={[cx, 0.2, cz]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.7} />
        </mesh>
      ))}

      {/* 3. Multi-Story Urban Buildings with Rooftop Utility Structures */}
      {buildings.map(([bx, bz, bw, bd, bh, color], idx) => (
        <group key={`building-${idx}`} position={[bx, 0, bz]}>
          {/* Main Structure Mass */}
          <mesh position={[0, bh / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[bw, bh, bd]} />
            <meshStandardMaterial color={color} roughness={0.65} metalness={0.2} />
          </mesh>

          {/* Horizontal Window Bands */}
          {Array.from({ length: Math.floor(bh / 5) }).map((_, floorIdx) => {
            const wy = 4 + floorIdx * 4.5;
            if (wy >= bh - 2) return null;
            return (
              <group key={`floor-${floorIdx}`}>
                {/* Front Windows */}
                <mesh position={[0, wy, bd / 2 + 0.05]}>
                  <boxGeometry args={[bw * 0.85, 1.4, 0.1]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Side Windows */}
                <mesh position={[bw / 2 + 0.05, wy, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[bd * 0.85, 1.4, 0.1]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.9} />
                </mesh>
              </group>
            );
          })}

          {/* Rooftop Elevator Penthouse & HVAC Pods */}
          <mesh position={[0, bh + 1.4, 0]} castShadow>
            <boxGeometry args={[bw * 0.35, 2.8, bd * 0.35]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          <mesh position={[bw * 0.25, bh + 0.8, bd * 0.2]} castShadow>
            <boxGeometry args={[3, 1.6, 2.5]} />
            <meshStandardMaterial color="#475569" roughness={0.4} />
          </mesh>

          {/* Roof Antenna Mast */}
          {idx % 2 === 0 && (
            <group position={[-bw * 0.25, bh, -bd * 0.2]}>
              <mesh position={[0, 4, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.15, 8, 6]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
              </mesh>
              <mesh position={[0, 8, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* 4. Electrical Substation Yard (High-Value Infrastructure Area) */}
      <group position={[0, 0, -40]}>
        {/* Perimeter Gravel Pad */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[28, 22]} />
          <meshStandardMaterial color="#78716C" roughness={0.9} />
        </mesh>

        {/* 3 High-Voltage Power Transformers */}
        {[-8, 0, 8].map((tx, idx) => (
          <group key={`trans-${idx}`} position={[tx, 0, 0]}>
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[3.2, 4, 3.8]} />
              <meshStandardMaterial color="#3F3F46" roughness={0.6} metalness={0.5} />
            </mesh>
            {/* Transformer Bushings */}
            {[-0.8, 0.8].map((bx, bIdx) => (
              <mesh key={bIdx} position={[bx, 4.6, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.3, 1.4, 8]} />
                <meshStandardMaterial color="#B91C1C" roughness={0.3} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
