import { create } from 'zustand';
import {
  ClassificationType,
  ContactEntity,
  GroundTruth,
  JammingSector,
  MissionScoreResult,
  ResponseAction,
  ScenarioDef,
  SensorState,
  TelemetrySnapshot,
} from '../types';
import { calculateMissionScore, ENGAGEMENT_ENVELOPE_METERS } from '../engine/scoring';
import { updateSwarmBoids } from '../engine/boids';
import { soundEngine } from '../engine/audio';

interface SimulationState {
  currentScenario: ScenarioDef | null;
  missionActive: boolean;
  isPaused: boolean;
  missionTime: number; // in seconds
  contacts: ContactEntity[];
  selectedContactId: string | null;
  cameraMode: 'EO' | 'IR';
  zoomLevel: number;
  sensorState: SensorState;
  radarJammingSectors: JammingSector[];
  cameraDegraded: boolean;
  lowQualityMode: boolean;
  soundEnabled: boolean;
  isAutopilot: boolean;
  tutorialCurrentStep: number;
  eventLog: Array<{ t: number; type: string; message: string }>;
  telemetrySnapshots: TelemetrySnapshot[];
  lastSnapshotTime: number;
  scoreResult: MissionScoreResult | null;
  radarSweepAngle: number; // 0 to 360

  // Actions
  loadScenario: (scenario: ScenarioDef) => void;
  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  resetMission: () => void;
  stepSimulation: (dt: number) => void;
  selectContact: (id: string | null) => void;
  flagContactDetected: (id: string) => void;
  classifyContact: (id: string, classification: ClassificationType) => void;
  respondToContact: (id: string, action: ResponseAction) => void;
  setCameraMode: (mode: 'EO' | 'IR') => void;
  setZoomLevel: (zoom: number) => void;
  toggleLowQuality: () => void;
  toggleSound: () => void;
  toggleAutopilot: () => void;
  finishMission: () => MissionScoreResult;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentScenario: null,
  missionActive: false,
  isPaused: false,
  missionTime: 0,
  contacts: [],
  selectedContactId: null,
  cameraMode: 'EO',
  zoomLevel: 1,
  sensorState: 'nominal',
  radarJammingSectors: [],
  cameraDegraded: false,
  lowQualityMode: false,
  soundEnabled: true,
  isAutopilot: false,
  tutorialCurrentStep: 1,
  eventLog: [],
  telemetrySnapshots: [],
  lastSnapshotTime: 0,
  scoreResult: null,
  radarSweepAngle: 0,

