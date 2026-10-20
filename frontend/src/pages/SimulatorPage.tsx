import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { getScenarioById, SCRIPTED_SCENARIOS } from '../scenarios';
import { Scene3D } from '../components/simulator/Scene3D';
import { RadarPPI } from '../components/simulator/RadarPPI';
import { ThermalCameraView } from '../components/simulator/ThermalCameraView';
import { ContactList } from '../components/simulator/ContactList';
import { HUDHeader } from '../components/simulator/HUDHeader';
import { TutorialOverlay } from '../components/simulator/TutorialOverlay';
import { generateScenario } from '../engine/generator';

export default function SimulatorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    currentScenario,
    missionActive,
    loadScenario,
    startMission,
    stepSimulation,
    scoreResult,
  } = useSimulationStore();

  const reqRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const accumulatorRef = useRef<number>(0);

  // Initialize scenario if not loaded or mismatch
  useEffect(() => {
    if (!id) return;
    if (!currentScenario || currentScenario.id !== id) {
      let sc = getScenarioById(id);
      if (!sc) {
        if (id.startsWith('proc-')) {
          const seed = parseInt(id.replace('proc-', ''), 10) || 12345;
          sc = generateScenario({ seed });
        } else {
          sc = SCRIPTED_SCENARIOS[0];
        }
      }
      loadScenario(sc);
      startMission();
    }
  }, [id, currentScenario, loadScenario, startMission]);

  // Fixed timestep game loop (dt = 0.05s / 20 Hz)
  useEffect(() => {
    const fixedDt = 0.05;

    const loop = (now: number) => {
      const elapsed = Math.min(0.2, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      accumulatorRef.current += elapsed;

      while (accumulatorRef.current >= fixedDt) {
        stepSimulation(fixedDt);
        accumulatorRef.current -= fixedDt;
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    reqRef.current = requestAnimationFrame(loop);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [stepSimulation]);

  // Auto-redirect to debrief on score generation
  useEffect(() => {
    if (scoreResult) {
      navigate(`/debrief/${scoreResult.sessionId}`);
    }
  }, [scoreResult, navigate]);

  return (
    <div className="relative w-screen h-[calc(100vh-57px)] bg-hud-bg overflow-hidden flex flex-col font-mono select-none">
      {/* Top HUD Bar */}
      <HUDHeader />

      {/* Main Tactical Workspace: 3D Scene + Right Panels */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* 3D Airspace Viewport */}
        <div className="relative flex-1 h-full bg-black">
          <Scene3D />

          {/* Guided Tutorial Overlay (Orientation drill) */}
          <TutorialOverlay />

          {/* HUD Crosshairs in center of screen */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-16 h-16 border border-hud-green/30 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-hud-green/80 rounded-full" />
              <div className="absolute w-full h-px bg-hud-green/20" />
              <div className="absolute h-full w-px bg-hud-green/20" />
            </div>
          </div>
        </div>

        {/* Right HUD Tactical Instrument Panel */}
        <div className="w-[380px] lg:w-[420px] h-full bg-hud-bg/95 border-l border-hud-border flex flex-col justify-between p-2.5 gap-2.5 overflow-hidden z-10 shadow-2xl">
          {/* Radar PPI Scope */}
          <RadarPPI />

          {/* Optical & Acoustic Cues */}
          <ThermalCameraView />

          {/* Contact Table & Trainee Action Panel */}
          <div className="flex-1 min-h-0">
            <ContactList />
          </div>
        </div>
      </div>
    </div>
  );
}
