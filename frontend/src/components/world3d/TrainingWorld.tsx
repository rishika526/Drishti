// DRISHTI: Genuinely Rendered 3D Tactical Simulation World
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPerspective, EnvironmentType, SimulatedTargetDef } from '../../types/simulation';
import { ENVIRONMENT_PRESETS } from '../../data/missions';
import { Terrain } from './Terrain';
import { Vegetation } from './Vegetation';
import { TacticalCompound } from './TacticalCompound';
import { UrbanEnvironment } from './UrbanEnvironment';
import { SimulatedDrone } from './SimulatedDrone';
import { MovingDroneGroup } from './MovingDroneGroup';
import { CameraController } from './CameraController';

interface TrainingWorldProps {
  perspective?: CameraPerspective;
  environmentId?: EnvironmentType;
  droneAltitude?: number;
  targets?: SimulatedTargetDef[];
  elapsedTimeSec?: number;
  isDetected?: boolean;
  onDetectTarget?: (id: string) => void;
  isNightVision?: boolean;
}

export const TrainingWorld: React.FC<TrainingWorldProps> = ({
  perspective = 'tactical_orbit',
  environmentId = 'rural_day',
  droneAltitude = 20,
  targets,
  elapsedTimeSec = 0,
  isDetected = false,
  onDetectTarget,
  isNightVision = false,
}) => {
  const envConfig = ENVIRONMENT_PRESETS[environmentId] || ENVIRONMENT_PRESETS.rural_day;
  const [leadPos, setLeadPos] = useState<[number, number, number]>([0, droneAltitude, 0]);

  const isUrban = environmentId === 'urban_day';
  const isNight = environmentId === 'border_night';

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0A0E0A] select-none">
      <Canvas
        shadows
        camera={{ position: [24, 28, 38], fov: 50, near: 0.1, far: 500 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNightVision ? 2.2 : 1.1,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Atmospheric Distance Fog */}
        <fog
          attach="fog"
          args={[
            isNightVision ? '#064E3B' : envConfig.lighting.fogColor,
            envConfig.lighting.fogNear,
            envConfig.lighting.fogFar,
          ]}
        />

        {/* Procedural Realistic Sky Dome */}
        {!isNight && (
          <Sky
            distance={450000}
            sunPosition={envConfig.lighting.sunPosition}
            turbidity={envConfig.lighting.skyTurbidity}
            rayleigh={envConfig.lighting.skyRayleigh}
            mieCoefficient={envConfig.lighting.skyMieCoefficient}
            mieDirectionalG={0.8}
          />
        )}

        {/* Natural Ambient Skylight */}
        <ambientLight
          color={isNightVision ? '#10B981' : envConfig.lighting.ambientColor}
          intensity={isNightVision ? 0.9 : envConfig.lighting.ambientIntensity}
        />

        {/* Hemisphere Light (Sky vs Ground Reflectance) */}
        <hemisphereLight
          args={[
            isNightVision ? '#34D399' : '#E8F0FE',
            isNightVision ? '#064E3B' : '#4A5844',
            0.55,
          ]}
          position={[0, 50, 0]}
        />

        {/* Directional Sun / Starlight with Soft Cascading Shadows */}
        <directionalLight
          position={envConfig.lighting.sunPosition}
          intensity={isNightVision ? 1.8 : envConfig.lighting.sunIntensity}
          color={isNightVision ? '#6EE7B7' : envConfig.lighting.sunColor}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={10}
          shadow-camera-far={260}
          shadow-camera-left={-65}
          shadow-camera-right={65}
          shadow-camera-top={65}
          shadow-camera-bottom={-65}
          shadow-bias={-0.0003}
        />

        {/* Ground Terrain: Urban Grid or Rural Rolling Hills */}
        {isUrban ? (
          <UrbanEnvironment />
        ) : (
          <>
            <Terrain environment={environmentId} />
            <Vegetation />
            <TacticalCompound />
          </>
        )}

        {/* Dynamic Target Drones or Single Drone Fallback */}
        {targets && targets.length > 0 ? (
          <MovingDroneGroup
            targets={targets}
            elapsedTimeSec={elapsedTimeSec}
            isDetected={isDetected}
            onDetectTarget={onDetectTarget}
            onLeadDronePosition={setLeadPos}
          />
        ) : (
          <SimulatedDrone
            position={[0, droneAltitude, 0]}
            altitude={droneAltitude}
            onPositionUpdate={setLeadPos}
          />
        )}

        {/* Tactical Camera Perspective System */}
        <CameraController
          perspective={perspective}
          dronePosition={leadPos}
        />
      </Canvas>
    </div>
  );
};
