import {
  ContactEntity,
  EntityType,
  GroundTruth,
  IFFStatus,
  ScenarioDef,
  SensorState,
  SignatureLevel,
  SwarmRole,
  TerrainType,
  TimeOfDay,
  WeatherType,
} from '../types';
import { createPRNG } from './prng';

export interface GeneratorOptions {
  seed?: number;
  timeOfDay?: TimeOfDay;
  terrain?: TerrainType;
  weather?: WeatherType;
  sensorState?: SensorState;
  threatCount?: number;
  approachVector?: 'single-axis' | 'multi-axis' | 'terrain-masked';
  hostileRatio?: number; // 0 to 1
}

const FINGERPRINT_KEY = 'drishti_scenario_fingerprints';

/**
 * Checks recent scenario fingerprints in localStorage to prevent rote-learning
 */
function isFingerprintRecent(fp: string): boolean {
  try {
    const raw = localStorage.getItem(FINGERPRINT_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.slice(-3).includes(fp);
  } catch {
    return false;
  }
}

function recordFingerprint(fp: string): void {
  try {
    const raw = localStorage.getItem(FINGERPRINT_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    list.push(fp);
    localStorage.setItem(FINGERPRINT_KEY, JSON.stringify(list.slice(-10)));
  } catch {}
}

/**
 * Procedurally generates a scenario with constrained randomization and anti-rote-learning
 */
export function generateScenario(options: GeneratorOptions = {}): ScenarioDef {
  const seed = options.seed ?? Math.floor(Math.random() * 1000000) + 1000;
  let rng = createPRNG(seed);

  const times: TimeOfDay[] = ['day', 'dusk', 'night', 'dawn'];
  const terrains: TerrainType[] = ['rural', 'hills', 'desert', 'urban'];
  const weathers: WeatherType[] = ['clear', 'fog', 'rain', 'dust'];
  const sensors: SensorState[] = ['nominal', 'radar-degraded', 'eo-degraded', 'jammed', 'dual-degraded'];
  const approaches: ('single-axis' | 'multi-axis' | 'terrain-masked')[] = ['single-axis', 'multi-axis', 'terrain-masked'];

  let timeOfDay: TimeOfDay = options.timeOfDay ?? rng.choice(times);
  let terrain: TerrainType = options.terrain ?? rng.choice(terrains);
  let weather: WeatherType = options.weather ?? rng.choice(weathers);
  let sensorState: SensorState = options.sensorState ?? rng.choice(sensors);
  let approachVector: 'single-axis' | 'multi-axis' | 'terrain-masked' = options.approachVector ?? rng.choice(approaches);

  // Anti-rote check: if fingerprint matches any of last 3, mutate
  let fp = `${timeOfDay}_${terrain}_${weather}_${sensorState}_${approachVector}`;
  if (isFingerprintRecent(fp)) {
    timeOfDay = times[(times.indexOf(timeOfDay) + 1) % times.length];
    sensorState = sensors[(sensors.indexOf(sensorState) + 1) % sensors.length];
    fp = `${timeOfDay}_${terrain}_${weather}_${sensorState}_${approachVector}`;
  }
  recordFingerprint(fp);

  const threatCount = Math.min(40, Math.max(2, options.threatCount ?? rng.nextInt(3, 8)));
  const hostileRatio = options.hostileRatio ?? rng.nextRange(0.5, 0.85);

  const scriptedSpawns: Partial<GroundTruth>[] = [];
  const baseAngle = rng.nextRange(0, Math.PI * 2);

  // HARD CONSTRAINT: Always at least one hostile
  let hostileCreated = false;

  for (let i = 0; i < threatCount; i++) {
    // Determine hostile status
    let isHostile = rng.chance(hostileRatio);
    if (i === 0 || (!hostileCreated && i === threatCount - 1)) {
      isHostile = true;
      hostileCreated = true;
    }

    let type: EntityType;
    let iff: IFFStatus = 'NONE';
    let rfSig: SignatureLevel = 'LOW';
    let acousticSig: SignatureLevel = 'LOW';
    let rcs = 0.05;
    let speed = 25;
    let altitude = 60;
    let intent = 'strike';
    let swarmRole: SwarmRole | undefined = undefined;

    if (isHostile) {
      if (threatCount >= 8 && i >= 2) {
        type = 'swarm';
        swarmRole = i % 3 === 0 ? 'scout' : i % 3 === 1 ? 'decoy' : 'striker';
        speed = rng.nextRange(28, 42);
        altitude = rng.nextRange(40, 110);
        rfSig = 'HIGH';
        acousticSig = 'HIGH';
        rcs = 0.03;
        intent = swarmRole === 'scout' ? 'surveillance' : swarmRole === 'decoy' ? 'feint' : 'saturation_attack';
      } else if (rng.chance(0.6)) {
        type = 'attack';
        speed = rng.nextRange(35, 55);
        altitude = rng.nextRange(30, 90);
        rfSig = rng.choice(['MEDIUM', 'HIGH']);
        acousticSig = 'MEDIUM';
        rcs = 0.08;
        intent = 'precision_strike';
      } else {
        type = 'recon';
        speed = rng.nextRange(15, 25);
        altitude = rng.nextRange(120, 220);
        rfSig = 'LOW';
        acousticSig = 'LOW';
        rcs = 0.04;
        intent = 'aerial_reconnaissance';
      }
    } else {
      // Non-hostile
      const roll = rng.next();
      if (roll < 0.35) {
        type = 'friendly';
        iff = 'VALID';
        rfSig = 'HIGH';
        acousticSig = 'MEDIUM';
        speed = rng.nextRange(25, 45);
        altitude = rng.nextRange(150, 300);
        rcs = 0.4;
        intent = 'perimeter_patrol';
      } else if (roll < 0.7) {
        type = 'bird';
        speed = rng.nextRange(8, 16);
        altitude = rng.nextRange(20, 70);
        rfSig = 'NONE';
        acousticSig = 'NONE';
        rcs = 0.005;
        intent = 'biological_flight';
      } else {
        type = 'hobby';
        speed = rng.nextRange(10, 18);
        altitude = rng.nextRange(25, 60);
        rfSig = 'HIGH';
        acousticSig = 'MEDIUM';
        rcs = 0.02;
        intent = 'unauthorized_recreational';
      }
    }

    // Approach angle based on vector mode
    let angle = baseAngle;
    if (approachVector === 'multi-axis') {
      angle = baseAngle + (i / threatCount) * Math.PI * 2 + rng.nextRange(-0.3, 0.3);
    } else if (approachVector === 'terrain-masked') {
      angle = baseAngle + rng.nextRange(-0.4, 0.4);
      altitude = rng.nextRange(15, 35); // hugging terrain
    } else {
      // single-axis
      angle = baseAngle + rng.nextRange(-0.25, 0.25);
    }

    const spawnDist = rng.nextRange(1500, 2400);
    const spawnX = Math.cos(angle) * spawnDist;
    const spawnZ = Math.sin(angle) * spawnDist;
    const spawnTime = i * rng.nextRange(2, 6);

    const callsign = isHostile
      ? `TGT-${String(i + 1).padStart(2, '0')}`
      : type === 'friendly'
      ? `FRIEND-${String(i + 1).padStart(2, '0')}`
      : type === 'bird'
      ? `BIRD-${String(i + 1).padStart(2, '0')}`
      : `CIV-${String(i + 1).padStart(2, '0')}`;

    scriptedSpawns.push({
      id: `gen-${seed}-${i + 1}`,
      callsign,
      type,
      hostile: isHostile,
      intent,
      spawnTime,
      initialPosition: [spawnX, altitude, spawnZ],
      speed,
      altitude,
      heading: Math.round(((Math.atan2(-spawnX, -spawnZ) * 180) / Math.PI + 360) % 360),
      iff,
      rfSignature: rfSig,
      acousticSignature: acousticSig,
      rcs,
      swarmRole,
    });
  }

  const name = `Procedural Op ${seed % 1000} (${approachVector.replace('-', ' ').toUpperCase()})`;
  const description = `Dynamic scenario generated with seed #${seed}. Terrain: ${terrain}, Weather: ${weather}, Sensors: ${sensorState}. Threat density: ${threatCount} contacts.`;
  const briefing = `Intel Alert: Unknown radar tracks detected along ${approachVector} corridor. Exercise strict ROE and identify RF/IFF signatures before kinetic engagement. Seed: #${seed}.`;

  return {
    id: `proc-${seed}`,
    name,
    description,
    briefing,
    duration: Math.max(75, Math.min(180, 50 + threatCount * 12)),
    timeOfDay,
    terrain,
    weather,
    initialSensorState: sensorState,
    threatCount,
    seed,
    scriptedSpawns,
  };
}
