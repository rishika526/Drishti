import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ContactEntity, TerrainType, TimeOfDay, WeatherType } from '../../types';
import { useSimulationStore } from '../../store/simulationStore';

// Watch post camera controller that responds to zoom level
function CameraRig({ zoomLevel }: { zoomLevel: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetFov = 65 / Math.max(1, zoomLevel);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.15);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls
      target={[0, 22, 50]}
      enablePan={false}
      enableZoom={true}
      minDistance={2}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2 + 0.1}
      minPolarAngle={0.05}
    />
  );
}

// Procedural Terrain for Rural / Hills / Desert
function ProceduralTerrain({ terrain }: { terrain: TerrainType }) {
  const { geometry, material } = useMemo(() => {
    const size = 3200;
    const segments = 90;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);

      // Flatten base area (inner 350m radius)
      let height = 0;
      if (distFromCenter > 250) {
        const factor = Math.min(1, (distFromCenter - 250) / 400);
        if (terrain === 'hills') {
          height =
            (Math.sin(x * 0.003) * Math.cos(z * 0.003) * 140 +
              Math.sin(x * 0.008 + z * 0.006) * 45) *
            factor;
        } else if (terrain === 'desert') {
          height =
            (Math.sin(x * 0.004 + z * 0.002) * 50 +
              Math.cos(x * 0.008) * 20) *
            factor;
        } else {
          // rural
          height =
            (Math.sin(x * 0.002) * Math.cos(z * 0.002) * 70 +
              Math.sin(x * 0.006) * 25) *
            factor;
        }
      }
      pos.setY(i, height);

      // Vertex color blending
      if (terrain === 'desert') {
        colors[i * 3] = 0.55 + (height / 200) * 0.2; // R
        colors[i * 3 + 1] = 0.45 + (height / 200) * 0.15; // G
        colors[i * 3 + 2] = 0.28; // B
      } else if (terrain === 'hills') {
        colors[i * 3] = 0.25 + (height / 180) * 0.2;
        colors[i * 3 + 1] = 0.32 + (height / 180) * 0.15;
        colors[i * 3 + 2] = 0.22;
      } else {
        // rural
        colors[i * 3] = 0.15 + (height / 150) * 0.1;
        colors[i * 3 + 1] = 0.28 + (height / 150) * 0.15;
        colors[i * 3 + 2] = 0.18;
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.1,
      wireframe: false,
    });

    return { geometry: geo, material: mat };
  }, [terrain]);

  return <mesh geometry={geometry} material={material} receiveShadow />;
}

// Instanced Urban Building Grid for Urban Canyon Scenario
function UrbanBuildings() {
  const count = 90;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    const dummy = new THREE.Object3D();
    const rng = (seed: number) => {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    let idx = 0;
    const gridDim = 10;
    const spacing = 140;

    for (let x = -gridDim / 2; x < gridDim / 2; x++) {
      for (let z = -gridDim / 2; z < gridDim / 2; z++) {
        const posX = x * spacing + rng(idx * 7) * 30;
        const posZ = z * spacing + rng(idx * 13) * 30;
        const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);

        // Clear center base perimeter
        if (distFromCenter < 280) {
          idx++;
          continue;
        }

        if (idx < count) {
          const height = 45 + rng(idx * 31) * 110;
          const width = 35 + rng(idx * 17) * 30;
          const depth = 35 + rng(idx * 23) * 30;

          dummy.position.set(posX, height / 2, posZ);
          dummy.scale.set(width, height, depth);
          dummy.updateMatrix();

          setTimeout(() => {
            if (meshRef.current) {
              meshRef.current.setMatrixAt(idx, dummy.matrix);
              meshRef.current.instanceMatrix.needsUpdate = true;
            }
          }, 0);
          idx++;
        }
      }
    }
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#15202e"
        roughness={0.7}
        metalness={0.3}
      />
    </instancedMesh>
  );
}

