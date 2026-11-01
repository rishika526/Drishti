// DRISHTI: Detailed After-Action Review (AAR) Debriefing Modal
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React from 'react';
import { CompletedSessionRecord } from '../../types/simulation';
import { ReconstructedSessionReplay } from './ReconstructedSessionReplay';
import {
  X,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  TrendingUp,
  Shield,
  Activity,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface DetailedAARModalProps {
  session: CompletedSessionRecord;
  isOpen: boolean;
  onClose: () => void;
  onLaunchReDrill: (scenarioId: string) => void;
}

export const DetailedAARModal: React.FC<DetailedAARModalProps> = ({
  session,
  isOpen,
  onClose,
  onLaunchReDrill,
}) => {
  if (!isOpen) return null;

  const { score, events } = session;
  const isCounterDrone =
    session.scenarioId.includes('rural') ||
    session.scenarioId.includes('urban') ||
    session.scenarioId.includes('night') ||
    session.scenarioId.includes('swarm');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-5 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
                AAR DOSSIER // {session.sessionId}
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                {new Date(session.dateIso).toLocaleString()}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1 font-sans">
              {session.scenarioTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Close Review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Debrief Body */}
        <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
          
          {/* 1. Score & Outcome Banner */}
          <div className="p-4 rounded-xl bg-military-olive/10 border border-military-olive/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-military-olive uppercase tracking-wider block">
                AGGREGATE EVALUATION SCORE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-military-charcoal">
                  {score.totalScore}
                </span>
                <span className="text-xs text-military-steel font-mono">/ 1,000 PTS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-[11px] font-mono text-military-steel">
                <div>DURATION: {session.durationSec}s</div>
                <div className="text-emerald-700 font-bold">RATING: {score.rankRating}</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-military-olive text-white font-mono font-bold text-xs uppercase shadow-sm">
                {score.rankRating}
              </div>
            </div>
          </div>

          {/* 2. Reconstructed Tactical Session Replay */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-military-olive" />
              <span>Tactical Airspace & Telemetry Reconstruction</span>
            </h4>
            <ReconstructedSessionReplay session={session} />
          </div>

          {/* 3. Transparent Score Breakdown */}
          <div className="space-y-3 p-4 rounded-xl bg-military-sand/30 border border-military-border">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
              Explainable Scoring Computation
            </h4>

            {isCounterDrone ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Detection */}
                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    1. Detection Reflexes
                  </span>
                  <div className="text-base font-bold font-mono text-military-olive">
                    {score.detectionScore} / 300 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    Acquired contact at T+{score.detectionTimeSec.toFixed(1)}s (Linear decay from 30s benchmark).
                  </p>
                </div>

                {/* Classification */}
                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    2. Classification Accuracy
                  </span>
                  <div className="text-base font-bold font-mono text-emerald-800">
                    {score.classificationScore} / 350 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    {score.classificationAccurate ? 'Target verified accurately against sensor intel.' : 'Sub-optimal classification recorded.'}
                  </p>
                </div>

                {/* Response Quality */}
                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    3. Response ROE Quality
                  </span>
                  <div className="text-base font-bold font-mono text-amber-800">
                    {score.responseScore} / 350 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    {score.responseQuality === 'optimal'
                      ? 'Optimal defensive proportionality exercised.'
                      : 'Sub-optimal response escalation.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    1. Flight Handling & Control
                  </span>
                  <div className="text-base font-bold font-mono text-military-olive">
                    {score.detectionScore} / 300 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    Altitude and attitude stability during maneuvering.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    2. Primary Objective Mastery
                  </span>
                  <div className="text-base font-bold font-mono text-emerald-800">
                    {score.classificationScore} / 400 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    Checkpoints cleared or inspection targets acquired.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-military-cream border border-military-border space-y-1">
                  <span className="text-[10px] text-military-subtle uppercase font-mono block">
                    3. Time & Efficiency Bonus
                  </span>
                  <div className="text-base font-bold font-mono text-amber-800">
                    {score.responseScore} / 300 PTS
                  </div>
                  <p className="text-[11px] text-military-steel leading-tight">
                    Course completed within authorized mission time envelope.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. Decision Review */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
              Doctrinal Decision Review
            </h4>
            <div className="p-4 rounded-xl bg-military-cream border border-military-border space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div>
                  <span className="text-military-subtle">TRAINEE SELECTION: </span>
                  <span className="font-bold text-military-charcoal uppercase">
                    {session.selectedClassification?.replace(/_/g, ' ') || 'STANDARD SORTIE'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>DOCTRINALLY VALIDATED</span>
                </div>
              </div>

              <div className="text-xs text-military-steel leading-relaxed font-sans pt-1 border-t border-military-border/60">
                Action executed: <strong>{session.selectedResponse?.replace(/_/g, ' ').toUpperCase() || 'PRACTICE RECORD'}</strong>. The operational timeline reflects proactive surveillance and measured tactical escalation.
              </div>
            </div>
          </div>

          {/* 5. Chronological Event Timeline */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-military-olive" />
              <span>Chronological Sortie Event Feed</span>
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              {events && events.length > 0 ? (
                events.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-military-sand/20 border border-military-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-military-olive font-bold w-12 text-[11px]">
                        +{ev.timestampSec.toFixed(1)}s
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          ev.type === 'ALERT'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : ev.type === 'DETECTION'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-military-sand text-military-charcoal'
                        }`}
                      >
                        {ev.type}
                      </span>
                      <span className="text-military-charcoal font-sans text-xs">
                        {ev.message}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-military-steel text-xs font-sans">
                  No chronological events recorded for this session.
                </div>
              )}
            </div>
          </div>

          {/* 6. Improvement Recommendations */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Targeted Performance Refinements</span>
            </h4>
            <div className="p-4 rounded-xl bg-military-sand/30 border border-military-border space-y-2">
              <div className="text-xs text-military-charcoal flex items-start gap-2">
                <span className="font-bold text-military-olive">•</span>
                <span>
                  {score.detectionTimeSec > 12
                    ? 'Target detection latency exceeded 12 seconds. Utilize radar azimuth cues and initiate wider optical sweeps across the treeline earlier in the sortie.'
                    : 'Detection latency was prompt and disciplined. Maintain this scan interval during night and adverse weather sorties.'}
                </span>
              </div>
              <div className="text-xs text-military-charcoal flex items-start gap-2">
                <span className="font-bold text-military-olive">•</span>
                <span>
                  Review the Academy module <strong>"Observation & Multi-Sensor Threat Classification"</strong> to reinforce identification of high-speed loitering munitions versus civilian multirotors.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-military-border text-military-steel hover:bg-military-sand/40 hover:text-military-charcoal font-medium transition-colors"
          >
            Back to Sortie Log
          </button>

          <button
            onClick={() => onLaunchReDrill(session.scenarioId)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Re-Fly Exercise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
