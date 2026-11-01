// DRISHTI: Unified Local Persistence Layer & Analytics Store
// Stage 4: Connects Simulation Workstations, Operator Drills, Academy & AAR

import { CompletedSessionRecord } from '../types/simulation';
import { AcademyProgressState, ModuleProgressRecord } from '../types/academy';

const SESSIONS_STORAGE_KEY = 'drishti_aar_sessions';
const ACADEMY_STORAGE_KEY = 'drishti_academy_progress';

// -------------------------------------------------------------
// 1. Session History Operations (Stage 2, 3 & 4)
// -------------------------------------------------------------

export function getCompletedSessions(): CompletedSessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load completed sessions from localStorage:', err);
    return [];
  }
}

export function getSessionById(sessionId: string): CompletedSessionRecord | undefined {
  const sessions = getCompletedSessions();
  return sessions.find((s) => s.sessionId === sessionId);
}

export function saveCompletedSession(session: CompletedSessionRecord): void {
  try {
    const existing = getCompletedSessions();
    // Prevent duplicate entries for same session ID
    const filtered = existing.filter((s) => s.sessionId !== session.sessionId);
    const updated = [session, ...filtered].slice(0, 50);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save completed session to localStorage:', err);
  }
}

export function deleteSession(sessionId: string): void {
  try {
    const existing = getCompletedSessions();
    const updated = existing.filter((s) => s.sessionId !== sessionId);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete session from localStorage:', err);
  }
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear sessions:', err);
  }
}

// -------------------------------------------------------------
// 2. Academy Progress Operations
// -------------------------------------------------------------

