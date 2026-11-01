// DRISHTI: Explainable Assessment Report Modal (Phase E)
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScenarioDefinition,
  MissionScoreBreakdown,
  CompletedSessionRecord,
  SimulationEvent,
  DroneClassification,
  DefensiveResponse,
} from '../../types/simulation';
import { saveCompletedSession } from '../../data/sessionStore';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Clock,
  Target,
  Shield,
  Lightbulb,
  FileText,
} from 'lucide-react';

interface AssessmentReportModalProps {
  scenario: ScenarioDefinition;
  score: MissionScoreBreakdown;
  selectedClassification: DroneClassification;
  selectedResponse: DefensiveResponse;
  events: SimulationEvent[];
  onRestart: () => void;
  onReturnToHub: () => void;
}

export const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({
  scenario,
  score,
  selectedClassification,
  selectedResponse,
  events,
  onRestart,
  onReturnToHub,
}) => {
  const navigate = useNavigate();
  const savedRef = useRef(false);
  const sessionIdRef = useRef<string>(`DRISHTI-EV-${Date.now().toString(36).toUpperCase()}`);

  // Save completed session to persistent store exactly once
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;

    try {
      const record: CompletedSessionRecord = {
        sessionId: sessionIdRef.current,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        dateIso: new Date().toISOString(),
        durationSec: Math.round(score.detectionTimeSec + 25),
        score,
        selectedClassification,
        selectedResponse,
        events,
      };

      saveCompletedSession(record);
    } catch (err) {
      console.error('Failed to save assessment record:', err);
    }
  }, [scenario, score, selectedClassification, selectedResponse, events]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col max-h-[92vh] text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-6 border-b border-military-border-dark flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
                EXERCISE DEBRIEFING // PHASE E
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                {scenario.codename}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1 font-sans">
              Tactical Performance Assessment
            </h2>
            <div className="text-xs text-slate-400 mt-0.5 font-sans">
              {scenario.title}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-military-subtle block">
              TRAINEE RATING
            </span>
            <span className="text-sm font-bold font-mono text-amber-400 mt-0.5 inline-block">
              {score.rankRating}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Score Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 rounded-lg bg-white border border-military-border text-center">
              <span className="text-[10px] font-mono text-military-subtle block">OVERALL SCORE</span>
              <span className="text-2xl font-black text-military-olive block mt-0.5">
                {score.totalScore}
              </span>
              <span className="text-[10px] font-mono text-military-steel">MAX: 1000 PTS</span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-military-border text-center">
              <span className="text-[10px] font-mono text-military-subtle block">DETECTION LATENCY</span>
              <span className="text-2xl font-black text-military-charcoal block mt-0.5">
                {score.detectionTimeSec.toFixed(1)}s
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
                +{score.detectionScore} PTS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-military-border text-center">
              <span className="text-[10px] font-mono text-military-subtle block">CLASSIFICATION</span>
              <span className="text-2xl font-black text-military-charcoal block mt-0.5">
                {score.classificationAccurate ? '100%' : '50%'}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
                +{score.classificationScore} PTS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-military-border text-center">
              <span className="text-[10px] font-mono text-military-subtle block">RESPONSE QUALITY</span>
              <span className="text-xl font-black text-military-charcoal block mt-1 capitalize">
                {score.responseQuality}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
                +{score.responseScore} PTS
              </span>
            </div>

          </div>

          {/* Explainable Decision Summary */}
          <div className="p-4 rounded-lg bg-military-sand/30 border border-military-border space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-military-olive" />
              <span>Explainable Decision Breakdown</span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-military-graphite">
              <div className="flex items-start gap-2">
                {score.classificationAccurate ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-military-charcoal">
                    Classification: {selectedClassification.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-military-steel text-[11px] mt-0.5">
                    {scenario.classificationOptionsExpl[selectedClassification]?.rationale}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-military-border/60">
                {score.responseQuality === 'optimal' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-military-charcoal">
                    Defensive Response: {selectedResponse.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <p className="text-military-steel text-[11px] mt-0.5">
                    {scenario.responseOptionsExpl[selectedResponse]?.rationale}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="p-4 rounded-lg bg-white border border-military-border space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Instructor Improvement Suggestions</span>
            </div>
            <ul className="space-y-1.5">
              {scenario.improvementTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-military-graphite leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-military-olive mt-1.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Structured Event Timeline */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono uppercase font-bold text-military-subtle">
              Session Event Timeline ({events.length} Logged Events)
            </div>
            <div className="p-2.5 rounded bg-military-sand/20 border border-military-border font-mono text-[10px] space-y-1 max-h-32 overflow-y-auto">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between text-military-steel">
                  <span>[{String(Math.floor(ev.timestampSec)).padStart(2, '0')}s] {ev.message}</span>
                  <span className="font-bold text-military-olive">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-military-border bg-white text-xs font-semibold text-military-charcoal hover:bg-military-sand/40 transition-all shadow-military-subtle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Exercise</span>
            </button>
            <button
              onClick={onReturnToHub}
              className="px-3.5 py-2 rounded-md border border-military-border bg-white text-xs font-semibold text-military-steel hover:text-military-charcoal hover:bg-military-sand/40 transition-all"
            >
              Return to Hub
            </button>
          </div>

          <button
            onClick={() => navigate('/aar')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle hover:scale-[1.02]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open After-Action Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
