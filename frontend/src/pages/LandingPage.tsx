import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Play,
  Radio,
  Shield,
  Zap,
  Cpu,
  Eye,
  Award,
  ChevronRight,
  Server,
  Layers,
} from 'lucide-react';
import { useBackendStatus } from '../hooks/useBackendStatus';
import { SCRIPTED_SCENARIOS } from '../scenarios';
import { useSimulationStore } from '../store/simulationStore';

export function LandingPage() {
  const navigate = useNavigate();
  const { statusText, status } = useBackendStatus();
  const { loadScenario, startMission } = useSimulationStore();

  const handleLaunchQuickDemo = () => {
    const orientationScenario = SCRIPTED_SCENARIOS[0];
    loadScenario(orientationScenario);
    startMission();
    navigate(`/sim/${orientationScenario.id}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-57px)] flex flex-col justify-between overflow-hidden bg-hud-bg text-slate-100">
      {/* Background Decorative Tactical Grid & Radar Sweep Circle */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 40%, rgba(0, 255, 156, 0.15) 0%, transparent 70%), linear-gradient(rgba(27, 42, 64, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(27, 42, 64, 0.2) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-8 flex-1 flex flex-col items-center text-center justify-center">
        {/* Defence Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hud-green/10 border border-hud-green/40 text-hud-green text-xs font-mono mb-6 shadow-hud-green">
          <Shield className="w-3.5 h-3.5" />
          <span>SMART INDIA HACKATHON 2024 // PROBLEM STATEMENT 26247</span>
          <span className="w-1.5 h-1.5 rounded-full bg-hud-green animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-wider text-slate-100 uppercase max-w-4xl leading-tight">
          <span className="text-hud-green drop-shadow-[0_0_25px_rgba(0,255,156,0.4)]">
            DRISHTI
          </span>{' '}
          COUNTER-DRONE SIMULATOR
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-tactical">
          AI-Enabled Single-Drone & Swarm Threat Simulation Trainer for Defence
          Personnel. Train to{' '}
          <span className="text-hud-green font-bold">DETECT</span>,{' '}
          <span className="text-hud-cyan font-bold">CLASSIFY</span>, and{' '}
          <span className="text-hud-amber font-bold">RESPOND</span> across degraded
          sensors and contested terrain.
        </p>

        {/* Big CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 font-mono text-sm">
          <Link
            to="/missions"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-hud-green text-black font-bold flex items-center justify-center gap-2 hover:bg-hud-green/90 shadow-hud-green transition-all transform hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4" />
            <span>LAUNCH TRAINING CURRICULUM</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleLaunchQuickDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-900 border-2 border-hud-green/70 text-hud-green font-bold flex items-center justify-center gap-2 hover:bg-hud-green/10 shadow-hud-green transition-all"
          >
            <Play className="w-4 h-4 fill-hud-green" />
            <span>QUICK DEMO DRILL (90 SECONDS)</span>
          </button>
        </div>

        {/* Architecture & Backend Health Status indicator */}
        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-slate-400">
          <Server className="w-3.5 h-3.5 text-hud-green" />
          <span>System State:</span>
          <span
            className={`font-semibold ${
              status === 'online'
                ? 'text-hud-green'
                : status === 'waking'
                ? 'text-hud-amber'
                : 'text-slate-300'
            }`}
          >
            {statusText}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Frontend runs 100% Standalone in Browser
          </span>
        </div>

        {/* Key Operational Metrics */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border text-left">
            <div className="text-2xl font-bold text-hud-green">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase">
              Deterministic Replay
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Mulberry32 PRNG seed engine
            </div>
          </div>

          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border text-left">
            <div className="text-2xl font-bold text-hud-cyan">40 DRONES</div>
            <div className="text-xs text-slate-400 mt-1 uppercase">
              Swarm Boids AI
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Separation, cohesion, EW split
            </div>
          </div>

          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border text-left">
            <div className="text-2xl font-bold text-hud-amber">EXPLAINABLE</div>
            <div className="text-xs text-slate-400 mt-1 uppercase">
              Decision Trees
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Zero blackbox AAR scoring
            </div>
          </div>

          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border text-left">
            <div className="text-2xl font-bold text-purple-400">BAYESIAN ELO</div>
            <div className="text-xs text-slate-400 mt-1 uppercase">
              Adaptive ML Model
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Targeted weakness training
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Feature Highlights Footer */}
      <div className="border-t border-hud-border bg-hud-panel/60 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-hud-green" />
            <span>Multi-Spectrum Sensors: Radar PPI + Thermal FLIR + Acoustic Cues</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-hud-cyan" />
            <span>Contested Terrains: Urban Canyon Occlusion & Mountain Ranges</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-hud-amber" />
            <span>Electronic Warfare: Sector Strobe Jamming & Signal Degradation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