  loadScenario: (scenario) => {
    // Initialize contacts from scripted spawns
    const contacts: ContactEntity[] = (scenario.scriptedSpawns || []).map((spawn) => {
      const pos: [number, number, number] = [
        spawn.initialPosition?.[0] ?? 800,
        spawn.initialPosition?.[1] ?? 50,
        spawn.initialPosition?.[2] ?? 800,
      ];
      const dist = Math.sqrt(pos[0] * pos[0] + pos[2] * pos[2]);
      const rad = Math.atan2(pos[0], pos[2]);
      const bearing = Math.round(((rad * 180) / Math.PI + 360) % 360);

      // Heading vector towards base
      const toBaseX = -pos[0];
      const toBaseZ = -pos[2];
      const baseLen = Math.sqrt(toBaseX * toBaseX + toBaseZ * toBaseZ) || 1;
      const speed = spawn.speed ?? 25;
      const vel: [number, number, number] = [
        (toBaseX / baseLen) * speed,
        0,
        (toBaseZ / baseLen) * speed,
      ];

      return {
        id: spawn.id || `tgt-${Math.random().toString(36).substr(2, 6)}`,
        callsign: spawn.callsign || 'TGT-UNKNOWN',
        type: spawn.type || 'attack',
        hostile: spawn.hostile ?? true,
        intent: spawn.intent || 'transit',
        spawnTime: spawn.spawnTime ?? 0,
        initialPosition: pos,
        speed,
        altitude: spawn.altitude ?? pos[1],
        heading: spawn.heading ?? Math.round(((Math.atan2(vel[0], vel[2]) * 180) / Math.PI + 360) % 360),
        iff: spawn.iff || 'NONE',
        rfSignature: spawn.rfSignature || 'LOW',
        acousticSignature: spawn.acousticSignature || 'LOW',
        rcs: spawn.rcs ?? 0.05,
        swarmId: spawn.swarmId,
        swarmRole: spawn.swarmRole,
        position: [...pos],
        velocity: vel,
        distanceToBase: dist,
        bearing,
        elevation: Math.round((Math.atan2(pos[1], dist) * 180) / Math.PI),
        detected: false,
        detectedAt: null,
        classifiedAs: null,
        classifiedAt: null,
        responseAction: null,
        respondedAt: null,
        status: 'active',
        history: [{ t: 0, pos: [...pos] }],
        isRadarVisible: false,
        radarOccludedByTerrain: false,
        radarBlipAlpha: 0,
      };
    });

    // Jamming sectors if jammed
    const jammingSectors: JammingSector[] =
      scenario.initialSensorState === 'jammed' || scenario.initialSensorState === 'dual-degraded'
        ? [
            { startAngle: 40, endAngle: 85, intensity: 0.9 },
            { startAngle: 220, endAngle: 260, intensity: 0.8 },
          ]
        : [];

    set({
      currentScenario: scenario,
      missionActive: false,
      isPaused: false,
      missionTime: 0,
      contacts,
      selectedContactId: contacts[0]?.id || null,
      cameraMode: 'EO',
      zoomLevel: 1,
      sensorState: scenario.initialSensorState,
      radarJammingSectors: jammingSectors,
      cameraDegraded: scenario.weather === 'fog' || scenario.weather === 'dust',
      tutorialCurrentStep: 1,
      eventLog: [
        {
          t: 0,
          type: 'INFO',
          message: `Mission initialized: ${scenario.name}. Sensors: ${scenario.initialSensorState.toUpperCase()}.`,
        },
      ],
      telemetrySnapshots: [],
      lastSnapshotTime: 0,
      scoreResult: null,
      radarSweepAngle: 0,
    });
  },

  startMission: () => {
    soundEngine.playUIClick();
    set({ missionActive: true, isPaused: false });
  },

  pauseMission: () => {
    set({ isPaused: true });
    soundEngine.stopAcousticDroneHum();
  },

  resumeMission: () => {
    set({ isPaused: false });
  },

  resetMission: () => {
    const sc = get().currentScenario;
    if (sc) get().loadScenario(sc);
  },

