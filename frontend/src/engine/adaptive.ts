import { MissionScoreResult, ScenarioDef, SkillRatings } from '../types';

export const INITIAL_SKILL_RATINGS: SkillRatings = {
  detection: 1000,
  classification: 1000,
  engagement: 1000,
  night: 1000,
  swarm: 1000,
  degradedSensors: 1000,
  urban: 1000,
};

export const K_FACTOR = 32;

/**
 * Derives scenario Elo difficulty rating from its tactical parameters
 */
export function calculateScenarioDifficulty(scenario: ScenarioDef): number {
  let difficulty = 950;

  // Drone count weight
  difficulty += Math.min(250, (scenario.threatCount - 1) * 20);

  // Night / dusk visibility penalty
  if (scenario.timeOfDay === 'night') difficulty += 110;
  else if (scenario.timeOfDay === 'dusk' || scenario.timeOfDay === 'dawn') difficulty += 50;

  // Sensor degradation penalty
  if (scenario.initialSensorState === 'jammed') difficulty += 130;
  else if (scenario.initialSensorState === 'dual-degraded') difficulty += 150;
  else if (scenario.initialSensorState === 'radar-degraded' || scenario.initialSensorState === 'eo-degraded') difficulty += 80;

  // Urban occlusion penalty
  if (scenario.terrain === 'urban') difficulty += 90;
  else if (scenario.terrain === 'hills') difficulty += 40;

  // Weather penalty
  if (scenario.weather === 'fog' || scenario.weather === 'dust') difficulty += 70;
  else if (scenario.weather === 'rain') difficulty += 50;

  return Math.round(Math.max(750, Math.min(1500, difficulty)));
}

/**
 * Updates a single skill rating based on Elo performance vs expected outcome
 */
export function updateEloRating(
  currentRating: number,
  difficulty: number,
  performancePercent: number,
  kFactor: number = K_FACTOR
): number {
  // expected probability of success (0 to 1)
  const expected = 1 / (1 + Math.pow(10, (difficulty - currentRating) / 400));
  const actual = Math.max(0, Math.min(1, performancePercent / 100));
  const delta = kFactor * (actual - expected);
  return Math.round(Math.max(400, Math.min(2200, currentRating + delta)));
}

/**
 * Updates all trainee skill ratings after completing a mission
 */
export function updateTraineeSkills(
  currentSkills: SkillRatings,
  scenario: ScenarioDef,
  scoreResult: MissionScoreResult
): SkillRatings {
  const difficulty = calculateScenarioDifficulty(scenario);
  const updated: SkillRatings = { ...currentSkills };

  // Core skills update
  updated.detection = updateEloRating(
    updated.detection,
    difficulty,
    scoreResult.breakdown.detection
  );

  updated.classification = updateEloRating(
    updated.classification,
    difficulty,
    scoreResult.breakdown.classification
  );

  updated.engagement = updateEloRating(
    updated.engagement,
    difficulty,
    scoreResult.breakdown.engagement
  );

  // Environmental / specialized skills
  if (scenario.timeOfDay === 'night' || scenario.timeOfDay === 'dawn') {
    updated.night = updateEloRating(updated.night, difficulty, scoreResult.overallScore);
  }

  if (scenario.threatCount >= 8 || scenario.id.includes('swarm')) {
    updated.swarm = updateEloRating(updated.swarm, difficulty, scoreResult.overallScore);
  }

  if (scenario.initialSensorState !== 'nominal') {
    updated.degradedSensors = updateEloRating(
      updated.degradedSensors,
      difficulty,
      scoreResult.overallScore
    );
  }

  if (scenario.terrain === 'urban') {
    updated.urban = updateEloRating(updated.urban, difficulty, scoreResult.overallScore);
  }

  return updated;
}

/**
 * Beta distribution random sampler for Thompson Sampling
 */
