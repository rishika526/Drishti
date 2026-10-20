import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { MissionSelectPage } from './pages/MissionSelectPage';
import { DebriefPage } from './pages/DebriefPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { Radio } from 'lucide-react';

// Lazy-load the heavy 3D Simulator route so landing page loads instantly
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));

function SimulatorLoadingFallback() {
  return (
    <div className="w-screen h-[calc(100vh-57px)] bg-hud-bg flex flex-col items-center justify-center font-mono text-hud-green space-y-4">
      <div className="relative w-16 h-16 border-2 border-hud-green/30 border-t-hud-green rounded-full animate-spin flex items-center justify-center">
        <Radio className="w-6 h-6 animate-pulse" />
      </div>
      <div className="text-sm font-bold tracking-wider animate-pulse">
        CALIBRATING TACTICAL 3D AIRSPACE & SENSOR ARRAYS...
      </div>
      <div className="text-xs text-slate-500 font-mono">
        Loading WebGL Shaders & Instanced Terrain
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-hud-bg text-slate-100 flex flex-col font-tactical">
        <Navbar />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/missions" element={<MissionSelectPage />} />
            <Route
              path="/sim/:id"
              element={
                <Suspense fallback={<SimulatorLoadingFallback />}>
                  <SimulatorPage />
                </Suspense>
              }
            />
            <Route path="/debrief/:sessionId" element={<DebriefPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
