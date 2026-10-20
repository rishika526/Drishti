import React from 'react';
import { Award, ChevronRight, HelpCircle, Target } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

export function TutorialOverlay() {
  const { currentScenario, tutorialCurrentStep, finishMission } = useSimulationStore();

  if (!currentScenario?.isTutorial) return null;

  const steps = [
    {
      step: 1,
      title: '1. Acquire Radar Contact',
      body: 'Look at the Radar PPI scope on the bottom-right or the 3D airspace. Click on the contact card "CIV-QUAD-11" to lock onto it.',
    },
    {
      step: 2,
      title: '2. Flag as Detected',
      body: 'Click the green "FLAG AS DETECTED" button in the contact panel. Timely detection within 3.0s scores 100 points.',
    },
    {
      step: 3,
      title: '3. Classify Intruder Signature',
      body: 'Check the sensor telemetry: High RF signature, No military IFF, slow 14 m/s speed. Click "Hobby UAV" in the classification grid.',
    },
    {
      step: 4,
      title: '4. Execute ROE Decision',
      body: 'Defense Rules of Engagement: Civilian/hobby drones must NOT receive kinetic weapons release. Select "HOLD FIRE" or "ALERT / ALARM" to safely monitor.',
    },
    {
      step: 5,
      title: '5. Tutorial Complete!',
      body: 'Outstanding! You correctly detected, classified, and maintained ROE compliance. You can now finalize the mission to inspect your Explainable AAR Debrief.',
    },
  ];

  const current = steps.find((s) => s.step === tutorialCurrentStep) || steps[0];

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full px-4 pointer-events-auto">
      <div className="bg-hud-card/95 border-2 border-hud-green rounded-lg p-3.5 shadow-hud-green backdrop-blur-md font-mono text-slate-100">
        <div className="flex items-center justify-between border-b border-hud-border pb-2 mb-2">
          <div className="flex items-center gap-2 text-hud-green font-bold text-sm tracking-wider">
            <Target className="w-4 h-4 animate-spin" />
            <span>TRAINING CADET TUTORIAL (SIH 26247)</span>
          </div>
          <span className="text-xs bg-hud-green/20 text-hud-green px-2 py-0.5 rounded font-bold">
            STEP {tutorialCurrentStep} OF 5
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-hud-green flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-hud-amber" />
            {current.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{current.body}</p>
        </div>

        {tutorialCurrentStep === 5 && (
          <div className="mt-3 pt-2 border-t border-hud-border flex justify-end">
            <button
              onClick={() => finishMission()}
              className="px-3 py-1.5 rounded bg-hud-green text-black font-bold text-xs flex items-center gap-1 hover:bg-hud-green/90 shadow-hud-green"
            >
              <Award className="w-4 h-4" />
              VIEW EXPLAINABLE DEBRIEF (AAR)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
