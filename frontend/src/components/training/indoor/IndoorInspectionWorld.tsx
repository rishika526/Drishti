// DRISHTI: Indoor Drone Inspection 3D Environment & Architecture
// Stage 3: Operator Training Experiences

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { IndoorTargetObject } from '../../../types/operatorTraining';

interface IndoorInspectionWorldProps {
  targets: IndoorTargetObject[];
  isSpotlightOn: boolean;
  isPaused: boolean;
  onTargetInRange: (target: IndoorTargetObject | null) => void;
  onRoomChange: (roomName: string) => void;
  onInspectTargetKey: () => void;
}

// 3D Facility Room Architecture
const FacilityInterior: React.FC<{ targets: IndoorTargetObject[] }> = ({ targets }) => {
  return (
    <group>
      {/* 1. Floor & Ceiling Planes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[32, 28]} />
        <meshStandardMaterial color="#1E2320" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, -8]}>
        <planeGeometry args={[32, 28]} />
        <meshStandardMaterial color="#141715" roughness={0.9} />
      </mesh>

      {/* 2. Perimeter Exterior Walls */}
      {/* North Wall */}
      <mesh position={[0, 2.1, -20]} receiveShadow>
        <boxGeometry args={[32, 4.2, 0.4]} />
        <meshStandardMaterial color="#2E3830" roughness={0.85} />
      </mesh>
      {/* South Wall */}
      <mesh position={[0, 2.1, 4]} receiveShadow>
        <boxGeometry args={[32, 4.2, 0.4]} />
        <meshStandardMaterial color="#2E3830" roughness={0.85} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-15, 2.1, -8]} receiveShadow>
        <boxGeometry args={[0.4, 4.2, 24]} />
        <meshStandardMaterial color="#2E3830" roughness={0.85} />
      </mesh>
      {/* East Wall */}
      <mesh position={[15, 2.1, -8]} receiveShadow>
        <boxGeometry args={[0.4, 4.2, 24]} />
        <meshStandardMaterial color="#2E3830" roughness={0.85} />
      </mesh>

      {/* 3. Interior Partition Walls with Doorways */}
      {/* West Wing Divider (Separates Utility Room from Corridor) */}
      <mesh position={[-4, 2.1, -4.5]} receiveShadow>
        <boxGeometry args={[0.3, 4.2, 6.5]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      <mesh position={[-4, 2.1, -15]} receiveShadow>
        <boxGeometry args={[0.3, 4.2, 6]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      {/* Door header lintel */}
      <mesh position={[-4, 3.6, -10]}>
        <boxGeometry args={[0.3, 1.2, 4]} />
        <meshStandardMaterial color="#242B25" />
      </mesh>

      {/* East Wing Divider (Separates Logistics Bay from Corridor) */}
      <mesh position={[4, 2.1, -4.5]} receiveShadow>
        <boxGeometry args={[0.3, 4.2, 6.5]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      <mesh position={[4, 2.1, -15]} receiveShadow>
        <boxGeometry args={[0.3, 4.2, 6]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      {/* East Door Header */}
      <mesh position={[4, 3.6, -10]}>
        <boxGeometry args={[0.3, 1.2, 4]} />
        <meshStandardMaterial color="#242B25" />
      </mesh>

      {/* North Divider (Separates Server Room from Central Hall) */}
      <mesh position={[-9, 2.1, -12]} receiveShadow>
        <boxGeometry args={[11, 4.2, 0.3]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      <mesh position={[9, 2.1, -12]} receiveShadow>
        <boxGeometry args={[11, 4.2, 0.3]} />
        <meshStandardMaterial color="#38433A" roughness={0.8} />
      </mesh>
      {/* North Door Header */}
      <mesh position={[0, 3.6, -12]}>
        <boxGeometry args={[6, 1.2, 0.3]} />
        <meshStandardMaterial color="#242B25" />
      </mesh>

      {/* 4. Room Decals, Signs & Ambient Accent Lights */}
      {/* Corridor Yellow Hazard Floor Markings */}
      <mesh position={[0, 0.02, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 18]} />
        <meshStandardMaterial color="#3E4A35" roughness={0.6} />
      </mesh>

      {/* Utility Room Sign */}
      <mesh position={[-3.8, 3.2, -7.5]}>
        <boxGeometry args={[0.08, 0.4, 1.2]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      {/* Server Room Sign */}
      <mesh position={[0, 3.2, -11.8]}>
        <boxGeometry args={[1.5, 0.4, 0.08]} />
        <meshStandardMaterial color="#2563EB" />
      </mesh>
      {/* Logistics Bay Sign */}
      <mesh position={[3.8, 3.2, -7.5]}>
        <boxGeometry args={[0.08, 0.4, 1.2]} />
        <meshStandardMaterial color="#059669" />
      </mesh>

      {/* 5. Target Objects in the 3 Rooms */}
      {/* Target 1: Electrical Main Breaker in Utility Room [-10, 2.0, -8] */}
      <group position={[-10, 2.0, -8]}>
        {/* Metal Breaker Cabinet */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 2.0, 0.5]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Scorch Marks / Hazardous Arc Visual */}
        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[1.1, 1.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.9} />
        </mesh>
        {/* Glowing Fault Indicator Light */}
        <pointLight color="#EF4444" intensity={2.5} distance={5} />
        <mesh position={[0.3, 0.5, 0.28]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
        {/* Inspection Placard */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.2, 0.25, 0.05]} />
          <meshStandardMaterial color="#EF4444" emissive="#7F1D1D" />
        </mesh>
      </group>

      {/* Target 2: Server Bay Dossier & Terminal in Server Room [0, 1.2, -14] */}
      <group position={[0, 0, -14]}>
        {/* Server Racks Left & Right */}
        <mesh position={[-2, 1.5, -2]} castShadow>
          <boxGeometry args={[1.2, 3.0, 1.0]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[2, 1.5, -2]} castShadow>
          <boxGeometry args={[1.2, 3.0, 1.0]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Blinking Rack LEDs */}
        <pointLight position={[-2, 2.0, -1.4]} color="#10B981" intensity={1.5} distance={3} />
        <pointLight position={[2, 2.0, -1.4]} color="#3B82F6" intensity={1.5} distance={3} />

        {/* Console Desk */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.0, 0.9, 1.0]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Unattended Briefcase & Terminal Screen */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.7, 0.15, 0.5]} />
          <meshStandardMaterial color="#78350F" metalness={0.5} roughness={0.5} />
        </mesh>
        <pointLight position={[0, 1.2, 0]} color="#F59E0B" intensity={1.8} distance={4} />
      </group>

      {/* Target 3: Emergency Backup Battery Pallet in Logistics Bay [10, 1.4, -8] */}
      <group position={[10, 0, -8]}>
        {/* Industrial Shelf Rack */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[3.0, 3.6, 1.2]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.3} roughness={0.7} wireframe />
        </mesh>
        {/* Wood Pallet */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.0, 0.2, 1.2]} />
          <meshStandardMaterial color="#78350F" roughness={0.9} />
        </mesh>
        {/* Battery Module Rack */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.8, 1.2, 0.9]} />
          <meshStandardMaterial color="#065F46" metalness={0.6} roughness={0.4} />
        </mesh>
        <pointLight position={[0, 1.2, 0.6]} color="#10B981" intensity={1.5} distance={4} />
      </group>
    </group>
  );
};

