// DRISHTI: Operator Performance Analytics & Competency Tracking
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompletedSessionRecord } from '../types/simulation';
import { AcademyProgressState } from '../types/academy';
import {
  getCompletedSessions,
  getAcademyProgress,
  seedPracticeSorties,
} from '../data/sessionStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Target,
  ShieldCheck,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  FolderOpen,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<CompletedSessionRecord[]>([]);
  const [academyProgress, setAcademyProgress] = useState<AcademyProgressState>(() =>
    getAcademyProgress()
  );

  const reloadData = () => {
    setSessions(getCompletedSessions());
    setAcademyProgress(getAcademyProgress());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const totalSorties = sessions.length;

  // Filter counter-drone sessions for latency and classification stats
  const counterDroneSessions = sessions.filter(
    (s) =>
      s.scenarioId.includes('rural') ||
      s.scenarioId.includes('urban') ||
      s.scenarioId.includes('night') ||
      s.scenarioId.includes('swarm')
  );

  // Compute Aggregates
  const avgScore =
    totalSorties > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.score.totalScore, 0) / totalSorties)
      : 0;

  const avgDetectionLatency =
    counterDroneSessions.length > 0
      ? (
          counterDroneSessions.reduce((acc, s) => acc + s.score.detectionTimeSec, 0) /
          counterDroneSessions.length
        ).toFixed(1)
      : '--';

  const classificationAccuracyRate =
    counterDroneSessions.length > 0
      ? Math.round(
          (counterDroneSessions.filter((s) => s.score.classificationAccurate).length /
            counterDroneSessions.length) *
            100
        )
      : 0;

  const modulesCompletedCount = Object.values(academyProgress.moduleProgress).filter(
    (m) => m.completed
  ).length;

  // Category counts
  const catCounts = {
    'Threat Simulation': counterDroneSessions.length,
    'FPV Flight': sessions.filter((s) => s.scenarioId === 'fpv-flight').length,
    'Indoor Inspection': sessions.filter((s) => s.scenarioId === 'indoor-inspection').length,
    'Aerial Observation': sessions.filter((s) => s.scenarioId === 'aerial-observation').length,
  };

  // Best category calculation
  const bestCategory =
    totalSorties > 0
      ? Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'Counter-Drone';

  // Chart Data 1: Score Progression Chronological (oldest to newest)
  const scoreProgressionData = [...sessions].reverse().map((s, idx) => ({
    name: `S-${idx + 1}`,
    score: s.score.totalScore,
    scenario: s.scenarioTitle,
  }));

  // Chart Data 2: Detection Latency Trend
  const latencyTrendData = [...counterDroneSessions].reverse().map((s, idx) => ({
    name: `M-${idx + 1}`,
    latency: Number(s.score.detectionTimeSec.toFixed(1)),
    title: s.scenarioTitle,
  }));

  // Chart Data 3: Activity Breakdown
  const activityBreakdownData = [
    { category: 'Threat Sim', sorties: catCounts['Threat Simulation'] },
    { category: 'FPV Flight', sorties: catCounts['FPV Flight'] },
    { category: 'Indoor Insp', sorties: catCounts['Indoor Inspection'] },
    { category: 'Aerial Recon', sorties: catCounts['Aerial Observation'] },
  ];

  // Dynamic Strengths & Areas for Improvement (Transparent Rule-Based)
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (totalSorties >= 1) {
    if (avgScore >= 800) {
      strengths.push(`High aggregate mission scoring discipline (Average: ${avgScore}/1000 pts).`);
    }
    if (counterDroneSessions.length > 0) {
      if (Number(avgDetectionLatency) < 10) {
        strengths.push(`Rapid airspace target acquisition reflexes (Average Latency: ${avgDetectionLatency}s).`);
      } else {
        improvements.push(
          `Target detection latency averages ${avgDetectionLatency}s. Scan radar azimuth cues and initiate wider optical sweeps earlier.`
        );
      }

      if (classificationAccuracyRate >= 75) {
        strengths.push(`Consistently accurate target classification (${classificationAccuracyRate}% verified).`);
      } else {
        improvements.push(
          `Classification accuracy stands at ${classificationAccuracyRate}%. Review the Academy module "Drone Recognition & Airframe Fundamentals".`
        );
      }
    }

    if (catCounts['FPV Flight'] > 0) {
      strengths.push('Demonstrated spatial orientation and checkpoint control in First-Person View (FPV) flight.');
    } else {
      improvements.push('No FPV Flight Familiarization sorties logged. Practice manual 6-DOF drone maneuvering.');
    }
  }

  // Next Recommended Training Rule
  const getRecommendation = () => {
    if (totalSorties === 0) {
      return {
        title: 'Single Unknown Drone — Rural Daylight',
        type: 'Counter-Drone Threat Simulation',
        route: '/sim/rural-day-unknown',
        rationale: 'Begin with foundational daytime visual airspace observation and unknown target classification.',
      };
    }
    if (modulesCompletedCount < 2) {
      return {
        title: 'Drone Recognition & Airframe Fundamentals',
        type: 'Drishti Academy Interactive Module',
        route: '/academy',
        rationale: 'Ground your operational decisions in multi-rotor and fixed-wing classification doctrine.',
      };
    }
    if (catCounts['FPV Flight'] === 0) {
      return {
        title: 'FPV Flight Familiarization',
        type: 'Operator Training Drill',
        route: '/training/fpv',
        rationale: 'Build 6-DOF manual drone piloting reflexes across illuminated waypoint gates.',
      };
    }
    if (catCounts['Indoor Inspection'] === 0) {
      return {
        title: 'Indoor Drone Inspection',
        type: 'Operator Training Drill',
        route: '/training/indoor',
        rationale: 'Master low-light confined space facility inspection and hazard identification.',
      };
    }
    return {
      title: 'Multiple Drone Activity — Swarm Awareness',
      type: 'Advanced Threat Simulation',
      route: '/sim/swarm-awareness',
      rationale: 'Test multi-vector target tracking and command escalation under saturation conditions.',
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans select-none">
      
      {/* 1. Header */}
      <div className="border-b border-military-border pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-military-olive text-xs font-bold uppercase tracking-wider font-mono">
            <BarChart2 className="w-4 h-4" />
            <span>Air Defense Operator Readiness Index // Operational Telemetry</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-military-charcoal font-sans mt-1">
            Performance Analytics
          </h2>
          <p className="text-sm text-military-steel mt-1 max-w-2xl font-sans leading-relaxed">
            Consolidated operator readiness metrics derived exclusively from actual locally completed simulation sorties and Academy knowledge examinations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/aar')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-military-border bg-military-cream hover:bg-military-sand/40 text-military-charcoal text-xs font-bold transition-all shadow-military-subtle"
          >
            <span>Sortie History (AAR)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Sorties */}
        <div className="p-5 rounded-xl border border-military-border bg-military-cream space-y-1">
          <div className="flex items-center justify-between text-military-subtle text-xs font-mono">
            <span>TOTAL SORTIES</span>
            <Activity className="w-4 h-4 text-military-olive" />
          </div>
          <div className="text-3xl font-extrabold text-military-charcoal font-mono">
            {totalSorties}
          </div>
          <div className="text-[11px] text-military-steel font-mono">
            {totalSorties > 0 ? `${bestCategory} Primary` : 'No Sorties Logged'}
          </div>
        </div>

        {/* Aggregate Average Score */}
        <div className="p-5 rounded-xl border border-military-border bg-military-cream space-y-1">
          <div className="flex items-center justify-between text-military-subtle text-xs font-mono">
            <span>AVERAGE SCORE</span>
            <Award className="w-4 h-4 text-military-olive" />
          </div>
          <div className="text-3xl font-extrabold text-military-charcoal font-mono">
            {totalSorties > 0 ? avgScore : '--'}
          </div>
          <div className="text-[11px] text-emerald-800 font-mono font-bold">
            {totalSorties > 0 ? 'Benchmark: 1,000 PTS' : 'Awaiting First Sortie'}
          </div>
        </div>

        {/* Detection Latency */}
        <div className="p-5 rounded-xl border border-military-border bg-military-cream space-y-1">
          <div className="flex items-center justify-between text-military-subtle text-xs font-mono">
            <span>AVG DETECTION</span>
            <Clock className="w-4 h-4 text-military-olive" />
          </div>
          <div className="text-3xl font-extrabold text-military-charcoal font-mono">
            {avgDetectionLatency !== '--' ? `${avgDetectionLatency}s` : '--'}
          </div>
          <div className="text-[11px] text-military-steel font-mono">
            {counterDroneSessions.length > 0 ? `${counterDroneSessions.length} Missions Sampled` : 'Target: < 12.0s'}
          </div>
        </div>

        {/* Classification Accuracy */}
        <div className="p-5 rounded-xl border border-military-border bg-military-cream space-y-1">
          <div className="flex items-center justify-between text-military-subtle text-xs font-mono">
            <span>CLASSIFICATION</span>
            <ShieldCheck className="w-4 h-4 text-military-olive" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-800 font-mono">
            {counterDroneSessions.length > 0 ? `${classificationAccuracyRate}%` : '--'}
          </div>
          <div className="text-[11px] text-military-steel font-mono">
            {modulesCompletedCount} Academy Module{modulesCompletedCount === 1 ? '' : 's'} Passed
          </div>
        </div>

      </div>

      {/* 3. Empty State Notice if No Data */}
      {totalSorties === 0 && (
        <div className="p-8 rounded-xl border border-dashed border-military-border bg-military-cream/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-military-charcoal">
              No Training Analytics On Record
            </h4>
            <p className="text-xs text-military-steel leading-relaxed max-w-2xl">
              Performance charts and competency trends populate dynamically as you complete counter-drone scenarios and operator drills.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                seedPracticeSorties();
                reloadData();
              }}
              className="px-4 py-2 rounded border border-dashed border-military-border bg-military-cream hover:bg-military-sand/40 text-xs font-mono font-bold text-military-charcoal transition-colors"
            >
              + Load Practice Telemetry (Demo)
            </button>
            <button
              onClick={() => navigate('/sim')}
              className="px-4 py-2 rounded bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold uppercase transition-all shadow-military-subtle"
            >
              Start First Sortie
            </button>
          </div>
        </div>
      )}

      {/* 4. Progress Visualizations (Charts) */}
      {totalSorties > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Score Progression Over Sessions */}
          <div className="p-6 rounded-2xl border border-military-border bg-military-cream space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono block">
                  Drill Performance Trend
                </span>
                <h4 className="text-base font-bold text-military-charcoal">
                  Score Progression (Latest Sorties)
                </h4>
              </div>
              <span className="text-xs font-mono text-military-steel">Target: 800+</span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreProgressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43503E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#43503E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CB" />
                  <XAxis dataKey="name" stroke="#6F7B6B" fontSize={11} fontVariant="monospace" />
                  <YAxis domain={[0, 1000]} stroke="#6F7B6B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A2318', border: '1px solid #384337', borderRadius: '8px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#43503E" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Detection Latency Trend */}
          <div className="p-6 rounded-2xl border border-military-border bg-military-cream space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono block">
                  Airspace Surveillance Reaction
                </span>
                <h4 className="text-base font-bold text-military-charcoal">
                  Detection Latency (Seconds to Acquire)
                </h4>
              </div>
              <span className="text-xs font-mono text-military-steel">Lower is Better</span>
            </div>

            <div className="h-60 w-full pt-2">
              {counterDroneSessions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DED8CB" />
                    <XAxis dataKey="name" stroke="#6F7B6B" fontSize={11} />
                    <YAxis domain={[0, 25]} stroke="#6F7B6B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1A2318', border: '1px solid #384337', borderRadius: '8px', color: '#FFF' }}
                    />
                    <Line type="monotone" dataKey="latency" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4, fill: '#D97706' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-military-steel font-mono">
                  No counter-drone threat missions logged yet.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 5. Strengths & Improvement Areas */}
      {totalSorties > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="p-6 rounded-2xl border border-military-border bg-military-cream space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-bold font-sans">
                Demonstrated Operational Strengths
              </h4>
            </div>

            <div className="space-y-2">
              {strengths.length > 0 ? (
                strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span>{str}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-military-steel">
                  Complete additional sorties to confirm consistent strengths.
                </div>
              )}
            </div>
          </div>

          {/* Improvement Areas */}
          <div className="p-6 rounded-2xl border border-military-border bg-military-cream space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h4 className="text-base font-bold font-sans">
                Targeted Improvement Directives
              </h4>
            </div>

            <div className="space-y-2">
              {improvements.length > 0 ? (
                improvements.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <span className="font-bold text-amber-700">•</span>
                    <span>{imp}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  Zero critical performance defects recorded across current sortie history.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 6. Recommended Next Training Card */}
      <div className="p-6 rounded-2xl bg-military-sand/40 border border-military-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-military-olive text-xs font-bold uppercase tracking-wider font-mono">
            <Zap className="w-4 h-4" />
            <span>Rule-Based Adaptive Training Recommendation</span>
          </div>
          <h3 className="text-xl font-bold text-military-charcoal font-sans">
            {recommendation.title}
          </h3>
          <p className="text-xs text-military-steel font-sans leading-relaxed">
            {recommendation.rationale}
          </p>
        </div>

        <button
          onClick={() => navigate(recommendation.route)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-military-olive hover:bg-military-olive-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-military-subtle shrink-0"
        >
          <span>Engage Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default PerformancePage;