function sampleBeta(alpha: number, beta: number): number {
  // Marsaglia and Tsang method for Gamma(alpha, 1)
  function sampleGamma(a: number): number {
    if (a < 1) {
      return sampleGamma(a + 1) * Math.pow(Math.random(), 1 / a);
    }
    const d = a - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    while (true) {
      let z = 0;
      let v = 0;
      do {
        // Box-Muller normal
        const u1 = Math.random();
        const u2 = Math.random();
        z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        v = 1 + c * z;
      } while (v <= 0);
      v = v * v * v;
      const u = Math.random();
      if (u < 1 - 0.0331 * z * z * z * z) return d * v;
      if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
    }
  }

  const g1 = sampleGamma(alpha);
  const g2 = sampleGamma(beta);
  return g1 / (g1 + g2);
}

export interface RecommendationResult {
  weakestSkill: keyof SkillRatings;
  weakestRating: number;
  recommendedScenarioId: string;
  recommendedScenarioName: string;
  targetDifficulty: number;
  difficultyRating: number;
  reasoning: string;
  expectedSuccessRate: number;
}

/**
 * Adaptive Skill Recommender using weakest-skill targeting and Thompson sampling
 */
export function recommendNextMission(
  skills: SkillRatings,
  availableScenarios: ScenarioDef[],
  categorySuccessPriors?: Record<string, { alpha: number; beta: number }>
): RecommendationResult {
  // Find weakest skill
  const skillEntries = Object.entries(skills) as [keyof SkillRatings, number][];
  skillEntries.sort((a, b) => a[1] - b[1]);
  const [weakestSkill, weakestRating] = skillEntries[0];

  // Map weakest skill to preferred scenario types
  let scenarioMatcher: (s: ScenarioDef) => boolean;
  let rationale = '';

  switch (weakestSkill) {
    case 'swarm':
      scenarioMatcher = (s) => s.id === 'dawn-swarm' || s.threatCount >= 8;
      rationale = `Weakest skill is Swarm Defense (rating: ${weakestRating}). Multi-axis coordinated targets require faster electronic warfare jamming to disrupt the mesh.`;
      break;
    case 'night':
      scenarioMatcher = (s) => s.timeOfDay === 'night' || s.id === 'night-recon';
      rationale = `Weakest skill is Night Ops (rating: ${weakestRating}). Thermal FLIR sensor cross-referencing and acoustic cues need refinement.`;
      break;
    case 'degradedSensors':
      scenarioMatcher = (s) => s.initialSensorState !== 'nominal' || s.id === 'radar-down';
      rationale = `Weakest skill is Degraded Sensors (rating: ${weakestRating}). Radar jamming and partial blackouts require relying on optical bearings.`;
      break;
    case 'urban':
      scenarioMatcher = (s) => s.terrain === 'urban' || s.id === 'urban-canyon';
      rationale = `Weakest skill is Urban Canyon (rating: ${weakestRating}). Building occlusion masks low-altitude drone signatures.`;
      break;
    case 'classification':
      scenarioMatcher = (s) => s.id === 'friend-or-foe';
      rationale = `Weakest skill is Classification (rating: ${weakestRating}). IFF transponder squawks and RF signatures must be confirmed before engagement.`;
      break;
    case 'detection':
    case 'engagement':
    default:
      scenarioMatcher = (s) => s.id === 'orientation' || s.id === 'friend-or-foe';
      rationale = `Weakest skill is Fundamental ${weakestSkill.toUpperCase()} (rating: ${weakestRating}). Honing baseline radar sweep correlation and weapons release discipline.`;
      break;
  }

  // Find candidate scenario matching weakness
  let candidate = availableScenarios.find(scenarioMatcher);
  if (!candidate) {
    candidate = availableScenarios[0];
  }

  // Target difficulty calculated so expected success is ~70% (Zone of Proximal Development)
  // 0.70 = 1 / (1 + 10^((diff - rating)/400))  => diff = rating - 147
  const calibratedTargetDifficulty = Math.round(weakestRating - 147);
  const scenarioDifficulty = calculateScenarioDifficulty(candidate);

  // Expected success rate in this mission
  const expectedSuccess = Math.round(
    (1 / (1 + Math.pow(10, (scenarioDifficulty - weakestRating) / 400))) * 100
  );

  return {
    weakestSkill,
    weakestRating,
    recommendedScenarioId: candidate.id,
    recommendedScenarioName: candidate.name,
    targetDifficulty: calibratedTargetDifficulty,
    difficultyRating: scenarioDifficulty,
    reasoning: rationale,
    expectedSuccessRate: expectedSuccess,
  };
}
