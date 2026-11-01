// DRISHTI: Simulation Viewport HUD & Perspective Controls
// Stage 1: Visual Foundation & 3D World

import React from 'react';
import { CameraPerspective, EnvironmentType } from '../../types/simulation';
import {
  Orbit,
  Compass,
  Video,
  Sun,
  Sunset,
  Moon,
  Crosshair,
  Info,
  Maximize2,
} from 'lucide-react';

interface ViewportOverlayProps {
  perspective: CameraPerspective;
  onPerspectiveChange: (p: CameraPerspective) => void;
  environmentId: EnvironmentType;
  onEnvironmentChange: (e: EnvironmentType) => void;
  altitudeMeters?: number;
  missionCodename?: string;
}

export const ViewportOverlay: React.FC<ViewportOverlayProps> = ({
  perspective,
  onPerspectiveChange,
  environmentId,
  onEnvironmentChange,
  altitudeMeters = 20,
  missionCodename = 'VERDANT SHIELD',
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono text-xs select-none">
      
      {/* Top Bar: Mission Badge, Heading Strip, Perspective Selector */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Compact Mission Identification Badge */}
        <div className="pointer-events-auto bg-[#1A2118]/85 backdrop-blur-md px-3.5 py-2.5 rounded border border-[#384337] text-slate-200 shadow-military-card">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-bold text-[13px] tracking-wide text-white">
              {missionCodename}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#2C3629] text-[10px] text-[#A3B899] font-semibold border border-[#43503E]">
              SIMULATION ACTIVE
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span>SECTOR 4 TRAINING GROUNDS</span>
            <span className="text-slate-600">•</span>
            <span>ALT {altitudeMeters}M AGL</span>
          </div>
        </div>

        {/* Center Compass Tape */}
        <div className="hidden md:flex flex-col items-center bg-[#1A2118]/80 backdrop-blur-md px-5 py-1.5 rounded border border-[#384337] text-[11px]">
          <div className="flex items-center gap-4 text-slate-400">
            <span>330°</span>
            <span className="text-amber-400 font-bold text-xs">NORTH 000°</span>
            <span>030°</span>
          </div>
          <div className="w-16 h-0.5 bg-amber-400/60 mt-0.5" />
        </div>

        {/* Camera Perspective Selector & Environmental Preset */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Environment Lighting Presets */}
          <div className="flex items-center bg-[#1A2118]/85 backdrop-blur-md p-1 rounded border border-[#384337] shadow-military-card">
            <button
              onClick={() => onEnvironmentChange('rural_day')}
              className={`p-1.5 rounded transition-all ${
                environmentId === 'rural_day'
                  ? 'bg-[#384337] text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Daylight Lighting"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEnvironmentChange('mountain_dusk')}
              className={`p-1.5 rounded transition-all ${
                environmentId === 'mountain_dusk'
                  ? 'bg-[#384337] text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dusk Lighting"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEnvironmentChange('border_night')}
              className={`p-1.5 rounded transition-all ${
                environmentId === 'border_night'
                  ? 'bg-[#384337] text-blue-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Night Surveillance Lighting"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Working Camera Perspective Controls */}
          <div className="flex items-center bg-[#1A2118]/85 backdrop-blur-md p-1 rounded border border-[#384337] shadow-military-card">
            <button
              onClick={() => onPerspectiveChange('tactical_orbit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                perspective === 'tactical_orbit'
                  ? 'bg-[#43503E] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#2C3629]'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Third-Person</span>
            </button>

            <button
              onClick={() => onPerspectiveChange('aerial_overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                perspective === 'aerial_overview'
                  ? 'bg-[#43503E] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#2C3629]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Aerial Overhead</span>
            </button>

            <button
              onClick={() => onPerspectiveChange('drone_fpv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                perspective === 'drone_fpv'
                  ? 'bg-[#43503E] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#2C3629]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Drone FPV Camera</span>
            </button>
          </div>

        </div>

      </div>

      {/* Center FPV Crosshair Reticle (Displayed only when in FPV mode) */}
      {perspective === 'drone_fpv' && (
        <div className="self-center flex flex-col items-center justify-center">
          <div className="relative w-28 h-28 border border-white/20 rounded-full flex items-center justify-center">
            {/* Center crosshair */}
            <div className="w-3 h-0.5 bg-emerald-400" />
            <div className="w-0.5 h-3 bg-emerald-400 absolute" />
            {/* Pitch ladder indicators */}
            <div className="absolute -top-3 w-8 h-0.5 bg-white/40" />
            <div className="absolute -bottom-3 w-8 h-0.5 bg-white/40" />
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-2 tracking-widest bg-black/50 px-2 py-0.5 rounded">
            GIMBAL OPTICS [FOV: 65°]
          </span>
        </div>
      )}

      {/* Bottom Bar: Telemetry Strip & Mouse Navigation Hints */}
      <div className="flex items-end justify-between gap-4">
        
        {/* Telemetry Indicator Strip */}
        <div className="pointer-events-auto bg-[#1A2118]/85 backdrop-blur-md px-3.5 py-2 rounded border border-[#384337] text-slate-300 text-[11px] flex items-center gap-4 shadow-military-card">
          <div>
            <span className="text-slate-500 mr-1.5">ALT:</span>
            <span className="text-white font-bold">{altitudeMeters.toFixed(1)}m AGL</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div>
            <span className="text-slate-500 mr-1.5">SPEED:</span>
            <span className="text-white font-bold">0.0 m/s (HOVER)</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div>
            <span className="text-slate-500 mr-1.5">WIND:</span>
            <span className="text-white font-bold">8 KTS (NE)</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div>
            <span className="text-slate-500 mr-1.5">RF LINK:</span>
            <span className="text-emerald-400 font-bold">98% OPTIMAL</span>
          </div>
        </div>

        {/* Control Interaction Hints */}
        <div className="pointer-events-auto bg-[#1A2118]/85 backdrop-blur-md px-3 py-1.5 rounded border border-[#384337] text-[10px] text-slate-400 flex items-center gap-3">
          <span>Left-Click + Drag: Rotate Angle</span>
          <span className="text-slate-600">•</span>
          <span>Scroll: Zoom Elevation</span>
          <span className="text-slate-600">•</span>
          <span>Right-Click: Pan Scene</span>
        </div>

      </div>

    </div>
  );
};
