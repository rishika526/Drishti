// DRISHTI: Operator Training Completion & Explainable Assessment Modal
// Stage 3: Operator Training Experiences

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OperatorExperienceDefinition,
  OperatorTrainingAssessment,
} from '../../../types/operatorTraining';
import { saveCompletedSession } from '../../../data/sessionStore';
import { CompletedSessionRecord, SimulationEvent } from '../../../types/simulation';
import {
  Trophy,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Award,
  FileText,
} from 'lucide-react';

interface TrainingCompletionModalProps {
  experience: OperatorExperienceDefinition;
  assessment: OperatorTrainingAssessment;
  onRestart: () => void;
  onReturnToHub: () => void;
  onNextExperience?: () => void;
}

export const TrainingCompletionModal: React.FC<TrainingCompletionModalProps> = ({
  experience,
  assessment,
  onRestart,
  onReturnToHub,
  onNextExperience,
}) => {
  const navigate = useNavigate();
  const savedRef = useRef(false);
  const sessionIdRef = useRef<string>(`TR-${experience.code}-${Date.now().toString(36).toUpperCase()}`);

  // Persist session record into unified local persistence layer exactly once
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    try {
      const d = assessment.durationSec;
      let sessionEvents: SimulationEvent[] = [];

      if (experience.id === 'fpv-flight') {
        sessionEvents = [
          { id: 'ev-1', timestampSec: 0, type: 'INFO', message: 'Initiated 6-DOF FPV flight trajectory over Sector 4 terrain.' },
          { id: 'ev-2', timestampSec: Math.round(d * 0.2), type: 'INFO', message: 'Cleared Waypoint Gate 01: Low Altitude Departure.' },
          { id: 'ev-3', timestampSec: Math.round(d * 0.4), type: 'INFO', message: 'Cleared Waypoint Gate 02: Pylon Slalom.' },
          { id: 'ev-4', timestampSec: Math.round(d * 0.6), type: 'INFO', message: 'Cleared Waypoint Gate 03: Observation Tower Flyby.' },
          { id: 'ev-5', timestampSec: Math.round(d * 0.8), type: 'INFO', message: 'Cleared Waypoint Gate 04: Ridge Descent Corridor.' },
          { id: 'ev-6', timestampSec: d, type: 'ALERT', message: 'Cleared Final Gate 05. Flight course concluded.' },
        ];
      } else if (experience.id === 'indoor-inspection') {
        sessionEvents = [
          { id: 'ev-1', timestampSec: 0, type: 'INFO', message: 'Entered multi-room structure with spotlight active.' },
          { id: 'ev-2', timestampSec: Math.round(d * 0.28), type: 'DETECTION', message: 'Inspected Utility Room: Main Electrical Breaker Panel.' },
          { id: 'ev-3', timestampSec: Math.round(d * 0.58), type: 'DETECTION', message: 'Inspected Server Room: Unsecured Briefcase on Console.' },
          { id: 'ev-4', timestampSec: Math.round(d * 0.85), type: 'DETECTION', message: 'Inspected Logistics Bay: Battery Pallet Storage Rack.' },
          { id: 'ev-5', timestampSec: d, type: 'ALERT', message: 'Completed internal facility sweep and inspection report.' },
        ];
      } else {
        sessionEvents = [
          { id: 'ev-1', timestampSec: 0, type: 'INFO', message: 'Aerial surveillance platform on station over Sector Delta.' },
          { id: 'ev-2', timestampSec: Math.round(d * 0.32), type: 'DETECTION', message: 'Identified strategic target: Fuel Storage Depots.' },
          { id: 'ev-3', timestampSec: Math.round(d * 0.65), type: 'DETECTION', message: 'Identified strategic target: Radar Antenna Array.' },
          { id: 'ev-4', timestampSec: Math.round(d * 0.88), type: 'DETECTION', message: 'Identified strategic target: Motor Transport Pool.' },
          { id: 'ev-5', timestampSec: d, type: 'ALERT', message: 'Comprehensive aerial observation dossier submitted.' },
        ];
      }

      const sessionRecord: CompletedSessionRecord = {
        sessionId: sessionIdRef.current,
        scenarioId: experience.id,
        scenarioTitle: experience.title,
        dateIso: new Date().toISOString(),
        durationSec: assessment.durationSec,
        score: {
          totalScore: assessment.totalScore,
          detectionScore: assessment.handlingScore,
          classificationScore: assessment.objectiveScore,
          responseScore: assessment.timeBonusScore,
          detectionTimeSec: assessment.durationSec,
          classificationAccurate: true,
          responseQuality: assessment.totalScore >= 750 ? 'optimal' : 'suboptimal',
          rankRating: assessment.totalScore >= 880 ? 'Exemplary Defense' : assessment.totalScore >= 720 ? 'Tactically Proficient' : 'Qualified Operator',
        },
        selectedClassification: 'authorized_aircraft',
        selectedResponse: 'record_and_report',
        events: sessionEvents,
      };

      saveCompletedSession(sessionRecord);
    } catch (err) {
      console.error('Failed to persist operator training session:', err);
    }
  }, [experience, assessment]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Distinguished Operator':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
      case 'Proficient Pilot':
        return 'text-blue-400 bg-blue-950/80 border-blue-500/50';
      case 'Qualified':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      default:
        return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-6 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
                EXERCISE COMPLETE // {experience.code}
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                DEBRIEFING
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1 font-sans">
              Tactical Performance Evaluation
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              {experience.title}
            </div>
          </div>

          {/* Overall Rank Rating Pill */}
          <div
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm ${getRankColor(
              assessment.rankRating
            )}`}
          >
            <Award className="w-4 h-4" />
            <span>{assessment.rankRating}</span>
          </div>
        </div>

        {/* Scrollable Evaluation Body */}
        <div className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
          
          {/* Top Score Banner */}
          <div className="p-4 rounded-xl bg-military-olive/10 border border-military-olive/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-military-olive uppercase tracking-wider block">
                AGGREGATE DRILL SCORE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-military-charcoal">
                  {assessment.totalScore}
                </span>
                <span className="text-xs text-military-steel font-mono">/ 1,000 PTS</span>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-military-steel">
              <div>COMPLETION TIME: {assessment.durationSec}s</div>
              <div className="text-emerald-700 font-bold">ALL DIRECTIVES SATISFIED</div>
            </div>
          </div>

          {/* Score Breakdown Category Bars */}
          <div className="space-y-3 p-4 rounded-lg bg-military-sand/30 border border-military-border">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
              Competency Breakdown
            </h4>

            {/* 1. Handling & Maneuvering */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-military-charcoal font-medium">Flight Handling & Attitude Stability</span>
                <span className="font-mono font-bold text-military-olive">{assessment.handlingScore} / 300</span>
              </div>
              <div className="w-full h-2 rounded-full bg-military-border/60 overflow-hidden">
                <div
                  className="h-full bg-military-olive rounded-full transition-all duration-500"
                  style={{ width: `${(assessment.handlingScore / 300) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. Objective Completion */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-military-charcoal font-medium">Primary Directive & Target Verification</span>
                <span className="font-mono font-bold text-emerald-800">{assessment.objectiveScore} / 400</span>
              </div>
              <div className="w-full h-2 rounded-full bg-military-border/60 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${(assessment.objectiveScore / 400) * 100}%` }}
                />
              </div>
            </div>

            {/* 3. Time & Efficiency */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-military-charcoal font-medium">Time Efficiency & Momentum</span>
                <span className="font-mono font-bold text-amber-800">{assessment.timeBonusScore} / 300</span>
              </div>
              <div className="w-full h-2 rounded-full bg-military-border/60 overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${(assessment.timeBonusScore / 300) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Metrics Summary */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
              Action Metrics & Observations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
              {assessment.metricsSummary.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-military-cream border border-military-border"
                >
                  <span className="text-[10px] text-military-subtle uppercase block truncate">
                    {metric.label}
                  </span>
                  <span
                    className={`text-sm font-bold block mt-0.5 ${
                      metric.quality === 'optimal'
                        ? 'text-emerald-800'
                        : metric.quality === 'good'
                        ? 'text-military-charcoal'
                        : 'text-amber-800'
                    }`}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable Assessment Findings */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-military-olive" />
              <span>Instructor Assessment Findings</span>
            </h4>
            <div className="space-y-1.5">
              {assessment.detailedFeedback.map((fb, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-military-sand/20 border border-military-border flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-xs text-military-charcoal leading-relaxed">
                    {fb}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Improvement Suggestions */}
          {assessment.improvementSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Recommendations for Skill Refinement</span>
              </h4>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                {assessment.improvementSuggestions.map((sug, idx) => (
                  <div key={idx} className="text-xs text-amber-950 flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-military-border text-military-charcoal hover:bg-military-sand/40 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Drill</span>
            </button>
            <button
              onClick={onReturnToHub}
              className="px-3.5 py-2 rounded border border-military-border text-military-steel hover:text-military-charcoal hover:bg-military-sand/40 font-medium transition-colors"
            >
              Back to Syllabus
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/aar')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-military-border bg-white text-xs font-semibold text-military-charcoal hover:bg-military-sand/40 transition-all shadow-military-subtle"
            >
              <FileText className="w-3.5 h-3.5 text-military-olive" />
              <span>Debrief in AAR</span>
            </button>

            {onNextExperience && (
              <button
                onClick={onNextExperience}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle hover:scale-[1.02]"
              >
                <span>Next Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
