import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Compass,
  FileQuestion,
  Glasses,
  Radio,
  Server,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useBackendStatus } from '../hooks/useBackendStatus';
import { useSimulationStore } from '../store/simulationStore';

export function Navbar() {
  const location = useLocation();
  const { status, statusText, latencyMs } = useBackendStatus();
  const { soundEnabled, toggleSound } = useSimulationStore();

  const navLinks = [
    { to: '/missions', label: 'MISSIONS', icon: Compass },
    { to: '/analytics', label: 'ANALYTICS', icon: BarChart3 },
    { to: '/how-it-works', label: 'SYSTEM ARCHITECTURE', icon: FileQuestion },
  ];

  return (
    <nav className="bg-hud-bg/95 border-b border-hud-border sticky top-0 z-50 backdrop-blur px-4 py-2.5 font-mono text-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-slate-900 border border-hud-green flex items-center justify-center text-hud-green shadow-hud-green transition-transform group-hover:scale-105">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-lg tracking-wider text-slate-100 group-hover:text-hud-green transition-colors">
                DRISHTI
              </span>
              <span className="text-[10px] bg-hud-green/10 text-hud-green px-1.5 py-0.2 rounded border border-hud-green/30">
                MoD DSSC
              </span>
            </div>
            <div className="text-[9px] text-slate-400 -mt-1 hidden sm:block">
              AI Counter-Drone Threat Simulator
            </div>
          </div>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-hud-green/15 text-hud-green border border-hud-green/50 shadow-hud-green'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side status badges & sound */}
        <div className="flex items-center gap-2.5">
          {/* Disabled VR Mode (WebXR) Roadmap Badge */}
          <div
            title="WebXR immersion roadmap item"
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 cursor-not-allowed"
          >
            <Glasses className="w-3 h-3 text-slate-600" />
            <span>VR (WebXR) - ROADMAP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute WebAudio Synthesizer' : 'Enable WebAudio'}
            className="p-1.5 rounded bg-slate-900 border border-hud-border text-slate-300 hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-hud-green" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {/* Backend Status Badge */}
          <div
            title={
              status === 'online'
                ? `FastAPI Microservice online (${latencyMs}ms)`
                : status === 'waking'
                ? 'Pinging Render free-tier container (cold start ~30s)'
                : '100% Standalone local mode - no backend required'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border ${
              status === 'online'
                ? 'bg-hud-green/10 text-hud-green border-hud-green/40'
                : status === 'waking'
                ? 'bg-hud-amber/10 text-hud-amber border-hud-amber/40 animate-pulse'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'online'
                  ? 'bg-hud-green shadow-hud-green'
                  : status === 'waking'
                  ? 'bg-hud-amber animate-ping'
                  : 'bg-slate-500'
              }`}
            />
            <span className="hidden md:inline">{statusText}</span>
            <span className="md:hidden">
              {status === 'online' ? 'ONLINE' : status === 'waking' ? 'WAKING' : 'LOCAL'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