// Indoor Drone Controller with Collision Boundaries & Spotlight
const IndoorDroneController: React.FC<{
  targets: IndoorTargetObject[];
  isSpotlightOn: boolean;
  isPaused: boolean;
  onTargetInRange: (target: IndoorTargetObject | null) => void;
  onRoomChange: (roomName: string) => void;
  onInspectTargetKey: () => void;
}> = ({
  targets,
  isSpotlightOn,
  isPaused,
  onTargetInRange,
  onRoomChange,
  onInspectTargetKey,
}) => {
  const { camera } = useThree();
  const spotlightRef = useRef<THREE.SpotLight>(null);

  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 0));
  const velRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const yawRef = useRef<number>(0);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'KeyE') {
        onInspectTargetKey();
      }
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
  }, [onInspectTargetKey]);

  useFrame((_, delta) => {
    if (isPaused) return;
    const dt = Math.min(delta, 0.1);
    const keys = keysRef.current;

    // 1. Yaw Rotation
    const yawSpeed = 1.6;
    if (keys['KeyQ'] || keys['ArrowLeft']) {
      yawRef.current += yawSpeed * dt;
    }
    if (keys['KeyE'] || keys['ArrowRight']) {
      yawRef.current -= yawSpeed * dt;
    }

    // 2. Translational Direction Vectors
    const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawRef.current
    );
    const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawRef.current
    );

    const accel = 12.0;
    if (keys['KeyW'] || keys['ArrowUp']) {
      velRef.current.addScaledVector(forwardVec, accel * dt);
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
      velRef.current.addScaledVector(forwardVec, -accel * 0.7 * dt);
    }
    if (keys['KeyA']) {
      velRef.current.addScaledVector(rightVec, -accel * 0.7 * dt);
    }
    if (keys['KeyD']) {
      velRef.current.addScaledVector(rightVec, accel * 0.7 * dt);
    }

    // Altitude
    const vertAccel = 8.0;
    if (keys['Space']) {
      velRef.current.y += vertAccel * dt;
    }
    if (keys['ShiftLeft'] || keys['ShiftRight']) {
      velRef.current.y -= vertAccel * dt;
    }

    // Damping
    velRef.current.x *= Math.pow(0.85, dt * 60);
    velRef.current.y *= Math.pow(0.85, dt * 60);
    velRef.current.z *= Math.pow(0.85, dt * 60);

    posRef.current.addScaledVector(velRef.current, dt);

    // Facility Boundary Clamps
    posRef.current.x = Math.max(-13.5, Math.min(13.5, posRef.current.x));
    posRef.current.z = Math.max(-18.5, Math.min(2.5, posRef.current.z));
    posRef.current.y = Math.max(0.8, Math.min(3.6, posRef.current.y));

    // Update Camera
    camera.position.copy(posRef.current);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yawRef.current;
    camera.rotation.x = 0;
    camera.rotation.z = 0;

    // Update Spotlight Position & Direction
    if (spotlightRef.current) {
      spotlightRef.current.position.copy(posRef.current);
      const targetPos = posRef.current.clone().add(forwardVec.multiplyScalar(10));
      spotlightRef.current.target.position.copy(targetPos);
      spotlightRef.current.target.updateMatrixWorld();
    }

    // Room Identification
    const px = posRef.current.x;
    const pz = posRef.current.z;
    if (pz < -12 && Math.abs(px) < 6) {
      onRoomChange('Server Operations Room (North Wing)');
    } else if (px < -4) {
      onRoomChange('Utility Room (West Wing)');
    } else if (px > 4) {
      onRoomChange('Logistics Storage Bay (East Wing)');
    } else {
      onRoomChange('Central Inspection Corridor');
    }

    // Target Proximity Detection (< 4.2m)
    let foundTarget: IndoorTargetObject | null = null;
    for (const tgt of targets) {
      const dist = posRef.current.distanceTo(new THREE.Vector3(...tgt.position));
      if (dist < 4.2) {
        foundTarget = tgt;
        break;
      }
    }
    onTargetInRange(foundTarget);
  });

  return (
    <>
      {/* Forward Inspection Spotlight Mounted on Camera Drone */}
      <spotLight
        ref={spotlightRef}
        intensity={isSpotlightOn ? 8.0 : 0}
        color="#FFFBEB"
        angle={Math.PI / 4.5}
        penumbra={0.6}
        distance={18}
        castShadow
      />
    </>
  );
};

export const IndoorInspectionWorld: React.FC<IndoorInspectionWorldProps> = ({
  targets,
  isSpotlightOn,
  isPaused,
  onTargetInRange,
  onRoomChange,
  onInspectTargetKey,
}) => {
  return (
    <div className="w-full h-full relative bg-[#060807]">
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 0], fov: 75, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Atmospheric Low-Light Interior & Fog */}
        <color attach="background" args={['#080C0A']} />
        <fog attach="fog" args={['#080C0A', 3, 20]} />

        <ambientLight intensity={0.25} color="#A7B3A5" />
        <directionalLight position={[0, 4, -8]} intensity={0.3} color="#D1D5DB" />

        {/* 3D Facility Structure & Environmental Objects */}
        <FacilityInterior targets={targets} />

        {/* Indoor Drone Navigation & Spotlight */}
        <IndoorDroneController
          targets={targets}
          isSpotlightOn={isSpotlightOn}
          isPaused={isPaused}
          onTargetInRange={onTargetInRange}
          onRoomChange={onRoomChange}
          onInspectTargetKey={onInspectTargetKey}
        />
      </Canvas>
    </div>
  );
};
