import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Award,
  BarChart3,
  CheckCircle,
  Database,
  Flame,
  RotateCcw,
  Shield,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import {
  getAnalyticsDataset,
  getUserSkills,
  resetDemoData,
  AnalyticsDataset,
} from '../lib/analyticsStore';

export function AnalyticsPage() {
  const [viewMode, setViewMode] = useState<'trainee' | 'instructor'>('trainee');
  const [dataset, setDataset] = useState<AnalyticsDataset>(() => getAnalyticsDataset());
  const userSkills = getUserSkills();

  const handleResetData = () => {
    const fresh = resetDemoData();
    setDataset(fresh);
  };

  // Prepare radar chart data for skills
  const radarData = [
    { subject: 'Detection', value: userSkills.detection, fullMark: 1500 },
    { subject: 'Classification', value: userSkills.classification, fullMark: 1500 },
    { subject: 'Engagement', value: userSkills.engagement, fullMark: 1500 },
    { subject: 'Night Ops', value: userSkills.night, fullMark: 1500 },
    { subject: 'Swarm Defense', value: userSkills.swarm, fullMark: 1500 },
    { subject: 'Degraded Sensors', value: userSkills.degradedSensors, fullMark: 1500 },
    { subject: 'Urban Canyon', value: userSkills.urban, fullMark: 1500 },
  ];

  // Weaknesses sorted by rating ascending
  const skillEntries = Object.entries(userSkills) as [string, number][];
  skillEntries.sort((a, b) => a[1] - b[1]);
  const weaknesses = skillEntries.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 font-mono text-slate-100 select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-hud-border pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-hud-green text-xs font-bold tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>OPERATIONAL READINESS & TELEMETRY ANALYTICS</span>
          </div>
          <h1 className="text-3xl font-heading font-black tracking-wide mt-1">
            {viewMode === 'trainee'
              ? 'CADET-01 SKILL DOSSIER & PROGRESSION'
              : 'DSSC UNIT COMMANDER PERFORMANCE OVERVIEW'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Defense Services Staff College Counter-Drone Assessment Metrics
          </p>
        </div>

        {/* View Switcher & Demo Data Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Demo Data Badge */}
          <div className="px-2.5 py-1 rounded bg-slate-900 border border-hud-border text-[11px] flex items-center gap-1.5 text-hud-amber">
            <Database className="w-3.5 h-3.5" />
            <span>DEMO DATA ACTIVE</span>
          </div>

          <button
            onClick={handleResetData}
            title="Reset dataset back to baseline 24 personnel"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET DEMO DATA</span>
          </button>

          {/* Mode Switcher */}
          <div className="bg-slate-900 p-0.5 rounded border border-hud-border flex">
            <button
              onClick={() => setViewMode('trainee')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'trainee'
                  ? 'bg-hud-green text-black shadow-hud-green'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>TRAINEE VIEW</span>
            </button>
            <button
              onClick={() => setViewMode('instructor')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'instructor'
                  ? 'bg-hud-cyan text-black shadow-hud-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>COMMANDER VIEW</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'trainee' ? (
        /* TRAINEE VIEW */
        <div className="space-y-6">
          {/* Trainee Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
              <div className="text-xs text-slate-400">CALLSIGN</div>
              <div className="text-xl font-bold text-hud-green mt-1">
                Cadet-01 (You)
              </div>
              <div className="text-[10px] text-slate-500">Service ID: DSSC-TR-001</div>
            </div>

            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
              <div className="text-xs text-slate-400">TOTAL DRILLS</div>
              <div className="text-xl font-bold text-slate-100 mt-1">
                {dataset.cadetTrend.length} Sessions
              </div>
              <div className="text-[10px] text-slate-500">Over 6 Weeks</div>
            </div>

            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
              <div className="text-xs text-slate-400">AVERAGE SCORE</div>
              <div className="text-xl font-bold text-hud-cyan mt-1">
                {Math.round(
                  dataset.cadetTrend.reduce((a, b) => a + b.score, 0) /
                    dataset.cadetTrend.length
                )}
                %
              </div>
              <div className="text-[10px] text-slate-500">Target: &gt; 85% Combat Ready</div>
            </div>

            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
              <div className="text-xs text-slate-400">STATUS</div>
              <div className="text-xl font-bold text-hud-amber mt-1">
                Combat Ready
              </div>
              <div className="text-[10px] text-slate-500">Tier 1 Perimeter Intercept</div>
            </div>
          </div>

          {/* Charts Row: Trend line and Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Progression Trend */}
            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-hud-green">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  HISTORICAL SCORE PROGRESSION (IMPROVING TREND)
                </span>
                <span className="text-[10px] text-slate-400">Last 10 Runs</span>
              </div>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataset.cadetTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1b2a40" />
                    <XAxis dataKey="session" stroke="#5c708a" fontSize={11} tickFormatter={(v) => `S-${v}`} />
                    <YAxis domain={[40, 100]} stroke="#5c708a" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090e17',
                        borderColor: '#1b2a40',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#00ff9c"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#00ff9c' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Skill Polygon */}
            <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-hud-cyan">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  BAYESIAN-ELO SKILL VECTOR (7 TACTICAL DOMAINS)
                </span>
                <span className="text-[10px] text-slate-400">Baseline 1000</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#1b2a40" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[600, 1400]} stroke="#5c708a" fontSize={8} />
                    <Radar
                      name="Elo Rating"
                      dataKey="value"
                      stroke="#00e5ff"
                      fill="#00e5ff"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Weakness & Targeted Coaching Recommendations */}
          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-3">
            <div className="text-xs font-bold text-hud-amber uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-hud-amber" />
              Targeted Weakness Diagnostic & Tactical Coaching
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {weaknesses.map(([skill, val], i) => (
                <div key={skill} className="p-3 rounded bg-slate-900 border border-hud-border space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="capitalize text-slate-200">
                      {skill.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-hud-amber">{val} Elo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {skill === 'swarm'
                      ? 'Mesh interdiction lag: deploy wideband EW early to break peer-to-peer relay nodes.'
                      : skill === 'degradedSensors'
                      ? 'Radar blackout dependency: train to cross-reference acoustic bearing cues with optical zooms.'
                      : skill === 'night'
                      ? 'FLIR signature recognition: cross-reference engine exhaust hot-spots against civilian quadcopters.'
                      : 'Hone rapid detection stamps within the 3.0s window.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* INSTRUCTOR / COMMANDER VIEW */
        <div className="space-y-6">
          {/* Section Aggregate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataset.sectionStats.map((sec) => (
              <div key={sec.section} className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-base text-slate-100">
                    {sec.section}
                  </span>
                  <span className="text-xs text-hud-green font-bold">
                    {sec.avgScore}% AVG
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Detection Rate:</span>
                    <span className="text-slate-200">{sec.detectionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification Accuracy:</span>
                    <span className="text-slate-200">{sec.classificationAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROE Compliance:</span>
                    <span className="text-slate-200">{sec.roeCompliance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detection Time Distribution Histogram */}
          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-hud-green">
              <span>DETECTION TIME DISTRIBUTION (60 EVALUATION SESSIONS)</span>
              <span className="text-slate-400">Target: &lt; 3.0s Picket Standard</span>
            </div>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataset.detectionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1b2a40" />
                  <XAxis dataKey="bin" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090e17',
                      borderColor: '#1b2a40',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#00ff9c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Heatmap Table */}
          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-3">
            <div className="text-xs font-bold text-hud-cyan uppercase tracking-wider">
              Curriculum Module Pass Rate Heatmap (% Success by Section)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 border-b border-hud-border text-slate-400">
                  <tr>
                    <th className="p-2">Curriculum Module</th>
                    <th className="p-2">Section A</th>
                    <th className="p-2">Section B</th>
                    <th className="p-2">Section C</th>
                    <th className="p-2 text-right">Overall Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hud-border/40">
                  {dataset.heatmap.map((row) => (
                    <tr key={row.scenarioName} className="hover:bg-slate-800/40">
                      <td className="p-2 font-bold text-slate-200">{row.scenarioName}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.sectionA >= 80 ? 'bg-hud-green/20 text-hud-green' : 'bg-hud-amber/20 text-hud-amber'}`}>
                          {row.sectionA}%
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.sectionB >= 80 ? 'bg-hud-green/20 text-hud-green' : 'bg-hud-amber/20 text-hud-amber'}`}>
                          {row.sectionB}%
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${row.sectionC >= 80 ? 'bg-hud-green/20 text-hud-green' : 'bg-hud-amber/20 text-hud-amber'}`}>
                          {row.sectionC}%
                        </span>
                      </td>
                      <td className="p-2 text-right font-bold text-slate-100">
                        {row.overallAvgScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Leaderboard Table (24 personnel) */}
          <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span>UNIT LEADERBOARD (24 DEFENCE PERSONNEL + CADET-01)</span>
              <span className="text-slate-400">Ranked by Composite Score</span>
            </div>
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 border-b border-hud-border text-slate-400 sticky top-0">
                  <tr>
                    <th className="p-2">Rank</th>
                    <th className="p-2">Callsign</th>
                    <th className="p-2">Section</th>
                    <th className="p-2">Service ID</th>
                    <th className="p-2">Avg Score</th>
                    <th className="p-2">Grade</th>
                    <th className="p-2">Composite Elo</th>
                    <th className="p-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hud-border/40">
                  {dataset.leaderboard.map((item, index) => {
                    const isYou = item.callsign.includes('You');
                    return (
                      <tr
                        key={item.serviceId}
                        className={
                          isYou
                            ? 'bg-hud-green/15 font-bold text-hud-green'
                            : 'hover:bg-slate-800/40 text-slate-300'
                        }
                      >
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2 font-bold">{item.callsign}</td>
                        <td className="p-2 text-slate-400">{item.section}</td>
                        <td className="p-2 text-slate-500 font-mono">{item.serviceId}</td>
                        <td className="p-2 font-bold">{item.avgScore}%</td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold">
                            {item.highestGrade}
                          </span>
                        </td>
                        <td className="p-2 text-hud-cyan">{item.compositeRating}</td>
                        <td className="p-2 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              item.status === 'Combat Ready'
                                ? 'bg-hud-green/20 text-hud-green'
                                : 'bg-hud-amber/20 text-hud-amber'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
