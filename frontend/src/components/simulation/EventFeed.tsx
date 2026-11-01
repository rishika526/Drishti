// DRISHTI: Compact Operational Event & Alert Feed
// Stage 2: Core Counter-Drone Threat Simulation

import React, { useState } from 'react';
import { SimulationEvent } from '../../types/simulation';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface EventFeedProps {
  events: SimulationEvent[];
}

export const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#1A2118]/85 backdrop-blur-md border border-[#384337] rounded-lg shadow-military-card overflow-hidden font-mono text-[11px] select-none text-slate-300 w-72">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3 py-2 bg-[#141B12]/80 flex items-center justify-between cursor-pointer border-b border-[#384337]"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-white tracking-wide text-xs">
            EVENT FEED ({events.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </div>

      {/* Expanded Logs */}
      {isExpanded && (
        <div className="p-2 space-y-1.5 max-h-36 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-slate-500 text-[10px] py-1 text-center">
              Scanning airspace...
            </div>
          ) : (
            [...events].reverse().map((ev) => (
              <div key={ev.id} className="text-[10px] leading-tight flex items-start gap-1.5">
                <span className="text-amber-400 flex-shrink-0 font-bold">
                  [{formatSec(ev.timestampSec)}]
                </span>
                <span
                  className={
                    ev.type === 'DETECTION'
                      ? 'text-emerald-400 font-semibold'
                      : ev.type === 'ALERT'
                      ? 'text-rose-400 font-semibold'
                      : 'text-slate-300'
                  }
                >
                  {ev.message}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
