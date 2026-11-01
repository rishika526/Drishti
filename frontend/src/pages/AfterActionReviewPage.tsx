// DRISHTI: After-Action Review (AAR) Debriefing Architecture
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompletedSessionRecord } from '../types/simulation';
import {
  getCompletedSessions,
  deleteSession,
  clearAllSessions,
  seedPracticeSorties,
} from '../data/sessionStore';
import { DetailedAARModal } from '../components/aar/DetailedAARModal';
import {
  FileText,
  Clock,
  ShieldCheck,
  RotateCcw,
  Play,
  ArrowRight,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Award,
  Search,
  Filter,
  Trash2,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AfterActionReviewPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [sessions, setSessions] = useState<CompletedSessionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedSession, setSelectedSession] = useState<CompletedSessionRecord | null>(null);

  const reloadSessions = () => {
    setSessions(getCompletedSessions());
  };

  useEffect(() => {
    reloadSessions();
  }, []);

  // Filter Categories
  const categories = [
    { id: 'All', label: 'All Sorties' },
    { id: 'Threat Simulation', label: 'Threat Simulation' },
    { id: 'FPV Training', label: 'FPV Flight' },
    { id: 'Indoor Inspection', label: 'Indoor Inspection' },
    { id: 'Aerial Observation', label: 'Aerial Observation' },
  ];

  // Map session to category
  const getSessionCategory = (s: CompletedSessionRecord) => {
    if (s.scenarioId === 'fpv-flight') return 'FPV Training';
    if (s.scenarioId === 'indoor-inspection') return 'Indoor Inspection';
    if (s.scenarioId === 'aerial-observation') return 'Aerial Observation';
    return 'Threat Simulation';
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const cat = getSessionCategory(s);
    const matchesCategory = categoryFilter === 'All' || cat === categoryFilter;
    const matchesSearch =
      s.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.score.rankRating && s.score.rankRating.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLaunchReDrill = (scenarioId: string) => {
    if (scenarioId === 'fpv-flight') navigate('/training/fpv');
    else if (scenarioId === 'indoor-inspection') navigate('/training/indoor');
    else if (scenarioId === 'aerial-observation') navigate('/training/aerial');
    else navigate(`/sim/${scenarioId}`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans select-none">
      
      {/* 1. Header */}
      <div className="border-b border-military-border pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-military-olive text-xs font-bold uppercase tracking-wider font-mono">
            <FileText className="w-4 h-4" />
            <span>Mission Telemetry & Debriefing Module // Tactical Evaluation</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-military-charcoal font-sans mt-1">
            After-Action Review (AAR)
          </h2>
          <p className="text-sm text-military-steel mt-1 max-w-2xl font-sans leading-relaxed">
            Review detailed telemetry, chronological event feeds, scoring formulas, and reconstructed airspace replays from your completed counter-drone and operator training sorties.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all locally saved sortie records?')) {
                  clearAllSessions();
                  reloadSessions();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded border border-military-border bg-military-cream hover:bg-rose-50 text-rose-800 text-xs font-bold transition-colors font-mono"
              title="Clear Local Session History"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={() => navigate('/sim')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold tracking-wide transition-all shadow-military-subtle"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Threat Simulation</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-military-steel absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sorties by mission title or session ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-military-cream border border-military-border text-xs text-military-charcoal placeholder-military-subtle focus:outline-none focus:ring-1 focus:ring-military-olive font-sans"
            />
          </div>

          <div className="text-xs text-military-steel font-mono">
            {filteredSessions.length} Sortie Log{filteredSessions.length === 1 ? '' : 's'} on Record
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                categoryFilter === c.id
                  ? 'bg-military-olive text-white font-semibold shadow-military-subtle'
                  : 'bg-military-cream border border-military-border text-military-charcoal hover:bg-military-sand/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Session History List or Empty State */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-military-border bg-military-cream/60 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-military-sand/50 border border-military-border flex items-center justify-center text-military-steel">
            <FolderOpen className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-military-charcoal">
              No Completed Sortie Records Found
            </h3>
            <p className="text-xs text-military-steel leading-relaxed">
              You haven't completed any simulation or operator training sessions yet. Complete an exercise in Threat Simulation or Operator Training to view your mission telemetry and tactical debriefing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/sim')}
              className="px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold uppercase tracking-wider transition-all shadow-military-subtle"
            >
              Fly Counter-Drone Mission
            </button>
            <button
              onClick={() => navigate('/training')}
              className="px-5 py-2.5 rounded-md border border-military-border bg-military-cream hover:bg-military-sand/40 text-military-charcoal text-xs font-bold transition-all"
            >
              Launch Operator Training
            </button>
            <button
              onClick={() => {
                seedPracticeSorties();
                reloadSessions();
              }}
              className="px-4 py-2 rounded border border-dashed border-military-border text-military-steel hover:text-military-charcoal hover:bg-military-sand/30 text-xs font-mono transition-colors"
              title="Loads genuine sample practice sorties for evaluation"
            >
              + Load Practice Telemetry (Demo)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const cat = getSessionCategory(session);

            return (
              <div
                key={session.sessionId}
                onClick={() => setSelectedSession(session)}
                className="p-5 rounded-xl border border-military-border bg-military-cream hover:border-military-olive/70 hover:shadow-military-card transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-military-sand text-military-charcoal font-bold">
                      {session.sessionId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-military-olive/15 border border-military-olive/30 text-military-olive font-bold">
                      {cat}
                    </span>
                    <span className="text-military-steel">
                      {new Date(session.dateIso).toLocaleDateString()} at{' '}
                      {new Date(session.dateIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-military-charcoal group-hover:text-military-olive transition-colors font-sans truncate">
                    {session.scenarioTitle}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-military-steel">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-military-subtle" />
                      {session.durationSec}s Duration
                    </span>
                    <span>•</span>
                    <span>Detection: T+{session.score.detectionTimeSec.toFixed(1)}s</span>
                    <span>•</span>
                    <span className="text-emerald-800 font-bold">
                      Score: {session.score.totalScore} / 1000
                    </span>
                  </div>
                </div>

                {/* Rating Badge & Action Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1.5 rounded-lg bg-military-sand/50 border border-military-border text-military-charcoal font-mono font-bold text-xs uppercase shadow-sm">
                    {session.score.rankRating || 'Qualified'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSession(session);
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 rounded bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold transition-all shadow-military-subtle"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Detailed AAR Dossier Modal */}
      {selectedSession && (
        <DetailedAARModal
          session={selectedSession}
          isOpen={true}
          onClose={() => setSelectedSession(null)}
          onLaunchReDrill={handleLaunchReDrill}
        />
      )}

    </div>
  );
};

export default AfterActionReviewPage;
