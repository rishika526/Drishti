import React from 'react';
import {
  Cpu,
  FileQuestion,
  GitBranch,
  Layers,
  Network,
  Server,
  Shield,
  Zap,
} from 'lucide-react';

export function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 font-mono text-slate-100 select-none">
      {/* Page Title */}
      <div className="border-b border-hud-border pb-4">
        <div className="flex items-center gap-2 text-hud-green text-xs font-bold tracking-wider">
          <FileQuestion className="w-4 h-4" />
          <span>TECHNICAL SPECIFICATION & ARCHITECTURE REFERENCE</span>
        </div>
        <h1 className="text-3xl font-heading font-black tracking-wide mt-1">
          SYSTEM ARCHITECTURE & EXPLAINABLE AI FLOWS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Reference diagrams for DSSC evaluators, operational briefing slides, and SIH 26247 technical assessment.
        </p>
      </div>

      {/* SECTION 1: EXPLAINABLE DECISION TREE */}
      <div className="p-6 rounded-lg bg-hud-panel border border-hud-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-hud-green font-bold text-base font-heading">
            <GitBranch className="w-5 h-5" />
            <span>1. EXPLAINABLE COUNTER-DRONE DECISION TREE</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-hud-green/10 text-hud-green border border-hud-green/30">
            ZERO BLACKBOX TRANSPARENCY
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Every decision made by the trainee is evaluated through an open, deterministic decision tree. Instead of an uninterpretable neural network, every point awarded or penalized is mapped directly to military ROE doctrine.
        </p>

        {/* SVG Diagram 1 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-hud-border overflow-x-auto">
          <svg viewBox="0 0 900 420" className="w-full min-w-[750px] text-xs font-mono">
            <defs>
              <linearGradient id="treeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00ff9c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Stage 1: Detection */}
            <rect x="30" y="30" width="220" height="70" rx="8" fill="#090e17" stroke="#00ff9c" strokeWidth="2" />
            <text x="140" y="58" fill="#00ff9c" fontWeight="bold" textAnchor="middle" fontSize="12">1. RADAR / THERMAL PICK-UP</text>
            <text x="140" y="78" fill="#94a3b8" textAnchor="middle" fontSize="10">Picket Latency &lt;= 3.0s: 100 Pts</text>

            {/* Arrow 1 to 2 */}
            <line x1="250" y1="65" x2="330" y2="65" stroke="#00ff9c" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="330,60 340,65 330,70" fill="#00ff9c" />

            {/* Stage 2: Classification */}
            <rect x="340" y="30" width="240" height="70" rx="8" fill="#090e17" stroke="#00e5ff" strokeWidth="2" />
            <text x="460" y="58" fill="#00e5ff" fontWeight="bold" textAnchor="middle" fontSize="12">2. SPECTRUM TAXONOMY</text>
            <text x="460" y="78" fill="#94a3b8" textAnchor="middle" fontSize="10">Mode-5 IFF / RF Sig / RCS / Speed</text>

            {/* Arrow 2 to Decision Diamond */}
            <line x1="580" y1="65" x2="660" y2="65" stroke="#00e5ff" strokeWidth="2" />
            <polygon points="660,60 670,65 660,70" fill="#00e5ff" />

            {/* Decision Diamond: Hostile? */}
            <polygon points="760,20 850,65 760,110 670,65" fill="#172230" stroke="#ffb000" strokeWidth="2" />
            <text x="760" y="62" fill="#ffb000" fontWeight="bold" textAnchor="middle" fontSize="11">HOSTILE</text>
            <text x="760" y="76" fill="#ffb000" fontWeight="bold" textAnchor="middle" fontSize="11">THREAT?</text>

            {/* Branch YES (Down to Hostile Protocol) */}
            <line x1="760" y1="110" x2="760" y2="180" stroke="#ff3344" strokeWidth="2" />
            <polygon points="755,180 760,190 765,180" fill="#ff3344" />
            <text x="770" y="150" fill="#ff3344" fontWeight="bold" fontSize="10">YES (THREAT)</text>

            {/* Branch NO (Left to Non-Hostile Protocol) */}
            <line x1="670" y1="65" x2="640" y2="65" stroke="#00ff9c" strokeWidth="2" />
            <line x1="640" y1="65" x2="640" y2="280" stroke="#00ff9c" strokeWidth="2" />
            <line x1="640" y1="280" x2="520" y2="280" stroke="#00ff9c" strokeWidth="2" />
            <polygon points="520,275 510,280 520,285" fill="#00ff9c" />
            <text x="648" y="200" fill="#00ff9c" fontWeight="bold" fontSize="10">NO (BENIGN)</text>

            {/* Hostile Envelope Box */}
            <rect x="630" y="190" width="260" height="90" rx="8" fill="#1b1216" stroke="#ff3344" strokeWidth="2" />
            <text x="760" y="215" fill="#ff3344" fontWeight="bold" textAnchor="middle" fontSize="12">WEAPONS ENGAGEMENT (WEZ)</text>
            <text x="760" y="235" fill="#e2e8f0" textAnchor="middle" fontSize="10">• Attack Munition -&gt; Kinetic Hard-Kill</text>
            <text x="760" y="252" fill="#e2e8f0" textAnchor="middle" fontSize="10">• Swarm Saturation -&gt; Wideband EW</text>
            <text x="760" y="268" fill="#ffb000" textAnchor="middle" fontSize="9">* Hold Fire inside 1200m = CRITICAL LEAKER</text>

            {/* Non-Hostile Restraint Box */}
            <rect x="250" y="245" width="260" height="85" rx="8" fill="#0b171c" stroke="#00ff9c" strokeWidth="2" />
            <text x="380" y="270" fill="#00ff9c" fontWeight="bold" textAnchor="middle" fontSize="12">ROE RESTRAINT PROTOCOL</text>
            <text x="380" y="290" fill="#e2e8f0" textAnchor="middle" fontSize="10">• Friendly UAV / Hobby / Bird</text>
            <text x="380" y="306" fill="#e2e8f0" textAnchor="middle" fontSize="10">• Mandatory Hold Fire & Surveillance</text>
            <text x="380" y="322" fill="#ff3344" textAnchor="middle" fontSize="9">* Kinetic Action = CRITICAL FRATRICIDE</text>

            {/* Final AAR Node */}
            <rect x="420" y="360" width="280" height="45" rx="6" fill="#090e17" stroke="#a855f7" strokeWidth="1.5" />
            <text x="560" y="388" fill="#a855f7" fontWeight="bold" textAnchor="middle" fontSize="11">EXPLAINABLE AAR SCORING & AUDIT LOG</text>
          </svg>
        </div>
      </div>

      {/* SECTION 2: ADAPTIVE ML SKILL MODEL */}
      <div className="p-6 rounded-lg bg-hud-panel border border-hud-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-hud-cyan font-bold text-base font-heading">
            <Cpu className="w-5 h-5" />
            <span>2. ADAPTIVE LEARNING LOOP (BAYESIAN-ELO & THOMPSON SAMPLING)</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30">
            PROVEN PROBABILISTIC ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The skill engine uses an Elo/Bayesian rating model across 7 specialized domains (Detection, Classification, Engagement, Night Ops, Swarm Defense, Degraded Sensors, Urban Canyon). Thompson sampling selects scenarios that target cadet weaknesses calibrated to a 70% expected success rate (Zone of Proximal Development).
        </p>

        {/* SVG Diagram 2 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-hud-border overflow-x-auto">
          <svg viewBox="0 0 900 320" className="w-full min-w-[750px] text-xs font-mono">
            {/* Box 1: Trainee Mission Execution */}
            <rect x="40" y="40" width="220" height="80" rx="8" fill="#090e17" stroke="#00e5ff" strokeWidth="2" />
            <text x="150" y="72" fill="#00e5ff" fontWeight="bold" textAnchor="middle" fontSize="12">TRAINEE DRILL RUN</text>
            <text x="150" y="92" fill="#94a3b8" textAnchor="middle" fontSize="10">Fixed Timestep Simulation Loop</text>
            <text x="150" y="106" fill="#94a3b8" textAnchor="middle" fontSize="9">2 Hz Telemetry Logging</text>

            {/* Arrow 1 to 2 */}
            <line x1="260" y1="80" x2="350" y2="80" stroke="#00e5ff" strokeWidth="2" />
            <polygon points="350,75 360,80 350,85" fill="#00e5ff" />

            {/* Box 2: Bayesian Elo Update */}
            <rect x="360" y="40" width="240" height="80" rx="8" fill="#090e17" stroke="#ffb000" strokeWidth="2" />
            <text x="480" y="70" fill="#ffb000" fontWeight="bold" textAnchor="middle" fontSize="12">BAYESIAN-ELO ESTIMATION</text>
            <text x="480" y="88" fill="#e2e8f0" textAnchor="middle" fontSize="10">E = 1 / (1 + 10^((Diff - Elo)/400))</text>
            <text x="480" y="104" fill="#ffb000" textAnchor="middle" fontSize="10">Delta = K * (Score/100 - E)</text>

            {/* Arrow 2 to 3 */}
            <line x1="600" y1="80" x2="680" y2="80" stroke="#ffb000" strokeWidth="2" />
            <polygon points="680,75 690,80 680,85" fill="#ffb000" />

            {/* Box 3: Thompson Sampling */}
            <rect x="690" y="40" width="180" height="80" rx="8" fill="#090e17" stroke="#a855f7" strokeWidth="2" />
            <text x="780" y="72" fill="#a855f7" fontWeight="bold" textAnchor="middle" fontSize="12">THOMPSON SAMPLING</text>
            <text x="780" y="92" fill="#94a3b8" textAnchor="middle" fontSize="10">Beta Posteriors B(a, b)</text>
            <text x="780" y="106" fill="#94a3b8" textAnchor="middle" fontSize="9">Calibrated 70% Win-Rate</text>

            {/* Loopback Arrow to Procedural Scenario Generator */}
            <path d="M 780 120 L 780 230 L 480 230" fill="none" stroke="#00ff9c" strokeWidth="2" />
            <polygon points="480,225 470,230 480,235" fill="#00ff9c" />

            {/* Box 4: Curriculum / Procedural Generator */}
            <rect x="230" y="195" width="240" height="70" rx="8" fill="#090e17" stroke="#00ff9c" strokeWidth="2" />
            <text x="350" y="225" fill="#00ff9c" fontWeight="bold" textAnchor="middle" fontSize="12">NEXT RECOMMENDED DRILL</text>
            <text x="350" y="245" fill="#94a3b8" textAnchor="middle" fontSize="10">Anti-Rote Seeded Generation</text>

            {/* Return Arrow from Generator to Trainee Run */}
            <path d="M 230 230 L 150 230 L 150 120" fill="none" stroke="#00ff9c" strokeWidth="2" />
            <polygon points="145,120 150,110 155,120" fill="#00ff9c" />
          </svg>
        </div>
      </div>

      {/* SECTION 3: SYSTEM ARCHITECTURE */}
      <div className="p-6 rounded-lg bg-hud-panel border border-hud-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-hud-amber font-bold text-base font-heading">
            <Network className="w-5 h-5" />
            <span>3. DISTRIBUTED DEPLOYMENT ARCHITECTURE</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-hud-amber/10 text-hud-amber border border-hud-amber/30">
            CLOUDFLARE PAGES + RENDER FASTAPI
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Drishti is designed to operate 100% standalone on edge devices without requiring backend availability. The optional FastAPI backend on Render handles centralized unit telemetry sync without blocking cadet operations.
        </p>

        {/* SVG Diagram 3 */}
        <div className="p-4 rounded-lg bg-slate-950 border border-hud-border overflow-x-auto">
          <svg viewBox="0 0 900 320" className="w-full min-w-[750px] text-xs font-mono">
            {/* Cloudflare Pages Box */}
            <rect x="40" y="40" width="380" height="230" rx="10" fill="#090e17" stroke="#f38020" strokeWidth="2" />
            <text x="230" y="70" fill="#f38020" fontWeight="bold" textAnchor="middle" fontSize="14">CLOUDFLARE PAGES (FRONTEND SPA)</text>
            <text x="230" y="90" fill="#94a3b8" textAnchor="middle" fontSize="10">Edge CDN Global Distribution • 0ms Cold Start</text>

            {/* Sub-components inside Frontend */}
            <rect x="60" y="110" width="160" height="60" rx="6" fill="#15202e" stroke="#00ff9c" />
            <text x="140" y="135" fill="#00ff9c" fontWeight="bold" textAnchor="middle" fontSize="10">Three.js / R3F</text>
            <text x="140" y="152" fill="#94a3b8" textAnchor="middle" fontSize="9">3D Airspace Simulation</text>

            <rect x="240" y="110" width="160" height="60" rx="6" fill="#15202e" stroke="#00ff9c" />
            <text x="320" y="135" fill="#00ff9c" fontWeight="bold" textAnchor="middle" fontSize="10">Mulberry32 PRNG</text>
            <text x="320" y="152" fill="#94a3b8" textAnchor="middle" fontSize="9">Deterministic Seed Engine</text>

            <rect x="60" y="185" width="160" height="60" rx="6" fill="#15202e" stroke="#00e5ff" />
            <text x="140" y="210" fill="#00e5ff" fontWeight="bold" textAnchor="middle" fontSize="10">Radar PPI Canvas</text>
            <text x="140" y="227" fill="#94a3b8" textAnchor="middle" fontSize="9">Phosphor Sweep & Blips</text>

            <rect x="240" y="185" width="160" height="60" rx="6" fill="#15202e" stroke="#a855f7" />
            <text x="320" y="210" fill="#a855f7" fontWeight="bold" textAnchor="middle" fontSize="10">WebAudio Synth</text>
            <text x="320" y="227" fill="#94a3b8" textAnchor="middle" fontSize="9">0 Audio Files Required</text>

            {/* Non-blocking API Connector */}
            <line x1="420" y1="150" x2="520" y2="150" stroke="#00ff9c" strokeWidth="2" strokeDasharray="5 5" />
            <polygon points="520,145 530,150 520,155" fill="#00ff9c" />
            <text x="475" y="140" fill="#00ff9c" textAnchor="middle" fontSize="9">Async Poll</text>
            <text x="475" y="165" fill="#94a3b8" textAnchor="middle" fontSize="8">Non-Blocking</text>

            {/* Render Backend Box */}
            <rect x="530" y="40" width="330" height="230" rx="10" fill="#090e17" stroke="#46e3b7" strokeWidth="2" />
            <text x="695" y="70" fill="#46e3b7" fontWeight="bold" textAnchor="middle" fontSize="14">RENDER (FASTAPI BACKEND)</text>
            <text x="695" y="90" fill="#94a3b8" textAnchor="middle" fontSize="10">Python 3.11 Microservice • Free Tier</text>

            <rect x="555" y="115" width="280" height="42" rx="6" fill="#15202e" stroke="#46e3b7" />
            <text x="695" y="140" fill="#46e3b7" fontWeight="bold" textAnchor="middle" fontSize="11">GET /health (Liveness Probe)</text>

            <rect x="555" y="168" width="280" height="42" rx="6" fill="#15202e" stroke="#46e3b7" />
            <text x="695" y="193" fill="#46e3b7" fontWeight="bold" textAnchor="middle" fontSize="11">GET /api/v1/status</text>

            <text x="695" y="240" fill="#94a3b8" textAnchor="middle" fontSize="10">Planned: Cadet Sync & ML Service</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
