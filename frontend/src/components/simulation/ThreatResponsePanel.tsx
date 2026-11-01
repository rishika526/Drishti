// DRISHTI: Defensive Threat Assessment & Response Panel (Phase D)
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useState } from 'react';
import { ScenarioDefinition, DefensiveResponse, DroneClassification } from '../../types/simulation';
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  FileText,
  Radio,
  Bell,
  Lock,
} from 'lucide-react';

interface ThreatResponsePanelProps {
  scenario: ScenarioDefinition;
  classification: DroneClassification;
  submittedResponse: DefensiveResponse | null;
  onSubmitResponse: (resp: DefensiveResponse) => void;
  onCompleteMission: () => void;
}

export const ThreatResponsePanel: React.FC<ThreatResponsePanelProps> = ({
  scenario,
  classification,
  submittedResponse,
  onSubmitResponse,
  onCompleteMission,
}) => {
  const [selected, setSelected] = useState<DefensiveResponse>('record_and_report');

  const responseOptions: { id: DefensiveResponse; title: string; desc: string; icon: any }[] = [
    {
      id: 'continue_monitoring',
      title: 'Continue Passive Monitoring',
      desc: 'Maintain continuous optical and radar surveillance without issuing outward reports or sector alerts.',
      icon: Shield,
    },
    {
      id: 'record_and_report',
      title: 'Record & Report to Sector Logbook',
      desc: 'Formally document the timestamped contact, telemetry, and classification into the sector flight operations log.',
      icon: FileText,
    },
    {
      id: 'issue_alert',
      title: 'Issue Training Alert to Perimeter Security Posts',
      desc: 'Broadcast immediate operational alert to all perimeter watchtowers and field security personnel to establish visual line-of-sight.',
      icon: Bell,
    },
    {
      id: 'escalate_command',
      title: 'Escalate to Designated Command Authority',
      desc: 'Transmit an expedited escalation report directly to Sector Air Defense Command for regional airspace correlation.',
      icon: Radio,
    },
    {
      id: 'safety_procedure',
      title: 'Execute Airspace Safety & Containment Procedure',
      desc: 'Initiate automated perimeter containment protocols, shelter personnel from potential hazard, and alert air corridors.',
      icon: Lock,
    },
  ];

  const hasSubmitted = submittedResponse !== null;
  const feedback = hasSubmitted ? scenario.responseOptionsExpl[submittedResponse] : null;
  const isOptimal = feedback?.quality === 'optimal';

  return (
    <div className="w-full max-w-xl max-h-[85vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col font-sans text-xs text-military-charcoal select-none">
      
      {/* Header */}
      <div className="bg-military-charcoal text-white p-4 border-b border-military-border-dark flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold text-sm tracking-wide">
              DEFENSIVE THREAT ASSESSMENT & RESPONSE
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Confirmed Classification: {classification.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-military-amber text-[10px] font-bold font-mono text-slate-950 uppercase">
          Phase D
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
        
        {/* Doctrine Context Notice */}
        <div className="p-3 rounded-lg bg-military-sand/40 border border-military-border text-military-steel leading-relaxed">
          <div className="text-[10px] font-bold uppercase tracking-wider text-military-charcoal font-mono mb-1">
            Defensive Rules of Engagement (ROE) Directive
          </div>
          <p>
            Select the authorized defensive response. Actions must prioritize personnel safety, accurate record-keeping, and proportional escalation without premature alert panic.
          </p>
        </div>

        {/* Response Options */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
            Instructor-Defined Defensive Options
          </div>

          <div className="space-y-1.5">
            {responseOptions.map((opt) => {
              const Icon = opt.icon;
              const isOptionSelected = (hasSubmitted ? submittedResponse : selected) === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!hasSubmitted) setSelected(opt.id);
                  }}
                  className={`p-3 rounded-lg border transition-all ${
                    hasSubmitted
                      ? isOptionSelected
                        ? isOptimal
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-amber-50 border-amber-500'
                        : 'bg-military-cream border-military-border opacity-60'
                      : isOptionSelected
                      ? 'bg-military-cream border-military-olive ring-1 ring-military-olive shadow-military-subtle cursor-pointer'
                      : 'bg-military-cream border-military-border hover:bg-military-sand/30 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-military-charcoal">
                      <Icon className="w-3.5 h-3.5 text-military-olive" />
                      <span>{opt.title}</span>
                    </div>
                    <input
                      type="radio"
                      name="response"
                      checked={isOptionSelected}
                      disabled={hasSubmitted}
                      onChange={() => setSelected(opt.id)}
                      className="accent-military-olive"
                    />
                  </div>
                  <p className="text-[11px] text-military-steel mt-1 leading-normal pl-5">
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explainable Feedback After Submission */}
        {hasSubmitted && feedback && (
          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isOptimal
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : feedback.quality === 'suboptimal'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              {isOptimal ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>DEFENSIVE RESPONSE OPTIMAL (+350 pts)</span>
                </>
              ) : feedback.quality === 'suboptimal' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>DEFENSIVE RESPONSE SUB-OPTIMAL (+180 pts)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-700" />
                  <span>INAPPROPRIATE RESPONSE (+50 pts)</span>
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
            onClick={() => onSubmitResponse(selected)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Submit Defensive Action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onCompleteMission}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Complete Mission & View Evaluation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
