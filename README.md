# Drishti: AI-Enabled Drone & Counter-Drone Threat Simulation Trainer

[![Smart India Hackathon](https://img.shields.io/badge/SIH%202024-PS%2026247-00ff9c.svg)](https://sih.gov.in)
[![Ministry of Defence](https://img.shields.io/badge/Ministry%20of%20Defence-DSSC-ffb000.svg)](https://mod.gov.in)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020.svg)](https://pages.cloudflare.com)
[![Render Free Tier](https://img.shields.io/badge/Backend-Render%20FastAPI-46e3b7.svg)](https://render.com)
[![Deterministic](https://img.shields.io/badge/Simulation-Mulberry32%20Deterministic-00e5ff.svg)]()

> **Drishti** is a browser-based tactical counter-drone simulation trainer built for defence personnel (Defence Services Staff College / Ministry of Defence). It trains operators to **DETECT**, **CLASSIFY**, and **RESPOND** to single-drone and coordinated swarm incursions across day/night, degraded electro-optical/radar sensors, and urban/rural terrain.

---

## Key Highlights

- **100% Standalone Client Architecture:** Drishti runs completely in any modern desktop browser with zero special hardware. If the backend is offline or sleeping, the frontend operates seamlessly with complete local simulation, deterministic Mulberry32 seed engine, WebAudio synthesizers, and localStorage telemetry.
- **Explainable Decision Tree Scoring (P0):** Zero blackbox scoring. Every trainee decision is evaluated through a strict military Rules of Engagement (ROE) decision tree with an audited node path shown in the After Action Report (AAR).
- **Swarm Boids AI (P0):** Flocking simulation (separation, alignment, cohesion) with tactical roles (scout, decoy, striker) and electronic warfare (EW) disruption behaviors.
- **Adaptive Bayesian-Elo Skill Model (P0/P1):** Per-domain skill tracking (detection, classification, engagement, night ops, swarm defense, degraded sensors, urban canyon) and Thompson sampling to recommend next missions targeting trainee weaknesses.
- **Multi-Spectrum Sensor Suite:**
  - Canvas Radar PPI scope with phosphor persistence sweep, range rings, WEZ envelope (1200m), noise clutter, and EW strobe jamming wedges.
  - Thermal FLIR (IR) and Electro-Optical (EO) camera modes with zoom.
  - Procedural WebAudio acoustic direction-finder harmonics (480 Hz motor whines) requiring zero external audio files.
- **2D Top-Down Replay Scrubber:** Recorded at 2 Hz, allowing cadets and instructors to scrub through recorded drone flight paths and review response timings.
- **Pre-Seeded DSSC Unit Analytics:** 24 simulated personnel (Eagle, Falcon, Trident sections) across 6 weeks with improving trends, section comparisons, and category heatmaps.

---

## Monorepo Layout

```text
Drishti/
├── frontend/                     # Standalone React 18 + Vite + Three.js + Tailwind web application
│   ├── public/
│   │   └── _redirects            # Cloudflare Pages SPA rewrite rule (/* /index.html 200)
│   ├── src/
│   │   ├── components/           # Radar PPI, 3D Scene, Contact Table, HUD Header, Thermal Camera
│   │   ├── engine/               # Mulberry32 PRNG, Scoring Decision Tree, Adaptive Elo, Boids AI, Audio
│   │   ├── hooks/                # useBackendStatus non-blocking health checker
│   │   ├── lib/                  # API client, Analytics dataset store
│   │   ├── pages/                # Landing, Mission Select, Simulator (lazy-loaded), Debrief, Analytics, Architecture
│   │   ├── scenarios/            # 6 Scripted scenarios (Orientation, Night Recon, Dawn Swarm, Urban, etc.)
│   │   ├── store/                # Zustand simulation state loop
│   │   └── types/                # TypeScript interfaces
│   ├── .env.example
│   ├── .node-version             # Node.js 20
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Lightweight FastAPI microservice (Render deployment)
│   ├── main.py                   # Health check, status endpoint, and CORS middleware
│   ├── requirements.txt
│   ├── runtime.txt               # Python 3.11.9
│   ├── .python-version
│   └── .env.example
├── render.yaml                   # Infrastructure-as-code blueprint for Render
├── .gitignore
└── README.md
```

---

## Local Development Quickstart

### Prerequisites
- Node.js >= 20.0.0
- Python >= 3.11 (optional for backend)

### 1. Run the Standalone Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend will immediately run 100% standalone with full simulation, 3D graphics, sound, and mock analytics.

To verify the production build and run test suites:
```bash
npm test          # Runs 9 Vitest decision tree & scoring unit tests
npm run build     # Compiles production TypeScript bundle into /dist
```

### 2. Run the Optional Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Production Deployment Guide

Drishti is designed for zero-cost, high-reliability deployment:
1. **Frontend:** Deployed to **Cloudflare Pages** (Global edge CDN, 0ms cold start, unlimited bandwidth).
2. **Backend:** Deployed to **Render Free Tier** (Python 3.11 web service).

### A. Deploy Frontend on Cloudflare Pages
1. Push your repository to GitHub.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your `Drishti` repository.
4. Set the build configuration:
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Under **Environment variables**, add:
   - `VITE_API_URL`: URL of your Render backend (e.g., `https://drishti-backend.onrender.com`). *If left blank or omitted, the frontend operates seamlessly in offline standalone mode.*
6. Click **Save and Deploy**. Cloudflare automatically respects `frontend/public/_redirects` for Single Page Application routing.

### B. Deploy Backend on Render
1. In the [Render Dashboard](https://dashboard.render.com/), click **New** > **Blueprint** (or **Web Service**).
2. Select your repository. If using Blueprint, Render will read the root `render.yaml` automatically.
3. If setting up manually as a Web Service:
   - **Name:** `drishti-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** `Free`
4. Under **Environment Variables**, set:
   - `PYTHON_VERSION`: `3.11.9`
   - `FRONTEND_ORIGIN`: Your Cloudflare Pages URL (e.g., `https://drishti-defence.pages.dev,http://localhost:5173`)
5. Click **Deploy Web Service**.

> **Note on Render Free Tier:** Render puts free web services to sleep after 15 minutes of inactivity. Cold starts can take 30–60 seconds. Drishti's `useBackendStatus` hook handles this transparently with an initial 8-second timeout, exponential backoff retries, and a "Waking backend..." badge. The simulator **never blocks or degrades** while the backend awakens.

---

## Trainee Curriculum Scenarios

1. **Orientation & Guided Tutorial (90s):** Single unauthorized commercial quadcopter. Interactive HUD overlay guides the cadet through radar acquisition, detection time stamping, RF signature reading, and ROE restraint.
2. **Night Reconnaissance (100s):** Low-RCS loitering surveillance drone. Requires toggling the optical suite to Thermal FLIR (IR mode) and correlating acoustic bearing tones.
3. **Dawn Swarm Saturation (120s):** 14-drone coordinated boids swarm attacking from multiple vectors. Emphasizes wideband Electronic Warfare (EW) jamming to break the inter-drone mesh.
4. **Urban Canyon Masking (100s):** High-rise building grid occluding radar line-of-sight below 45 meters. Requires visual tracking and acoustic triangulation.
5. **Friend or Foe / IFF Drill (110s):** Congested airspace featuring a friendly UAV with valid Mode-5 IFF, migratory bird flock, commercial drone, and a covert hostile loitering munition. Tests fratricide prevention.
6. **Electronic Warfare Radar Down (110s):** Hostile stand-off noise jamming blinds radar PPI sectors mid-mission, forcing cadets to transition to optical/acoustic fallbacks.
7. **Procedural Mission Generator:** Dynamic scenarios generated via Mulberry32 PRNG with constrained anti-rote randomization (guarantees at least one hostile and prevents identical parameter fingerprints across 3 consecutive sessions).

---

## Explainable Scoring & Rules of Engagement (ROE)

Scoring weights:
- **Detection (25%):** 100 points for designation within 3.0 seconds of detection window, decaying linearly to 0 points at 20.0 seconds.
- **Classification (30%):** Exact class match awards 100 points; adjacent class awards 50 points.
- **Engagement (35%):**
  - Hostile inside 1200m Weapons Engagement Zone (WEZ): Kinetic hard-kill for high-speed strike drones (100 pts), EW jamming for swarms (100 pts), soft-kill takeover for recon (100 pts).
  - Hostile outside 1200m: Tracking and alert status awarded (100 pts); early missile release penalizes ROE.
- **ROE Compliance (10%):**
  - Non-hostile (Friendly UAV, bird flock, hobbyist): Hold Fire / monitor awards 100 points.
  - **Critical Failure Rule:** Firing kinetic weapons on friendly units (fratricide) or allowing a hostile to penetrate unchallenged (leaker) triggers a **CRITICAL BREACH** and caps the overall mission grade at **C**.

---

## License

Developed for the Ministry of Defence / Defence Services Staff College under Smart India Hackathon Problem Statement 26247. All training types, signatures, and models are generic simulation profiles intended for educational and training research.
