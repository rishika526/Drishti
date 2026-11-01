// DRISHTI: Procedural Rural Landscape & Terrain Mesh
// Stage 1: Visual Foundation & 3D World

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TerrainProps {
  environment?: string;
}

export const Terrain: React.FC<TerrainProps> = () => {
  // Generate elevation-displaced terrain with flat base compound and natural hills
  const { geometry, roadPoints } = useMemo(() => {
    const width = 360;
    const depth = 360;
    const segments = 120;
    const geo = new THREE.PlaneGeometry(width, depth, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // Color palettes (warm grass, dark foliage green, dry dirt, ridge rock)
    const colorGrass = new THREE.Color('#4E5D46');
    const colorMeadow = new THREE.Color('#647558');
    const colorDirt = new THREE.Color('#8D806D');
    const colorRidge = new THREE.Color('#7A7469');
    const colorClay = new THREE.Color('#5E5648');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from center compound (keep compound area flat)
      const distFromCenter = Math.hypot(x, z);
      const compoundRadius = 32;

      // Base undulating landscape
      let height = 0;

      // Layer 1: Broad rolling hills
      height += Math.sin(x * 0.015) * Math.cos(z * 0.015) * 9.0;
      // Layer 2: Medium ridges
      height += Math.cos(x * 0.035 + 1.2) * Math.sin(z * 0.035 + 0.8) * 4.5;
      // Layer 3: High northern ridgeline
      if (z < -30) {
        height += Math.pow(Math.abs(z + 30) * 0.12, 1.35) * 1.6;
      }
      // Layer 4: Gentle eastern valley
      if (x > 40) {
        height += Math.sin((x - 40) * 0.03) * 3.0;
      }

      // Smoothly blend compound area to flat ground (y = 0)
      if (distFromCenter < compoundRadius) {
        const blend = Math.pow(distFromCenter / compoundRadius, 2);
        height *= blend;
      }

      pos.setY(i, height);

      // Vertex color assignment based on elevation, slope, and proximity to compound
      let vertexColor = colorGrass.clone();

      if (distFromCenter < compoundRadius * 0.85) {
        // Flattened compound ground is packed gravel/earth
        vertexColor.lerp(colorDirt, 0.7);
      } else if (height > 12) {
        // High rocky ridge
        vertexColor.lerp(colorRidge, Math.min(1, (height - 12) / 10));
      } else if (height > 5) {
        // Sloped meadow
        vertexColor.lerp(colorMeadow, 0.4);
      } else if (height < -2) {
        // Low soil / moisture
        vertexColor.lerp(colorClay, 0.35);
      }

      // Subtle noise variation
      const noise = (Math.sin(x * 0.4) * Math.cos(z * 0.4) + 1) * 0.05;
      vertexColor.offsetHSL(0, 0, noise);

      colors[i * 3] = vertexColor.r;
      colors[i * 3 + 1] = vertexColor.g;
      colors[i * 3 + 2] = vertexColor.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    // Road curve points winding from compound to outer perimeter
    const road = [
      new THREE.Vector3(-25, 0.1, 10),
      new THREE.Vector3(-45, 0.2, 28),
      new THREE.Vector3(-60, 0.6, 55),
      new THREE.Vector3(-85, 1.4, 90),
      new THREE.Vector3(-120, 2.5, 140),
    ];

    return { geometry: geo, roadPoints: road };
  }, []);

  // Road geometry ribbon
  const roadGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(roadPoints);
    return new THREE.TubeGeometry(curve, 40, 2.8, 4, false);
  }, [roadPoints]);

  return (
    <group>
      {/* Main Ground Mesh */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0.06}
          flatShading={false}
        />
      </mesh>

      {/* Dirt Access Road Ribbon */}
      <mesh geometry={roadGeometry} receiveShadow position={[0, -0.4, 0]}>
        <meshStandardMaterial
          color="#9C8F7A"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Outpost Compound Concrete Apron */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[26, 32]} />
        <meshStandardMaterial
          color="#AFAAA0"
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      {/* Central Drone Landing Pad Marking */}
      <group position={[0, 0.08, 0]}>
        {/* Outer Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.8, 7.4, 32]} />
          <meshBasicMaterial color="#EBE5D9" />
        </mesh>
        {/* Inner Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.6, 32]} />
          <meshBasicMaterial color="#EBE5D9" />
        </mesh>
        {/* Yellow Orientation Pointers */}
        <mesh position={[0, 0.01, 7.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.8]} />
          <meshBasicMaterial color="#C97708" />
        </mesh>
        <mesh position={[0, 0.01, -7.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.8]} />
          <meshBasicMaterial color="#C97708" />
        </mesh>
      </group>
    </group>
  );
};
