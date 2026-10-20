import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Cpu,
  Flame,
  Layers,
  Play,
  RotateCw,
  Shield,
  Sliders,
  Sparkles,
  Sun,
  Users,
  Wind,
  Zap,
} from 'lucide-react';
import { SCRIPTED_SCENARIOS } from '../scenarios';
import { generateScenario } from '../engine/generator';
import { recommendNextMission } from '../engine/adaptive';
import { getUserSkills } from '../lib/analyticsStore';
import { useSimulationStore } from '../store/simulationStore';
import {
  ScenarioDef,
  SensorState,
  TerrainType,
  TimeOfDay,
  WeatherType,
} from '../types';

export function MissionSelectPage() {
  const navigate = useNavigate();
  const { loadScenario, startMission } = useSimulationStore();

  // Trainee current skills and adaptive recommendation
  const userSkills = getUserSkills();
  const recommendation = recommendNextMission(userSkills, SCRIPTED_SCENARIOS);

  // Procedural generator state
  const [procSeed, setProcSeed] = useState<number>(() => Math.floor(Math.random() * 899999) + 100000);
  const [procTime, setProcTime] = useState<TimeOfDay>('dusk');
  const [procTerrain, setProcTerrain] = useState<TerrainType>('hills');
  const [procWeather, setProcWeather] = useState<WeatherType>('clear');
  const [procSensors, setProcSensors] = useState<SensorState>('nominal');
  const [procThreats, setProcThreats] = useState<number>(6);
  const [procVector, setProcVector] = useState<'single-axis' | 'multi-axis' | 'terrain-masked'>('multi-axis');
  const [procHostileRatio, setProcHostileRatio] = useState<number>(0.75);

  const handleLaunch = (scenario: ScenarioDef) => {
    loadScenario(scenario);
    startMission();
    navigate(`/sim/${scenario.id}`);
  };

  const handleGenerateAndLaunch = () => {
    const customScenario = generateScenario({
      seed: procSeed,
      timeOfDay: procTime,
      terrain: procTerrain,
      weather: procWeather,
      sensorState: procSensors,
      threatCount: procThreats,
      approachVector: procVector,
      hostileRatio: procHostileRatio,
    });
    handleLaunch(customScenario);
  };

  const handleRandomizeSeed = () => {
    setProcSeed(Math.floor(Math.random() * 899999) + 100000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-mono select-none">
      {/* Title Header */}
      <div className="border-b border-hud-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-hud-green text-xs font-bold tracking-wider">
            <Compass className="w-4 h-4" />
            <span>OPERATIONAL SCENARIO MATRIX</span>
          </div>
          <h1 className="text-3xl font-heading font-black tracking-wide text-slate-100 mt-1">
            MISSION DIRECTORY & THREAT SIMULATION
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Select a DSSC curriculum syllabus scenario or configure a procedurally generated engagement.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-hud-panel border border-hud-border px-3 py-2 rounded text-xs">
          <div className="text-slate-400">
            Cadet Composite Elo:
            <span className="text-hud-green font-bold ml-1.5">
              {Math.round(
                Object.values(userSkills).reduce((a, b) => a + b, 0) /
                  Object.keys(userSkills).length
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Next Mission Card (Adaptive Skill Model) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-hud-card via-slate-900 to-hud-card border-2 border-hud-cyan/60 shadow-hud-cyan">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-hud-cyan/20 border border-hud-cyan/50 text-hud-cyan text-[11px] font-bold">
                ADAPTIVE SKILL MODEL (BAYESIAN-ELO RECOMMENDATION)
              </span>
              <span className="text-slate-400 text-xs">
                Expected Success: ~{recommendation.expectedSuccessRate}% (Zone of Proximal Development)
              </span>
            </div>
            <h3 className="text-lg font-heading font-bold text-slate-100">
              Recommended Drill: {recommendation.recommendedScenarioName}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation.reasoning}
            </p>
          </div>

          <button
            onClick={() => {
              const matched = SCRIPTED_SCENARIOS.find(
                (s) => s.id === recommendation.recommendedScenarioId
              );
              if (matched) handleLaunch(matched);
            }}
            className="px-6 py-2.5 rounded bg-hud-cyan text-black font-bold text-xs flex items-center gap-2 hover:bg-hud-cyan/90 shadow-hud-cyan whitespace-nowrap transition-transform transform hover:-translate-y-0.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>LAUNCH RECOMMENDED DRILL</span>
          </button>
        </div>
      </div>

      {/* Scripted Scenarios Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Standard DSSC Syllabus Modules ({SCRIPTED_SCENARIOS.length})
          </span>
          <span>Deterministic Seeded Replay Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCRIPTED_SCENARIOS.map((sc, idx) => {
            const isRec = sc.id === recommendation.recommendedScenarioId;
            return (
              <div
                key={sc.id}
                className={`flex flex-col justify-between p-4 rounded-lg bg-hud-panel border transition-all ${
                  isRec
                    ? 'border-hud-cyan/70 shadow-hud-cyan'
                    : 'border-hud-border hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      MODULE 0{idx + 1}
                    </span>
                    <span className="text-hud-amber font-mono">
                      SEED #{sc.seed}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-slate-100">
                    {sc.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {sc.description}
                  </p>

                  {/* Badges */}
                  <div className="grid grid-cols-2 gap-1.5 mt-4 text-[10px] text-slate-300">
                    <div className="bg-slate-900/80 p-1.5 rounded border border-hud-border">
                      <span className="text-slate-500">TERRAIN: </span>
                      <span className="font-bold uppercase text-slate-200">
                        {sc.terrain}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-hud-border">
                      <span className="text-slate-500">TIME: </span>
                      <span className="font-bold uppercase text-slate-200">
                        {sc.timeOfDay}
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-hud-border">
                      <span className="text-slate-500">THREATS: </span>
                      <span className="font-bold text-hud-red">
                        {sc.threatCount} CONTACTS
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded border border-hud-border">
                      <span className="text-slate-500">DURATION: </span>
                      <span className="font-bold text-hud-green">
                        {sc.duration}s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-hud-border/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {sc.initialSensorState === 'nominal'
                      ? 'Sensors Nominal'
                      : `Sensor: ${sc.initialSensorState.toUpperCase()}`}
                  </span>
                  <button
                    onClick={() => handleLaunch(sc)}
                    className="px-4 py-1.5 rounded bg-slate-800 hover:bg-hud-green hover:text-black text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 hover:border-hud-green transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>LAUNCH</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Procedural Scenario Generator Panel */}
      <div className="p-5 rounded-lg bg-hud-panel border border-hud-border space-y-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-hud-amber" />
            <h2 className="text-lg font-heading font-bold text-slate-100">
              PROCEDURAL SCENARIO GENERATOR (ANTI-ROTE ENGINE)
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">CURRENT SEED:</span>
            <input
              type="number"
              value={procSeed}
              onChange={(e) => setProcSeed(Number(e.target.value) || 10101)}
              className="w-28 px-2 py-1 rounded bg-slate-900 border border-hud-border text-hud-green font-bold text-xs text-center"
            />
            <button
              onClick={handleRandomizeSeed}
              title="Randomize PRNG seed"
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Generator Knobs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Time of Day */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">TIME OF DAY</label>
            <select
              value={procTime}
              onChange={(e) => setProcTime(e.target.value as TimeOfDay)}
              className="w-full bg-slate-900 border border-hud-border rounded px-2 py-1 text-slate-200"
            >
              <option value="day">Day</option>
              <option value="dusk">Dusk</option>
              <option value="night">Night</option>
              <option value="dawn">Dawn</option>
            </select>
          </div>

          {/* Terrain */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">TERRAIN</label>
            <select
              value={procTerrain}
              onChange={(e) => setProcTerrain(e.target.value as TerrainType)}
              className="w-full bg-slate-900 border border-hud-border rounded px-2 py-1 text-slate-200"
            >
              <option value="rural">Rural</option>
              <option value="hills">Hills</option>
              <option value="desert">Desert</option>
              <option value="urban">Urban Canyon</option>
            </select>
          </div>

          {/* Weather */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">WEATHER</label>
            <select
              value={procWeather}
              onChange={(e) => setProcWeather(e.target.value as WeatherType)}
              className="w-full bg-slate-900 border border-hud-border rounded px-2 py-1 text-slate-200"
            >
              <option value="clear">Clear</option>
              <option value="fog">Fog</option>
              <option value="rain">Rain</option>
              <option value="dust">Dust Storm</option>
            </select>
          </div>

          {/* Sensor State */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">SENSOR STATE</label>
            <select
              value={procSensors}
              onChange={(e) => setProcSensors(e.target.value as SensorState)}
              className="w-full bg-slate-900 border border-hud-border rounded px-2 py-1 text-slate-200"
            >
              <option value="nominal">Nominal</option>
              <option value="radar-degraded">Radar Degraded</option>
              <option value="eo-degraded">EO Degraded</option>
              <option value="jammed">EW Jammed</option>
              <option value="dual-degraded">Dual Degraded</option>
            </select>
          </div>

          {/* Threat Count */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>THREAT COUNT</span>
              <span className="text-hud-amber font-bold">{procThreats}</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={procThreats}
              onChange={(e) => setProcThreats(Number(e.target.value))}
              className="w-full accent-hud-amber"
            />
          </div>

          {/* Approach Vector */}
          <div className="space-y-1">
            <label className="text-slate-400 text-[10px]">APPROACH VECTOR</label>
            <select
              value={procVector}
              onChange={(e) => setProcVector(e.target.value as any)}
              className="w-full bg-slate-900 border border-hud-border rounded px-2 py-1 text-slate-200"
            >
              <option value="single-axis">Single Axis</option>
              <option value="multi-axis">Multi-Axis Swarm</option>
              <option value="terrain-masked">Terrain-Masked</option>
            </select>
          </div>
        </div>

        {/* Launch Custom Procedural Drill Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            * Fingerprint hash ensures no scenario repeats within 3 consecutive runs.
          </span>
          <button
            onClick={handleGenerateAndLaunch}
            className="w-full sm:w-auto px-6 py-2.5 rounded bg-hud-amber hover:bg-hud-amber/90 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-hud-amber transition-all"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>GENERATE & LAUNCH SEED #{procSeed}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
