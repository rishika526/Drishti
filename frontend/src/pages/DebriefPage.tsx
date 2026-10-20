import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  FileText,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Target,
  XCircle,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { useSimulationStore } from '../store/simulationStore';
import {
  recordUserSession,
  getUserSkills,
  saveUserSkills,
} from '../lib/analyticsStore';
import { updateTraineeSkills } from '../engine/adaptive';
import { SCRIPTED_SCENARIOS } from '../scenarios';

export function DebriefPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const {
    scoreResult,
    currentScenario,
    telemetrySnapshots,
    eventLog,
    loadScenario,
    startMission,
  } = useSimulationStore();

  const [expandedThreatId, setExpandedThreatId] = useState<string | null>(null);

  // 2D Replay Scrubber State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [replayTime, setReplayTime] = useState<number>(0);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(true);

  const duration = scoreResult?.durationSeconds || currentScenario?.duration || 90;

  // Persist score to Cadet-01 analytics on mount
  useEffect(() => {
    if (scoreResult) {
      recordUserSession(scoreResult);
      if (currentScenario) {
        const currentSkills = getUserSkills();
        const updatedSkills = updateTraineeSkills(
          currentSkills,
          currentScenario,
          scoreResult
        );
        saveUserSkills(updatedSkills);
      }
    }
  }, [scoreResult, currentScenario]);

  // Replay animation timer
  useEffect(() => {
    if (!isPlayingReplay) return;
    const interval = setInterval(() => {
      setReplayTime((prev) => {
        if (prev >= duration) {
          setIsPlayingReplay(false);
          return duration;
        }
        return Math.min(duration, prev + 0.5);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlayingReplay, duration]);

  // Draw 2D top-down replay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = cx - 14;
    const maxRange = 2400; // meters

    // Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Range rings
    ctx.strokeStyle = 'rgba(0, 255, 156, 0.18)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach((step) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * step, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 1200m WEZ Envelope Ring
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 176, 0, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius * (1200 / maxRange), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Center base
    ctx.fillStyle = '#00ff9c';
    ctx.fillRect(cx - 3, cy - 3, 6, 6);

    // Find current snapshot at replayTime
    const currentSnap = telemetrySnapshots.reduce((prev, curr) => {
      return curr.t <= replayTime ? curr : prev;
    }, telemetrySnapshots[0]);

    // Draw full trajectory paths from all snapshots up to current replayTime
    const relevantSnaps = telemetrySnapshots.filter((s) => s.t <= replayTime);
    const pathsById: Record<string, [number, number][]> = {};

    relevantSnaps.forEach((s) => {
      s.contacts.forEach((c) => {
        if (!pathsById[c.id]) pathsById[c.id] = [];
        const r = (Math.hypot(c.pos[0], c.pos[2]) / maxRange) * maxRadius;
        const rad = Math.atan2(c.pos[0], c.pos[2]) - Math.PI / 2;
        const px = cx + Math.cos(rad) * r;
        const py = cy + Math.sin(rad) * r;
        pathsById[c.id].push([px, py]);
      });
    });

    // Draw trails
    Object.entries(pathsById).forEach(([id, points]) => {
      if (points.length < 2) return;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
    });

    // Draw active contact points at current time
    if (currentSnap) {
      currentSnap.contacts.forEach((c) => {
        const r = (Math.hypot(c.pos[0], c.pos[2]) / maxRange) * maxRadius;
        const rad = Math.atan2(c.pos[0], c.pos[2]) - Math.PI / 2;
        const px = cx + Math.cos(rad) * r;
        const py = cy + Math.sin(rad) * r;

        ctx.save();
        ctx.fillStyle = c.hostile ? '#ef4444' : '#1e90ff';
        ctx.beginPath();
        ctx.arc(px, py, c.hostile ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(c.id.split('-').pop() || '', px + 5, py - 3);
        ctx.restore();
      });
    }
  }, [telemetrySnapshots, replayTime]);

  const handleReplaySeed = () => {
    if (currentScenario) {
      loadScenario(currentScenario);
      startMission();
      navigate(`/sim/${currentScenario.id}`);
    } else {
      navigate('/missions');
    }
  };

  const gradeColor =
    scoreResult?.grade === 'A'
      ? 'text-hud-green border-hud-green shadow-hud-green'
      : scoreResult?.grade === 'B'
      ? 'text-hud-cyan border-hud-cyan shadow-hud-cyan'
      : scoreResult?.grade === 'C'
      ? 'text-hud-amber border-hud-amber shadow-hud-amber'
      : 'text-hud-red border-hud-red shadow-hud-red';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 font-mono text-slate-100 select-none">
      {/* AAR Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-hud-border pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-hud-green text-xs font-bold tracking-wider">
            <FileText className="w-4 h-4" />
            <span>AFTER ACTION REPORT (AAR) // MISSION DEBRIEF</span>
          </div>
          <h1 className="text-3xl font-heading font-black tracking-wide mt-1">
            {scoreResult?.scenarioName || 'Simulation Drill'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Session ID: {scoreResult?.sessionId || sessionId} • Seed: #{scoreResult?.seed || 10101} • Fixed Timestep 2Hz Telemetry
          </p>
        </div>

        {/* Grade Badge */}
        <div className="flex items-center gap-4 bg-hud-panel border border-hud-border p-3 rounded-lg">
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase">Composite Score</div>
            <div className="text-3xl font-bold font-heading text-slate-100">
              {scoreResult?.overallScore ?? 0}
              <span className="text-sm text-slate-500 font-normal"> / 100</span>
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-heading font-black text-3xl ${gradeColor} bg-slate-900`}
          >
            {scoreResult?.grade ?? 'C'}
          </div>
        </div>
      </div>

      {/* Critical Breaches Alert Callout */}
      {scoreResult?.criticalErrors && scoreResult.criticalErrors.length > 0 && (
        <div className="p-4 rounded-lg bg-red-950/40 border-2 border-hud-red/80 space-y-2">
          <div className="flex items-center gap-2 text-hud-red font-bold text-sm">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
            <span>
              CRITICAL TACTICAL BREACHES ({scoreResult.criticalErrors.length}) - GRADE CAPPED AT &apos;C&apos;
            </span>
          </div>
          <ul className="text-xs text-slate-200 list-disc list-inside space-y-1">
            {scoreResult.criticalErrors.map((err, idx) => (
              <li key={idx} className="font-semibold text-red-300">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4 Score Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DETECTION (25%)</span>
            <Target className="w-4 h-4 text-hud-green" />
          </div>
          <div className="text-2xl font-bold font-heading text-hud-green mt-1">
            {scoreResult?.breakdown.detection ?? 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Target acquire & flag latency
          </div>
        </div>

        <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CLASSIFICATION (30%)</span>
            <CheckCircle2 className="w-4 h-4 text-hud-cyan" />
          </div>
          <div className="text-2xl font-bold font-heading text-hud-cyan mt-1">
            {scoreResult?.breakdown.classification ?? 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            RF & IFF signature taxonomy
          </div>
        </div>

        <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ENGAGEMENT (35%)</span>
            <ShieldAlert className="w-4 h-4 text-hud-amber" />
          </div>
          <div className="text-2xl font-bold font-heading text-hud-amber mt-1">
            {scoreResult?.breakdown.engagement ?? 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            EW vs Kinetic action inside WEZ
          </div>
        </div>

        <div className="p-4 rounded-lg bg-hud-panel border border-hud-border">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ROE RESTRAINT (10%)</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-purple-400 mt-1">
            {scoreResult?.breakdown.roe ?? 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Zero fratricide & disciplined hold
          </div>
        </div>
      </div>

      {/* 2D Top-Down Replay Scrubber */}
      <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-3">
        <div className="flex items-center justify-between border-b border-hud-border pb-2 text-xs">
          <div className="flex items-center gap-2 text-hud-cyan font-bold">
            <Clock className="w-4 h-4" />
            <span>2D TOP-DOWN TELEMETRY REPLAY ({telemetrySnapshots.length} SNAPSHOTS @ 2Hz)</span>
          </div>
          <div className="text-slate-400">
            TIME: <span className="text-hud-amber font-bold">{replayTime.toFixed(1)}s</span> / {duration}s
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full border border-hud-cyan/40 bg-black"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 bg-black/80 px-2 py-0.5 rounded border border-slate-800">
              WEZ Envelope: 1200m (amber dash)
            </div>
          </div>

          <div className="flex-1 w-full space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 border border-slate-700"
              >
                {isPlayingReplay ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-hud-amber" /> PAUSE
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-hud-green" /> PLAY REPLAY
                  </>
                )}
              </button>

              <button
                onClick={() => setReplayTime(0)}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="0"
                max={duration}
                step="0.5"
                value={replayTime}
                onChange={(e) => {
                  setReplayTime(Number(e.target.value));
                  setIsPlayingReplay(false);
                }}
                className="flex-1 accent-hud-cyan cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/90 border border-hud-border rounded p-3 text-[11px] space-y-1.5">
              <div className="text-hud-green font-bold uppercase">
                Tactical Coaching Assessment
              </div>
              {scoreResult?.coachingFeedback.map((tip, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">
                  • {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explainable Decision Tree Path per Contact */}
      <div className="p-4 rounded-lg bg-hud-panel border border-hud-border space-y-3">
        <div className="flex items-center justify-between border-b border-hud-border pb-2 text-xs">
          <span className="font-bold text-hud-green uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Explainable Decision Tree Paths ({scoreResult?.threatScores.length || 0} Contacts)
          </span>
          <span className="text-slate-400 text-[10px]">
            CLICK TO EXPAND WHY POINTS WERE AWARDED OR PENALIZED
          </span>
        </div>

        <div className="space-y-2">
          {scoreResult?.threatScores.map((threat) => {
            const isExpanded = expandedThreatId === threat.threatId;

            return (
              <div
                key={threat.threatId}
                className="rounded border border-hud-border/70 bg-slate-900/70 overflow-hidden"
              >
                <div
                  onClick={() =>
                    setExpandedThreatId(isExpanded ? null : threat.threatId)
                  }
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        threat.criticalError
                          ? 'bg-hud-red'
                          : threat.hostile
                          ? 'bg-hud-amber'
                          : 'bg-hud-green'
                      }`}
                    />
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{threat.callsign}</span>
                        <span className="text-[10px] text-slate-400">
                          (Actual: {threat.actualType.toUpperCase()})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Classified as:{' '}
                        <strong className="text-slate-200">
                          {threat.classifiedAs?.toUpperCase() || 'UNCLASSIFIED'}
                        </strong>{' '}
                        • Action:{' '}
                        <strong className="text-hud-amber">
                          {threat.actionTaken?.toUpperCase() || 'NONE'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-sm text-hud-green">
                        {threat.totalScore}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Detect: {threat.detectionScore}%
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Explainable Decision Tree Path Nodes */}
                {isExpanded && (
                  <div className="p-3 bg-black/60 border-t border-hud-border space-y-2 text-xs">
                    <div className="text-[11px] text-hud-cyan font-bold mb-1">
                      DECISION TREE AUDIT TRAIL:
                    </div>
                    {threat.decisionPath.map((node, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-200">{node.node}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded ${
                              node.result
                                ? 'bg-hud-green/20 text-hud-green'
                                : 'bg-hud-red/20 text-hud-red'
                            }`}
                          >
                            {node.result ? 'YES / PASS' : 'NO / FAIL'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          Condition: {node.condition}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Evaluation: {node.note}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-hud-border">
        <button
          onClick={handleReplaySeed}
          className="px-5 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>REPLAY THIS SEED (#{scoreResult?.seed})</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/analytics')}
            className="px-5 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700"
          >
            <BarChart2 className="w-4 h-4" />
            <span>UNIT ANALYTICS</span>
          </button>

          <button
            onClick={() => navigate('/missions')}
            className="px-6 py-2.5 rounded bg-hud-green text-black font-bold text-xs flex items-center gap-2 hover:bg-hud-green/90 shadow-hud-green"
          >
            <Compass className="w-4 h-4" />
            <span>CONTINUE CURRICULUM</span>
          </button>
        </div>
      </div>
    </div>
  );
}
