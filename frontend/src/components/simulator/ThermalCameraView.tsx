import React from 'react';
import { Camera, Eye, Volume2, ZoomIn } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export function ThermalCameraView() {
  const {
    cameraMode,
    setCameraMode,
    zoomLevel,
    setZoomLevel,
    cameraDegraded,
    contacts,
  } = useSimulationStore();

  // Find closest active contact for acoustic cueing
  const activeContacts = contacts.filter((c) => c.status === 'active');
  activeContacts.sort((a, b) => a.distanceToBase - b.distanceToBase);
  const closest = activeContacts[0];

  return (
    <div className="bg-hud-panel border border-hud-border rounded p-2.5 text-xs font-mono space-y-2">
      <div className="flex items-center justify-between border-b border-hud-border pb-1.5 text-hud-green">
        <span className="flex items-center gap-1.5 font-bold tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          OPTICAL / ACOUSTIC SENSORS
        </span>
        <span
          className={`px-1.5 py-0.2 rounded text-[10px] ${
            cameraDegraded
              ? 'bg-hud-amber/20 text-hud-amber border border-hud-amber/50 animate-pulse'
              : 'bg-hud-green/20 text-hud-green border border-hud-green/50'
          }`}
        >
          {cameraDegraded ? 'OPTICAL DEGRADED' : 'CLEAR'}
        </span>
      </div>

      {/* Mode & Zoom Toggles */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCameraMode('EO')}
            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              cameraMode === 'EO'
                ? 'bg-hud-cyan text-black shadow-hud-cyan'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3 h-3" />
            EO (VIS)
          </button>
          <button
            onClick={() => setCameraMode('IR')}
            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              cameraMode === 'IR'
                ? 'bg-hud-amber text-black shadow-hud-amber'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Camera className="w-3 h-3" />
            IR (FLIR)
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-hud-border">
          <ZoomIn className="w-3 h-3 text-slate-400 ml-1" />
          {[1, 2, 4, 8].map((z) => (
            <button
              key={z}
              onClick={() => setZoomLevel(z)}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                zoomLevel === z
                  ? 'bg-hud-green text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {z}x
            </button>
          ))}
        </div>
      </div>

      {/* Acoustic Direction Finder Cue Box */}
      <div className="bg-hud-bg/80 border border-slate-800 rounded p-2 text-[11px] space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1 text-hud-cyan font-bold">
            <Volume2 className="w-3 h-3 text-hud-cyan animate-pulse" />
            ACOUSTIC ARRAY CUE
          </span>
          <span className="text-[10px]">
            {closest ? 'CORRELATED' : 'SEARCHING'}
          </span>
        </div>

        {closest ? (
          <div className="space-y-0.5">
            <div className="flex justify-between text-slate-200">
              <span>EST. BEARING:</span>
              <span className="text-hud-amber font-bold">
                {String(closest.bearing).padStart(3, '0')}° MAG
              </span>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>PROP HARMONIC:</span>
              <span className="text-slate-200">
                {closest.type === 'attack'
                  ? '720 Hz (High RPM Jet/Prop)'
                  : closest.type === 'swarm'
                  ? '540 Hz (Multi-rotor mesh)'
                  : closest.type === 'bird'
                  ? 'Sub-audible (Wingbeat)'
                  : '380 Hz (Brushless motor)'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>EST. RANGE:</span>
              <span className="text-hud-green">
                ~{Math.round(closest.distanceToBase / 100) * 100}m
              </span>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 italic text-[10px] py-1 text-center">
            Airspace acoustic baseline nominal (no motor harmonics detected)
          </div>
        )}
      </div>
    </div>
  );
}
