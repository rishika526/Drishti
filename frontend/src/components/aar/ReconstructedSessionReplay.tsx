// DRISHTI: Reconstructed Tactical Session Replay Visualizer
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState, useEffect } from 'react';
import { CompletedSessionRecord } from '../../types/simulation';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Crosshair,
  Shield,
  Eye,
  Activity,
  Layers,
  MapPin,
} from 'lucide-react';

interface ReconstructedSessionReplayProps {
  session: CompletedSessionRecord;
}

export const ReconstructedSessionReplay: React.FC<ReconstructedSessionReplayProps> = ({ session }) => {
  const maxDuration = Math.max(10, session.durationSec || 30);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Playback timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= maxDuration) {
            setIsPlaying(false);
            return maxDuration;
          }
          return Math.min(maxDuration, prev + 1);
        });
      }, 500); // 2x playback speed for quick review
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxDuration]);

  const detectionTime = session.score.detectionTimeSec || 10;
  const isCounterDrone =
    session.scenarioId.includes('rural') ||
    session.scenarioId.includes('urban') ||
    session.scenarioId.includes('night') ||
    session.scenarioId.includes('swarm');

  // Format time MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Trajectory calculation for Counter-Drone 2D Radar PPI
  // Flight path from [30, 220] -> [150, 150] -> [250, 130] -> [340, 60] on a 400x300 radar canvas
  const progressRatio = Math.min(1, Math.max(0, playbackTime / maxDuration));
  const droneX = 40 + progressRatio * 320;
  const droneY = 240 - Math.sin(progressRatio * Math.PI) * 110 - progressRatio * 70;

  const detRatio = Math.min(1, Math.max(0, detectionTime / maxDuration));
  const detX = 40 + detRatio * 320;
  const detY = 240 - Math.sin(detRatio * Math.PI) * 110 - detRatio * 70;

  return (
    <div className="bg-[#0B100C] border border-[#2D382B] rounded-xl overflow-hidden flex flex-col font-mono text-emerald-400 select-none shadow-military-card">
      
      {/* 1. Replay Header */}
      <div className="bg-[#121A13] border-b border-[#2D382B] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide font-sans">
            Reconstructed Tactical Airspace Replay
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/40 text-[10px] text-emerald-300">
            TELEMETRY RECONSTRUCTION
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">TIMELINE:</span>
          <span className="text-white font-bold bg-[#0A0E0A] px-2 py-0.5 rounded border border-[#2D382B]">
            {formatTime(playbackTime)} / {formatTime(maxDuration)}
          </span>
        </div>
      </div>

      {/* 2. Visual Reconstructed Radar Screen */}
      <div className="relative w-full h-64 sm:h-72 bg-[#060A06] overflow-hidden flex items-center justify-center p-4">
        
        {/* Radar Concentric Rings & Range Markers */}
        <div className="absolute w-56 h-56 rounded-full border border-emerald-500/20" />
        <div className="absolute w-40 h-40 rounded-full border border-dashed border-emerald-500/25" />
        <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t border-emerald-500/15" />
          <div className="h-full border-l border-emerald-500/15 absolute" />
        </div>

        {/* Range Label Rings */}
        <span className="absolute top-8 text-[9px] text-emerald-500/40">200m PERIMETER</span>
        <span className="absolute top-16 text-[9px] text-emerald-500/40">100m INNER ZONE</span>
        <span className="absolute top-24 text-[9px] text-emerald-500/50">BASE AIRSPACE</span>

        {/* Tactical Airspace Trajectory Graphic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Historical Path Flight Line */}
          <path
            d="M 40 240 Q 180 90 360 80"
            fill="none"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Active Flown Segment */}
          <path
            d={`M 40 240 Q ${40 + (droneX - 40) / 2} ${240 - (240 - droneY) * 0.8} ${droneX} ${droneY}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
          />

          {/* Detection Event Marker */}
          {playbackTime >= detectionTime && (
            <g>
              <circle cx={detX} cy={detY} r="7" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <text x={detX + 10} y={detY - 6} fill="#F59E0B" fontSize="10" fontFamily="monospace">
                T+{detectionTime.toFixed(1)}s: DETECTED
              </text>
            </g>
          )}

          {/* Current Drone Blip Marker */}
          <g transform={`translate(${droneX}, ${droneY})`}>
            <circle cx="0" cy="0" r="6" fill="#10B981" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="#34D399" strokeWidth="1.5" className="animate-ping" />
            <text x="10" y="4" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="monospace">
              TGT-01 [{Math.round(droneX * 2)}m, {Math.round((280 - droneY) * 1.5)}m]
            </text>
          </g>
        </svg>

        {/* Replay Notice Label */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-[#2D382B]">
          {isCounterDrone
            ? 'Tactical 2D PPI Radar Airspace Reconstruction'
            : 'Operator Flight Course Waypoint Sequence'}
        </div>
      </div>

      {/* 3. Replay Scrubber & Playback Controls Bar */}
      <div className="bg-[#0E150F] border-t border-[#2D382B] p-4 space-y-3">
        
        {/* Timeline Scrubber Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={maxDuration}
            value={playbackTime}
            onChange={(e) => {
              setPlaybackTime(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#1F291E] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>00:00 (Infiltration)</span>
            <span className="text-amber-400">T+{detectionTime.toFixed(0)}s (Detection)</span>
            <span>{formatTime(maxDuration)} (Neutralization)</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaybackTime(0)}
              className="p-1.5 rounded bg-[#1B241A] hover:bg-[#253224] text-slate-300 transition-colors"
              title="Reset to 00:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPlaybackTime((prev) => Math.max(0, prev - 5))}
              className="p-1.5 rounded bg-[#1B241A] hover:bg-[#253224] text-slate-300 transition-colors"
              title="Step Back 5s"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Replay'}</span>
            </button>
            <button
              onClick={() => setPlaybackTime((prev) => Math.min(maxDuration, prev + 5))}
              className="p-1.5 rounded bg-[#1B241A] hover:bg-[#253224] text-slate-300 transition-colors"
              title="Step Forward 5s"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {playbackTime < detectionTime ? (
              <span className="text-slate-400">Phase B: Passive Airspace Scanning</span>
            ) : playbackTime < detectionTime + 10 ? (
              <span className="text-amber-400 font-bold">Phase C: Target Optical Inspection</span>
            ) : (
              <span className="text-emerald-400 font-bold">Phase D: Defensive Action Active</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
