// DRISHTI: Experience C — Aerial Observation Training Workstation
// Stage 3: Operator Training Experiences

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OPERATOR_EXPERIENCES, AERIAL_OBSERVATION_LANDMARKS } from '../data/operatorTrainingData';
import { AerialLandmarkTarget, OperatorTrainingAssessment } from '../types/operatorTraining';
import { TrainingBriefingModal } from '../components/training/shared/TrainingBriefingModal';
import { TrainingHUD } from '../components/training/shared/TrainingHUD';
import { TrainingCompletionModal } from '../components/training/shared/TrainingCompletionModal';
import { AerialObservationWorld } from '../components/training/aerial/AerialObservationWorld';
import { AerialGimbalHUD } from '../components/training/aerial/AerialGimbalHUD';
import { AerialLandmarkReportModal } from '../components/training/aerial/AerialLandmarkReportModal';
import { Keyboard } from 'lucide-react';

export const AerialObservationPage: React.FC = () => {
  const navigate = useNavigate();
  const experience = OPERATOR_EXPERIENCES['aerial-observation'];

  // Workstation Workflow State
  const [phase, setPhase] = useState<'BRIEFING' | 'OBSERVING' | 'COMPLETED'>('BRIEFING');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);

  // Sensor Gimbal State
  const [viewMode, setViewMode] = useState<'oblique' | 'overhead'>('oblique');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [currentSector, setCurrentSector] = useState<string>('Sector Delta [Central Proving Grounds]');

  // Landmarks State
  const [landmarks, setLandmarks] = useState<AerialLandmarkTarget[]>(() =>
    AERIAL_OBSERVATION_LANDMARKS.map((l) => ({ ...l }))
  );
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);
  const [activeLandmarkForModal, setActiveLandmarkForModal] = useState<AerialLandmarkTarget | null>(null);

  // Elapsed Timer
  useEffect(() => {
    if (phase !== 'OBSERVING' || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTimeSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Keyboard shortcut listener for 'V' (view mode toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') {
        setViewMode((prev) => (prev === 'oblique' ? 'overhead' : 'oblique'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save observation for individual landmark
  const handleSaveObservation = (landmarkId: string, selectedObservation: string) => {
    setLandmarks((prev) =>
      prev.map((lm) => {
        if (lm.id === landmarkId) {
          const isCorrect = selectedObservation === lm.expectedObservation;
          return {
            ...lm,
            observed: true,
            selectedObservation,
            isCorrect,
          };
        }
        return lm;
      })
    );
    setActiveLandmarkForModal(null);
  };

  // Submit final recon report
  const handleSubmitReconReport = () => {
    setPhase('COMPLETED');
  };

  // Restart Drill
  const handleRestart = () => {
    setLandmarks(AERIAL_OBSERVATION_LANDMARKS.map((l) => ({ ...l })));
    setElapsedTimeSec(0);
    setIsPaused(false);
    setSelectedLandmarkId(null);
    setActiveLandmarkForModal(null);
    setPhase('OBSERVING');
  };

  // Compute Explainable Assessment
  const computeAssessment = (): OperatorTrainingAssessment => {
    const observedCount = landmarks.filter((l) => l.observed).length;
    const correctCount = landmarks.filter((l) => l.isCorrect).length;

    // Objective completion (locating and observing all 3 strategic landmarks): up to 400 pts
    const objectiveScore = Math.round((observedCount / landmarks.length) * 400);

    // Optical identification accuracy: up to 300 pts
    const handlingScore = Math.round((correctCount / landmarks.length) * 300);

    // Time & systematic reconnaissance speed: up to 300 pts (decay after 80s)
    const timeBonusScore = Math.max(100, Math.round(Math.max(0, 1 - (elapsedTimeSec - 40) / 100) * 300));

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
        { label: 'Landmarks Verified', value: `${observedCount} / ${landmarks.length}`, quality: observedCount === 3 ? 'optimal' : 'good' },
        { label: 'Intelligence Accuracy', value: `${correctCount} / ${landmarks.length} Correct`, quality: correctCount === 3 ? 'optimal' : 'good' },
        { label: 'Sector Reconnaissance Time', value: `${elapsedTimeSec} seconds`, quality: elapsedTimeSec < 80 ? 'optimal' : 'good' },
        { label: 'Gimbal Mode Usage', value: 'Multi-Perspective (Oblique + Nadir)', quality: 'optimal' },
        { label: 'Optical Zoom Steps', value: 'Telephoto Zoom Verified', quality: 'optimal' },
        { label: 'Recon Intel Dissemination', value: 'Transmitted to Command', quality: 'optimal' },
      ],
      detailedFeedback: [
        `Systematically surveyed Sectors Alpha, Bravo, and Charlie, acquiring ${observedCount} of ${landmarks.length} strategic landmarks.`,
        correctCount === 3
          ? 'Confirmed all optical intelligence observations: Radar Dish status, Camouflaged Transport silhouette, and Bulk Fuel Containment integrity.'
          : `Correctly recorded ${correctCount} of 3 landmark assessments. Correlate thermal signatures with visual camouflage during wide-area passes.`,
        `Effective utilization of optical magnification (1x-4x) and overhead nadir perspective for top-down structural assessment.`,
      ],
      improvementSuggestions: [
        'Utilize 90° Overhead Nadir mode [V] when verifying perimeter fence lines and vehicle parking alignments.',
        'Use 4.0x telephoto zoom before logging status to distinguish operational assets from mockups or decoys.',
      ],
    };
  };

  const observedCount = landmarks.filter((l) => l.observed).length;
  const progressPercent = (observedCount / landmarks.length) * 100;

  return (
    <div className="h-full w-full relative flex flex-col bg-[#060A06] overflow-hidden select-none font-mono">
      
      {/* 1. Tactical Workstation Top HUD */}
      <TrainingHUD
        experience={experience}
        elapsedTimeSec={elapsedTimeSec}
        isPaused={isPaused}
        progressText={`LANDMARKS: ${observedCount}/${landmarks.length} VERIFIED`}
        progressPercent={progressPercent}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
        onExit={() => navigate('/training')}
        onToggleControls={() => setShowControlsGuide(!showControlsGuide)}
        showControlsGuide={showControlsGuide}
      />

      {/* 2. Interactive 3D Aerial Reconnaissance Viewport */}
      <div className="flex-1 relative w-full h-full min-h-0">
        <AerialObservationWorld
          landmarks={landmarks}
          selectedLandmarkId={selectedLandmarkId}
          viewMode={viewMode}
          zoomLevel={zoomLevel}
          isPaused={isPaused || phase !== 'OBSERVING'}
          onSelectLandmark={(lm) => {
            setSelectedLandmarkId(lm.id);
            setActiveLandmarkForModal(lm);
          }}
          onSectorChange={setCurrentSector}
        />

        {/* Gimbal HUD Overlay */}
        {phase === 'OBSERVING' && (
          <AerialGimbalHUD
            viewMode={viewMode}
            zoomLevel={zoomLevel}
            currentSector={currentSector}
            landmarks={landmarks}
            selectedLandmarkId={selectedLandmarkId}
            onToggleViewMode={() => setViewMode((prev) => (prev === 'oblique' ? 'overhead' : 'oblique'))}
            onSelectZoom={(z) => setZoomLevel(z)}
            onSlewToLandmark={(lm) => setSelectedLandmarkId(lm.id)}
            onInspectLandmark={(lm) => setActiveLandmarkForModal(lm)}
            onSubmitReconReport={handleSubmitReconReport}
          />
        )}

        {/* Modal: Landmark Intelligence Verification */}
        {activeLandmarkForModal && (
          <AerialLandmarkReportModal
            landmark={activeLandmarkForModal}
            isOpen={true}
            onSaveObservation={handleSaveObservation}
            onClose={() => setActiveLandmarkForModal(null)}
          />
        )}

        {/* Optional Control Key Guide Overlay */}
        {showControlsGuide && (
          <div className="absolute top-4 right-4 z-40 bg-[#0A0E0A]/95 backdrop-blur-md border border-[#384337] p-4 rounded-xl text-xs space-y-2 shadow-2xl max-w-xs font-mono">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-[#2D382B] pb-2">
              <span className="flex items-center gap-1.5">
                <Keyboard className="w-4 h-4" />
                Aerial Recon Controls
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
                <span className="font-bold text-white bg-slate-800 px-1 rounded">W / A / S / D</span>
                <span>Pan Gimbal Across Terrain</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">V</span>
                <span>Toggle 45° Oblique / 90° Nadir</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">1x / 2x / 4x</span>
                <span>Optical Telephoto Magnification</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white bg-slate-800 px-1 rounded">Click Landmark</span>
                <span>Acquire & Verify Target</span>
              </div>
            </div>
          </div>
        )}

        {/* Briefing Screen */}
        <TrainingBriefingModal
          experience={experience}
          isOpen={phase === 'BRIEFING'}
          onStart={() => setPhase('OBSERVING')}
          onExit={() => navigate('/training')}
        />

        {/* Completion Screen & Assessment */}
        {phase === 'COMPLETED' && (
          <TrainingCompletionModal
            experience={experience}
            assessment={computeAssessment()}
            onRestart={handleRestart}
            onReturnToHub={() => navigate('/training')}
            onNextExperience={() => navigate('/training/fpv')}
          />
        )}

      </div>

    </div>
  );
};

export default AerialObservationPage;
