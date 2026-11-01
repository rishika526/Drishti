// DRISHTI: Mission Briefing Modal (Phase A)
// Stage 2: Core Counter-Drone Threat Simulation

import React from 'react';
import { ScenarioDefinition } from '../../types/simulation';
import {
  ShieldAlert,
  Target,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Play,
  ArrowRight,
  Info,
} from 'lucide-react';

interface BriefingModalProps {
  scenario: ScenarioDefinition;
  isOpen: boolean;
  onStartMission: () => void;
  onExit: () => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  scenario,
  isOpen,
  onStartMission,
  onExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Mission Classification Header */}
        <div className="bg-military-charcoal text-white p-6 border-b border-military-border-dark flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[11px] font-bold font-mono uppercase tracking-wider text-white">
                SIMULATION BRIEFING // PHASE A
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                CODENAME: {scenario.codename}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1.5 font-sans">
              {scenario.title}
            </h2>
          </div>

          <div className="text-right font-mono text-xs text-military-sand">
            <span className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white font-bold">
              {scenario.difficulty}
            </span>
            <div className="text-[10px] text-military-subtle mt-1.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              <span>~{scenario.estimatedDurationSec}s</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-military-charcoal">
          
          {/* Scenario Overview */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-military-olive font-mono mb-1">
              Operational Context
            </div>
            <p className="text-military-steel leading-relaxed">
              {scenario.briefing.description}
            </p>
          </div>

          {/* Training Objectives */}
          <div className="p-4 rounded-lg bg-military-sand/40 border border-military-border space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-military-olive" />
              <span>Training Objectives</span>
            </div>
            <ul className="space-y-1.5">
              {scenario.briefing.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-military-graphite">
                  <CheckCircle2 className="w-3.5 h-3.5 text-military-olive mt-0.5 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trainee Instructions & Controls */}
          <div className="p-4 rounded-lg bg-white border border-military-border space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-military-amber" />
              <span>Trainee Instructions</span>
            </div>
            <ul className="space-y-1 text-military-steel list-disc list-inside">
              {scenario.briefing.traineeInstructions.map((inst, i) => (
                <li key={i} className="leading-relaxed">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          {/* Environment Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono pt-1">
            <div className="p-2.5 rounded bg-military-sand/20 border border-military-border">
              <span className="text-military-subtle block">LOCATION</span>
              <span className="font-bold text-military-charcoal truncate block">{scenario.location}</span>
            </div>
            <div className="p-2.5 rounded bg-military-sand/20 border border-military-border">
              <span className="text-military-subtle block">ENVIRONMENT</span>
              <span className="font-bold text-military-charcoal capitalize block">{scenario.environment.replace('_', ' ')}</span>
            </div>
            <div className="p-2.5 rounded bg-military-sand/20 border border-military-border col-span-2 sm:col-span-1">
              <span className="text-military-subtle block">TARGET AIRFRAMES</span>
              <span className="font-bold text-military-charcoal block">{scenario.targets.length} Unit(s)</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between gap-3">
          <button
            onClick={onExit}
            className="px-4 py-2.5 rounded-md text-xs font-semibold text-military-steel hover:text-military-charcoal hover:bg-military-sand/50 transition-all"
          >
            Cancel & Return
          </button>

          <button
            onClick={onStartMission}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Mission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