// Protected Military Base Model & Watch Tower
function ProtectedBase() {
  const radarDishRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y += dt * 1.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Ground platform slab */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[180, 190, 1, 32]} />
        <meshStandardMaterial color="#0c121c" roughness={0.8} />
      </mesh>

      {/* Perimeter fence glow ring */}
      <mesh position={[0, 1.2, 0]}>
        <ringGeometry args={[175, 178, 48]} />
        <meshBasicMaterial color="#00ff9c" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Observation Watch Tower (where trainee stands at Y=22) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 10, 0]}>
          <cylinderGeometry args={[4, 7, 20, 8]} />
          <meshStandardMaterial color="#1a2636" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 20.5, 0]}>
          <cylinderGeometry args={[8, 7, 1.5, 12]} />
          <meshStandardMaterial color="#223348" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Railing */}
        <mesh position={[0, 22, 0]}>
          <cylinderGeometry args={[8.2, 8.2, 1.5, 16, 1, true]} />
          <meshBasicMaterial color="#00ff9c" wireframe transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Radome Array */}
      <group position={[45, 0, -35]}>
        <mesh position={[0, 12, 0]}>
          <sphereGeometry args={[10, 24, 18]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[6, 8, 8, 12]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>

      {/* Secondary Radar Mast with rotating antenna dish */}
      <group ref={radarDishRef} position={[-40, 24, 30]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[14, 3, 1]} />
          <meshStandardMaterial color="#ffb000" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 2]}>
          <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
          <meshStandardMaterial color="#00ff9c" />
        </mesh>
      </group>
      <mesh position={[-40, 11, 30]}>
        <cylinderGeometry args={[1.5, 3, 22, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Command Bunker */}
      <mesh position={[0, 3.5, -45]}>
        <boxGeometry args={[35, 7, 25]} />
        <meshStandardMaterial color="#172230" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Animated Drone mesh with silhouette and night strobes
function DroneItem({
  contact,
  isSelected,
  onClick,
  isThermal,
}: {
  contact: ContactEntity;
  isSelected: boolean;
  onClick: () => void;
  isThermal: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += dt * 35;
    }
  });

  const isHostile = contact.hostile;
  const isNight = contact.altitude > 0;

  // Thermal FLIR material vs standard tactical material
  const bodyColor = isThermal
    ? contact.hostile
      ? '#ffffff' // hot white in FLIR
      : '#cccccc'
    : contact.type === 'friendly'
    ? '#1e90ff'
    : contact.type === 'bird'
    ? '#8b5a2b'
    : contact.type === 'hobby'
    ? '#ffb000'
    : isHostile
    ? '#ef4444'
    : '#94a3b8';

  return (
    <group
      ref={meshRef}
      position={[contact.position[0], contact.position[1], contact.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Selection Box / HUD Diamond in 3D */}
      {isSelected && (
        <group>
          <mesh>
            <boxGeometry args={[12, 12, 12]} />
            <meshBasicMaterial
              color="#00ff9c"
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>
          <pointLight color="#00ff9c" intensity={1.5} distance={30} />
        </group>
      )}

      {/* Low-Poly Drone Silhouettes */}
      {contact.type === 'bird' ? (
        // Bird Flapping V-mesh
        <group scale={1.8}>
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.5, 2, 4]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          <mesh position={[-1.2, 0.2, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[2, 0.1, 0.8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          <mesh position={[1.2, 0.2, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[2, 0.1, 0.8]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
        </group>
      ) : contact.type === 'attack' ? (
        // Lethal Delta-Wing Loitering Munition
        <group scale={2.8}>
          {/* Fuselage */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.8, 4.5, 6]} />
            <meshStandardMaterial
              color={bodyColor}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          {/* Swept Delta Wings */}
          <mesh position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
            <boxGeometry args={[5.5, 0.15, 2.2]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} />
          </mesh>
          {/* Engine Thruster Glow */}
          <mesh position={[0, 0, 2.3]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#ff3300" />
          </mesh>
          <pointLight color="#ff3300" intensity={2} distance={15} />
        </group>
      ) : contact.type === 'swarm' ? (
        // Agile Compact Swarm Quad
        <group scale={1.8}>
          <mesh>
            <sphereGeometry args={[0.9, 8, 8]} />
            <meshStandardMaterial color={bodyColor} metalness={0.8} />
          </mesh>
          {/* Red/Amber Navigation Strobe */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.25, 6, 6]} />
            <meshBasicMaterial color={isHostile ? '#ff2233' : '#00ff9c'} />
          </mesh>
          {/* Quad arms */}
          <mesh rotation={[0, 0.78, 0]}>
            <boxGeometry args={[3.2, 0.12, 0.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh rotation={[0, -0.78, 0]}>
            <boxGeometry args={[3.2, 0.12, 0.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      ) : contact.type === 'recon' ? (
        // High-Altitude Recon Wing with Dual Sensor Pods
        <group scale={3.2}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 5, 8]} />
            <meshStandardMaterial color={bodyColor} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[9, 0.12, 1.2]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Optical Gimbal Pod */}
          <mesh position={[0, -0.6, -1.8]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#00e5ff" metalness={0.9} />
          </mesh>
        </group>
      ) : (
        // Commercial / Friendly Quadcopter
        <group scale={2.2}>
          <mesh>
            <boxGeometry args={[1.2, 0.4, 1.2]} />
            <meshStandardMaterial color={bodyColor} />
          </mesh>
          {/* Arms & Rotors */}
          <group ref={rotorRef}>
            <mesh position={[1.4, 0.3, 1.4]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05, 8]} />
              <meshBasicMaterial color="#94a3b8" wireframe />
            </mesh>
            <mesh position={[-1.4, 0.3, 1.4]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05, 8]} />
              <meshBasicMaterial color="#94a3b8" wireframe />
            </mesh>
            <mesh position={[1.4, 0.3, -1.4]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05, 8]} />
              <meshBasicMaterial color="#94a3b8" wireframe />
            </mesh>
            <mesh position={[-1.4, 0.3, -1.4]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05, 8]} />
              <meshBasicMaterial color="#94a3b8" wireframe />
            </mesh>
          </group>
        </group>
      )}

      {/* Target Status Indicator when destroyed or jammed */}
      {contact.status === 'destroyed' && (
        <group>
          <mesh>
            <sphereGeometry args={[6, 12, 12]} />
            <meshBasicMaterial color="#ff5500" transparent opacity={0.6} />
          </mesh>
          <pointLight color="#ff4400" intensity={4} distance={40} />
        </group>
      )}
      {contact.status === 'jammed' && (
        <mesh>
          <sphereGeometry args={[4, 10, 10]} />
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

// Weather Particle Rain / Dust
function WeatherParticles({ weather }: { weather: WeatherType }) {
  const count = weather === 'rain' ? 800 : weather === 'dust' ? 400 : 0;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800;
      pos[i * 3 + 1] = Math.random() * 150;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return [pos];
  }, [count]);

  useFrame((_, dt) => {
    if (!pointsRef.current || count === 0) return;
    const pos = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - (weather === 'rain' ? dt * 140 : dt * 25);
      if (y < 0) y = 150;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={weather === 'rain' ? 0.8 : 1.6}
        color={weather === 'rain' ? '#7dd3fc' : '#d97706'}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export function Scene3D() {
  const {
    currentScenario,
    contacts,
    selectedContactId,
    selectContact,
    cameraMode,
    zoomLevel,
    lowQualityMode,
  } = useSimulationStore();

  const timeOfDay: TimeOfDay = currentScenario?.timeOfDay || 'day';
  const terrain: TerrainType = currentScenario?.terrain || 'rural';
  const weather: WeatherType = currentScenario?.weather || 'clear';
  const isThermal = cameraMode === 'IR';

  // Sky and ambient light colors tailored to time of day
  const skyConfig = useMemo(() => {
    switch (timeOfDay) {
      case 'night':
        return {
          bg: '#030712',
          ambientColor: '#0f172a',
          ambientIntensity: 0.35,
          sunColor: '#38bdf8',
          sunIntensity: 0.4,
          sunPos: [20, 80, 20] as [number, number, number],
          fogColor: '#030712',
          fogDensity: weather === 'fog' ? 0.0035 : 0.0006,
        };
      case 'dusk':
        return {
          bg: '#1c1917',
          ambientColor: '#78350f',
          ambientIntensity: 0.8,
          sunColor: '#f97316',
          sunIntensity: 1.8,
          sunPos: [-200, 35, -100] as [number, number, number],
          fogColor: '#292524',
          fogDensity: weather === 'fog' ? 0.003 : 0.0005,
        };
      case 'dawn':
        return {
          bg: '#1e1b4b',
          ambientColor: '#4338ca',
          ambientIntensity: 0.7,
          sunColor: '#fbbf24',
          sunIntensity: 1.6,
          sunPos: [200, 30, 100] as [number, number, number],
          fogColor: '#1e1b4b',
          fogDensity: weather === 'fog' ? 0.0035 : 0.0005,
        };
      case 'day':
      default:
        return {
          bg: '#080d1a',
          ambientColor: '#1e293b',
          ambientIntensity: 0.9,
          sunColor: '#f8fafc',
          sunIntensity: 2.2,
          sunPos: [150, 220, 100] as [number, number, number],
          fogColor: '#080d1a',
          fogDensity: weather === 'fog' ? 0.003 : 0.0004,
        };
    }
  }, [timeOfDay, weather]);

  const activeVisibleContacts = contacts.filter((c) => c.status !== 'escaped');

  return (
    <div
      className={`relative w-full h-full select-none ${
        isThermal ? 'filter contrast-150 brightness-110' : ''
      }`}
    >
      <Canvas
        shadows={!lowQualityMode}
        dpr={[1, lowQualityMode ? 1.0 : 1.5]}
        camera={{ position: [0, 22, 0.1], fov: 65 }}
        gl={{ antialias: !lowQualityMode, alpha: false }}
      >
        <color attach="background" args={[skyConfig.bg]} />
        <fogExp2 attach="fog" args={[skyConfig.fogColor, skyConfig.fogDensity]} />

        {/* Camera Watch-Post Rig */}
        <CameraRig zoomLevel={zoomLevel} />

        {/* Lighting */}
        <ambientLight
          color={skyConfig.ambientColor}
          intensity={skyConfig.ambientIntensity}
        />
        <directionalLight
          position={skyConfig.sunPos}
          intensity={skyConfig.sunIntensity}
          color={skyConfig.sunColor}
          castShadow={!lowQualityMode}
        />

        {/* Stars at night */}
        {timeOfDay === 'night' && <Stars radius={800} depth={80} count={2500} />}

        {/* Base and Watch Tower */}
        <ProtectedBase />

        {/* Terrain or Urban Environment */}
        {terrain === 'urban' ? (
          <group>
            <UrbanBuildings />
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.1, 0]}
              receiveShadow
            >
              <planeGeometry args={[3000, 3000]} />
              <meshStandardMaterial color="#0b0f19" roughness={0.9} />
            </mesh>
          </group>
        ) : (
          <ProceduralTerrain terrain={terrain} />
        )}

        {/* Weather particle effect */}
        <WeatherParticles weather={weather} />

        {/* In-flight Drone Contacts */}
        {activeVisibleContacts.map((contact) => (
          <DroneItem
            key={contact.id}
            contact={contact}
            isSelected={contact.id === selectedContactId}
            onClick={() => selectContact(contact.id)}
            isThermal={isThermal}
          />
        ))}
      </Canvas>
    </div>
  );
}
