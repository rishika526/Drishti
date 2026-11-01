// DRISHTI: FPV Drone Cockpit HUD Overlay
// Stage 3: Operator Training Experiences

import React from 'react';
import { FPVCheckpointGate } from '../../../types/operatorTraining';
import { Compass, Navigation2, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface FPVCockpitHUDProps {
  altitude: number;
  speed: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  throttlePct: number;
  activeGateIndex: number;
  gates: FPVCheckpointGate[];
  collisionWarning: boolean;
  dronePos: [number, number, number];
}

export const FPVCockpitHUD: React.FC<FPVCockpitHUDProps> = ({
  altitude,
  speed,
  headingDeg,
  pitchDeg,
  rollDeg,
  throttlePct,
  activeGateIndex,
  gates,
  collisionWarning,
  dronePos,
}) => {
  const activeGate = gates[activeGateIndex];
  
  // Calculate relative distance to active gate
  const distanceToGate = activeGate
    ? Math.hypot(
        activeGate.position[0] - dronePos[0],
        activeGate.position[1] - dronePos[1],
        activeGate.position[2] - dronePos[2]
      )
    : 0;

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-mono text-emerald-400 overflow-hidden flex flex-col justify-between p-6">
      
      {/* 1. Top Horizon & Heading Tape */}
      <div className="flex flex-col items-center">
        {/* Compass Tape */}
        <div className="bg-[#0A0E0A]/80 backdrop-blur-sm border border-emerald-500/30 px-6 py-1 rounded-full flex items-center gap-4 text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div className="flex items-center gap-3">
            <span className="text-slate-400">HDG:</span>
            <span className="font-bold text-emerald-300 w-12 text-center">
              {Math.round((headingDeg + 360) % 360).toString().padStart(3, '0')}°
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">MODE:</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-600/50 text-[10px] font-bold text-emerald-300">
              STABILIZED FPV
            </span>
          </div>
        </div>

        {/* Collision Warning Banner */}
        {collisionWarning && (
          <div className="mt-3 bg-rose-950/90 border border-rose-500/80 text-rose-300 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-bounce shadow-[0_0_20px_rgba(244,63,94,0.5)]">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>TERRAIN PROXIMITY WARNING — PULL UP</span>
          </div>
        )}
      </div>

      {/* 2. Center FPV Crosshair & Artificial Horizon Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Dynamic Artificial Horizon Reticle with Roll & Pitch */}
        <div
          className="relative w-64 h-64 border border-emerald-500/20 rounded-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `rotate(${-rollDeg}deg) translateY(${pitchDeg * 2}px)`,
          }}
        >
          {/* Pitch Ladder Bars */}
          <div className="absolute w-32 border-t-2 border-emerald-400/60" />
          <div className="absolute -top-12 w-20 border-t border-dashed border-emerald-400/40 flex justify-between text-[9px]">
            <span>+10</span>
            <span>+10</span>
          </div>
          <div className="absolute -bottom-12 w-20 border-t border-dashed border-emerald-400/40 flex justify-between text-[9px]">
            <span>-10</span>
            <span>-10</span>
          </div>

          {/* Center Crosshair Bore Sight */}
          <div className="w-6 h-6 border-2 border-emerald-400 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
          </div>

          {/* Roll Angle Indices */}
          <div className="absolute -left-3 w-3 border-t-2 border-emerald-400" />
          <div className="absolute -right-3 w-3 border-t-2 border-emerald-400" />
        </div>

        {/* Active Target Gate Waypoint Pip */}
        {activeGate && (
          <div className="absolute top-1/4 flex flex-col items-center">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1 rounded text-xs shadow-md">
              <Navigation2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold text-white uppercase text-[11px]">
                {activeGate.label}
              </span>
              <span className="text-emerald-300 font-bold ml-1">
                {distanceToGate.toFixed(0)}m
              </span>
            </div>
          </div>
        )}

      </div>

      {/* 3. Bottom HUD Readouts: Flight Telemetry & Throttle */}
      <div className="flex items-end justify-between z-20">
        
        {/* Left Telemetry: Speed & Altitude */}
        <div className="bg-[#0A0E0A]/85 backdrop-blur-md border border-[#2D382B] p-3.5 rounded-lg space-y-2 shadow-lg min-w-[140px]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">SPD:</span>
            <span className="text-sm font-bold text-white">{speed.toFixed(1)} m/s</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">ALT (AGL):</span>
            <span className="text-sm font-bold text-emerald-300">{altitude.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-[#2D382B]">
            <span className="text-slate-400">PITCH/ROLL:</span>
            <span className="text-[11px] text-slate-300">
              {pitchDeg.toFixed(0)}° / {rollDeg.toFixed(0)}°
            </span>
          </div>
        </div>

        {/* Center: Checkpoint Progression Tracker */}
        <div className="bg-[#0A0E0A]/90 backdrop-blur-md border border-[#2D382B] px-5 py-2.5 rounded-lg flex items-center gap-3 shadow-lg">
          <span className="text-xs text-slate-400 uppercase font-sans font-medium">
            Waypoint Gates:
          </span>
          <div className="flex items-center gap-2">
            {gates.map((g, idx) => (
              <div
                key={g.id}
                className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-all ${
                  g.cleared
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : idx === activeGateIndex
                    ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 animate-pulse'
                    : 'bg-[#1A2218] text-slate-500 border border-[#2D382B]'
                }`}
              >
                {g.cleared ? '✓' : idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right Telemetry: Throttle Bar & Battery */}
        <div className="bg-[#0A0E0A]/85 backdrop-blur-md border border-[#2D382B] p-3.5 rounded-lg space-y-2 shadow-lg min-w-[140px]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">THROTTLE:</span>
            <span className="text-sm font-bold text-emerald-300">{Math.round(throttlePct)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#1F271D] overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-75"
              style={{ width: `${throttlePct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-[#2D382B]">
            <span className="text-slate-400">BATTERY:</span>
            <span className="text-emerald-400 font-bold">15.8V (94%)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
