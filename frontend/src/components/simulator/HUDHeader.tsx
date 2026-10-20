import React, { useEffect } from 'react';
import {
  Activity,
  Bot,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  XCircle,
  Flag,
} from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export function HUDHeader() {
  const {
    currentScenario,
    missionTime,
    isPaused,
    pauseMission,
    resumeMission,
    resetMission,
    finishMission,
    contacts,
    eventLog,
    lowQualityMode,
    toggleLowQuality,
    soundEnabled,
    toggleSound,
    isAutopilot,
    toggleAutopilot,
  } = useSimulationStore();

  const duration = currentScenario?.duration || 90;
  const remaining = Math.max(0, duration - missionTime);
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);

  const activeThreats = contacts.filter(
    (c) => c.status === 'active' && c.hostile
  ).length;
  const neutralized = contacts.filter(
    (c) => c.status === 'destroyed' || c.status === 'jammed'
  ).length;

  // Keyboard shortcuts (Space = pause/resume, R = reset, A = autopilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPaused) resumeMission();
        else pauseMission();
      } else if (e.key === 'r' || e.key === 'R') {
        resetMission();
      } else if (e.key === 'a' || e.key === 'A') {
        toggleAutopilot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, resumeMission, pauseMission, resetMission, toggleAutopilot]);

  const latestEvent = eventLog[eventLog.length - 1];

  return (
    <header className="bg-hud-panel/90 border-b border-hud-border px-4 py-2 flex items-center justify-between font-mono text-xs select-none backdrop-blur z-20">
      {/* Left: Mission info & Seed */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-hud-green animate-pulse" />
          <span className="font-heading font-black text-sm text-hud-green tracking-wider">
            DRISHTI // SIM
          </span>
        </div>
        <div className="h-4 w-px bg-hud-border" />
        <div className="text-slate-300">
          <span className="font-bold text-slate-100">
            {currentScenario?.name || 'Tactical Drill'}
          </span>
          <span className="ml-2 text-[10px] text-hud-amber font-mono">
            SEED: #{currentScenario?.seed || 10101}
          </span>
        </div>
      </div>

      {/* Center: Mission Clock & Threat Counter & Event Ticker */}
      <div className="flex items-center gap-6">
        {/* Mission Timer */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded border border-hud-border">
          <Clock className="w-3.5 h-3.5 text-hud-amber" />
          <span className="text-slate-400 text-[10px]">REMAINING:</span>
          <span className="font-bold text-sm text-slate-100">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Threat Counters */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1 rounded border border-hud-border text-[11px]">
          <div>
            <span className="text-slate-400">HOSTILE INBOUND: </span>
            <span
              className={`font-bold ${
                activeThreats > 0 ? 'text-hud-red animate-pulse' : 'text-slate-300'
              }`}
            >
              {activeThreats}
            </span>
          </div>
          <div className="h-3 w-px bg-hud-border" />
          <div>
            <span className="text-slate-400">NEUTRALIZED: </span>
            <span className="font-bold text-hud-green">{neutralized}</span>
          </div>
        </div>

        {/* Dynamic Event Ticker */}
        {latestEvent && (
          <div className="hidden xl:flex items-center gap-1.5 max-w-sm truncate text-[11px] text-slate-300 bg-hud-bg/90 px-2 py-0.5 rounded border border-hud-border">
            <Activity className="w-3 h-3 text-hud-cyan shrink-0" />
            <span className="text-hud-amber font-bold shrink-0">
              [{latestEvent.t}s]
            </span>
            <span className="truncate">{latestEvent.message}</span>
          </div>
        )}
      </div>

      {/* Right: Controls & Toggles */}
      <div className="flex items-center gap-2">
        {/* Autopilot Demo Button (P2) */}
        <button
          onClick={toggleAutopilot}
          title="Autopilot: Simulates optimal trainee decisions"
          className={`px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 transition-all ${
            isAutopilot
              ? 'bg-hud-cyan text-black shadow-hud-cyan animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
          }`}
        >
          <Bot className="w-3 h-3" />
          {isAutopilot ? 'AUTOPILOT ON' : 'AUTOPILOT'}
        </button>

        {/* Low Quality Toggle */}
        <button
          onClick={toggleLowQuality}
          title="Toggle Low Quality Mode for low-spec hardware"
          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
            lowQualityMode
              ? 'bg-hud-amber/20 text-hud-amber border border-hud-amber/50'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gauge className="w-3 h-3" />
          {lowQualityMode ? 'LOW Q' : 'HIGH Q'}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title="Toggle WebAudio Sound"
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-hud-green" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Pause / Resume */}
        <button
          onClick={isPaused ? resumeMission : pauseMission}
          className="px-2.5 py-1 rounded font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-hud-green" /> RESUME
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-hud-amber" /> PAUSE
            </>
          )}
        </button>

        {/* Restart Mission */}
        <button
          onClick={resetMission}
          title="Restart Mission (R)"
          className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Finish Drill Early */}
        <button
          onClick={() => finishMission()}
          className="px-2.5 py-1 rounded font-bold bg-hud-red/80 hover:bg-hud-red text-white flex items-center gap-1"
        >
          <Flag className="w-3 h-3" /> FINISH DRILL
        </button>
      </div>
    </header>
  );
}
