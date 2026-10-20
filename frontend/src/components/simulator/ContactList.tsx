import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Crosshair,
  Radio,
  Shield,
  ShieldAlert,
  Zap,
  Target,
  UserCheck,
} from 'lucide-react';
import { ClassificationType, ContactEntity, ResponseAction } from '../../types';
import { useSimulationStore } from '../../store/simulationStore';
import { ENGAGEMENT_ENVELOPE_METERS } from '../../engine/scoring';

export function ContactList() {
  const {
    contacts,
    selectedContactId,
    selectContact,
    flagContactDetected,
    classifyContact,
    respondToContact,
  } = useSimulationStore();

  const selected = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  return (
    <div className="flex flex-col h-full bg-hud-panel border border-hud-border rounded text-xs font-mono select-none overflow-hidden">
      {/* Contact Header */}
      <div className="p-2 border-b border-hud-border bg-slate-900/60 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold tracking-wider text-hud-green">
          <Crosshair className="w-3.5 h-3.5" />
          ACTIVE TRACK TABLE ({contacts.length})
        </span>
        <span className="text-[10px] text-slate-400">
          SELECT TRACK TO ENGAGE
        </span>
      </div>

      {/* Contact Table / List */}
      <div className="flex-1 overflow-y-auto divide-y divide-hud-border/40 max-h-[220px]">
        {contacts.map((c) => {
          const isSelected = c.id === selectedContactId;
          const isInsideEnvelope = c.distanceToBase <= ENGAGEMENT_ENVELOPE_METERS;

          return (
            <div
              key={c.id}
              onClick={() => selectContact(c.id)}
              className={`p-2 cursor-pointer transition-colors flex items-center justify-between ${
                isSelected
                  ? 'bg-hud-green/15 border-l-4 border-l-hud-green text-slate-100'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    c.status === 'destroyed'
                      ? 'bg-hud-red'
                      : c.status === 'jammed'
                      ? 'bg-hud-cyan'
                      : c.detected
                      ? 'bg-hud-green'
                      : 'bg-hud-amber animate-pulse'
                  }`}
                />
                <div>
                  <div className="font-bold flex items-center gap-1">
                    <span>{c.callsign}</span>
                    {c.iff === 'VALID' && (
                      <span className="text-[9px] px-1 rounded bg-blue-900/80 text-blue-300 border border-blue-500/50">
                        IFF OK
                      </span>
                    )}
                    {isInsideEnvelope && (
                      <span className="text-[9px] px-1 rounded bg-red-900/80 text-red-300 border border-red-500/50 animate-pulse">
                        IN WEZ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>R: {Math.round(c.distanceToBase)}m</span>
                    <span>B: {String(c.bearing).padStart(3, '0')}°</span>
                    <span>ALT: {Math.round(c.altitude)}m</span>
                  </div>
                </div>
              </div>

              {/* Status indicators */}
              <div className="text-right text-[10px]">
                {c.classifiedAs ? (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-hud-cyan border border-hud-cyan/40">
                    {c.classifiedAs.toUpperCase()}
                  </span>
                ) : c.detected ? (
                  <span className="px-1.5 py-0.5 rounded bg-hud-green/20 text-hud-green border border-hud-green/40">
                    DETECTED
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    UNFLAGGED
                  </span>
                )}
                <div className="text-slate-400 mt-0.5">
                  {c.responseAction ? (
                    <span className="text-hud-amber font-semibold">
                      {c.responseAction.replace('_', ' ').toUpperCase()}
                    </span>
                  ) : (
                    <span>SPD: {Math.round(c.speed)} m/s</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Contact Trainee Engagement HUD */}
      {selected && (
        <div className="border-t border-hud-border p-2.5 bg-hud-panel space-y-2">
          {/* Selected Track Details Header */}
          <div className="flex items-center justify-between text-[11px] bg-slate-900/90 p-1.5 rounded border border-hud-border">
            <div>
              <span className="text-slate-400">SELECTED: </span>
              <span className="text-hud-green font-bold text-sm">
                {selected.callsign}
              </span>
            </div>
            <div className="flex gap-2 text-slate-300">
              <span>
                RF:{' '}
                <strong
                  className={
                    selected.rfSignature === 'HIGH'
                      ? 'text-hud-red'
                      : selected.rfSignature === 'MEDIUM'
                      ? 'text-hud-amber'
                      : 'text-slate-400'
                  }
                >
                  {selected.rfSignature}
                </strong>
              </span>
              <span>
                IFF:{' '}
                <strong
                  className={
                    selected.iff === 'VALID'
                      ? 'text-blue-400'
                      : 'text-slate-400'
                  }
                >
                  {selected.iff}
                </strong>
              </span>
            </div>
          </div>

          {/* Action 1: FLAG AS DETECTED */}
          <button
            onClick={() => flagContactDetected(selected.id)}
            disabled={selected.detected}
            className={`w-full py-1.5 rounded font-bold flex items-center justify-center gap-1.5 text-xs transition-all ${
              selected.detected
                ? 'bg-hud-green/20 text-hud-green border border-hud-green/50 cursor-default'
                : 'bg-hud-green text-black hover:bg-hud-green/90 shadow-hud-green animate-pulse'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {selected.detected
              ? `FLAGGED AT ${selected.detectedAt?.toFixed(1)}s`
              : 'FLAG AS DETECTED (STAMP DETECTION)'}
          </button>

          {/* Action 2: CLASSIFICATION */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              2. Classify Signature:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { type: 'bird', label: 'Bird' },
                { type: 'hobby', label: 'Hobby UAV' },
                { type: 'friendly', label: 'Friendly UAV' },
                { type: 'recon', label: 'Recon UAV' },
                { type: 'attack', label: 'Attack Drone' },
                { type: 'swarm', label: 'Swarm Unit' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() =>
                    classifyContact(selected.id, type as ClassificationType)
                  }
                  className={`py-1 px-1 rounded text-[10px] font-semibold border transition-all truncate ${
                    selected.classifiedAs === type
                      ? 'border-hud-cyan bg-hud-cyan/25 text-hud-cyan shadow-hud-cyan'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Action 3: RESPONSE PROTOCOL */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 uppercase tracking-wider">
                3. Execute ROE Response:
              </span>
              <span
                className={`font-semibold ${
                  selected.distanceToBase <= ENGAGEMENT_ENVELOPE_METERS
                    ? 'text-hud-red'
                    : 'text-slate-400'
                }`}
              >
                Range: {Math.round(selected.distanceToBase)}m / 1200m WEZ
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => respondToContact(selected.id, 'hold_fire')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'hold_fire'
                    ? 'border-hud-green bg-hud-green text-black'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-hud-green'
                }`}
              >
                <Shield className="w-3 h-3 text-hud-green" />
                HOLD FIRE
              </button>

              <button
                onClick={() => respondToContact(selected.id, 'alert_alarm')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'alert_alarm'
                    ? 'border-hud-amber bg-hud-amber text-black'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-hud-amber'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-hud-amber" />
                ALERT / ALARM
              </button>

              <button
                onClick={() => respondToContact(selected.id, 'jam_ew')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'jam_ew'
                    ? 'border-hud-cyan bg-hud-cyan text-black'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-hud-cyan'
                }`}
              >
                <Radio className="w-3 h-3 text-hud-cyan" />
                JAM (EW)
              </button>

              <button
                onClick={() => respondToContact(selected.id, 'soft_kill')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'soft_kill'
                    ? 'border-purple-400 bg-purple-500 text-black'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-purple-400'
                }`}
              >
                <Zap className="w-3 h-3 text-purple-400" />
                SOFT-KILL
              </button>

              <button
                onClick={() => respondToContact(selected.id, 'hard_kill')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'hard_kill'
                    ? 'border-hud-red bg-hud-red text-white'
                    : 'border-red-900 bg-slate-900 text-red-400 hover:border-hud-red hover:bg-red-950/40'
                }`}
              >
                <Target className="w-3 h-3 text-hud-red" />
                HARD-KILL
              </button>

              <button
                onClick={() => respondToContact(selected.id, 'take_cover')}
                className={`py-1.5 px-1 rounded text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${
                  selected.responseAction === 'take_cover'
                    ? 'border-yellow-400 bg-yellow-500 text-black'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-yellow-400'
                }`}
              >
                <ShieldAlert className="w-3 h-3 text-yellow-400" />
                TAKE COVER
              </button>
            </div>
          </div>

          {/* Quick ROE Card summary */}
          <div className="bg-hud-bg/90 border border-slate-800 rounded p-1.5 text-[9px] text-slate-400 space-y-0.5">
            <div className="font-bold text-slate-300 flex items-center justify-between">
              <span>RULES OF ENGAGEMENT (ROE):</span>
              <span className="text-hud-green">WEZ: 1200m</span>
            </div>
            <p>• Friendly IFF / Civilian: Kinetic action strictly prohibited (Fratricide penalty).</p>
            <p>• Swarm Threats: Prioritize wideband EW Jamming to sever communication mesh.</p>
          </div>
        </div>
      )}
    </div>
  );
}
