// DRISHTI: Aerial Observation Reconnaissance 3D Landscape & Camera
// Stage 3: Operator Training Experiences

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AerialLandmarkTarget } from '../../../types/operatorTraining';
import { Terrain } from '../../world3d/Terrain';
import { Vegetation } from '../../world3d/Vegetation';
import { TacticalCompound } from '../../world3d/TacticalCompound';

interface AerialObservationWorldProps {
  landmarks: AerialLandmarkTarget[];
  selectedLandmarkId: string | null;
  viewMode: 'oblique' | 'overhead';
  zoomLevel: number;
  isPaused: boolean;
  onSelectLandmark: (landmark: AerialLandmarkTarget) => void;
  onSectorChange: (sector: string) => void;
}

// 1. Sector Alpha: 3D Radar Mast with Rotating Dish [0, 4, -40]
const RadarMastModel: React.FC<{
  position: [number, number, number];
  isSelected: boolean;
  isObserved: boolean;
  onClick: () => void;
}> = ({ position, isSelected, isObserved, onClick }) => {
  const dishRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (dishRef.current) {
      dishRef.current.rotation.y += 0.8 * delta;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Base Foundation & Equipment Shelter */}
      <mesh position={[0, -2.5, 0]} castShadow>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial color="#374151" roughness={0.7} />
      </mesh>

      {/* Lattice Mast Tower */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.6, 1.8, 14, 4]} />
        <meshStandardMaterial color="#4B5563" wireframe roughness={0.5} />
      </mesh>

      {/* Rotating Parabolic Dish Mount */}
      <group ref={dishRef} position={[0, 11, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[3.2, 0.4, 0.6, 24, 1, true]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 1.5]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Tactical Highlight Beacon */}
      {isSelected && (
        <mesh position={[0, 13, 0]}>
          <ringGeometry args={[4, 4.4, 32]} />
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// 2. Sector Bravo: 3D Tactical Transport Vehicle under Camouflage [28, 1.5, -15]
const CamouflageConvoyModel: React.FC<{
  position: [number, number, number];
  isSelected: boolean;
  isObserved: boolean;
  onClick: () => void;
}> = ({ position, isSelected, isObserved, onClick }) => {
  return (
    <group position={position} onClick={onClick}>
      {/* Camouflage Canopy Shade Frame */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[9, 0.2, 5]} />
        <meshStandardMaterial color="#4D5D44" roughness={0.9} />
      </mesh>
      <mesh position={[-4, 1.25, -2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#2B3626" />
      </mesh>
      <mesh position={[4, 1.25, -2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#2B3626" />
      </mesh>
      <mesh position={[-4, 1.25, 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#2B3626" />
      </mesh>
      <mesh position={[4, 1.25, 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#2B3626" />
      </mesh>

      {/* 6x6 Military Truck Chassis */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[6.5, 1.6, 2.4]} />
        <meshStandardMaterial color="#364532" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Truck Cab */}
      <mesh position={[2.2, 1.4, 0]} castShadow>
        <boxGeometry args={[2.0, 1.5, 2.3]} />
        <meshStandardMaterial color="#2E3B2A" roughness={0.6} />
      </mesh>

      {/* Wheels */}
      {[-1.8, 0, 1.8].map((xOffset, idx) => (
        <group key={idx}>
          <mesh position={[xOffset, 0.4, 1.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#18181B" roughness={0.8} />
          </mesh>
          <mesh position={[xOffset, 0.4, -1.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
            <meshStandardMaterial color="#18181B" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {isSelected && (
        <mesh position={[0, 3.5, 0]}>
          <ringGeometry args={[5, 5.4, 32]} />
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// 3. Sector Charlie: 3D Hardened Bulk Fuel Tanks Depot [-30, 2.5, -25]
const FuelDepotModel: React.FC<{
  position: [number, number, number];
  isSelected: boolean;
  isObserved: boolean;
  onClick: () => void;
}> = ({ position, isSelected, isObserved, onClick }) => {
  return (
    <group position={position} onClick={onClick}>
      {/* Earthen Containment Berm */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[14, 1.2, 12]} />
        <meshStandardMaterial color="#5C5544" roughness={0.9} />
      </mesh>

      {/* Twin Cylindrical Fuel Tanks */}
      {/* Tank 1 */}
      <group position={[-3.2, 3.0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.6, 2.6, 4.5, 32]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Tank 2 */}
      <group position={[3.2, 3.0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[2.6, 2.6, 4.5, 32]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[2.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {isSelected && (
        <mesh position={[0, 6.5, 0]}>
          <ringGeometry args={[7, 7.5, 32]} />
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

// Aerial Camera & Gimbal Controller
const AerialGimbalController: React.FC<{
  targetPos: THREE.Vector3;
  viewMode: 'oblique' | 'overhead';
  zoomLevel: number;
  isPaused: boolean;
  onSectorChange: (sector: string) => void;
}> = ({ targetPos, viewMode, zoomLevel, isPaused, onSectorChange }) => {
  const { camera } = useThree();
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -20));
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

    // Pan target focus across landscape with W/A/S/D
    const panSpeed = 30.0;
    if (keys['KeyW'] || keys['ArrowUp']) targetPos.z -= panSpeed * dt;
    if (keys['KeyS'] || keys['ArrowDown']) targetPos.z += panSpeed * dt;
    if (keys['KeyA'] || keys['ArrowLeft']) targetPos.x -= panSpeed * dt;
    if (keys['KeyD'] || keys['ArrowRight']) targetPos.x += panSpeed * dt;

    // Landscape boundary clamps
    targetPos.x = Math.max(-50, Math.min(50, targetPos.x));
    targetPos.z = Math.max(-65, Math.min(10, targetPos.z));

    // Smoothly interpolate current focus toward targetPos
    currentPosRef.current.lerp(targetPos, 5 * dt);

    // Calculate Desired Camera Position based on View Mode
    const desiredCamPos = new THREE.Vector3();
    if (viewMode === 'oblique') {
      desiredCamPos.set(
        currentPosRef.current.x,
        currentPosRef.current.y + 45,
        currentPosRef.current.z + 45
      );
    } else {
      // 90° Nadir Overhead Satellite View
      desiredCamPos.set(
        currentPosRef.current.x,
        currentPosRef.current.y + 80,
        currentPosRef.current.z + 0.1
      );
    }

    camera.position.lerp(desiredCamPos, 4 * dt);
    camera.lookAt(currentPosRef.current);

    // Adjust Field of View for Optical Zoom
    const targetFov = zoomLevel === 4.0 ? 18 : zoomLevel === 2.0 ? 36 : 65;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 6 * dt);
      camera.updateProjectionMatrix();
    }

    // Update active sector readout
    const cx = currentPosRef.current.x;
    const cz = currentPosRef.current.z;
    if (cz < -30 && Math.abs(cx) < 18) {
      onSectorChange('Sector Alpha [North Ridge]');
    } else if (cx > 15) {
      onSectorChange('Sector Bravo [East Pass]');
    } else if (cx < -15) {
      onSectorChange('Sector Charlie [Southwest]');
    } else {
      onSectorChange('Sector Delta [Central Proving Grounds]');
    }
  });

  return null;
};

export const AerialObservationWorld: React.FC<AerialObservationWorldProps> = ({
  landmarks,
  selectedLandmarkId,
  viewMode,
  zoomLevel,
  isPaused,
  onSelectLandmark,
  onSectorChange,
}) => {
  const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -25));

  // When a landmark is clicked or selected from HUD, update target position
  useEffect(() => {
    if (selectedLandmarkId) {
      const lm = landmarks.find((l) => l.id === selectedLandmarkId);
      if (lm) {
        targetPosRef.current.set(...lm.position);
      }
    }
  }, [selectedLandmarkId, landmarks]);

  return (
    <div className="w-full h-full relative bg-[#060A06]">
      <Canvas
        shadows
        camera={{ position: [0, 50, 20], fov: 65, near: 0.5, far: 800 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} color="#E2EBE2" />
        <directionalLight
          position={[60, 100, 50]}
          intensity={1.8}
          color="#FFFDF5"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 3D Landscape Terrain & Compound Elements */}
        <Terrain />
        <Vegetation />
        <TacticalCompound />

        {/* 1. Radar Mast in Sector Alpha */}
        <RadarMastModel
          position={[0, 4, -40]}
          isSelected={selectedLandmarkId === 'radar_mast'}
          isObserved={Boolean(landmarks.find((l) => l.id === 'radar_mast')?.observed)}
          onClick={() => {
            const lm = landmarks.find((l) => l.id === 'radar_mast');
            if (lm) onSelectLandmark(lm);
          }}
        />

        {/* 2. Camouflaged Convoy in Sector Bravo */}
        <CamouflageConvoyModel
          position={[28, 1.5, -15]}
          isSelected={selectedLandmarkId === 'supply_convoy'}
          isObserved={Boolean(landmarks.find((l) => l.id === 'supply_convoy')?.observed)}
          onClick={() => {
            const lm = landmarks.find((l) => l.id === 'supply_convoy');
            if (lm) onSelectLandmark(lm);
          }}
        />

        {/* 3. Fuel Depot in Sector Charlie */}
        <FuelDepotModel
          position={[-30, 2.5, -25]}
          isSelected={selectedLandmarkId === 'fuel_depot'}
          isObserved={Boolean(landmarks.find((l) => l.id === 'fuel_depot')?.observed)}
          onClick={() => {
            const lm = landmarks.find((l) => l.id === 'fuel_depot');
            if (lm) onSelectLandmark(lm);
          }}
        />

        {/* Gimbal Camera & Surveillance Controls */}
        <AerialGimbalController
          targetPos={targetPosRef.current}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          isPaused={isPaused}
          onSectorChange={onSectorChange}
        />
      </Canvas>
    </div>
  );
};
