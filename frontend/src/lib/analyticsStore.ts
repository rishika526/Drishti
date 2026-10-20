import { GradeBand, MissionScoreResult, SkillRatings, TraineeProfile } from '../types';
import { INITIAL_SKILL_RATINGS, updateTraineeSkills } from '../engine/adaptive';

const STORAGE_KEY = 'drishti_analytics_v1';
const SKILLS_KEY = 'drishti_user_skills_v1';

export interface UnitLeaderboardEntry {
  callsign: string;
  serviceId: string;
  section: 'Section A' | 'Section B' | 'Section C';
  totalSessions: number;
  avgScore: number;
  highestGrade: GradeBand;
  detectionAvg: number;
  classificationAvg: number;
  engagementAvg: number;
  compositeRating: number;
  status: 'Combat Ready' | 'Proficient' | 'Needs Drill';
}

export interface SectionComparisonData {
  section: string;
  avgScore: number;
  detectionRate: number;
  classificationAccuracy: number;
  roeCompliance: number;
  activeTrainees: number;
}

export interface ScenarioCategoryHeatmap {
  scenarioName: string;
  sectionA: number; // pass rate %
  sectionB: number;
  sectionC: number;
  overallAvgScore: number;
}

export interface DetectionDistributionBin {
  bin: string;
  count: number;
  percentage: number;
}

export interface AnalyticsDataset {
  isDemoData: boolean;
  trainees: TraineeProfile[];
  leaderboard: UnitLeaderboardEntry[];
  sectionStats: SectionComparisonData[];
  heatmap: ScenarioCategoryHeatmap[];
  detectionDistribution: DetectionDistributionBin[];
  cadetTrend: Array<{ session: number; date: string; score: number; grade: GradeBand; scenario: string }>;
}

export function getUserSkills(): SkillRatings {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...INITIAL_SKILL_RATINGS };
}

export function saveUserSkills(skills: SkillRatings): void {
  try {
    localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  } catch {}
}

export function generateDefaultAnalyticsData(): AnalyticsDataset {
  const sections: Array<'Section A' | 'Section B' | 'Section C'> = ['Section A', 'Section B', 'Section C'];
  const prefixes = { 'Section A': 'Eagle', 'Section B': 'Falcon', 'Section C': 'Trident' };

  const leaderboard: UnitLeaderboardEntry[] = [];
  const trainees: TraineeProfile[] = [];

  // Generate 24 realistic defense personnel
  let idCounter = 100;
  sections.forEach((sec) => {
    const prefix = prefixes[sec];
    for (let i = 1; i <= 8; i++) {
      idCounter++;
      const callsign = `${prefix}-${i}`;
      const serviceId = `DSSC-${sec[8]}-${idCounter}`;
      
      // Base ability varies by section & trainee
      const ability = sec === 'Section A' ? 82 + (i % 5) * 2 : sec === 'Section B' ? 76 + (i % 4) * 3 : 73 + (i % 5) * 2.5;
      const totalSessions = 12 + Math.floor((i * 1.5));
      const avgScore = Math.round(ability + Math.sin(i) * 4);
      
      const compositeRating = Math.round(950 + avgScore * 3.8);
      const grade: GradeBand = avgScore >= 90 ? 'A' : avgScore >= 80 ? 'B' : avgScore >= 70 ? 'C' : 'D';

      leaderboard.push({
        callsign,
        serviceId,
        section: sec,
        totalSessions,
        avgScore,
        highestGrade: grade,
        detectionAvg: Math.round(Math.min(98, avgScore + 4)),
        classificationAvg: Math.round(Math.min(96, avgScore - 2)),
        engagementAvg: Math.round(Math.min(95, avgScore + 1)),
        compositeRating,
        status: avgScore >= 85 ? 'Combat Ready' : avgScore >= 75 ? 'Proficient' : 'Needs Drill',
      });

      trainees.push({
        callsign,
        serviceId,
        section: sec,
        skills: {
          detection: compositeRating + 20,
          classification: compositeRating - 15,
          engagement: compositeRating + 10,
          night: compositeRating - 30,
          swarm: compositeRating - 45,
          degradedSensors: compositeRating - 25,
          urban: compositeRating - 10,
        },
        totalSessions,
        avgScore,
        history: [],
      });
    }
  });

  // Sort leaderboard by score descending
  leaderboard.sort((a, b) => b.avgScore - a.avgScore);

  // Section comparison aggregation
  const sectionStats: SectionComparisonData[] = [
    { section: 'Section A (Eagle)', avgScore: 86, detectionRate: 91, classificationAccuracy: 88, roeCompliance: 96, activeTrainees: 8 },
    { section: 'Section B (Falcon)', avgScore: 79, detectionRate: 84, classificationAccuracy: 81, roeCompliance: 90, activeTrainees: 8 },
    { section: 'Section C (Trident)', avgScore: 76, detectionRate: 80, classificationAccuracy: 77, roeCompliance: 86, activeTrainees: 8 },
  ];

  // Heatmap across 6 tactical curriculum missions
  const heatmap: ScenarioCategoryHeatmap[] = [
    { scenarioName: '01: Orientation Tutorial', sectionA: 98, sectionB: 95, sectionC: 92, overallAvgScore: 95 },
    { scenarioName: '02: Night Reconnaissance', sectionA: 88, sectionB: 78, sectionC: 72, overallAvgScore: 79 },
    { scenarioName: '03: Dawn Swarm Saturation', sectionA: 78, sectionB: 69, sectionC: 62, overallAvgScore: 70 },
    { scenarioName: '04: Urban Canyon Masking', sectionA: 82, sectionB: 75, sectionC: 71, overallAvgScore: 76 },
    { scenarioName: '05: Friend or Foe (IFF)', sectionA: 90, sectionB: 84, sectionC: 79, overallAvgScore: 84 },
    { scenarioName: '06: Electronic Warfare Radar Down', sectionA: 74, sectionB: 65, sectionC: 60, overallAvgScore: 66 },
  ];

  // Detection time histogram distribution (60 simulated sessions across 6 weeks)
  const detectionDistribution: DetectionDistributionBin[] = [
    { bin: '< 3.0s (Rapid Picket)', count: 24, percentage: 40 },
    { bin: '3.0s - 8.0s (Nominal)', count: 21, percentage: 35 },
    { bin: '8.0s - 15.0s (Lagging)', count: 9, percentage: 15 },
    { bin: '15.0s - 20.0s (Late)', count: 4, percentage: 7 },
    { bin: '> 20.0s (Compromised)', count: 2, percentage: 3 },
  ];

  // Cadet-01 historical training progression (improving trend over 10 previous runs)
  const cadetTrend = [
    { session: 1, date: 'Week 1', score: 58, grade: 'D' as GradeBand, scenario: 'Orientation' },
    { session: 2, date: 'Week 1', score: 64, grade: 'D' as GradeBand, scenario: 'Orientation' },
    { session: 3, date: 'Week 2', score: 71, grade: 'C' as GradeBand, scenario: 'Friend or Foe' },
    { session: 4, date: 'Week 2', score: 68, grade: 'D' as GradeBand, scenario: 'Night Recon' },
    { session: 5, date: 'Week 3', score: 76, grade: 'C' as GradeBand, scenario: 'Friend or Foe' },
    { session: 6, date: 'Week 3', score: 79, grade: 'C' as GradeBand, scenario: 'Urban Canyon' },
    { session: 7, date: 'Week 4', score: 73, grade: 'C' as GradeBand, scenario: 'Radar Down' },
    { session: 8, date: 'Week 4', score: 82, grade: 'B' as GradeBand, scenario: 'Night Recon' },
    { session: 9, date: 'Week 5', score: 85, grade: 'B' as GradeBand, scenario: 'Dawn Swarm' },
    { session: 10, date: 'Week 6', score: 91, grade: 'A' as GradeBand, scenario: 'Friend or Foe' },
  ];

  return {
    isDemoData: true,
    trainees,
    leaderboard,
    sectionStats,
    heatmap,
    detectionDistribution,
    cadetTrend,
  };
}

