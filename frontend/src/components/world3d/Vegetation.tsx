// DRISHTI: Procedural Vegetation & Foliage Systems
// Stage 1: Visual Foundation & 3D World

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Procedural Pine Tree Mesh
const PineTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}> = ({ position, scale = 1, rotationY = 0 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {/* Trunk */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.35, 3.6, 6]} />
        <meshStandardMaterial color="#4A3B32" roughness={0.9} />
      </mesh>
      {/* Layer 1 (Bottom Tier) */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[2.2, 2.8, 7]} />
        <meshStandardMaterial color="#2E432B" roughness={0.85} flatShading />
      </mesh>
      {/* Layer 2 (Middle Tier) */}
      <mesh position={[0, 4.6, 0]} castShadow>
        <coneGeometry args={[1.7, 2.5, 7]} />
        <meshStandardMaterial color="#364F33" roughness={0.85} flatShading />
      </mesh>
      {/* Layer 3 (Crown) */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <coneGeometry args={[1.1, 2.2, 6]} />
        <meshStandardMaterial color="#3D5A3A" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
};

// Procedural Deciduous Broadleaf Tree Mesh
const BroadleafTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
}> = ({ position, scale = 1, rotationY = 0 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotationY, 0]}>
      {/* Trunk */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.45, 4.4, 7]} />
        <meshStandardMaterial color="#544439" roughness={0.9} />
      </mesh>
      {/* Canopy Clusters */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <sphereGeometry args={[2.2, 7, 7]} />
        <meshStandardMaterial color="#4B5E41" roughness={0.82} flatShading />
      </mesh>
      <mesh position={[-0.8, 5.4, 0.6]} castShadow>
        <sphereGeometry args={[1.6, 6, 6]} />
        <meshStandardMaterial color="#556B4A" roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0.7, 5.2, -0.5]} castShadow>
        <sphereGeometry args={[1.5, 6, 6]} />
        <meshStandardMaterial color="#5E7552" roughness={0.82} flatShading />
      </mesh>
    </group>
  );
};

// Low Scrub / Bush cluster
const Bush: React.FC<{
  position: [number, number, number];
  scale?: number;
}> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.9, 6, 5]} />
        <meshStandardMaterial color="#5B6C55" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.4, 0.4, 0.3]} castShadow>
        <sphereGeometry args={[0.7, 5, 5]} />
        <meshStandardMaterial color="#4D5D48" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
};

export const Vegetation: React.FC = () => {
  // Generate procedural placement points for organic forest clusters and solitary trees
  const treeData = useMemo(() => {
    const list: {
      id: number;
      type: 'pine' | 'broadleaf';
      position: [number, number, number];
      scale: number;
      rotationY: number;
    }[] = [];

    // Helper to calculate terrain height approximately at (x, z)
    const getApproxHeight = (x: number, z: number) => {
      let h = Math.sin(x * 0.015) * Math.cos(z * 0.015) * 9.0;
      h += Math.cos(x * 0.035 + 1.2) * Math.sin(z * 0.035 + 0.8) * 4.5;
      if (z < -30) h += Math.pow(Math.abs(z + 30) * 0.12, 1.35) * 1.6;
      if (x > 40) h += Math.sin((x - 40) * 0.03) * 3.0;
      return h;
    };

    let idCounter = 0;

    // Cluster 1: Northwest Pine Forest Grove (x: -120 to -40, z: -110 to -45)
    for (let i = 0; i < 34; i++) {
      const x = -45 - Math.random() * 75;
      const z = -45 - Math.random() * 65;
      const h = getApproxHeight(x, z);
      list.push({
        id: idCounter++,
        type: Math.random() > 0.25 ? 'pine' : 'broadleaf',
        position: [x, h, z],
        scale: 0.8 + Math.random() * 0.5,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    // Cluster 2: Northeast Ridge Trees (x: 40 to 110, z: -100 to -40)
    for (let i = 0; i < 28; i++) {
      const x = 40 + Math.random() * 70;
      const z = -40 - Math.random() * 60;
      const h = getApproxHeight(x, z);
      list.push({
        id: idCounter++,
        type: Math.random() > 0.4 ? 'pine' : 'broadleaf',
        position: [x, h, z],
        scale: 0.85 + Math.random() * 0.45,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    // Cluster 3: Southwest Farmland Boundary Trees (x: -95 to -35, z: 45 to 110)
    for (let i = 0; i < 20; i++) {
      const x = -35 - Math.random() * 60;
      const z = 45 + Math.random() * 65;
      const h = getApproxHeight(x, z);
      list.push({
        id: idCounter++,
        type: Math.random() > 0.6 ? 'pine' : 'broadleaf',
        position: [x, h, z],
        scale: 0.9 + Math.random() * 0.4,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    // Cluster 4: Eastern Valley Scattered Broadleafs (x: 50 to 120, z: 30 to 100)
    for (let i = 0; i < 18; i++) {
      const x = 50 + Math.random() * 70;
      const z = 30 + Math.random() * 70;
      const h = getApproxHeight(x, z);
      list.push({
        id: idCounter++,
        type: 'broadleaf',
        position: [x, h, z],
        scale: 0.95 + Math.random() * 0.4,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    return list;
  }, []);

  // Roadside Bushes
  const bushes = useMemo(() => {
    return [
      { pos: [-28, 0, 16], scale: 1.1 },
      { pos: [-34, 0.1, 22], scale: 0.9 },
      { pos: [-48, 0.3, 36], scale: 1.3 },
      { pos: [-55, 0.5, 48], scale: 1.0 },
      { pos: [-68, 0.8, 68], scale: 1.2 },
      { pos: [18, 0, 12], scale: 0.85 },
      { pos: [22, 0.1, -14], scale: 1.15 },
      { pos: [-16, 0, -22], scale: 1.0 },
    ] as { pos: [number, number, number]; scale: number }[];
  }, []);

  return (
    <group>
      {treeData.map((tree) =>
        tree.type === 'pine' ? (
          <PineTree
            key={tree.id}
            position={tree.position}
            scale={tree.scale}
            rotationY={tree.rotationY}
          />
        ) : (
          <BroadleafTree
            key={tree.id}
            position={tree.position}
            scale={tree.scale}
            rotationY={tree.rotationY}
          />
        )
      )}

      {bushes.map((b, i) => (
        <Bush key={`bush-${i}`} position={b.pos} scale={b.scale} />
      ))}
    </group>
  );
};
