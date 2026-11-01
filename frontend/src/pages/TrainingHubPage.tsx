// DRISHTI: Training Hub (Home Screen)
// Stage 1: Visual Foundation & 3D World

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  ArrowRight,
  Compass,
  Clock,
  Shield,
  Layers,
  MapPin,
  ChevronRight,
  FolderOpen,
  Crosshair,
  BookOpen,
  FileText,
  BarChart2,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { FEATURED_MISSION, MISSION_CATALOG } from '../data/missions';
import { ScenarioCategory, TrainingMission, CompletedSessionRecord } from '../types/simulation';
import { getCompletedSessions } from '../data/sessionStore';
import { TrainingWorld } from '../components/world3d/TrainingWorld';

export const TrainingHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ScenarioCategory>('All');
  const [recentSessions, setRecentSessions] = useState<CompletedSessionRecord[]>([]);

  useEffect(() => {
    setRecentSessions(getCompletedSessions().slice(0, 3));
  }, []);

  const categories: ScenarioCategory[] = [
    'All',
    'Rural',
    'Urban',
    'Day',
    'Night',
    'Single Drone',
    'Swarm',
  ];

  const filteredMissions: TrainingMission[] = MISSION_CATALOG.filter((mission: TrainingMission) => {
    if (activeCategory === 'All') return true;
    return mission.category.includes(activeCategory);
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Visually Striking Featured Training Mission with Live 3D Preview */}
      <section className="bg-military-cream border border-military-border rounded-xl overflow-hidden shadow-military-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          
          {/* Mission Details & Launch Callout (5 cols) */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-military-border bg-gradient-to-b from-[#FDFCF9] to-[#F7F4EE]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-military-olive/15 text-military-olive text-xs font-bold tracking-wider font-mono">
                  FEATURED SORTIE
                </span>
                <span className="px-2 py-0.5 rounded bg-military-sand/60 text-military-steel text-xs font-medium">
                  {FEATURED_MISSION.difficulty} Drill
                </span>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-military-amber font-mono font-bold">
                  CODENAME: {FEATURED_MISSION.codename}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-military-charcoal font-sans mt-1">
                  {FEATURED_MISSION.title}
                </h2>
              </div>

              <p className="text-xs text-military-steel leading-relaxed font-sans">
                {FEATURED_MISSION.summary}
              </p>

              {/* Objectives List */}
              <div className="space-y-2 pt-2 border-t border-military-border/60">
                <div className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono">
                  Key Training Objectives
                </div>
                <ul className="space-y-1.5 text-xs text-military-graphite">
                  {FEATURED_MISSION.objectives.map((obj: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-military-olive mt-1.5 flex-shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 text-xs text-military-steel font-mono pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-military-olive" />
                  <span>Sector 4 Ground Facility</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-military-olive" />
                  <span>{FEATURED_MISSION.durationMinutes} min</span>
                </div>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="pt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/sim/${FEATURED_MISSION.id}`)}
                className="flex-1 py-3 px-5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-military-subtle transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Training</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('scenarios-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-3 px-4 rounded-md bg-military-sand/70 hover:bg-military-sand text-military-charcoal text-xs font-semibold tracking-wide border border-military-border transition-all"
              >
                Explore Training
              </button>
            </div>
          </div>

          {/* Large Live 3D Environment Preview (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[340px] bg-black">
            <TrainingWorld
              perspective="tactical_orbit"
              environmentId={FEATURED_MISSION.environment}
              droneAltitude={22}
            />

            {/* Live Preview Indicator */}
            <div className="absolute top-4 left-4 bg-[#1A2118]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#384337] text-white text-[11px] font-mono flex items-center gap-2 pointer-events-none shadow-military-subtle">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>3D RURAL TRAINING AIRSPACE PREVIEW</span>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 right-4 bg-[#1A2118]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#384337] text-slate-300 text-[10px] font-mono pointer-events-none">
              Interactive 3D Engine • Drag to Rotate
            </div>
          </div>

        </div>
      </section>

      {/* 2. Scenario Catalog with Category Filters */}
      <section id="scenarios-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-military-border pb-3">
          <div>
            <h3 className="text-lg font-bold text-military-charcoal tracking-tight font-sans">
              Simulation Scenario Catalog
            </h3>
            <p className="text-xs text-military-steel mt-0.5">
              Select an operational environment to commence specialized counter-drone drills.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-military-olive text-white shadow-military-subtle'
                    : 'bg-military-sand/50 text-military-steel hover:bg-military-sand hover:text-military-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMissions.map((mission: TrainingMission) => (
            <div
              key={mission.id}
              className="bg-military-cream border border-military-border rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-military-card transition-all hover:border-military-olive/50"
            >
              <div>
                {/* Terrain Gradient Strip */}
                <div className={`h-24 bg-gradient-to-br ${mission.thumbnailGradient} p-3 flex flex-col justify-between relative`}>
                  <div className="flex items-center justify-between text-[10px] text-white/90 font-mono">
                    <span className="uppercase tracking-widest bg-black/30 px-1.5 py-0.5 rounded">
                      {mission.codename}
                    </span>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded font-semibold">
                      {mission.difficulty}
                    </span>
                  </div>
                  <div className="text-white text-xs font-mono">
                    {mission.threatType}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-military-charcoal leading-snug">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-military-steel line-clamp-2 leading-relaxed">
                    {mission.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-military-subtle font-mono pt-2 border-t border-military-border/60">
                    <span>{mission.location}</span>
                    <span>{mission.durationMinutes} min</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => navigate(`/sim/${mission.id}`)}
                  className="w-full py-2 px-3 rounded bg-military-sand/60 hover:bg-military-olive hover:text-white text-military-charcoal text-xs font-semibold transition-all border border-military-border flex items-center justify-center gap-1.5"
                >
                  <span>Enter Simulation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Operational Training Pillars Architecture */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Threat Simulation */}
        <div
          onClick={() => navigate('/sim')}
          className="p-5 rounded-xl bg-military-cream border border-military-border hover:border-military-olive/60 hover:shadow-military-card transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive group-hover:bg-military-olive group-hover:text-white transition-all">
              <Crosshair className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-military-charcoal group-hover:text-military-olive transition-colors">
              Threat Simulation
            </h4>
            <p className="text-xs text-military-steel leading-relaxed">
              4 interactive tactical scenarios covering rural infiltration, urban radar masking, night FLIR surveillance, and swarm recognition.
            </p>
          </div>
          <div className="pt-3 border-t border-military-border/60 text-[11px] font-mono font-bold text-military-olive flex items-center gap-1">
            <span>Commence Drills</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 2: Operator Training */}
        <div
          onClick={() => navigate('/training')}
          className="p-5 rounded-xl bg-military-cream border border-military-border hover:border-military-olive/60 hover:shadow-military-card transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive group-hover:bg-military-olive group-hover:text-white transition-all">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-military-charcoal group-hover:text-military-olive transition-colors">
              Operator Training
            </h4>
            <p className="text-xs text-military-steel leading-relaxed">
              Hands-on piloting syllabus featuring 6-DOF FPV flight courses, confined indoor drone inspection, and high-altitude aerial reconnaissance.
            </p>
          </div>
          <div className="pt-3 border-t border-military-border/60 text-[11px] font-mono font-bold text-military-olive flex items-center gap-1">
            <span>Open Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 3: Drishti Academy */}
        <div
          onClick={() => navigate('/academy')}
          className="p-5 rounded-xl bg-military-cream border border-military-border hover:border-military-olive/60 hover:shadow-military-card transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive group-hover:bg-military-olive group-hover:text-white transition-all">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-military-charcoal group-hover:text-military-olive transition-colors">
              Drishti Academy
            </h4>
            <p className="text-xs text-military-steel leading-relaxed">
              Curriculum modules on airframe recognition, multi-sensor signatures, and verified video lessons from authoritative public institutions.
            </p>
          </div>
          <div className="pt-3 border-t border-military-border/60 text-[11px] font-mono font-bold text-military-olive flex items-center gap-1">
            <span>Explore Doctrine</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Pillar 4: After-Action Review */}
        <div
          onClick={() => navigate('/aar')}
          className="p-5 rounded-xl bg-military-cream border border-military-border hover:border-military-olive/60 hover:shadow-military-card transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive group-hover:bg-military-olive group-hover:text-white transition-all">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-military-charcoal group-hover:text-military-olive transition-colors">
              After-Action Review
            </h4>
            <p className="text-xs text-military-steel leading-relaxed">
              Detailed sortie logs, timestamped event feeds, explainable scoring breakdown, and reconstructed 2D tactical airspace replays.
            </p>
          </div>
          <div className="pt-3 border-t border-military-border/60 text-[11px] font-mono font-bold text-military-olive flex items-center gap-1">
            <span>Review Sorties</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </section>

      {/* 4. Recent Training Sorties (Live Local Records or Honest Empty State) */}
      <section className="bg-military-cream border border-military-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-military-charcoal tracking-wide uppercase font-mono">
              Recent Training Sorties
            </h3>
            <p className="text-xs text-military-steel">
              Flight recorder logs and assessment history from local simulator sessions.
            </p>
          </div>

          {recentSessions.length > 0 && (
            <button
              onClick={() => navigate('/aar')}
              className="text-xs font-mono font-bold text-military-olive hover:underline flex items-center gap-1"
            >
              <span>View All Sorties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => navigate('/aar')}
                className="p-4 rounded-lg bg-[#FAF9F6] border border-military-border hover:border-military-olive/60 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-military-steel">
                    <span>{session.sessionId}</span>
                    <span className="text-military-olive font-bold">{new Date(session.dateIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="text-sm font-bold text-military-charcoal">
                    {session.scenarioTitle}
                  </h4>
                  <div className="text-[11px] text-military-steel font-mono">
                    Duration: {session.durationSec}s • {session.events?.length || 0} Events
                  </div>
                </div>

                <div className="pt-2 border-t border-military-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-military-subtle block">RATING</span>
                    <span className="text-xs font-bold text-emerald-800 font-mono">{session.score.rankRating}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold font-mono text-military-charcoal">{session.score.totalScore}</span>
                    <span className="text-[10px] text-military-steel font-mono">/1000</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-lg border border-dashed border-military-border bg-military-sand/20 text-center space-y-3">
            <FolderOpen className="w-8 h-8 mx-auto text-military-muted" />
            <div className="text-xs font-bold text-military-charcoal">
              No local sorties recorded in this session
            </div>
            <p className="text-xs text-military-steel max-w-sm mx-auto">
              Launch a training mission in the Threat Simulation screen to record your flight telemetry and debriefing evaluations.
            </p>
            <button
              onClick={() => navigate('/sim')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-military-olive text-white text-xs font-semibold transition-all shadow-military-subtle hover:bg-military-olive-dark"
            >
              <span>Launch First Sortie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