export function getAcademyProgress(): AcademyProgressState {
  try {
    const raw = localStorage.getItem(ACADEMY_STORAGE_KEY);
    if (!raw) {
      return {
        completedVideoIds: [],
        moduleProgress: {},
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read academy progress:', err);
    return {
      completedVideoIds: [],
      moduleProgress: {},
    };
  }
}

export function saveModuleProgress(
  moduleId: string,
  quizScorePct: number,
  passed: boolean,
  moduleTitle: string
): void {
  try {
    const current = getAcademyProgress();
    const prevRecord = current.moduleProgress[moduleId];

    const updatedRecord: ModuleProgressRecord = {
      moduleId,
      started: true,
      completed: passed || Boolean(prevRecord?.completed),
      highestQuizScorePct: Math.max(quizScorePct, prevRecord?.highestQuizScorePct || 0),
      attemptsCount: (prevRecord?.attemptsCount || 0) + 1,
      lastAttemptIso: new Date().toISOString(),
    };

    const updatedState: AcademyProgressState = {
      ...current,
      moduleProgress: {
        ...current.moduleProgress,
        [moduleId]: updatedRecord,
      },
      lastActivityTitle: moduleTitle,
      lastActivityType: 'module',
      lastActivityIso: new Date().toISOString(),
    };

    localStorage.setItem(ACADEMY_STORAGE_KEY, JSON.stringify(updatedState));
  } catch (err) {
    console.error('Failed to save module progress:', err);
  }
}

export function markVideoCompleted(videoId: string, videoTitle: string): void {
  try {
    const current = getAcademyProgress();
    const completedSet = new Set(current.completedVideoIds);
    completedSet.add(videoId);

    const updatedState: AcademyProgressState = {
      ...current,
      completedVideoIds: Array.from(completedSet),
      lastActivityTitle: videoTitle,
      lastActivityType: 'video',
      lastActivityIso: new Date().toISOString(),
    };

    localStorage.setItem(ACADEMY_STORAGE_KEY, JSON.stringify(updatedState));
  } catch (err) {
    console.error('Failed to mark video completed:', err);
  }
}

// -------------------------------------------------------------
// 3. Demo Telemetry Seeder (Explicitly Labeled Practice Telemetry)
// -------------------------------------------------------------

export function seedPracticeSorties(): void {
  const sampleSessions: CompletedSessionRecord[] = [
    {
      sessionId: 'DRISHTI-EV-PRAC-01',
      scenarioId: 'rural-day-unknown',
      scenarioTitle: 'Single Unknown Drone — Rural Daylight',
      dateIso: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      durationSec: 38,
      score: {
        totalScore: 920,
        detectionScore: 270,
        classificationScore: 350,
        responseScore: 300,
        detectionTimeSec: 6.8,
        classificationAccurate: true,
        responseQuality: 'optimal',
        rankRating: 'Exemplary Defense',
      },
      selectedClassification: 'unknown_drone',
      selectedResponse: 'record_and_report',
      events: [
        { id: 'e1', timestampSec: 0, type: 'INFO', message: 'Mission initiated. Surveillance radar active.' },
        { id: 'e2', timestampSec: 6.8, type: 'DETECTION', message: 'Airspace contact confirmed by trainee.' },
        { id: 'e3', timestampSec: 12.4, type: 'CLASSIFICATION', message: 'Classified: Unknown Drone (Accurate).' },
        { id: 'e4', timestampSec: 24.1, type: 'RESPONSE', message: 'Defensive Action: Record & Report to Sector Logbook.' },
        { id: 'e5', timestampSec: 38.0, type: 'ALERT', message: 'Exercise concluded. Airspace secure.' },
      ],
    },
    {
      sessionId: 'DRISHTI-EV-PRAC-02',
      scenarioId: 'urban-day-suspicious',
      scenarioTitle: 'Suspicious Drone — Urban Environment',
      dateIso: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      durationSec: 44,
      score: {
        totalScore: 840,
        detectionScore: 240,
        classificationScore: 350,
        responseScore: 250,
        detectionTimeSec: 11.2,
        classificationAccurate: true,
        responseQuality: 'optimal',
        rankRating: 'Tactically Proficient',
      },
      selectedClassification: 'suspicious_drone',
      selectedResponse: 'issue_alert',
      events: [
        { id: 'e1', timestampSec: 0, type: 'INFO', message: 'Airspace surveillance over Sector 7 Urban Rooftops.' },
        { id: 'e2', timestampSec: 11.2, type: 'DETECTION', message: 'Visual silhouette acquired near communication tower.' },
        { id: 'e3', timestampSec: 21.0, type: 'CLASSIFICATION', message: 'Classified: Potentially Suspicious Drone.' },
        { id: 'e4', timestampSec: 33.5, type: 'RESPONSE', message: 'Defensive Action: Issue Training Alert to Perimeter Security.' },
        { id: 'e5', timestampSec: 44.0, type: 'ALERT', message: 'Mission completed. Perimeter alerted.' },
      ],
    },
    {
      sessionId: 'DRISHTI-EV-PRAC-03',
      scenarioId: 'fpv-flight',
      scenarioTitle: 'FPV Flight Familiarization',
      dateIso: new Date(Date.now() - 3600000 * 12).toISOString(),
      durationSec: 62,
      score: {
        totalScore: 890,
        detectionScore: 280,
        classificationScore: 400,
        responseScore: 210,
        detectionTimeSec: 62,
        classificationAccurate: true,
        responseQuality: 'optimal',
        rankRating: 'Exemplary Defense',
      },
      selectedClassification: 'authorized_aircraft',
      selectedResponse: 'record_and_report',
      events: [
        { id: 'e1', timestampSec: 0, type: 'INFO', message: 'Engaged FPV Flight Familiarization drill.' },
        { id: 'e2', timestampSec: 12.0, type: 'INFO', message: 'Cleared Checkpoint Gate 01 (Low Departure).' },
        { id: 'e3', timestampSec: 25.4, type: 'INFO', message: 'Cleared Checkpoint Gate 02 (Pylon Slalom).' },
        { id: 'e4', timestampSec: 38.1, type: 'INFO', message: 'Cleared Checkpoint Gate 03 (Tower Flyby).' },
        { id: 'e5', timestampSec: 51.0, type: 'INFO', message: 'Cleared Checkpoint Gate 04 (Ridge Descent).' },
        { id: 'e6', timestampSec: 62.0, type: 'ALERT', message: 'Cleared Checkpoint Gate 05. Course Completed.' },
      ],
    },
    {
      sessionId: 'DRISHTI-EV-PRAC-04',
      scenarioId: 'indoor-inspection',
      scenarioTitle: 'Indoor Drone Inspection',
      dateIso: new Date(Date.now() - 3600000 * 4).toISOString(),
      durationSec: 78,
      score: {
        totalScore: 910,
        detectionScore: 260,
        classificationScore: 400,
        responseScore: 250,
        detectionTimeSec: 78,
        classificationAccurate: true,
        responseQuality: 'optimal',
        rankRating: 'Exemplary Defense',
      },
      selectedClassification: 'authorized_aircraft',
      selectedResponse: 'record_and_report',
      events: [
        { id: 'e1', timestampSec: 0, type: 'INFO', message: 'Entered multi-room training structure with spotlight active.' },
        { id: 'e2', timestampSec: 22.0, type: 'DETECTION', message: 'Utility Room: Main Breaker inspected (Hazardous).' },
        { id: 'e3', timestampSec: 46.5, type: 'DETECTION', message: 'Server Room: Unsecured Briefcase inspected (Compromised).' },
        { id: 'e4', timestampSec: 68.0, type: 'DETECTION', message: 'Logistics Bay: Battery Pallet inspected (Normal).' },
        { id: 'e5', timestampSec: 78.0, type: 'ALERT', message: 'Consolidated inspection dossier submitted.' },
      ],
    },
  ];

  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sampleSessions));
}
