# Drishti: AI-Enabled Drone & Counter-Drone Threat Simulation Trainer

[![Smart India Hackathon](https://img.shields.io/badge/SIH%202026-PS%2026247-00ff9c.svg)](https://sih.gov.in)
[![Air Defense](https://img.shields.io/badge/Air%20Defense-Simulation%20Trainer-ffb000.svg)]()
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020.svg)](https://pages.cloudflare.com)
[![Render FastApi](https://img.shields.io/badge/Backend-Render%20FastAPI-46e3b7.svg)](https://render.com)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20%2F%20R3F-00e5ff.svg)]()

> **DRISHTI** (*Train for the unseen. Secure the skies.*) is a browser-based tactical drone and counter-drone defense training simulation platform. Built for air defense personnel and security operators, DRISHTI trains trainees to **OBSERVE**, **DETECT**, **CLASSIFY**, and **RESPOND** to commercial multirotors, fixed-wing surveillance UAVs, and coordinated drone swarms across realistic 3D environments, as well as pilot manual 6-DOF FPV drones, conduct confined indoor structure inspections, and perform strategic aerial reconnaissance.

Website link: https://drishti-9fe.pages.dev/

---

## 🏛️ Platform Architecture & Integrated Capabilities

```text
                                     DRISHTI PLATFORM SHELL
 ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
 │ Navigation:   [Training Hub]  [Threat Sim]  [Operator Training]  [Academy]  [AAR]  [Perf]   │
 └───────┬───────────────────────────┬──────────────────────────────────┬───────────┬──────────┘
         │                           │                                  │           │
         ▼                           ▼                                  ▼           ▼
┌──────────────────┐       ┌──────────────────┐               ┌───────────┐ ┌─────────────┐
│ 4 Counter-Drone  │       │ 3 Operator Drills│               │ DRISHTI   │ │ AAR & PERF  │
│ Scenarios (3D)   │       │ FPV, Indoor, Obs │               │ ACADEMY   │ │ ANALYTICS   │
└────────┬─────────┘       └─────────┬────────┘               └─────┬─────┘ └──────┬──────┘
         │                           │                              │              │
         └─────────────┬─────────────┘                              │              │
                       ▼                                            ▼              ▼
         ┌─────────────────────────────────────────────────────────────────────────────────────┐
         │                  UNIFIED LOCAL PERSISTENCE LAYER (sessionStore.ts)                  │
         │  • drishti_aar_sessions (Sortie logs, event timelines, trajectory coordinates)     │
         │  • drishti_academy_progress (Module slides, quiz scores, completed videos)          │
         └─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Training Hub (`/`)
- Central mission operations launcher featuring live 3D tactical terrain rendering.
- Interactive scenario catalog with environment category chips (Rural, Urban, Day, Night, Swarm).
- Recent Training Sorties widget displaying live locally completed sessions with instant After-Action Review (AAR) debrief links.

### 2. Core Counter-Drone Threat Simulation (`/sim`, `/sim/:id`)
- 5-Phase structured military training workflow: **Briefing ➔ Airspace Observation ➔ Object Detection ➔ Multi-Sensor Classification ➔ Defensive Response ➔ Explainable Assessment**.
- Four playable scenarios:
  1. **Single Unknown Drone — Rural Daylight** (`rural-day-unknown`): Low-altitude Doppler track moving across farmland approach corridor.
  2. **Suspicious Drone — Urban Environment** (`urban-day-suspicious`): Dark-painted airframe weaving through alleyways with electrical substation line-of-sight masking.
  3. **Low-Visibility Observation — Night** (`night-low-vis`): Fixed-wing long-range recon drone with NVG/FLIR optic overlay toggle and strobe acquisition.
  4. **Multiple Drone Activity — Swarm Awareness** (`swarm-awareness`): Micro-drone formation exhibiting synchronized turns and mesh dispersal.

### 3. Operator Training Workstations (`/training`)
- **Experience A — FPV Flight Familiarization** (`/training/fpv`): 6-DOF manual drone flight with pitch, roll, yaw, and throttle through 5 illuminated checkpoint gates.
- **Experience B — Indoor Drone Inspection** (`/training/indoor`): Confined facility navigation with interactive toggleable spotlight, inspecting hazardous electrical breakers, unsecured briefcases, and battery storage racks.
- **Experience C — Aerial Observation Training** (`/training/aerial`): High-altitude sensor reconnaissance platform with switchable Oblique/Overhead gimbal camera modes and strategic target identification.

### 4. Drishti Academy (`/academy`)
- 7 Air defense curriculum categories with search and category filtering.
- **Verified Educational Video Library**: Public educational videos from authoritative sources (Lesics, FAA, NASA Ames Research Center, Alec Searle, Lockheed Martin, NATO News) with embedded player and YouTube fallbacks.
- **3 Interactive Doctrinal Modules**: *Drone Recognition Basics*, *Observation & Multi-Sensor Classification*, and *Defensive Reporting & Decision-Making* with multi-slide doctrine and 4-question knowledge quizzes with immediate feedback.

### 5. After-Action Review (AAR) (`/aar`)
- Filterable and searchable sortie log connecting to real simulator sessions.
- **Detailed Debriefing Modal**: Mission summary, transparent scoring formula breakdown, chronological event timeline with timestamps, decision review (trainee choice vs doctrinal standard), and actionable tactical refinement suggestions.
- **Reconstructed Tactical Session Replay**: Interactive 2D radar grid trajectory scrubber displaying drone flight paths, detection markers, and mission milestones.

### 6. Performance Analytics (`/performance`)
- Dynamic readiness analytics derived from saved sortie records: Average Score, Target Detection Latency (sec), Classification Accuracy Rate (%), and Academy Completion Rate.
- Visualizations via Recharts (Score Progression trend, Detection Latency progression, Sortie distribution by category).
- Dynamic rule-based Strengths, Improvement Directives, and Next Training Recommendations.

---

## 🛠️ Monorepo Structure

```text
Drishti/
├── frontend/                     # Standalone React 18 + Vite + Three.js + Tailwind web application
│   ├── public/
│   │   └── _redirects            # Cloudflare Pages SPA rewrite rule (/* /index.html 200)
│   ├── src/
│   │   ├── components/
│   │   │   ├── aar/              # DetailedAARModal, ReconstructedSessionReplay
│   │   │   ├── academy/          # AcademyVideoModal, InteractiveModuleModal
│   │   │   ├── layout/           # Sidebar, TopBar
│   │   │   ├── simulation/       # BriefingModal, ObservationPanel, ThreatResponsePanel, AssessmentReportModal, EventFeed
│   │   │   ├── training/         # FPVFlightWorld, IndoorInspectionWorld, AerialObservationWorld, HUDs, Modals
│   │   │   └── world3d/          # TrainingWorld, TacticalCompound, UrbanEnvironment, SimulatedDrone, CameraController
│   │   ├── data/
│   │   │   ├── academyData.ts    # Curated videos and interactive doctrine modules
│   │   │   ├── counterDroneScenarios.ts # 4 tactical counter-drone scenario definitions
│   │   │   ├── missions.ts       # Mission catalog and environment configurations
│   │   │   ├── operatorTrainingData.ts  # FPV gates, indoor targets, aerial landmarks
│   │   │   └── sessionStore.ts   # Unified local persistence layer (localStorage)
│   │   ├── pages/                # All application routes
│   │   └── types/                # Strict TypeScript data models
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Lightweight FastAPI microservice (Render deployment)
│   ├── main.py                   # Health check, status endpoint, and CORS middleware
│   ├── requirements.txt
│   ├── runtime.txt               # Python 3.11.9
│   └── render.yaml               # Infrastructure-as-code blueprint for Render
├── README.md
└── render.yaml
```

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Run the Standalone Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The application runs 100% standalone with complete local simulation, Three.js 3D rendering, local telemetry storage, and analytics.

### Verify Production Build
```bash
cd frontend
npm run build
```
Compiles the production TypeScript bundle into `frontend/dist/` with zero errors.

---

## 🌐 Production Deployment Guide

### A. Deploy Frontend on Cloudflare Pages
1. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your `Drishti` repository.
3. Configure build settings:
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare respects `frontend/public/_redirects` for Single Page Application client-side routing.

### B. Deploy Backend on Render
1. In Render Dashboard, create a new Blueprint service using the repository's root `render.yaml`.
2. Render provisions the FastAPI service on Python 3.11 with automatic CORS configuration.

---

## 📜 Notice & Compliance
Developed under Problem Statement 26247: *AI-Enabled Drone & Counter-Drone Threat Simulation Trainer*. All scenarios, telemetry profiles, and radar models are generic simulations intended exclusively for defensive training and educational evaluation.
