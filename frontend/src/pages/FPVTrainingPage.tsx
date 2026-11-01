// DRISHTI: Experience A — FPV Flight Familiarization Workstation
// Stage 3: Operator Training Experiences

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPERATOR_EXPERIENCES, FPV_CHECKPOINT_GATES } from '../data/operatorTrainingData';
import { FPVCheckpointGate, OperatorTrainingAssessment } from '../types/operatorTraining';
import { TrainingBriefingModal } from '../components/training/shared/TrainingBriefingModal';
import { TrainingHUD } from '../components/training/shared/TrainingHUD';
import { TrainingCompletionModal } from '../components/training/shared/TrainingCompletionModal';
import { FPVFlightWorld } from '../components/training/fpv/FPVFlightWorld';
import { FPVCockpitHUD } from '../components/training/fpv/FPVCockpitHUD';
import { Keyboard, Crosshair, ArrowRight, Shield } from 'lucide-react';

export const FPVTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const experience = OPERATOR_EXPERIENCES['fpv-flight'];

  // State
  const [phase, setPhase] = useState<'BRIEFING' | 'FLYING' | 'COMPLETED'>('BRIEFING');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);

  // Gates State
  const [gates, setGates] = useState<FPVCheckpointGate[]>(() =>
    FPV_CHECKPOINT_GATES.map((g) => ({ ...g }))
  );
  const [activeGateIndex, setActiveGateIndex] = useState<number>(0);
  const [collisionCount, setCollisionCount] = useState<number>(0);

  // Live Telemetry from 3D World
  const [telemetry, setTelemetry] = useState({
    altitude: 3.5,
    speed: 0,
    headingDeg: 0,
    pitchDeg: 0,
    rollDeg: 0,
    throttlePct: 45,
    dronePos: [0, 3.5, 0] as [number, number, number],
    collisionWarning: false,
  });

  // Elapsed Timer
  useEffect(() => {
    if (phase !== 'FLYING' || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTimeSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Handle Gate Clearance
  const handleGateCleared = (index: number) => {
    if (index !== activeGateIndex) return;

    setGates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], cleared: true, timeSec: elapsedTimeSec };
      return updated;
    });

    if (index + 1 < gates.length) {
      setActiveGateIndex(index + 1);
    } else {
      // All 5 gates cleared! Drill Complete!
      setTimeout(() => {
        setPhase('COMPLETED');
      }, 600);
    }
  };

  // Telemetry update callback
  const handleTelemetryUpdate = (t: typeof telemetry) => {
    setTelemetry(t);
    if (t.collisionWarning) {
      setCollisionCount((prev) => prev + 1);
    }
  };

  // Reset/Restart Drill
  const handleRestart = () => {
    setGates(FPV_CHECKPOINT_GATES.map((g) => ({ ...g })));
    setActiveGateIndex(0);
    setElapsedTimeSec(0);
    setCollisionCount(0);
    setIsPaused(false);
    setPhase('FLYING');
  };

  // Compute Explainable Assessment
  const computeAssessment = (): OperatorTrainingAssessment => {
    const clearedCount = gates.filter((g) => g.cleared).length;
    
    // Objective score: up to 400 pts (80 pts per gate)
    const objectiveScore = clearedCount * 80;

    // Handling stability: up to 300 pts, penalty for collisions
    const handlingScore = Math.max(100, Math.round(300 - Math.min(200, collisionCount * 4)));

    // Time efficiency: up to 300 pts (decay after 60s)
    const timeBonusScore = Math.max(80, Math.round(Math.max(0, 1 - (elapsedTimeSec - 30) / 90) * 300));

    const total = objectiveScore + handlingScore + timeBonusScore;

    let rankRating: OperatorTrainingAssessment['rankRating'] = 'Remedial Practice Required';
    if (total >= 880) rankRating = 'Distinguished Operator';
    else if (total >= 720) rankRating = 'Proficient Pilot';
    else if (total >= 500) rankRating = 'Qualified';

    return {
      totalScore: total,
      handlingScore,
      objectiveScore,
      timeBonusScore,
      durationSec: elapsedTimeSec,
      rankRating,
      metricsSummary: [
        { label: 'Gates Cleared', value: `${clearedCount} / ${gates.length}`, quality: clearedCount === 5 ? 'optimal' : 'good' },
        { label: 'Course Completion Time', value: `${elapsedTimeSec} seconds`, quality: elapsedTimeSec < 60 ? 'optimal' : 'good' },
        { label: 'Terrain Bounces / Warnings', value: `${collisionCount}`, quality: collisionCount === 0 ? 'optimal' : 'good' },
        { label: 'Average Airspeed', value: `${telemetry.speed.toFixed(1)} m/s`, quality: 'optimal' },
        { label: 'Flight Stability Index', value: `${Math.round((handlingScore / 300) * 100)}%`, quality: handlingScore > 240 ? 'optimal' : 'good' },
        { label: 'Airframe Integrity', value: '100% Operational', quality: 'optimal' },
      ],
      detailedFeedback: [
        `Successfully piloted through ${clearedCount} of ${gates.length} aerial waypoint gates on Sector 4 Proving Grounds.`,
        collisionCount === 0
          ? 'Demonstrated exemplary altitude discipline with zero ground contact warnings.'
          : `Recorded ${collisionCount} minor altitude corrections near ground boundary.`,
        `Maintained smooth turn coordinated yaw through slaloms and elevation transitions.`,
      ],
      improvementSuggestions: [
        'Practice gentle counter-banking with [A] and [D] when exiting high-speed turns to arrest drift.',
        'Use short pulse inputs on [Space] rather than holding throttle continuously to maintain stable level flight.',
      ],
    };
  };

  const clearedCount = gates.filter((g) => g.cleared).length;
  const progressPercent = (clearedCount / gates.length) * 100;

  return (
    <div className="h-full w-full relative flex flex-col bg-[#060A06] overflow-hidden select-none font-mono">
      
      {/* 1. Tactical HUD Header */}
      <TrainingHUD
        experience={experience}
        elapsedTimeSec={elapsedTimeSec}
        isPaused={isPaused}
        progressText={`GATES CLEARED: ${clearedCount}/${gates.length}`}
        progressPercent={progressPercent}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
        onExit={() => navigate('/training')}
        onToggleControls={() => setShowControlsGuide(!showControlsGuide)}
        showControlsGuide={showControlsGuide}
      />

      {/* 2. Interactive 3D FPV Simulation Viewport */}
      <div className="flex-1 relative w-full h-full min-h-0">
        <FPVFlightWorld
          gates={gates}
          activeGateIndex={activeGateIndex}
          isPaused={isPaused || phase !== 'FLYING'}
          onGateCleared={handleGateCleared}
          onTelemetryUpdate={handleTelemetryUpdate}
        />

        {/* In-Flight Cockpit HUD */}
        {phase === 'FLYING' && (
          <FPVCockpitHUD
            altitude={telemetry.altitude}
            speed={telemetry.speed}
            headingDeg={telemetry.headingDeg}
            pitchDeg={telemetry.pitchDeg}
            rollDeg={telemetry.rollDeg}
            throttlePct={telemetry.throttlePct}
            activeGateIndex={activeGateIndex}
            gates={gates}
            collisionWarning={telemetry.collisionWarning}
            dronePos={telemetry.dronePos}
          />
        )}

        {/* Floating Contextual Instruction Pill (Bottom Center) */}
        {phase === 'FLYING' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
            <div className="bg-[#0D120B]/90 backdrop-blur-md px-5 py-2 rounded-full border border-emerald-500/40 text-emerald-300 text-xs shadow-lg flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 animate-spin" />
              <span>
                Fly through {gates[activeGateIndex]?.label || 'Gate'}. Use [W/A/S/D] to steer, [Q/E] to yaw.
              </span>
            </div>
          </div>
        )}

        {/* Optional Control Key Guide Overlay */}
        {showControlsGuide && (
          <div className="absolute top-4 right-4 z-40 bg-[#0A0E0A]/95 backdrop-blur-md border border-[#384337] p-4 rounded-xl text-xs space-y-2 shadow-2xl max-w-xs font-mono">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-[#2D382B] pb-2">
              <span className="flex items-center gap-1.5">
                <Keyboard className="w-4 h-4" />
                FPV Flight Controls
              </span>
              <button
                onClick={() => setShowControlsGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">W / S</span>
                <span>Pitch Forward / Reverse</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">A / D</span>
                <span>Strafe Roll Left / Right</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">SPACE</span>
                <span>Throttle Up (Ascend)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">SHIFT</span>
                <span>Throttle Down (Descend)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">Q / E</span>
                <span>Yaw Rotate Left / Right</span>
              </div>
            </div>
          </div>
        )}

        {/* Briefing Screen */}
        <TrainingBriefingModal
          experience={experience}
          isOpen={phase === 'BRIEFING'}
          onStart={() => setPhase('FLYING')}
          onExit={() => navigate('/training')}
        />

        {/* Completion Screen & Assessment */}
        {phase === 'COMPLETED' && (
          <TrainingCompletionModal
            experience={experience}
            assessment={computeAssessment()}
            onRestart={handleRestart}
            onReturnToHub={() => navigate('/training')}
            onNextExperience={() => navigate('/training/indoor')}
          />
        )}

      </div>

    </div>
  );
};

export default FPVTrainingPage;
