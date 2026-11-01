// DRISHTI: Experience B — Indoor Drone Inspection Workstation
// Stage 3: Operator Training Experiences

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPERATOR_EXPERIENCES, INDOOR_INSPECTION_TARGETS } from '../data/operatorTrainingData';
import { IndoorTargetObject, OperatorTrainingAssessment } from '../types/operatorTraining';
import { TrainingBriefingModal } from '../components/training/shared/TrainingBriefingModal';
import { TrainingHUD } from '../components/training/shared/TrainingHUD';
import { TrainingCompletionModal } from '../components/training/shared/TrainingCompletionModal';
import { IndoorInspectionWorld } from '../components/training/indoor/IndoorInspectionWorld';
import { IndoorDroneCameraHUD } from '../components/training/indoor/IndoorDroneCameraHUD';
import { InspectionReportModal } from '../components/training/indoor/InspectionReportModal';
import { Keyboard } from 'lucide-react';

export const IndoorInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const experience = OPERATOR_EXPERIENCES['indoor-inspection'];

  // Workstation Workflow State
  const [phase, setPhase] = useState<'BRIEFING' | 'INSPECTING' | 'COMPLETED'>('BRIEFING');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);

  // Targets State
  const [targets, setTargets] = useState<IndoorTargetObject[]>(() =>
    INDOOR_INSPECTION_TARGETS.map((t) => ({ ...t }))
  );
  const [activeTargetForModal, setActiveTargetForModal] = useState<IndoorTargetObject | null>(null);
  const [targetInRange, setTargetInRange] = useState<IndoorTargetObject | null>(null);

  // Telemetry & Sensor State
  const [currentRoom, setCurrentRoom] = useState<string>('Central Inspection Corridor');
  const [isSpotlightOn, setIsSpotlightOn] = useState<boolean>(true);

  // Elapsed Timer
  useEffect(() => {
    if (phase !== 'INSPECTING' || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTimeSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Keyboard shortcut listener for 'F' (spotlight toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF') {
        setIsSpotlightOn((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save report for individual target
  const handleSaveReport = (
    targetId: string,
    loggedCondition: 'Normal' | 'Compromised' | 'Hazardous'
  ) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id === targetId) {
          const isCorrect = loggedCondition === t.hazardCondition;
          return {
            ...t,
            inspected: true,
            loggedCondition,
            isCorrect,
          };
        }
        return t;
      })
    );
    setActiveTargetForModal(null);
  };

  // Submit consolidated final inspection report
  const handleSubmitConsolidatedReport = () => {
    setPhase('COMPLETED');
  };

  // Restart Drill
  const handleRestart = () => {
    setTargets(INDOOR_INSPECTION_TARGETS.map((t) => ({ ...t })));
    setElapsedTimeSec(0);
    setIsPaused(false);
    setActiveTargetForModal(null);
    setTargetInRange(null);
    setPhase('INSPECTING');
  };

  // Compute Explainable Assessment
  const computeAssessment = (): OperatorTrainingAssessment => {
    const inspectedCount = targets.filter((t) => t.inspected).length;
    const correctCount = targets.filter((t) => t.isCorrect).length;

    // Objective completion (coverage of all 3 rooms): up to 400 pts
    const objectiveScore = Math.round((inspectedCount / targets.length) * 400);

    // Observation accuracy (correct hazard ratings): up to 300 pts
    const handlingScore = Math.round((correctCount / targets.length) * 300);

    // Time & systematic search bonus: up to 300 pts (decay after 90s)
    const timeBonusScore = Math.max(100, Math.round(Math.max(0, 1 - (elapsedTimeSec - 45) / 120) * 300));

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
        { label: 'Inspection Coverage', value: `${inspectedCount} / ${targets.length} Zones`, quality: inspectedCount === 3 ? 'optimal' : 'good' },
        { label: 'Observation Accuracy', value: `${correctCount} / ${targets.length} Correct`, quality: correctCount === 3 ? 'optimal' : 'good' },
        { label: 'Facility Inspection Time', value: `${elapsedTimeSec} seconds`, quality: elapsedTimeSec < 90 ? 'optimal' : 'good' },
        { label: 'Illumination Management', value: isSpotlightOn ? 'Active Spotlight' : 'Passive Optic', quality: 'optimal' },
        { label: 'Structural Clearance', value: 'Zero Wall Collisions', quality: 'optimal' },
        { label: 'Report Status', value: 'Consolidated & Verified', quality: 'optimal' },
      ],
      detailedFeedback: [
        `Inspected ${inspectedCount} of ${targets.length} designated infrastructure points across the Utility Room, Server Room, and Logistics Bay.`,
        correctCount === 3
          ? 'Identified all hazard classifications correctly: Main Breaker (Hazardous), Server Dossier (Compromised), and Battery Pallet (Normal).'
          : `Correctly classified ${correctCount} of 3 target conditions. Review the distinction between active electrical hazards and unsecured confidential assets.`,
        `Demonstrated safe confined space drone maneuvering under low ambient illumination.`,
      ],
      improvementSuggestions: [
        'Always toggle the forward spotlight [F] upon entering dark unlit rooms to identify scorch marks and loose wiring before close approach.',
        'Hover at 1.5m eye-level when scanning horizontal workbenches to avoid ground suction effects.',
      ],
    };
  };

  const inspectedCount = targets.filter((t) => t.inspected).length;
  const progressPercent = (inspectedCount / targets.length) * 100;

  return (
    <div className="h-full w-full relative flex flex-col bg-[#080C0A] overflow-hidden select-none font-mono">
      
      {/* 1. Tactical Workstation Top HUD */}
      <TrainingHUD
        experience={experience}
        elapsedTimeSec={elapsedTimeSec}
        isPaused={isPaused}
        progressText={`INSPECTED: ${inspectedCount}/${targets.length} TARGETS`}
        progressPercent={progressPercent}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
        onExit={() => navigate('/training')}
        onToggleControls={() => setShowControlsGuide(!showControlsGuide)}
        showControlsGuide={showControlsGuide}
      />

      {/* 2. Interactive 3D Indoor Facility Viewport */}
      <div className="flex-1 relative w-full h-full min-h-0">
        <IndoorInspectionWorld
          targets={targets}
          isSpotlightOn={isSpotlightOn}
          isPaused={isPaused || phase !== 'INSPECTING'}
          onTargetInRange={setTargetInRange}
          onRoomChange={setCurrentRoom}
          onInspectTargetKey={() => {
            if (targetInRange) {
              setActiveTargetForModal(targetInRange);
            }
          }}
        />

        {/* Indoor Camera Overlay */}
        {phase === 'INSPECTING' && (
          <IndoorDroneCameraHUD
            currentRoom={currentRoom}
            targets={targets}
            targetInRange={targetInRange}
            isSpotlightOn={isSpotlightOn}
            onToggleSpotlight={() => setIsSpotlightOn(!isSpotlightOn)}
            onInspectTarget={(tgt) => setActiveTargetForModal(tgt)}
            onSubmitConsolidatedReport={handleSubmitConsolidatedReport}
          />
        )}

        {/* Modal: Target Condition Logging */}
        {activeTargetForModal && (
          <InspectionReportModal
            target={activeTargetForModal}
            isOpen={true}
            onSaveReport={handleSaveReport}
            onClose={() => setActiveTargetForModal(null)}
          />
        )}

        {/* Optional Control Key Guide Overlay */}
        {showControlsGuide && (
          <div className="absolute top-4 right-4 z-40 bg-[#0A0E0A]/95 backdrop-blur-md border border-[#384337] p-4 rounded-xl text-xs space-y-2 shadow-2xl max-w-xs font-mono">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-[#2D382B] pb-2">
              <span className="flex items-center gap-1.5">
                <Keyboard className="w-4 h-4" />
                Indoor Inspection Controls
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
                <span>Corridor Translation (Forward/Back)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">A / D</span>
                <span>Lateral Strafe (Left/Right)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">SPACE / SHIFT</span>
                <span>Elevation (Ascend / Descend)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">Q / E</span>
                <span>Camera Yaw (Pan Left/Right)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">F</span>
                <span>Toggle Inspection Spotlight</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">E</span>
                <span>Inspect Target in Range</span>
              </div>
            </div>
          </div>
        )}

        {/* Briefing Screen */}
        <TrainingBriefingModal
          experience={experience}
          isOpen={phase === 'BRIEFING'}
          onStart={() => setPhase('INSPECTING')}
          onExit={() => navigate('/training')}
        />

        {/* Completion Screen & Assessment */}
        {phase === 'COMPLETED' && (
          <TrainingCompletionModal
            experience={experience}
            assessment={computeAssessment()}
            onRestart={handleRestart}
            onReturnToHub={() => navigate('/training')}
            onNextExperience={() => navigate('/training/aerial')}
          />
        )}

      </div>

    </div>
  );
};

export default IndoorInspectionPage;
