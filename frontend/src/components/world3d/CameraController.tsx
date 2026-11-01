// DRISHTI: Tactical Camera Management System
// Stage 1: Visual Foundation & 3D World

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPerspective } from '../../types/simulation';

interface CameraControllerProps {
  perspective: CameraPerspective;
  dronePosition: [number, number, number];
}

export const CameraController: React.FC<CameraControllerProps> = ({
  perspective,
  dronePosition,
}) => {
  const { camera } = useThree();
  const orbitRef = useRef<any>(null);

  // Desired camera state targets
  const targetCamPos = useRef(new THREE.Vector3(25, 28, 38));
  const targetLookAt = useRef(new THREE.Vector3(0, 18, 0));

  useEffect(() => {
    // Configure targets when perspective changes
    const [dx, dy, dz] = dronePosition;

    if (perspective === 'tactical_orbit') {
      targetCamPos.current.set(dx + 22, dy + 10, dz + 28);
      targetLookAt.current.set(dx, dy, dz);
      if (orbitRef.current) {
        orbitRef.current.enabled = true;
        orbitRef.current.maxPolarAngle = Math.PI / 2 - 0.04;
        orbitRef.current.minDistance = 8;
        orbitRef.current.maxDistance = 140;
      }
    } else if (perspective === 'aerial_overview') {
      targetCamPos.current.set(0, 130, 2);
      targetLookAt.current.set(0, 0, 0);
      if (orbitRef.current) {
        orbitRef.current.enabled = true;
        orbitRef.current.maxPolarAngle = Math.PI / 2.2;
        orbitRef.current.minDistance = 30;
        orbitRef.current.maxDistance = 220;
      }
    } else if (perspective === 'drone_fpv') {
      // First-Person Camera directly mounted beneath drone gimbal
      targetCamPos.current.set(dx, dy - 0.35, dz + 0.65);
      targetLookAt.current.set(dx, dy - 4, dz + 35);
      if (orbitRef.current) {
        // Disable orbit controls in FPV to lock to drone camera axis
        orbitRef.current.enabled = false;
      }
    }
  }, [perspective, dronePosition]);

  useFrame((_, delta) => {
    const [dx, dy, dz] = dronePosition;
    const lerpSpeed = Math.min(1, delta * 4.5);

    if (perspective === 'drone_fpv') {
      // Strict FPV lock follows drone motion precisely
      const fpvPos = new THREE.Vector3(dx, dy - 0.35, dz + 0.65);
      const fpvLook = new THREE.Vector3(dx, dy - 4, dz + 40);
      camera.position.lerp(fpvPos, 0.4);
      camera.lookAt(fpvLook);
    } else if (perspective === 'aerial_overview') {
      camera.position.lerp(targetCamPos.current, lerpSpeed);
      if (orbitRef.current) {
        orbitRef.current.target.lerp(targetLookAt.current, lerpSpeed);
        orbitRef.current.update();
      }
    } else {
      // Tactical Orbit
      if (orbitRef.current) {
        const droneVec = new THREE.Vector3(dx, dy, dz);
        orbitRef.current.target.lerp(droneVec, lerpSpeed * 0.5);
        orbitRef.current.update();
      }
    }
  });

  return (
    <DreiOrbitControls
      ref={orbitRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
    />
  );
};
