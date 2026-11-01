// DRISHTI: Tactical Top Bar
// Stage 1: Visual Foundation & 3D World

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crosshair, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  actionButton,
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#FAF9F6] border-b border-military-border px-8 py-4 flex items-center justify-between select-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-military-charcoal font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-military-steel font-sans mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Readiness Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-military-sand/40 border border-military-border text-xs text-military-steel font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>3D SIMULATION ENGINE: READY</span>
        </div>

        {/* Action Button */}
        {actionButton ? (
          <button
            onClick={actionButton.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-semibold tracking-wide transition-all shadow-military-subtle"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{actionButton.label}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/sim')}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-military-olive hover:bg-military-olive-dark text-white text-xs font-semibold tracking-wide transition-all shadow-military-subtle"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Launch Simulation</span>
          </button>
        )}
      </div>
    </header>
  );
};
