// DRISHTI: Professional Military Simulation Platform Sidebar
// Stage 1: Visual Foundation & 3D World

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Crosshair,
  Shield,
  BookOpen,
  FileText,
  BarChart2,
  Radio,
  User,
} from 'lucide-react';
import { CURRENT_OPERATOR } from '../../data/missions';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Training Hub', icon: Compass, exact: true },
    { to: '/sim', label: 'Threat Simulation', icon: Crosshair },
    { to: '/training', label: 'Operator Training', icon: Shield },
    { to: '/academy', label: 'Drishti Academy', icon: BookOpen },
    { to: '/aar', label: 'After-Action Review', icon: FileText },
    { to: '/performance', label: 'Performance', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-[#FBF9F5] border-r border-military-border flex flex-col justify-between select-none h-full shrink-0 overflow-y-auto">
      
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-military-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-military-olive flex items-center justify-center text-[#F6F4EF] shadow-military-subtle">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-wider text-military-charcoal font-sans">
                DRISHTI
              </div>
              <div className="text-[9px] uppercase tracking-widest text-military-steel font-medium">
                Simulation Platform
              </div>
            </div>
          </div>

          <div className="mt-3 text-[10px] uppercase tracking-wider text-military-olive font-semibold font-mono border-t border-military-border/60 pt-2">
            Train for the unseen. Secure the skies.
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-military-subtle font-mono">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-military-olive text-white shadow-military-subtle font-semibold'
                      : 'text-military-charcoal hover:bg-military-sand/60 hover:text-military-olive-deep'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-military-steel'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Operator Profile Area (Minimal & Honest) */}
      <div className="p-4 m-3 rounded-lg bg-military-sand/50 border border-military-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-military-charcoal truncate">
              {CURRENT_OPERATOR.name}
            </div>
            <div className="text-[10px] text-military-steel truncate">
              {CURRENT_OPERATOR.unit}
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-military-border/60 flex items-center justify-between text-[10px] font-mono">
          <span className="text-military-subtle">Callsign: {CURRENT_OPERATOR.callsign}</span>
          <span className="inline-flex items-center gap-1 text-military-olive font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {CURRENT_OPERATOR.status}
          </span>
        </div>
      </div>

    </aside>
  );
};
