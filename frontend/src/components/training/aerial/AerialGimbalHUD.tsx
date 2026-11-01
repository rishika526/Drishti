// DRISHTI: Aerial Observation Reconnaissance Gimbal HUD Overlay
// Stage 3: Operator Training Experiences

import React from 'react';
import { AerialLandmarkTarget } from '../../../types/operatorTraining';
import {
  Compass,
  Crosshair,
  Maximize2,
  ZoomIn,
  Eye,
  CheckCircle2,
  MapPin,
  Camera,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AerialGimbalHUDProps {
  viewMode: 'oblique' | 'overhead';
  zoomLevel: number;
  currentSector: string;
  landmarks: AerialLandmarkTarget[];
  selectedLandmarkId: string | null;
  onToggleViewMode: () => void;
  onSelectZoom: (zoom: number) => void;
  onSlewToLandmark: (landmark: AerialLandmarkTarget) => void;
  onInspectLandmark: (landmark: AerialLandmarkTarget) => void;
  onSubmitReconReport: () => void;
}

export const AerialGimbalHUD: React.FC<AerialGimbalHUDProps> = ({
  viewMode,
  zoomLevel,
  currentSector,
  landmarks,
  selectedLandmarkId,
  onToggleViewMode,
  onSelectZoom,
  onSlewToLandmark,
  onInspectLandmark,
  onSubmitReconReport,
}) => {
  const verifiedCount = landmarks.filter((l) => l.observed).length;
  const allVerified = verifiedCount === landmarks.length;

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-mono text-emerald-400 overflow-hidden flex flex-col justify-between p-6">
      
      {/* 1. Top Bar: Sector Coordinates & Landmark Checklist */}
      <div className="flex items-start justify-between z-20">
        
        {/* Left: Gimbal Telemetry */}
        <div className="bg-[#0A0E0A]/85 backdrop-blur-md border border-[#2D382B] px-4 py-2 rounded-lg space-y-1 shadow-lg">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[10px]">SENSOR GIMBAL:</span>
            <span className="font-bold text-white uppercase text-xs">{currentSector}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-[#2D382B]">
            <span>ALT: 85m AGL</span>
            <span>MGRS: 43Q-XF-8291-3948</span>
            <span>OPTIC: EO/IR-4K</span>
          </div>
        </div>

        {/* Right: Assigned Landmarks Checklist */}
        <div className="bg-[#0A0E0A]/90 backdrop-blur-md border border-[#2D382B] p-3.5 rounded-lg space-y-2 shadow-lg min-w-[240px] pointer-events-auto">
          <div className="flex items-center justify-between text-[11px] border-b border-[#2D382B] pb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              Strategic Landmarks
            </span>
            <span className="text-emerald-300 font-mono">
              {verifiedCount}/{landmarks.length}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {landmarks.map((lm) => (
              <div
                key={lm.id}
                onClick={() => onSlewToLandmark(lm)}
                className={`p-1.5 rounded cursor-pointer border flex items-center justify-between gap-2 transition-all ${
                  selectedLandmarkId === lm.id
                    ? 'bg-emerald-950/80 border-emerald-500'
                    : 'bg-[#151D14] border-[#2D382B] hover:bg-[#1E291D]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {lm.observed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0 inline-block" />
                  )}
                  <span className={`truncate text-[10px] ${lm.observed ? 'text-slate-200' : 'text-slate-400'}`}>
                    {lm.name.split(' ')[2] || lm.name.split(' ')[0]}
                  </span>
                </div>

                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono shrink-0 ${
                    lm.observed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'text-slate-500'
                  }`}
                >
                  {lm.observed ? 'VERIFIED' : 'LOCATE'}
                </span>
              </div>
            ))}
          </div>

          {/* Submit Reconnaissance Findings */}
          {allVerified && (
            <button
              onClick={onSubmitReconReport}
              className="w-full mt-2 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all animate-pulse"
            >
              <span>Submit Recon Debrief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* 2. Center Reconnaissance Reticle & Coordinate Tick Marks */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Gimbal Crosshair with Tick Marks */}
        <div className="relative w-48 h-48 border border-emerald-500/25 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <div className="absolute w-64 border-t border-emerald-500/30" />
          <div className="absolute h-64 border-l border-emerald-500/30" />

          {/* Corner Framing Brackets */}
          <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
        </div>

        {/* Selected Landmark Quick Action Prompt */}
        {selectedLandmarkId && (
          <div className="mt-6 pointer-events-auto">
            {(() => {
              const lm = landmarks.find((l) => l.id === selectedLandmarkId);
              if (!lm) return null;
              return (
                <button
                  onClick={() => onInspectLandmark(lm)}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {lm.observed ? 'RE-EXAMINE' : 'VERIFY & RECORD OBSERVATION'}: {lm.name.split(' ')[0]}
                  </span>
                </button>
              );
            })()}
          </div>
        )}
      </div>

      {/* 3. Bottom Controls HUD: Perspective Mode & Optical Zoom Selector */}
      <div className="flex items-end justify-between z-20 pointer-events-auto">
        
        {/* View Mode Toggle: Oblique vs Overhead Nadir */}
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#151D14] border border-[#2D382B] text-slate-300 hover:bg-[#202B1E] font-mono text-xs transition-all shadow-md"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>
            PERSPECTIVE: {viewMode === 'oblique' ? '45° TACTICAL OBLIQUE [V]' : '90° OVERHEAD NADIR [V]'}
          </span>
        </button>

        {/* Optical Zoom Level Selector */}
        <div className="bg-[#0A0E0A]/90 backdrop-blur-md border border-[#2D382B] p-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
          <span className="text-[10px] text-slate-400 font-sans px-2 flex items-center gap-1">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            ZOOM:
          </span>
          {[1.0, 2.0, 4.0].map((z) => (
            <button
              key={z}
              onClick={() => onSelectZoom(z)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                zoomLevel === z
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#151D14] text-slate-400 hover:text-white'
              }`}
            >
              {z.toFixed(1)}x
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
