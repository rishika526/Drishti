// DRISHTI: Core Counter-Drone Threat Simulation Workstation (Stage 2)
// Implements 5-Phase Mission Workflow: Briefing -> Observation -> Classification -> Response -> Assessment

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CameraPerspective,
  EnvironmentType,
  SimulationPhase,
  DroneClassification,
  DefensiveResponse,
  SimulationEvent,
  MissionScoreBreakdown,
} from '../types/simulation';
import { getCounterDroneScenario, COUNTER_DRONE_SCENARIOS } from '../data/counterDroneScenarios';
import { TrainingWorld } from '../components/world3d/TrainingWorld';
import { ViewportOverlay } from '../components/simulation/ViewportOverlay';
import { BriefingModal } from '../components/simulation/BriefingModal';
import { ObservationPanel } from '../components/simulation/ObservationPanel';
import { ThreatResponsePanel } from '../components/simulation/ThreatResponsePanel';
import { AssessmentReportModal } from '../components/simulation/AssessmentReportModal';
import { EventFeed } from '../components/simulation/EventFeed';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Crosshair,
  ShieldAlert,
  Moon,
  ChevronDown,
} from 'lucide-react';

export const ThreatSimulationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Load Active Scenario
  const scenario = getCounterDroneScenario(id);

  // Workflow State Management
  const [phase, setPhase] = useState<SimulationPhase>('BRIEFING');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);

  // Trainee Actions & Detection State
  const [isDetected, setIsDetected] = useState<boolean>(false);
  const [detectionTimeSec, setDetectionTimeSec] = useState<number | null>(null);
  const [submittedClassification, setSubmittedClassification] = useState<DroneClassification | null>(null);
  const [submittedResponse, setSubmittedResponse] = useState<DefensiveResponse | null>(null);

  // Environment & Viewport State
  const [perspective, setPerspective] = useState<CameraPerspective>('tactical_orbit');
  const [environmentId, setEnvironmentId] = useState<EnvironmentType>(scenario.environment);
  const [isNightVision, setIsNightVision] = useState<boolean>(false);

  // Operational Event Feed
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  // Synchronize scenario environment when route changes
  useEffect(() => {
    setEnvironmentId(scenario.environment);
    setPhase('BRIEFING');
    setIsPaused(false);
    setElapsedTimeSec(0);
    setIsDetected(false);
    setDetectionTimeSec(null);
    setSubmittedClassification(null);
    setSubmittedResponse(null);
    setEvents([
      {
        id: `ev-${Date.now()}-0`,
        timestampSec: 0,
        type: 'INFO',
        message: `Scenario "${scenario.codename}" initialized. Ready for briefing.`,
      },
    ]);
  }, [id, scenario]);

  // Simulation Clock Tick (runs during OBSERVING phase when not paused)
  useEffect(() => {
    if (phase === 'OBSERVING' && !isPaused) {
      const interval = setInterval(() => {
        setElapsedTimeSec((prev) => {
          const next = prev + 0.1;
          // Spawn events
          scenario.targets.forEach((t) => {
            if (Math.abs(next - t.spawnDelaySec) < 0.1) {
              setEvents((evs) => [
                ...evs,
                {
                  id: `ev-${Date.now()}-${t.id}`,
                  timestampSec: Math.round(next * 10) / 10,
                  type: 'INFO',
                  message: `Radar return: Unidentified object entered sector (${t.label})`,
                },
              ]);
            }
          });
          return next;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase, isPaused, scenario.targets]);

  // Handler: Start Mission (Phase A -> Phase B)
  const handleStartMission = () => {
    setPhase('OBSERVING');
    setElapsedTimeSec(0);
    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-start`,
        timestampSec: 0,
        type: 'INFO',
        message: 'Mission timer started. Trainee observing airspace.',
      },
    ]);
  };

  // Handler: Trainee Detects Suspected Object (Phase B -> Phase C)
  const handleDetectObject = () => {
    if (isDetected || phase !== 'OBSERVING') return;

    const recordedTime = Math.max(0.1, Math.round(elapsedTimeSec * 10) / 10);
    setIsDetected(true);
    setDetectionTimeSec(recordedTime);
    setPhase('CLASSIFYING');

    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-detect`,
        timestampSec: recordedTime,
        type: 'DETECTION',
        message: `Object detected and reported by trainee at ${recordedTime}s`,
      },
    ]);
  };

  // Handler: Trainee Submits Classification (Phase C)
  const handleSubmitClassification = (classification: DroneClassification) => {
    setSubmittedClassification(classification);
    const isAccurate = classification === scenario.expectedClassification;

    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-class`,
        timestampSec: Math.round(elapsedTimeSec * 10) / 10,
        type: 'CLASSIFICATION',
        message: `Classification submitted: "${classification.replace('_', ' ').toUpperCase()}" (${isAccurate ? 'ACCURATE' : 'SUB-OPTIMAL'})`,
      },
    ]);
  };

  // Handler: Proceed to Response (Phase C -> Phase D)
  const handleProceedToResponse = () => {
    setPhase('RESPONDING');
  };

  // Handler: Trainee Submits Defensive Response (Phase D)
  const handleSubmitResponse = (resp: DefensiveResponse) => {
    setSubmittedResponse(resp);
    const quality = scenario.responseOptionsExpl[resp]?.quality || 'inappropriate';

    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-resp`,
        timestampSec: Math.round(elapsedTimeSec * 10) / 10,
        type: 'RESPONSE',
        message: `Defensive action executed: "${resp.replace(/_/g, ' ').toUpperCase()}" (${quality.toUpperCase()})`,
      },
    ]);
  };

  // Handler: Complete Mission (Phase D -> Phase E)
  const handleCompleteMission = () => {
    setPhase('COMPLETED');
    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-done`,
        timestampSec: Math.round(elapsedTimeSec * 10) / 10,
        type: 'INFO',
        message: 'Exercise concluded. Evaluating trainee decision trail.',
      },
    ]);
  };

  // Calculate Explainable Score Breakdown
  const computeScore = (): MissionScoreBreakdown => {
    const dTime = detectionTimeSec || 15;
    // Faster detection awards up to 300 points (linear decay from 0 to 30 seconds)
    const detectionScore = Math.max(100, Math.round(Math.max(0, 1 - dTime / 30) * 300));

    // Classification score (accurate: 350, sub-optimal: 100)
    const isClassAccurate = submittedClassification === scenario.expectedClassification;
    const classificationScore = isClassAccurate ? 350 : 100;

    // Response score (optimal: 350, sub-optimal: 180, inappropriate: 50)
    const respQuality = scenario.responseOptionsExpl[submittedResponse || 'continue_monitoring']?.quality || 'suboptimal';
    const responseScore = respQuality === 'optimal' ? 350 : respQuality === 'suboptimal' ? 180 : 50;

    const total = detectionScore + classificationScore + responseScore;

    let rankRating: MissionScoreBreakdown['rankRating'] = 'Retraining Recommended';
    if (total >= 900) rankRating = 'Exemplary Defense';
    else if (total >= 750) rankRating = 'Tactically Proficient';
    else if (total >= 500) rankRating = 'Qualified Operator';

    return {
      totalScore: total,
      detectionScore,
      classificationScore,
      responseScore,
      detectionTimeSec: dTime,
      classificationAccurate: isClassAccurate,
      responseQuality: respQuality,
      rankRating,
    };
  };

  // Format MM:SS
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full relative flex flex-col bg-[#0A0E0A] overflow-hidden select-none font-mono">
      
      {/* 1. Tactical Workstation Top Control Bar */}
      <div className="bg-[#141B12] border-b border-[#384337] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-30">
        
        {/* Left: Return & Scenario Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-300 hover:text-white transition-colors"
            title="Return to Training Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white font-sans">
              {scenario.title}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-military-sand/20 border border-[#43503E] text-[10px] text-military-sand font-bold">
              {scenario.difficulty}
            </span>
          </div>

          {/* Quick Scenario Switcher */}
          <select
            value={scenario.id}
            onChange={(e) => navigate(`/sim/${e.target.value}`)}
            className="bg-[#1E251C] border border-[#384337] text-xs text-slate-300 rounded px-2 py-1 outline-none font-sans cursor-pointer hover:border-slate-500"
          >
            {Object.values(COUNTER_DRONE_SCENARIOS).map((sc) => (
              <option key={sc.id} value={sc.id}>
                Switch Scenario: {sc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Timer, Phase Badge, Simulation Controls */}
        <div className="flex items-center gap-4 text-xs">
          
          {/* Mission Progress Phase Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1A2118] border border-[#384337] text-slate-300">
            <span className="text-slate-500">PHASE:</span>
            <span className="font-bold text-amber-400">{phase}</span>
          </div>

          {/* Live Mission Elapsed Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1A2118] border border-[#384337] text-slate-300">
            <span className="text-slate-500">TIMER:</span>
            <span className="font-bold text-white text-sm">
              {formatTimer(elapsedTimeSec)}
            </span>
          </div>

          {/* Night Vision / FLIR Optic Toggle */}
          {scenario.environment === 'border_night' && (
            <button
              onClick={() => setIsNightVision(!isNightVision)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${
                isNightVision
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-[#1A2118] text-slate-400 border-[#384337]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{isNightVision ? 'NVG OPTIC: ON' : 'NVG OPTIC: OFF'}</span>
            </button>
          )}

          {/* Simulation Controls: Pause/Resume, Reset */}
          <div className="flex items-center gap-1.5 border-l border-[#384337] pl-3">
            {phase === 'OBSERVING' && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-200 transition-colors"
                title={isPaused ? 'Resume Exercise' : 'Pause Exercise'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => {
                setPhase('BRIEFING');
                setIsPaused(false);
                setElapsedTimeSec(0);
                setIsDetected(false);
                setDetectionTimeSec(null);
                setSubmittedClassification(null);
                setSubmittedResponse(null);
              }}
              className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-200 transition-colors"
              title="Reset Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. Main 3D Viewport with Realistic Moving Targets */}
      <div className="flex-1 relative w-full h-full">
        <TrainingWorld
          perspective={perspective}
          environmentId={environmentId}
          targets={scenario.targets}
          elapsedTimeSec={elapsedTimeSec}
          isDetected={isDetected}
          onDetectTarget={handleDetectObject}
          isNightVision={isNightVision}
        />

        {/* Viewport Overlay Controls & HUD */}
        <ViewportOverlay
          perspective={perspective}
          onPerspectiveChange={setPerspective}
          environmentId={environmentId}
          onEnvironmentChange={setEnvironmentId}
          missionCodename={scenario.codename}
        />

        {/* Live Event & Alert Feed (Bottom-Right) */}
        <div className="absolute bottom-16 right-4 z-20 pointer-events-auto">
          <EventFeed events={events} />
        </div>

        {/* Contextual Guidance & Primary Detection Action (Active during Phase B: OBSERVING) */}
        {phase === 'OBSERVING' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center gap-2">
            
            {/* Context Instruction Banner */}
            <div className="bg-[#141B12]/90 backdrop-blur-md px-4 py-1.5 rounded border border-[#384337] text-slate-300 text-xs text-center font-sans">
              Scan the 3D airspace using mouse drag. Click the button or target as soon as you spot the intruder.
            </div>

            {/* Prominent Detect / Report Action Button */}
            <button
              onClick={handleDetectObject}
              className="px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-widest uppercase flex items-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
            >
              <Crosshair className="w-5 h-5 animate-pulse" />
              <span>DETECT / REPORT OBJECT</span>
            </button>
          </div>
        )}

        {/* Phase C Modal: Observation & Classification Panel */}
        {phase === 'CLASSIFYING' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <ObservationPanel
              scenario={scenario}
              detectionTimeSec={detectionTimeSec || 0}
              submittedClassification={submittedClassification}
              onSubmitClassification={handleSubmitClassification}
              onProceedToResponse={handleProceedToResponse}
            />
          </div>
        )}

        {/* Phase D Modal: Threat Assessment & Defensive Response Panel */}
        {phase === 'RESPONDING' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <ThreatResponsePanel
              scenario={scenario}
              classification={submittedClassification || scenario.expectedClassification}
              submittedResponse={submittedResponse}
              onSubmitResponse={handleSubmitResponse}
              onCompleteMission={handleCompleteMission}
            />
          </div>
        )}

        {/* Phase E Modal: Explainable Assessment Report */}
        {phase === 'COMPLETED' && (
          <AssessmentReportModal
            scenario={scenario}
            score={computeScore()}
            selectedClassification={submittedClassification || scenario.expectedClassification}
            selectedResponse={submittedResponse || scenario.expectedResponse}
            events={events}
            onRestart={() => {
              setPhase('BRIEFING');
              setIsPaused(false);
              setElapsedTimeSec(0);
              setIsDetected(false);
              setDetectionTimeSec(null);
              setSubmittedClassification(null);
              setSubmittedResponse(null);
            }}
            onReturnToHub={() => navigate('/')}
          />
        )}

        {/* Phase A Modal: Mission Briefing */}
        <BriefingModal
          scenario={scenario}
          isOpen={phase === 'BRIEFING'}
          onStartMission={handleStartMission}
          onExit={() => navigate('/')}
        />

      </div>

    </div>
  );
};

export default ThreatSimulationPage;
