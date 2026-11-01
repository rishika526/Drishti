// DRISHTI: Indoor Drone Inspection Observation & Logging Modal
// Stage 3: Operator Training Experiences

import React, { useState } from 'react';
import { IndoorTargetObject } from '../../../types/operatorTraining';
import { Eye, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface InspectionReportModalProps {
  target: IndoorTargetObject;
  isOpen: boolean;
  onSaveReport: (targetId: string, loggedCondition: 'Normal' | 'Compromised' | 'Hazardous') => void;
  onClose: () => void;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
  target,
  isOpen,
  onSaveReport,
  onClose,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<'Normal' | 'Compromised' | 'Hazardous'>(
    target.loggedCondition || 'Normal'
  );

  if (!isOpen) return null;

  const conditions: {
    id: 'Normal' | 'Compromised' | 'Hazardous';
    label: string;
    desc: string;
    color: string;
  }[] = [
    {
      id: 'Normal',
      label: 'NOMINAL / SECURE',
      desc: 'No structural deformation, tampering, or scorch marks observed. Operating within standard parameters.',
      color: 'border-emerald-600 bg-emerald-50 text-emerald-950',
    },
    {
      id: 'Compromised',
      label: 'COMPROMISED / UNSECURED',
      desc: 'Unauthorized physical access, broken seals, or suspicious equipment left unattended in restricted zone.',
      color: 'border-amber-500 bg-amber-50 text-amber-950',
    },
    {
      id: 'Hazardous',
      label: 'ACTIVE HAZARD / CRITICAL DEFECT',
      desc: 'Severe scorch marks, exposed live wiring, thermal overheating, or imminent fire/containment hazard.',
      color: 'border-rose-600 bg-rose-50 text-rose-950',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-lg max-h-[88vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-5 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-military-sand uppercase tracking-wider">
                OPTICAL SENSOR ACQUISITION // {target.room}
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-1 font-sans">
              {target.name}
            </h3>
          </div>

          <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white">
            PROXIMITY LOCK
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* Target Visual Analysis */}
          <div className="p-3.5 rounded-lg bg-military-sand/40 border border-military-border space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Inspection Camera Observation</span>
            </div>
            <p className="text-xs text-military-charcoal leading-relaxed font-sans font-medium">
              {target.description}
            </p>
          </div>

          {/* Condition Evaluation Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono block">
              Trainee Condition Assessment
            </label>

            <div className="space-y-2">
              {conditions.map((c) => {
                const isSelected = selectedCondition === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCondition(c.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? `${c.color} shadow-sm ring-1 ring-black/10`
                        : 'border-military-border bg-military-cream hover:bg-military-sand/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-xs">
                      <span>{c.label}</span>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedCondition(c.id)}
                        className="accent-military-olive"
                      />
                    </div>
                    <p className="text-[11px] font-sans text-military-steel mt-1 leading-normal">
                      {c.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-military-border text-military-steel hover:bg-military-sand/40 hover:text-military-charcoal font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onSaveReport(target.id, selectedCondition)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Log Inspection Finding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
