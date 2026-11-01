// DRISHTI: Indoor Drone Inspection Camera HUD Overlay
// Stage 3: Operator Training Experiences

import React from 'react';
import { IndoorTargetObject } from '../../../types/operatorTraining';
import {
  Lightbulb,
  Crosshair,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Eye,
  Camera,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface IndoorDroneCameraHUDProps {
  currentRoom: string;
  targets: IndoorTargetObject[];
  targetInRange: IndoorTargetObject | null;
  isSpotlightOn: boolean;
  onToggleSpotlight: () => void;
  onInspectTarget: (target: IndoorTargetObject) => void;
  onSubmitConsolidatedReport: () => void;
}

export const IndoorDroneCameraHUD: React.FC<IndoorDroneCameraHUDProps> = ({
  currentRoom,
  targets,
  targetInRange,
  isSpotlightOn,
  onToggleSpotlight,
  onInspectTarget,
  onSubmitConsolidatedReport,
}) => {
  const inspectedCount = targets.filter((t) => t.inspected).length;
  const allInspected = inspectedCount === targets.length;

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-mono text-emerald-400 overflow-hidden flex flex-col justify-between p-6">
      
      {/* 1. Top Bar: Current Room & Camera Sensor Telemetry */}
      <div className="flex items-start justify-between z-20">
        
        {/* Left: Zone & Location Sensor */}
        <div className="bg-[#0A0E0A]/85 backdrop-blur-md border border-[#2D382B] px-4 py-2 rounded-lg space-y-1 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[10px]">CURRENT ZONE:</span>
            <span className="font-bold text-white uppercase text-xs">{currentRoom}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-[#2D382B]">
            <span>ALT: 1.8m</span>
            <span>BAT: 92%</span>
            <span>SIGNAL: -58 dBm (STRONG)</span>
          </div>
        </div>

        {/* Right: Inspection Objectives Checklist */}
        <div className="bg-[#0A0E0A]/90 backdrop-blur-md border border-[#2D382B] p-3.5 rounded-lg space-y-2 shadow-lg min-w-[220px] pointer-events-auto">
          <div className="flex items-center justify-between text-[11px] border-b border-[#2D382B] pb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Inspection Checklist
            </span>
            <span className="text-emerald-300 font-mono">
              {inspectedCount}/{targets.length}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {targets.map((tgt) => (
              <div
                key={tgt.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-1.5 truncate">
                  {tgt.inspected ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 inline-block" />
                  )}
                  <span className={`truncate text-[10px] ${tgt.inspected ? 'text-slate-200' : 'text-slate-400'}`}>
                    {tgt.name.split('&')[0]}
                  </span>
                </div>

                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono shrink-0 ${
                    tgt.inspected
                      ? tgt.loggedCondition === 'Hazardous'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : tgt.loggedCondition === 'Compromised'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'text-slate-500'
                  }`}
                >
                  {tgt.inspected ? tgt.loggedCondition : 'PENDING'}
                </span>
              </div>
            ))}
          </div>

          {/* Submit Consolidated Findings Action */}
          {allInspected && (
            <button
              onClick={onSubmitConsolidatedReport}
              className="w-full mt-2 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all animate-pulse"
            >
              <span>Submit Inspection Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* 2. Center Crosshair & Target Proximity Action */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Reticle */}
        <div className="w-12 h-12 border border-emerald-500/40 rounded-full flex items-center justify-center relative">
          <div className="w-1 h-1 bg-emerald-400 rounded-full" />
          <div className="absolute w-16 border-t border-emerald-500/20" />
          <div className="absolute h-16 border-l border-emerald-500/20" />
        </div>

        {/* Target In Range Banner & Action Button */}
        {targetInRange && (
          <div className="mt-8 pointer-events-auto flex flex-col items-center gap-2">
            <div className="bg-[#0A0E0A]/95 border-2 border-amber-400 px-5 py-2.5 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.35)] flex items-center gap-3 animate-bounce">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                  TARGET OBJECT IN OPTICAL RANGE
                </div>
                <div className="text-white font-bold text-xs font-sans">
                  {targetInRange.name} ({targetInRange.room})
                </div>
              </div>
            </div>

            <button
              onClick={() => onInspectTarget(targetInRange)}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4 fill-current" />
              <span>
                {targetInRange.inspected ? 'RE-INSPECT & UPDATE REPORT' : 'INSPECT & LOG FINDING [E]'}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* 3. Bottom Controls HUD */}
      <div className="flex items-end justify-between z-20 pointer-events-auto">
        
        {/* Spotlight Toggle Button */}
        <button
          onClick={onToggleSpotlight}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono text-xs transition-all shadow-md ${
            isSpotlightOn
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'bg-[#151D14] border-[#2D382B] text-slate-300 hover:bg-[#202B1E]'
          }`}
        >
          <Lightbulb className={`w-4 h-4 ${isSpotlightOn ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>INSPECTION SPOTLIGHT: {isSpotlightOn ? 'ON [F]' : 'OFF [F]'}</span>
        </button>

        {/* Indoor Navigation Guidance */}
        <div className="bg-[#0A0E0A]/80 border border-[#2D382B] px-4 py-1.5 rounded-full text-xs text-slate-400">
          Fly close to objects in the Utility Room, Server Room, or Logistics Bay to unlock the scanner.
        </div>

      </div>

    </div>
  );
};
