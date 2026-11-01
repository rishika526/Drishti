// DRISHTI: Operator Training Syllabus & Mission Launcher
// Stage 3: Operator Training Experiences

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OPERATOR_EXPERIENCES } from '../data/operatorTrainingData';
import {
  Shield,
  Play,
  Clock,
  ArrowRight,
  CheckCircle2,
  Crosshair,
  Eye,
  Camera,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';

export const OperatorTrainingPage: React.FC = () => {
  const navigate = useNavigate();

  const experiences = [
    {
      ...OPERATOR_EXPERIENCES['fpv-flight'],
      route: '/training/fpv',
      icon: Crosshair,
      tagline: 'FIRST-PERSON 6-DOF HANDLING',
      accentColor: 'border-emerald-600/60 bg-emerald-950/20',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      highlightStats: '5 Aerial Gates // Proving Grounds',
      previewGraphic: (
        <div className="relative w-full h-44 bg-gradient-to-br from-[#0D150E] to-[#1E291C] rounded-lg overflow-hidden border border-[#384337] flex items-center justify-center p-4">
          {/* Tactical Horizon & Checkpoint Rings Visual Graphic */}
          <div className="absolute inset-0 bg-tactical-grid opacity-30" />
          <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Crosshair className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400/80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <span>SECTOR 4 PROVING GROUNDS</span>
            <span className="font-bold text-white">6-DOF FPV OPTIC</span>
          </div>
        </div>
      ),
    },
    {
      ...OPERATOR_EXPERIENCES['indoor-inspection'],
      route: '/training/indoor',
      icon: Eye,
      tagline: 'CONFINED SPACE RECONNAISSANCE',
      accentColor: 'border-amber-600/60 bg-amber-950/20',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      highlightStats: '3 Connected Zones // Spotlight Optic',
      previewGraphic: (
        <div className="relative w-full h-44 bg-gradient-to-br from-[#121214] to-[#1F2228] rounded-lg overflow-hidden border border-[#384337] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tactical-dots opacity-30" />
          {/* Indoor Corridor & Spotlight Cone Visual Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-20 border border-slate-700 bg-slate-900/80 rounded flex items-center justify-center shadow-inner relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-transparent" />
              <Eye className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-amber-300/90 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <span>MULTI-ROOM BUNKER INTERIOR</span>
            <span className="font-bold text-amber-400">FLASHLIGHT / SCANNER</span>
          </div>
        </div>
      ),
    },
    {
      ...OPERATOR_EXPERIENCES['aerial-observation'],
      route: '/training/aerial',
      icon: Camera,
      tagline: 'HIGH-ALTITUDE SURVEILLANCE GIMBAL',
      accentColor: 'border-blue-600/60 bg-blue-950/20',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      highlightStats: 'Sectors Alpha-Bravo-Charlie // 1x-4x Zoom',
      previewGraphic: (
        <div className="relative w-full h-44 bg-gradient-to-br from-[#0F171A] to-[#1E2B2F] rounded-lg overflow-hidden border border-[#384337] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tactical-grid opacity-30" />
          {/* Aerial Recon Orbit Reticle Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 border border-blue-400/40 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-blue-300/90 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            <span>MGRS GRID COORDINATES</span>
            <span className="font-bold text-blue-400">NADIR + OBLIQUE 4K</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto select-none">
      
      {/* 1. Header & Doctrine Introduction */}
      <div className="border-b border-military-border pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-military-olive text-xs font-bold uppercase tracking-wider font-mono">
            <Shield className="w-4 h-4" />
            <span>Operational Doctrine // Operator Flight Syllabus</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-military-charcoal font-sans mt-1">
            Operator Training Experiences
          </h2>
          <p className="text-sm text-military-steel mt-1 max-w-2xl font-sans leading-relaxed">
            Hands-on flight familiarization, enclosed structure inspection, and high-altitude surveillance drills. Each module provides realistic 3D interaction, telemetry HUDs, and explainable performance evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/sim')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-military-border bg-military-cream hover:bg-military-sand/40 text-military-charcoal text-xs font-bold tracking-wide transition-all shadow-military-subtle"
          >
            <span>Threat Simulation Workstation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Three Differentiated Training Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => {
          const Icon = exp.icon;

          return (
            <div
              key={exp.id}
              className="p-6 rounded-2xl border border-military-border bg-military-cream flex flex-col justify-between transition-all hover:shadow-military-card hover:border-military-olive/70 relative group"
            >
              <div className="space-y-4">
                
                {/* 3D Visual Preview Window */}
                {exp.previewGraphic}

                {/* Subtitle & Difficulty Pill */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="px-2 py-0.5 rounded bg-military-sand font-bold text-military-charcoal">
                    {exp.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-military-steel flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exp.duration}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${exp.badgeColor}`}>
                      {exp.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-military-olive uppercase block">
                    {exp.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-military-charcoal font-sans mt-0.5">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-military-steel font-sans leading-relaxed mt-2 line-clamp-3">
                    {exp.description}
                  </p>
                </div>

                {/* Key Skills */}
                <div className="pt-2 border-t border-military-border/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-military-subtle font-mono block">
                    Core Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-military-sand/40 text-military-charcoal border border-military-border/60 font-sans"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Action Button */}
              <div className="pt-5 mt-4 border-t border-military-border/60">
                <button
                  onClick={() => navigate(exp.route)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-military-olive hover:bg-military-olive-dark text-white font-bold text-xs tracking-wider uppercase transition-all shadow-military-subtle group-hover:scale-[1.01]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Training</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Operational Standards & AAR Integration Doctrine */}
      <div className="p-6 rounded-xl bg-military-sand/30 border border-military-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-military-charcoal font-mono uppercase">
            <CheckCircle2 className="w-4 h-4 text-military-olive" />
            <span>Local Session History & Assessment Integration</span>
          </div>
          <p className="text-xs text-military-steel font-sans max-w-3xl leading-relaxed">
            All completed flight drills, inspection reports, and reconnaissance sightings are scored through explainable evaluation algorithms and preserved locally for unified After-Action Review (AAR) analysis.
          </p>
        </div>

        <button
          onClick={() => navigate('/aar')}
          className="px-4 py-2 rounded border border-military-border bg-military-cream hover:bg-military-sand/50 text-xs font-bold text-military-charcoal transition-colors shrink-0"
        >
          View Session Records
        </button>
      </div>

    </div>
  );
};

export default OperatorTrainingPage;