  stepSimulation: (dt: number) => {
    const {
      currentScenario,
      missionActive,
      isPaused,
      missionTime,
      contacts,
      telemetrySnapshots,
      lastSnapshotTime,
      sensorState,
      radarJammingSectors,
      isAutopilot,
      tutorialCurrentStep,
    } = get();

    if (!missionActive || isPaused || !currentScenario) return;

    const newTime = missionTime + dt;
    const newSweep = (get().radarSweepAngle + dt * 90) % 360; // 90 deg/s -> 4s per revolution

    // Dynamic scenario events (e.g. radar jamming trigger at 25s for radar-down scenario)
    let nextSensorState = sensorState;
    let nextJammingSectors = [...radarJammingSectors];
    if (currentScenario.id === 'radar-down' && newTime >= 20 && sensorState === 'nominal') {
      nextSensorState = 'jammed';
      nextJammingSectors = [
        { startAngle: 60, endAngle: 120, intensity: 0.95 },
        { startAngle: 280, endAngle: 330, intensity: 0.85 },
      ];
      soundEngine.playEWJamPulse();
      get().eventLog.push({
        t: Math.round(newTime),
        type: 'SENSOR_CHANGE',
        message: 'ALERT: Severe wideband EW jamming detected on primary radar array!',
      });
    }

    // Separate swarm and individual contacts for boids update
    const swarmContacts = contacts.filter((c) => c.type === 'swarm');
    if (swarmContacts.length > 0) {
      updateSwarmBoids(swarmContacts, [0, 20, 0], dt);
    }

    // Update all contacts kinematics and radar visibility
    let closestActiveDist = 99999;
    const updatedContacts = contacts.map((c) => {
      // Spawn time gate
      if (newTime < c.spawnTime) {
        return c;
      }

      // If active, update position
      if (c.status === 'active') {
        if (c.type !== 'swarm') {
          c.position[0] += c.velocity[0] * dt;
          c.position[1] += c.velocity[1] * dt;
          c.position[2] += c.velocity[2] * dt;
          c.distanceToBase = Math.sqrt(
            c.position[0] * c.position[0] + c.position[2] * c.position[2]
          );
          const rad = Math.atan2(c.position[0], c.position[2]);
          c.bearing = Math.round(((rad * 180) / Math.PI + 360) % 360);
          c.elevation = Math.round((Math.atan2(c.position[1], c.distanceToBase) * 180) / Math.PI);
        }

        if (c.distanceToBase < closestActiveDist) {
          closestActiveDist = c.distanceToBase;
        }

        // Urban / terrain line-of-sight occlusion:
        // In urban terrain, contacts flying below 45m with distance > 400m are masked behind buildings
        const isOccluded =
          currentScenario.terrain === 'urban' &&
          c.altitude < 45 &&
          c.distanceToBase > 350;
        c.radarOccludedByTerrain = isOccluded;

        // Radar visibility calculation:
        // Visible if: spawned, active, not occluded, and not in blacked-out sensor state
        let visible = !isOccluded && nextSensorState !== 'dual-degraded';

        // Check if inside a jamming noise sector
        if (visible && nextSensorState === 'jammed') {
          const inJammedSector = nextJammingSectors.some(
            (sec) => c.bearing >= sec.startAngle && c.bearing <= sec.endAngle
          );
          if (inJammedSector) visible = false;
        }

        c.isRadarVisible = visible;

        // Blip sweep illumination: if radar beam just crossed bearing
        const sweepDiff = Math.abs(c.bearing - newSweep);
        if (sweepDiff < 6 && visible && c.radarBlipAlpha < 0.2) {
          c.radarBlipAlpha = 1.0;
          soundEngine.playRadarBlip();
        } else {
          c.radarBlipAlpha = Math.max(0, c.radarBlipAlpha - dt * 0.4);
        }

        // Perimeter breach check
        if (c.distanceToBase < 80 && c.hostile) {
          c.status = 'escaped';
          soundEngine.playThreatAlarm();
          get().eventLog.push({
            t: Math.round(newTime),
            type: 'LEAKER',
            message: `CRITICAL PERIMETER BREACH: Hostile ${c.callsign} penetrated inner asset defense zone!`,
          });
        }
      }

      return c;
    });

    // Update acoustic engine proximity tone
    soundEngine.updateAcousticDroneHum(closestActiveDist);

    // 2 Hz Telemetry snapshot recorder (every 0.5s)
    let newSnapshots = telemetrySnapshots;
    let nextSnapTime = lastSnapshotTime;
    if (newTime - lastSnapshotTime >= 0.5) {
      nextSnapTime = newTime;
      const snapshot: TelemetrySnapshot = {
        t: Math.round(newTime * 10) / 10,
        contacts: updatedContacts.map((c) => ({
          id: c.id,
          pos: [
            Math.round(c.position[0]),
            Math.round(c.position[1]),
            Math.round(c.position[2]),
          ],
          status: c.status,
          detected: c.detected,
          type: c.type,
          hostile: c.hostile,
        })),
      };
      newSnapshots = [...telemetrySnapshots, snapshot];
    }

    // Autopilot agent (P2): executes disciplined trainee actions automatically
    if (isAutopilot) {
      updatedContacts.forEach((contact) => {
        if (newTime >= contact.spawnTime + 1.2 && !contact.detected) {
          get().flagContactDetected(contact.id);
        }
        if (contact.detected && !contact.classifiedAs && newTime >= (contact.detectedAt || 0) + 1.5) {
          get().classifyContact(contact.id, contact.type);
        }
        if (
          contact.classifiedAs &&
          !contact.responseAction &&
          newTime >= (contact.classifiedAt || 0) + 1.5
        ) {
          if (contact.hostile) {
            if (contact.type === 'attack') get().respondToContact(contact.id, 'hard_kill');
            else if (contact.type === 'swarm') get().respondToContact(contact.id, 'jam_ew');
            else get().respondToContact(contact.id, 'soft_kill');
          } else {
            get().respondToContact(contact.id, 'hold_fire');
          }
        }
      });
    }

    // Check if mission time completed
    if (newTime >= currentScenario.duration) {
      get().finishMission();
      return;
    }

    set({
      missionTime: newTime,
      radarSweepAngle: newSweep,
      contacts: updatedContacts,
      sensorState: nextSensorState,
      radarJammingSectors: nextJammingSectors,
      telemetrySnapshots: newSnapshots,
      lastSnapshotTime: nextSnapTime,
    });
  },

