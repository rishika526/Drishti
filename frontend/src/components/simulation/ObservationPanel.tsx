// DRISHTI: Observation & Identification Panel (Phase C)
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useState } from 'react';
import { ScenarioDefinition, DroneClassification } from '../../types/simulation';
import {
  Radio,
  Eye,
  Volume2,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface ObservationPanelProps {
  scenario: ScenarioDefinition;
  detectionTimeSec: number;
  submittedClassification: DroneClassification | null;
  onSubmitClassification: (choice: DroneClassification) => void;
  onProceedToResponse: () => void;
}

export const ObservationPanel: React.FC<ObservationPanelProps> = ({
  scenario,
  detectionTimeSec,
  submittedClassification,
  onSubmitClassification,
  onProceedToResponse,
}) => {
  const [selected, setSelected] = useState<DroneClassification>('unknown_drone');
  const { sensorIntel } = scenario;

  const classificationOptions: { id: DroneClassification; label: string; desc: string }[] = [
    {
      id: 'authorized_aircraft',
      label: 'Authorized / Known Aircraft',
      desc: 'Pre-filed municipal, civil or military flight clearance with active Mode-5/Mode-S transponder return.',
    },
    {
      id: 'unknown_drone',
      label: 'Unknown Drone',
      desc: 'Unregistered generic commercial/hobbyist multirotor or fixed-wing operating without flight corridor squawk.',
    },
    {
      id: 'suspicious_drone',
      label: 'Potentially Suspicious Drone',
      desc: 'Modified airframe displaying intentional blackout, payload delivery attachments, or critical infrastructure masking.',
    },
    {
      id: 'swarm_activity',
      label: 'Multiple-Drone / Swarm Activity',
      desc: 'Multiple coordinated airframes operating in formation with dynamic mesh networking or boids cohesion.',
    },
  ];

  const hasSubmitted = submittedClassification !== null;
  const isCorrect = submittedClassification === scenario.expectedClassification;
  const feedback = hasSubmitted ? scenario.classificationOptionsExpl[submittedClassification] : null;

  return (
    <div className="w-full max-w-xl max-h-[85vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col font-sans text-xs text-military-charcoal select-none">
      
      {/* Header */}
      <div className="bg-military-charcoal text-white p-4 border-b border-military-border-dark flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-sm tracking-wide">
              TARGET INSPECTION & CLASSIFICATION
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Detection Time: {detectionTimeSec.toFixed(1)}s from mission start
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
          Phase C
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
        
        {/* Simulated Multi-Sensor Observation Dossier */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Simulated Sensor & Visual Observations</span>
          </div>

          <div className="p-3.5 rounded-lg bg-military-sand/40 border border-military-border space-y-2.5">
            <div>
              <span className="text-[10px] font-mono font-bold text-military-steel block">VISUAL SILHOUETTE</span>
              <p className="text-military-charcoal font-medium leading-relaxed mt-0.5">
                {sensorIntel.visualDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-military-border/60">
              <div>
                <span className="text-military-subtle block">FLIGHT BEHAVIOR</span>
                <span className="text-military-charcoal font-bold block">{sensorIntel.flightBehavior}</span>
              </div>
              <div>
                <span className="text-military-subtle block">SPEED BAND</span>
                <span className="text-military-charcoal font-bold block">{sensorIntel.estimatedSpeedBand}</span>
              </div>
              <div>
                <span className="text-military-subtle block">ALTITUDE BAND</span>
                <span className="text-military-charcoal font-bold block">{sensorIntel.estimatedAltitudeBand}</span>
              </div>
              <div>
                <span className="text-military-subtle block">RF TELEMETRY</span>
                <span className="text-military-charcoal font-bold block">{sensorIntel.rfTelemetry}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-military-border/60 text-military-steel">
              <span>ACOUSTICS: {sensorIntel.acousticProfile}</span>
              <span className="font-bold text-emerald-800">CONFIDENCE: {sensorIntel.sensorConfidencePct}%</span>
            </div>
          </div>
        </div>

        {/* Classification Selection */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
            Select Trainee Classification
          </div>

          <div className="space-y-1.5">
            {classificationOptions.map((opt) => {
              const isOptionSelected = (hasSubmitted ? submittedClassification : selected) === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!hasSubmitted) setSelected(opt.id);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    hasSubmitted
                      ? isOptionSelected
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-rose-50 border-rose-500'
                        : 'bg-military-cream border-military-border opacity-60'
                      : isOptionSelected
                      ? 'bg-military-cream border-military-olive ring-1 ring-military-olive shadow-military-subtle cursor-pointer'
                      : 'bg-military-cream border-military-border hover:bg-military-sand/30 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-military-charcoal">
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      name="classification"
                      checked={isOptionSelected}
                      disabled={hasSubmitted}
                      onChange={() => setSelected(opt.id)}
                      className="accent-military-olive"
                    />
                  </div>
                  <p className="text-[11px] text-military-steel mt-0.5 leading-normal">
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Area After Submission */}
        {hasSubmitted && feedback && (
          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>CLASSIFICATION ACCURATE (+350 pts)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-700" />
                  <span>CLASSIFICATION SUB-OPTIMAL (+100 pts)</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed font-sans">
              {feedback.rationale}
            </p>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-end gap-3 shrink-0">
        {!hasSubmitted ? (
          <button
            onClick={() => onSubmitClassification(selected)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Submit Classification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onProceedToResponse}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-charcoal hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Proceed to Threat Assessment (Phase D)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
