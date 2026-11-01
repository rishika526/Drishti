// DRISHTI: Operator Training Briefing Screen
// Stage 3: Operator Training Experiences

import React from 'react';
import { OperatorExperienceDefinition } from '../../../types/operatorTraining';
import {
  Shield,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Keyboard,
  Play,
  RotateCcw,
} from 'lucide-react';

interface TrainingBriefingModalProps {
  experience: OperatorExperienceDefinition;
  isOpen: boolean;
  onStart: () => void;
  onExit: () => void;
}

export const TrainingBriefingModal: React.FC<TrainingBriefingModalProps> = ({
  experience,
  isOpen,
  onStart,
  onExit,
}) => {
  if (!isOpen) return null;

  const { briefing } = experience;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-6 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[11px] font-bold font-mono uppercase tracking-wider text-white">
                OPERATOR TRAINING // {experience.code}
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                ROLE: {briefing.operationalRole}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1.5 font-sans">
              {experience.title}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              {experience.subtitle}
            </div>
          </div>

          <div className="text-right font-mono text-xs text-military-sand shrink-0">
            <span className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white font-bold">
              {experience.difficulty}
            </span>
            <div className="text-[10px] text-military-subtle mt-1.5 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              <span>{experience.duration}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
          
          {/* Operational Directive Banner */}
          <div className="p-3.5 rounded-lg bg-military-sand/40 border border-military-border space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Primary Training Directive</span>
            </div>
            <p className="text-xs text-military-charcoal font-medium leading-relaxed">
              {briefing.primaryDirective}
            </p>
          </div>

          {/* Operational Context */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono mb-1">
              Operational Context & Doctrinal Importance
            </h4>
            <p className="text-xs text-military-steel leading-relaxed">
              {briefing.context}
            </p>
          </div>

          {/* Objectives Checklist */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono mb-2">
              Graded Skill Objectives
            </h4>
            <div className="space-y-1.5">
              {briefing.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-military-cream border border-military-border flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-military-olive shrink-0 mt-0.5" />
                  <span className="text-xs text-military-charcoal leading-snug">
                    {obj}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Quick Reference Table */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono mb-2">
              <Keyboard className="w-3.5 h-3.5 text-military-olive" />
              <span>Simulated Flight & Sensor Controls</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {briefing.controls.map((ctrl, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-military-sand/30 border border-military-border font-mono text-[11px]"
                >
                  <span className="px-1.5 py-0.5 rounded bg-military-charcoal text-white font-bold inline-block mr-1.5 shadow-sm">
                    {ctrl.key}
                  </span>
                  <div className="text-military-charcoal font-bold mt-1 text-[11px]">
                    {ctrl.label}
                  </div>
                  <div className="text-military-steel text-[10px] font-sans">
                    {ctrl.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Safety Notice */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-600/30 flex items-start gap-2 text-amber-900 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Simulated Exercise Doctrine:</strong> This is a flight familiarization and observation drill. No offensive payload authorization is active. Maintain calm throttle control and preserve situational awareness.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded border border-military-border text-military-steel hover:bg-military-sand/40 hover:text-military-charcoal font-medium transition-colors"
          >
            Return to Syllabus
          </button>

          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Engage Training Exercise</span>
          </button>
        </div>

      </div>
    </div>
  );
};