  selectContact: (id) => {
    soundEngine.playUIClick();
    set({ selectedContactId: id });

    // Check tutorial step 1
    const { currentScenario, tutorialCurrentStep } = get();
    if (currentScenario?.isTutorial && tutorialCurrentStep === 1 && id) {
      set({ tutorialCurrentStep: 2 });
    }
  },

  flagContactDetected: (id) => {
    const { contacts, missionTime, currentScenario, tutorialCurrentStep } = get();
    soundEngine.playUIClick();

    const updated = contacts.map((c) => {
      if (c.id === id && !c.detected) {
        return {
          ...c,
          detected: true,
          detectedAt: missionTime,
        };
      }
      return c;
    });

    const contact = contacts.find((c) => c.id === id);
    const logMsg = `Target designated: ${contact?.callsign || id} at bearing ${contact?.bearing || 0}°, range ${contact?.distanceToBase.toFixed(0)}m.`;

    get().eventLog.push({
      t: Math.round(missionTime),
      type: 'DETECT',
      message: logMsg,
    });

    if (currentScenario?.isTutorial && tutorialCurrentStep === 2) {
      set({ tutorialCurrentStep: 3 });
    }

    set({ contacts: updated });
  },

  classifyContact: (id, classification) => {
    const { contacts, missionTime, currentScenario, tutorialCurrentStep } = get();
    soundEngine.playUIClick();

    const updated = contacts.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          classifiedAs: classification,
          classifiedAt: missionTime,
        };
      }
      return c;
    });

    const contact = contacts.find((c) => c.id === id);
    get().eventLog.push({
      t: Math.round(missionTime),
      type: 'CLASSIFY',
      message: `${contact?.callsign || id} classified as: ${classification.toUpperCase()}.`,
    });

    if (currentScenario?.isTutorial && tutorialCurrentStep === 3) {
      set({ tutorialCurrentStep: 4 });
    }

    set({ contacts: updated });
  },

  respondToContact: (id, action) => {
    const { contacts, missionTime, currentScenario, tutorialCurrentStep } = get();
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    if (action === 'hard_kill') {
      soundEngine.playHardKillSplash();
    } else if (action === 'jam_ew') {
      soundEngine.playEWJamPulse();
    } else if (action === 'alert_alarm') {
      soundEngine.playThreatAlarm();
    } else {
      soundEngine.playUIClick();
    }

    // Determine target state update
    let nextStatus = contact.status;
    if (action === 'hard_kill') {
      nextStatus = 'destroyed';
    } else if (action === 'jam_ew' || action === 'soft_kill') {
      nextStatus = 'jammed';
    }

    const updated = contacts.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          responseAction: action,
          respondedAt: missionTime,
          status: nextStatus,
        };
      }
      return c;
    });

    get().eventLog.push({
      t: Math.round(missionTime),
      type: 'RESPOND',
      message: `Directive executed on ${contact.callsign}: ${action.toUpperCase()} (${contact.distanceToBase.toFixed(0)}m range).`,
    });

    if (currentScenario?.isTutorial && tutorialCurrentStep === 4) {
      set({ tutorialCurrentStep: 5 });
    }

    set({ contacts: updated });
  },

  setCameraMode: (mode) => {
    soundEngine.playUIClick();
    set({ cameraMode: mode });
  },

  setZoomLevel: (zoom) => {
    soundEngine.playUIClick();
    set({ zoomLevel: zoom });
  },

  toggleLowQuality: () => {
    set((state) => ({ lowQualityMode: !state.lowQualityMode }));
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    soundEngine.setSoundEnabled(next);
    set({ soundEnabled: next });
  },

  toggleAutopilot: () => {
    soundEngine.playUIClick();
    set((state) => ({ isAutopilot: !state.isAutopilot }));
  },

  finishMission: () => {
    const { currentScenario, contacts, missionTime } = get();
    soundEngine.stopAcousticDroneHum();

    const sessionId = `sess-${Date.now()}`;
    const score = calculateMissionScore(
      sessionId,
      currentScenario?.id || 'unknown',
      currentScenario?.name || 'Simulation Mission',
      currentScenario?.seed || 1234,
      contacts,
      missionTime
    );

    set({
      missionActive: false,
      scoreResult: score,
    });

    return score;
  },
}));
