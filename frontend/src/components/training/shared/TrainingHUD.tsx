// DRISHTI: Operator Training Workstation HUD & Top Controls
// Stage 3: Operator Training Experiences

import React from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, HelpCircle, Shield, CheckCircle2 } from 'lucide-react';
import { OperatorExperienceDefinition } from '../../../types/operatorTraining';

interface TrainingHUDProps {
  experience: OperatorExperienceDefinition;
  elapsedTimeSec: number;
  isPaused: boolean;
  progressText: string;
  progressPercent: number;
  onPauseToggle: () => void;
  onRestart: () => void;
  onExit: () => void;
  onToggleControls: () => void;
  showControlsGuide: boolean;
}

export const TrainingHUD: React.FC<TrainingHUDProps> = ({
  experience,
  elapsedTimeSec,
  isPaused,
  progressText,
  progressPercent,
  onPauseToggle,
  onRestart,
  onExit,
  onToggleControls,
  showControlsGuide,
}) => {
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#141B12] border-b border-[#384337] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-30 select-none font-mono shrink-0">
      
      {/* Left: Navigation & Experience Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-300 hover:text-white transition-colors"
          title="Return to Operator Training Hub"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#2C3629] text-[10px] text-emerald-400 font-bold border border-[#43503E]">
            {experience.code}
          </span>
          <span className="font-bold text-sm text-white font-sans">
            {experience.title}
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-military-sand/20 border border-[#43503E] text-[10px] text-military-sand font-bold">
            {experience.difficulty}
          </span>
        </div>
      </div>

      {/* Center: Live Objective Progress Bar */}
      <div className="flex items-center gap-3 bg-[#0D120B] px-3.5 py-1.5 rounded-lg border border-[#2D382B]">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">{progressText}</span>
        </div>

        <div className="w-24 sm:w-36 h-2 rounded-full bg-[#1F271D] overflow-hidden border border-[#384337]/60">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Right: Timer & Interactive Controls */}
      <div className="flex items-center gap-3">
        
        {/* Elapsed Timer */}
        <div className="flex items-center gap-1.5 bg-[#0D120B] px-3 py-1 rounded border border-[#2D382B] text-xs">
          <span className="text-slate-400 text-[10px]">TIME:</span>
          <span className="text-emerald-400 font-bold">{formatTimer(elapsedTimeSec)}</span>
        </div>

        {/* Controls Guide Overlay Toggle */}
        <button
          onClick={onToggleControls}
          className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors border ${
            showControlsGuide
              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
              : 'bg-[#2C3629] hover:bg-[#384337] border-[#43503E] text-slate-300'
          }`}
          title="Toggle Control Instructions"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-sans font-medium text-[11px]">Controls</span>
        </button>

        {/* Pause/Resume & Reset */}
        <div className="flex items-center gap-1.5 border-l border-[#384337] pl-3">
          <button
            onClick={onPauseToggle}
            className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-200 transition-colors"
            title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded bg-[#2C3629] hover:bg-[#384337] text-slate-200 transition-colors"
            title="Restart Drill"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
