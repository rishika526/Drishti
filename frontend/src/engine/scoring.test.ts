import { describe, it, expect } from 'vitest';
import {
  calculateMissionScore,
  evaluateClassification,
  evaluateDetection,
  evaluateEngagement,
  ENGAGEMENT_ENVELOPE_METERS,
} from './scoring';
import { ContactEntity } from '../types';

function createMockContact(overrides: Partial<ContactEntity> = {}): ContactEntity {
  return {
    id: 'test-1',
    callsign: 'TGT-ALPHA',
    type: 'attack',
    hostile: true,
    intent: 'strike',
    spawnTime: 5.0,
    initialPosition: [500, 100, 500],
    speed: 40,
    altitude: 120,
    heading: 180,
    iff: 'NONE',
    rfSignature: 'HIGH',
    acousticSignature: 'MEDIUM',
    rcs: 0.05,
    position: [200, 80, 200],
    velocity: [0, 0, -40],
    distanceToBase: 800,
    bearing: 45,
    elevation: 10,
    detected: true,
    detectedAt: 7.0, // 2s elapsed -> <= 3s -> 100%
    classifiedAs: 'attack',
    classifiedAt: 8.0,
    responseAction: 'hard_kill',
    respondedAt: 9.0,
    status: 'destroyed',
    history: [],
    isRadarVisible: true,
    radarOccludedByTerrain: false,
    radarBlipAlpha: 1.0,
    ...overrides,
  };
}

describe('Drishti Scoring & Decision Tree Engine', () => {
  it('awards 100% detection score if flagged within 3 seconds', () => {
    const contact = createMockContact({ spawnTime: 10, detectedAt: 12.5 });
    const result = evaluateDetection(contact, 90);
    expect(result.score).toBe(100);
    expect(result.critical).toBe(false);
  });

  it('decays detection score linearly between 3s and 20s', () => {
    // at 11.5s elapsed (midway of 3..20s): ~50%
    const contact = createMockContact({ spawnTime: 10, detectedAt: 21.5 });
    const result = evaluateDetection(contact, 90);
    expect(result.score).toBeGreaterThanOrEqual(45);
    expect(result.score).toBeLessThanOrEqual(55);
  });

  it('flags missed hostile detection as critical', () => {
    const contact = createMockContact({ detected: false, hostile: true });
    const result = evaluateDetection(contact, 90);
    expect(result.score).toBe(0);
    expect(result.critical).toBe(true);
  });

  it('awards 100 for exact classification and 50 for adjacent class', () => {
    const attackDrone = createMockContact({ type: 'attack', classifiedAs: 'attack' });
    expect(evaluateClassification(attackDrone).score).toBe(100);

    const adjacent = createMockContact({ type: 'attack', classifiedAs: 'swarm' });
    expect(evaluateClassification(adjacent).score).toBe(50);
  });

  it('triggers CRITICAL error when hostile is misclassified as benign/friendly', () => {
    const hostileClassifiedBenign = createMockContact({
      hostile: true,
      type: 'attack',
      classifiedAs: 'bird',
    });
    const result = evaluateClassification(hostileClassifiedBenign);
    expect(result.critical).toBe(true);
    expect(result.score).toBe(0);
  });

  it('triggers CRITICAL FRATRICIDE error when friendly is misclassified as hostile', () => {
    const friendlyClassifiedHostile = createMockContact({
      hostile: false,
      type: 'friendly',
      classifiedAs: 'attack',
    });
    const result = evaluateClassification(friendlyClassifiedHostile);
    expect(result.critical).toBe(true);
  });

  it('triggers CRITICAL LEAKER when hostile is inside envelope with Hold Fire', () => {
    const leaker = createMockContact({
      hostile: true,
      distanceToBase: 600, // inside 1200m
      responseAction: 'hold_fire',
    });
    const result = evaluateEngagement(leaker);
    expect(result.critical).toBe(true);
    expect(result.score).toBe(0);
  });

  it('triggers CRITICAL FRATRICIDE when friendly unit receives kinetic hard-kill', () => {
    const fratricide = createMockContact({
      hostile: false,
      type: 'friendly',
      responseAction: 'hard_kill',
    });
    const result = evaluateEngagement(fratricide);
    expect(result.critical).toBe(true);
    expect(result.score).toBe(0);
  });

  it('caps mission grade at C when any critical error occurs even with high raw score', () => {
    const highScoringContactWithOneFatalError = createMockContact({
      hostile: true,
      detectedAt: 5.5, // 0.5s -> 100%
      classifiedAs: 'attack', // 100%
      responseAction: 'hold_fire', // inside envelope -> CRITICAL LEAKER
    });

    const missionResult = calculateMissionScore(
      'sess-test',
      'test-scen',
      'Test Scenario',
      12345,
      [highScoringContactWithOneFatalError],
      60
    );

    expect(missionResult.criticalErrors.length).toBeGreaterThan(0);
    expect(['C', 'D', 'F']).toContain(missionResult.grade);
    expect(missionResult.grade).not.toBe('A');
    expect(missionResult.grade).not.toBe('B');
  });
});
