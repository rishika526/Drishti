export type EntityType = 'bird' | 'hobby' | 'friendly' | 'recon' | 'attack' | 'swarm';

export type IFFStatus = 'VALID' | 'INVALID' | 'NONE';
export type SignatureLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
export type ContactStatus = 'active' | 'destroyed' | 'jammed' | 'escaped' | 'neutralized';
export type SwarmRole = 'scout' | 'decoy' | 'striker';

export type ResponseAction = 
  | 'hold_fire' 
  | 'alert_alarm' 
  | 'jam_ew' 
  | 'soft_kill' 
  | 'hard_kill' 
  | 'take_cover';

export type ClassificationType = 
  | 'bird' 
  | 'hobby' 
  | 'friendly' 
  | 'recon' 
  | 'attack' 
  | 'swarm' 
  | 'unknown';

export interface GroundTruth {
  id: string;
  callsign: string;
  type: EntityType;
  hostile: boolean;
  intent: string;
  spawnTime: number; // in seconds
  initialPosition: [number, number, number];
  speed: number; // m/s
  altitude: number; // meters
  heading: number; // degrees 0-359
  iff: IFFStatus;
  rfSignature: SignatureLevel;
  acousticSignature: SignatureLevel;
  rcs: number; // m^2
  swarmId?: string;
  swarmRole?: SwarmRole;
}

export interface ContactEntity extends GroundTruth {
  position: [number, number, number];
  velocity: [number, number, number];
  distanceToBase: number; // meters
  bearing: number; // degrees from base
  elevation: number; // degrees
  
  // Trainee interaction state
  detected: boolean;
  detectedAt: number | null;
  classifiedAs: ClassificationType | null;
  classifiedAt: number | null;
  responseAction: ResponseAction | null;
  respondedAt: number | null;
  status: ContactStatus;

  // Track history for trajectory replay
  history: Array<{ t: number; pos: [number, number, number] }>;

  // Radar observability
  isRadarVisible: boolean;
  radarOccludedByTerrain: boolean;
  radarBlipAlpha: number; // for canvas fade effect
}

export type TimeOfDay = 'day' | 'dusk' | 'night' | 'dawn';
export type TerrainType = 'rural' | 'hills' | 'desert' | 'urban';
export type WeatherType = 'clear' | 'fog' | 'rain' | 'dust';
export type SensorState = 'nominal' | 'radar-degraded' | 'eo-degraded' | 'jammed' | 'dual-degraded';

export interface JammingSector {
  startAngle: number;
  endAngle: number;
  intensity: number;
}

export interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  briefing: string;
  duration: number; // seconds
  timeOfDay: TimeOfDay;
  terrain: TerrainType;
  weather: WeatherType;
  initialSensorState: SensorState;
  threatCount: number;
  seed: number;
  isTutorial?: boolean;
  tutorialSteps?: TutorialStep[];
  scriptedSpawns?: Array<Partial<GroundTruth>>;
}

export interface TutorialStep {
  id: number;
  title: string;
  instruction: string;
  targetContactId?: string;
  requiredAction?: 'select' | 'detect' | 'classify' | 'respond';
  requiredValue?: string;
  completed: boolean;
}

export interface DecisionNode {
  node: string;
  condition: string;
  result: boolean;
  note: string;
}

export interface PerThreatScore {
  threatId: string;
  callsign: string;
  actualType: EntityType;
  hostile: boolean;
  detectionScore: number; // 0-100
  detectionTimeElapsed: number; // seconds since detectable
  classificationScore: number; // 0-100
  classifiedAs: string | null;
  engagementScore: number; // 0-100
  actionTaken: ResponseAction | null;
  roeScore: number; // 0-100
  totalScore: number; // weighted 0-100
  criticalError: boolean;
  criticalReason?: string;
  decisionPath: DecisionNode[];
}

export type GradeBand = 'A' | 'B' | 'C' | 'D' | 'F';

export interface MissionScoreResult {
  sessionId: string;
  scenarioId: string;
  scenarioName: string;
  timestamp: string;
  durationSeconds: number;
  overallScore: number;
  grade: GradeBand;
  breakdown: {
    detection: number;
    classification: number;
    engagement: number;
    roe: number;
  };
  criticalErrors: string[];
  threatScores: PerThreatScore[];
  coachingFeedback: string[];
  seed: number;
}

export interface TelemetrySnapshot {
  t: number;
  contacts: Array<{
    id: string;
    pos: [number, number, number];
    status: ContactStatus;
    detected: boolean;
    type: EntityType;
    hostile: boolean;
  }>;
}

export interface MissionSessionLog {
  sessionId: string;
  scenarioDef: ScenarioDef;
  startTime: number;
  endTime: number;
  events: Array<{
    t: number;
    type: 'SPAWN' | 'DETECT' | 'CLASSIFY' | 'RESPOND' | 'SENSOR_CHANGE' | 'HIT' | 'LEAKER' | 'INFO';
    message: string;
    data?: any;
  }>;
  snapshots: TelemetrySnapshot[];
  scoreResult?: MissionScoreResult;
}

export interface SkillRatings {
  detection: number;
  classification: number;
  engagement: number;
  night: number;
  swarm: number;
  degradedSensors: number;
  urban: number;
}

export interface TraineeProfile {
  callsign: string;
  serviceId: string;
  section: 'Section A' | 'Section B' | 'Section C';
  skills: SkillRatings;
  totalSessions: number;
  avgScore: number;
  history: Array<{
    sessionId: string;
    date: string;
    scenarioName: string;
    score: number;
    grade: GradeBand;
  }>;
}

export interface BackendStatusState {
  status: 'offline' | 'waking' | 'online';
  latencyMs?: number;
  apiUrl: string;
  lastChecked?: string;
}
