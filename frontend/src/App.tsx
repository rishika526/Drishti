// DRISHTI: Main Application Router & Shell
// Stage 3: Operator Training Experiences & Viewport Layout Architecture

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { TrainingHubPage } from './pages/TrainingHubPage';
import { OperatorTrainingPage } from './pages/OperatorTrainingPage';
import { DrishtiAcademyPage } from './pages/DrishtiAcademyPage';
import { AfterActionReviewPage } from './pages/AfterActionReviewPage';
import { PerformancePage } from './pages/PerformancePage';
import { Radio } from 'lucide-react';

// Lazy-load 3D simulation workstations
const ThreatSimulationPage = lazy(() => import('./pages/ThreatSimulationPage'));
const FPVTrainingPage = lazy(() => import('./pages/FPVTrainingPage'));
const IndoorInspectionPage = lazy(() => import('./pages/IndoorInspectionPage'));
const AerialObservationPage = lazy(() => import('./pages/AerialObservationPage'));

function SimulationLoadingFallback() {
  return (
    <div className="w-full h-full min-h-[400px] bg-[#0A0E0A] flex flex-col items-center justify-center font-mono text-emerald-400 space-y-3 select-none">
      <div className="relative w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin flex items-center justify-center">
        <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
      </div>
      <div className="text-xs font-bold tracking-wider text-slate-200">
        RENDERING 3D TACTICAL AIRSPACE & TERRAIN...
      </div>
      <div className="text-[11px] text-slate-500">
        Drishti Simulation Workstation
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  // Both Threat Simulation (/sim) and Operator Training Sub-experiences (/training/fpv, etc.) are fullscreen 3D workstations
  const isSimulationScreen =
    location.pathname.startsWith('/sim') || location.pathname.startsWith('/training/');

  // Page header titles
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Training Hub', subtitle: 'Central command and simulation mission launcher' };
      case '/training':
        return { title: 'Operator Training', subtitle: 'Structured tactical flight, inspection & surveillance curriculum' };
      case '/academy':
        return { title: 'Drishti Academy', subtitle: 'Threat recognition doctrine and multi-sensor library' };
      case '/aar':
        return { title: 'After-Action Review', subtitle: 'Mission telemetry logs and debriefing evaluations' };
      case '/performance':
        return { title: 'Performance Analytics', subtitle: 'Operator readiness index and qualification records' };
      default:
        return { title: 'Threat Simulation', subtitle: 'Active 3D tactical training airspace' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-[#F6F4EF] text-military-charcoal font-sans antialiased overflow-hidden">
      {/* Persistent Left Military Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {!isSimulationScreen && (
          <TopBar
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
          />
        )}

        <main className={`flex-1 min-h-0 ${isSimulationScreen ? 'overflow-hidden flex flex-col h-full' : 'overflow-y-auto'}`}>
          <Routes>
            {/* 1. Training Hub (Home) */}
            <Route path="/" element={<TrainingHubPage />} />

            {/* 2. Threat Simulation (Live 3D Environment) */}
            <Route
              path="/sim"
              element={
                <Suspense fallback={<SimulationLoadingFallback />}>
                  <ThreatSimulationPage />
                </Suspense>
              }
            />
            <Route
              path="/sim/:id"
              element={
                <Suspense fallback={<SimulationLoadingFallback />}>
                  <ThreatSimulationPage />
                </Suspense>
              }
            />

            {/* 3. Operator Training Syllabus & Hub */}
            <Route path="/training" element={<OperatorTrainingPage />} />

            {/* 3.1 Experience A: FPV Flight Familiarization */}
            <Route
              path="/training/fpv"
              element={
                <Suspense fallback={<SimulationLoadingFallback />}>
                  <FPVTrainingPage />
                </Suspense>
              }
            />

            {/* 3.2 Experience B: Indoor Drone Inspection */}
            <Route
              path="/training/indoor"
              element={
                <Suspense fallback={<SimulationLoadingFallback />}>
                  <IndoorInspectionPage />
                </Suspense>
              }
            />

            {/* 3.3 Experience C: Aerial Observation Training */}
            <Route
              path="/training/aerial"
              element={
                <Suspense fallback={<SimulationLoadingFallback />}>
                  <AerialObservationPage />
                </Suspense>
              }
            />

            {/* 4. Drishti Academy */}
            <Route path="/academy" element={<DrishtiAcademyPage />} />

            {/* 5. After-Action Review */}
            <Route path="/aar" element={<AfterActionReviewPage />} />

            {/* 6. Performance */}
            <Route path="/performance" element={<PerformancePage />} />

            {/* Fallback to Training Hub */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
