// DRISHTI: Simulation Types & Domain Models
// Stage 2: Core Counter-Drone Threat Simulation

export type CameraPerspective = 'tactical_orbit' | 'aerial_overview' | 'drone_fpv';

export type EnvironmentType = 'rural_day' | 'urban_day' | 'mountain_dusk' | 'border_night';

export type ScenarioCategory = 'All' | 'Rural' | 'Urban' | 'Day' | 'Night' | 'Single Drone' | 'Swarm';

export type SimulationPhase =
  | 'BRIEFING'       // Phase A: Mission briefing & instructions
  | 'OBSERVING'      // Phase B: Live airspace surveillance & detection
  | 'CLASSIFYING'    // Phase C: Sensor inspection & object classification
  | 'RESPONDING'     // Phase D: Threat assessment & defensive response selection
  | 'COMPLETED';     // Phase E: Mission debrief & explainable assessment

export type DroneClassification =
  | 'authorized_aircraft'    // Known civilian / allied aircraft
  | 'unknown_drone'          // Unregistered generic commercial drone
  | 'suspicious_drone'       // Modified drone / potential hostile payload
  | 'swarm_activity';        // Multiple drones / decentralized cluster

export type DefensiveResponse =
  | 'continue_monitoring'     // Keep passive observation
  | 'record_and_report'       // Log observation in sector logbook
  | 'issue_alert'             // Broadcast training alert to perimeter posts
  | 'escalate_command'        // Escalate to designated command authority
  | 'safety_procedure';       // Execute predefined safety & airspace lockdown procedure

export interface SimulationEvent {
  id: string;
  timestampSec: number;
  type: 'INFO' | 'DETECTION' | 'CLASSIFICATION' | 'RESPONSE' | 'WARNING' | 'ALERT';
  message: string;
}

export interface EnvironmentConfig {
  id: EnvironmentType;
  name: string;
  lighting: {
    sunPosition: [number, number, number];
    sunIntensity: number;
    sunColor: string;
    ambientColor: string;
    ambientIntensity: number;
    skyTurbidity: number;
    skyRayleigh: number;
    skyMieCoefficient: number;
    fogColor: string;
    fogNear: number;
    fogFar: number;
  };
  wind: {
    speedKnots: number;
    directionDeg: number;
  };
}

export interface DroneWaypoint {
  pos: [number, number, number]; // [x, y, z] in meters
  speedMs: number;
}

export interface SimulatedTargetDef {
  id: string;
  label: string;
  modelType: 'quadcopter' | 'fixed_wing' | 'micro_boid';
  path: DroneWaypoint[];
  spawnDelaySec: number;
  visualColor: string;
  initialHeadingDeg: number;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  codename: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: ScenarioCategory[];
  environment: EnvironmentType;
  location: string;
  estimatedDurationSec: number;
  briefing: {
    description: string;
    objectives: string[];
    threatContext: string;
    traineeInstructions: string[];
  };
  // Drones
  targets: SimulatedTargetDef[];
  // Sensor details revealed upon detection
  sensorIntel: {
    visualDescription: string;
    flightBehavior: string;
    estimatedSpeedBand: string;
    estimatedAltitudeBand: string;
    rfTelemetry: string;
    acousticProfile: string;
    thermalProfile: string;
    sensorConfidencePct: number;
  };
  // Expected Decisions & Explanations
  expectedClassification: DroneClassification;
  classificationRationale: string;
  expectedResponse: DefensiveResponse;
  responseRationale: string;
  // Explanations for all options
  classificationOptionsExpl: Record<DroneClassification, { title: string; rationale: string; accurate: boolean }>;
  responseOptionsExpl: Record<DefensiveResponse, { title: string; rationale: string; quality: 'optimal' | 'suboptimal' | 'inappropriate' }>;
  improvementTips: string[];
}

export interface MissionScoreBreakdown {
  totalScore: number; // 0 - 1000
  detectionScore: number; // 0 - 300
  classificationScore: number; // 0 - 350
  responseScore: number; // 0 - 350
  detectionTimeSec: number;
  classificationAccurate: boolean;
  responseQuality: 'optimal' | 'suboptimal' | 'inappropriate';
  rankRating: 'Exemplary Defense' | 'Tactically Proficient' | 'Qualified Operator' | 'Retraining Recommended';
}

export interface CompletedSessionRecord {
  sessionId: string;
  scenarioId: string;
  scenarioTitle: string;
  dateIso: string;
  durationSec: number;
  score: MissionScoreBreakdown;
  selectedClassification: DroneClassification;
  selectedResponse: DefensiveResponse;
  events: SimulationEvent[];
}

export interface DroneTelemetry {
  position: [number, number, number];
  altitudeMeters: number;
  speedMs: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  batteryPct: number;
  linkQualityPct: number;
  cameraTiltDeg: number;
}

export interface OperatorProfile {
  name: string;
  rank: string;
  callsign: string;
  unit: string;
  status: 'Operational' | 'Standby' | 'Training';
}

export interface TrainingMission {
  id: string;
  title: string;
  codename: string;
  category: ScenarioCategory[];
  environment: EnvironmentType;
  location: string;
  durationMinutes: number;
  threatType: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objectives: string[];
  thumbnailGradient: string;
}
