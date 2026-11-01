// DRISHTI: Aerial Observation Landmark Verification Modal
// Stage 3: Operator Training Experiences

import React, { useState } from 'react';
import { AerialLandmarkTarget } from '../../../types/operatorTraining';
import { Eye, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface AerialLandmarkReportModalProps {
  landmark: AerialLandmarkTarget;
  isOpen: boolean;
  onSaveObservation: (landmarkId: string, selectedObservation: string) => void;
  onClose: () => void;
}

export const AerialLandmarkReportModal: React.FC<AerialLandmarkReportModalProps> = ({
  landmark,
  isOpen,
  onSaveObservation,
  onClose,
}) => {
  const [selectedObs, setSelectedObs] = useState<string>(
    landmark.selectedObservation || landmark.observationOptions[0]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-lg max-h-[88vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-5 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold font-mono text-military-sand uppercase tracking-wider">
                GIMBAL OPTICAL ACQUISITION // {landmark.gridSector}
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight mt-1 font-sans">
              {landmark.name}
            </h3>
          </div>

          <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white">
            VERIFICATION
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* Landmark Recon Intelligence */}
          <div className="p-3.5 rounded-lg bg-military-sand/40 border border-military-border space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Target Structure Specification</span>
            </div>
            <p className="text-xs text-military-charcoal leading-relaxed font-sans font-medium">
              {landmark.description}
            </p>
          </div>

          {/* Sighting Verification Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-military-charcoal font-mono block">
              Confirm Visual Aerial Observation
            </label>

            <div className="space-y-2">
              {landmark.observationOptions.map((opt, idx) => {
                const isSelected = selectedObs === opt;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedObs(opt)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-military-olive bg-military-olive/10 shadow-sm'
                        : 'border-military-border bg-military-cream hover:bg-military-sand/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-sans text-military-charcoal font-medium leading-relaxed">
                        {opt}
                      </p>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setSelectedObs(opt)}
                        className="accent-military-olive mt-0.5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-military-border text-military-steel hover:bg-military-sand/40 hover:text-military-charcoal font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onSaveObservation(landmark.id, selectedObs)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle"
          >
            <span>Record Observation Finding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