export function getAnalyticsDataset(): AnalyticsDataset {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  const initial = generateDefaultAnalyticsData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function resetDemoData(): AnalyticsDataset {
  const fresh = generateDefaultAnalyticsData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    localStorage.setItem(SKILLS_KEY, JSON.stringify(INITIAL_SKILL_RATINGS));
  } catch {}
  return fresh;
}

/**
 * Merges a newly completed mission session into Cadet-01 analytics records
 */
export function recordUserSession(scoreResult: MissionScoreResult): void {
  try {
    const dataset = getAnalyticsDataset();
    const nextSessionNum = dataset.cadetTrend.length + 1;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    // Append to trend
    dataset.cadetTrend.push({
      session: nextSessionNum,
      date: nowStr,
      score: scoreResult.overallScore,
      grade: scoreResult.grade,
      scenario: scoreResult.scenarioName.split(':')[1]?.trim() || scoreResult.scenarioName,
    });

    // Update or insert Cadet-01 in leaderboard
    let cadet = dataset.leaderboard.find((l) => l.callsign === 'Cadet-01 (You)');
    if (!cadet) {
      cadet = {
        callsign: 'Cadet-01 (You)',
        serviceId: 'DSSC-TR-001',
        section: 'Section A',
        totalSessions: dataset.cadetTrend.length,
        avgScore: scoreResult.overallScore,
        highestGrade: scoreResult.grade,
        detectionAvg: scoreResult.breakdown.detection,
        classificationAvg: scoreResult.breakdown.classification,
        engagementAvg: scoreResult.breakdown.engagement,
        compositeRating: 1000 + Math.round(scoreResult.overallScore * 3.5),
        status: scoreResult.overallScore >= 85 ? 'Combat Ready' : 'Proficient',
      };
      dataset.leaderboard.push(cadet);
    } else {
      cadet.totalSessions += 1;
      cadet.avgScore = Math.round(
        dataset.cadetTrend.reduce((acc, c) => acc + c.score, 0) / dataset.cadetTrend.length
      );
      if (scoreResult.overallScore > 85) cadet.status = 'Combat Ready';
    }

    dataset.leaderboard.sort((a, b) => b.avgScore - a.avgScore);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
  } catch (err) {
    console.error('Failed to record user session in analytics store:', err);
  }
}
