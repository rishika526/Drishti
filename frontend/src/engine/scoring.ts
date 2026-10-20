import {
  ContactEntity,
  DecisionNode,
  EntityType,
  GradeBand,
  MissionScoreResult,
  PerThreatScore,
  ResponseAction,
} from '../types';

export const ENGAGEMENT_ENVELOPE_METERS = 1200;

/**
 * Checks if two entity types are adjacent in classification taxonomy
 */
export function areAdjacentClasses(a: EntityType, b: string): boolean {
  if (a === b) return true;
  const pairs: [string, string][] = [
    ['hobby', 'recon'],
    ['recon', 'hobby'],
    ['attack', 'swarm'],
    ['swarm', 'attack'],
    ['bird', 'hobby'],
    ['hobby', 'bird'],
    ['recon', 'attack'],
    ['attack', 'recon'],
  ];
  return pairs.some(([x, y]) => x === a && y === b);
}

/**
 * Computes the detection score and decision path for a single contact
 */
export function evaluateDetection(
  contact: ContactEntity,
  missionDuration: number
): { score: number; elapsed: number; critical: boolean; reason?: string; nodes: DecisionNode[] } {
  const nodes: DecisionNode[] = [];
  
  if (!contact.detected) {
    nodes.push({
      node: 'Detection Verification',
      condition: 'Was contact designated on radar / thermal picket?',
      result: false,
      note: 'Target was never flagged by trainee during surveillance window.',
    });

    const isCritical = contact.hostile;
    return {
      score: 0,
      elapsed: missionDuration,
      critical: isCritical,
      reason: isCritical
        ? `Hostile target ${contact.callsign} penetrated defense zone undetected`
        : undefined,
      nodes,
    };
  }

  const elapsed = Math.max(0, (contact.detectedAt ?? contact.spawnTime) - contact.spawnTime);
  let score = 0;

  if (elapsed <= 3.0) {
    score = 100;
    nodes.push({
      node: 'Detection Latency Check',
      condition: 'Elapsed detection time <= 3.0s from spawn?',
      result: true,
      note: `Rapid tactical pick-up at ${elapsed.toFixed(1)}s (100% score).`,
    });
  } else if (elapsed <= 20.0) {
    // Linear decay from 100 at 3s to 0 at 20s
    score = Math.max(0, Math.round(100 - ((elapsed - 3.0) / 17.0) * 100));
    nodes.push({
      node: 'Detection Latency Check',
      condition: 'Elapsed detection time between 3.0s and 20.0s?',
      result: true,
      note: `Delayed pick-up at ${elapsed.toFixed(1)}s (${score}% score after decay).`,
    });
  } else {
    score = 0;
    nodes.push({
      node: 'Detection Latency Check',
      condition: 'Elapsed detection time > 20.0s?',
      result: true,
      note: `Severe pick-up delay of ${elapsed.toFixed(1)}s. Picket line compromised.`,
    });
  }

  return {
    score,
    elapsed,
    critical: false,
    nodes,
  };
}

/**
 * Evaluates classification accuracy and checks for critical misidentifications
 */
export function evaluateClassification(
  contact: ContactEntity
): { score: number; critical: boolean; reason?: string; nodes: DecisionNode[] } {
  const nodes: DecisionNode[] = [];
  const classifiedAs = contact.classifiedAs;

  if (!classifiedAs || classifiedAs === 'unknown') {
    nodes.push({
      node: 'Classification Assignment',
      condition: 'Was a confirmed classification assigned?',
      result: false,
      note: 'Contact left unclassified / unknown.',
    });
    return {
      score: 0,
      critical: contact.hostile,
      reason: contact.hostile
        ? `Hostile ${contact.callsign} left unclassified before engagement decision`
        : undefined,
      nodes,
    };
  }

  // Critical error 1: Hostile classified as friendly or benign
  if (contact.hostile && (classifiedAs === 'friendly' || classifiedAs === 'bird' || classifiedAs === 'hobby')) {
    nodes.push({
      node: 'Hostile Misidentification Check',
      condition: 'Was hostile threat classified as friendly/benign?',
      result: true,
      note: `CRITICAL: Hostile ${contact.type.toUpperCase()} misclassified as ${classifiedAs.toUpperCase()}. Picket security breached.`,
    });
    return {
      score: 0,
      critical: true,
      reason: `FATAL ERROR: Hostile ${contact.callsign} misclassified as ${classifiedAs.toUpperCase()} (Lethal infiltration risk)`,
      nodes,
    };
  }

  // Critical error 2: Friendly classified as hostile
  if (contact.type === 'friendly' && (classifiedAs === 'attack' || classifiedAs === 'swarm' || classifiedAs === 'recon')) {
    nodes.push({
      node: 'Fratricide Risk Check',
      condition: 'Was friendly aircraft misclassified as hostile threat?',
      result: true,
      note: `CRITICAL: Friendly unit classified as ${classifiedAs.toUpperCase()}. Severe fratricide liability.`,
    });
    return {
      score: 0,
      critical: true,
      reason: `CRITICAL ROE VIOLATION: Friendly unit ${contact.callsign} misclassified as hostile ${classifiedAs.toUpperCase()}`,
      nodes,
    };
  }

  if (classifiedAs === contact.type) {
    nodes.push({
      node: 'Exact Classification Match',
      condition: `Classified as ${classifiedAs} matches actual ${contact.type}?`,
      result: true,
      note: `Target correctly identified as ${contact.type.toUpperCase()} (100% score).`,
    });
    return { score: 100, critical: false, nodes };
  }

  if (areAdjacentClasses(contact.type, classifiedAs)) {
    nodes.push({
      node: 'Adjacent Class Identification',
      condition: `Is ${classifiedAs} in adjacent tactical family with ${contact.type}?`,
      result: true,
      note: `Adjacent profile match (${classifiedAs} vs ${contact.type}). Partial credit (50% score).`,
    });
    return { score: 50, critical: false, nodes };
  }

  nodes.push({
    node: 'Classification Match',
    condition: `Does ${classifiedAs} match ${contact.type}?`,
    result: false,
    note: `Incorrect identification: ${classifiedAs.toUpperCase()} vs actual ${contact.type.toUpperCase()} (0% score).`,
  });
  return { score: 0, critical: false, nodes };
}

/**
 * Evaluates the engagement decision tree based on ground truth hostile state,
 * engagement envelope, and appropriate counter-drone response action.
 */
export function evaluateEngagement(
  contact: ContactEntity
): { score: number; roeScore: number; critical: boolean; reason?: string; nodes: DecisionNode[] } {
  const nodes: DecisionNode[] = [];
  const action = contact.responseAction;
  const isInsideEnvelope = contact.distanceToBase <= ENGAGEMENT_ENVELOPE_METERS;

  // Branch 1: Hostile Target
  if (contact.hostile) {
    nodes.push({
      node: 'Threat Assessment',
      condition: 'Is ground truth threat hostile?',
      result: true,
      note: `Threat confirmed hostile (${contact.type.toUpperCase()}).`,
    });

    if (isInsideEnvelope) {
      nodes.push({
        node: 'Engagement Envelope',
        condition: `Range ${contact.distanceToBase.toFixed(0)}m <= ${ENGAGEMENT_ENVELOPE_METERS}m perimeter envelope?`,
        result: true,
        note: 'Target inside active weapons engagement zone (WEZ).',
      });

      if (!action || action === 'hold_fire') {
        nodes.push({
          node: 'Weapons Release Action',
          condition: 'Did trainee order countermeasure or interdiction?',
          result: false,
          note: 'CRITICAL: Hold Fire maintained on hostile inside engagement envelope. Target leaked!',
        });
        return {
          score: 0,
          roeScore: 10,
          critical: true,
          reason: `CRITICAL LEAKER: Hostile ${contact.callsign} inside perimeter without countermeasure engagement`,
          nodes,
        };
      }

      // Check optimal action by type
      if (contact.type === 'attack') {
        if (action === 'hard_kill') {
          nodes.push({
            node: 'Optimal Kinetic Intercept',
            condition: 'Action == hard_kill for direct-strike loitering munition?',
            result: true,
            note: 'Direct kinetic intercept executed against high-speed strike drone (100% score).',
          });
          return { score: 100, roeScore: 100, critical: false, nodes };
        } else if (action === 'soft_kill') {
          nodes.push({
            node: 'Soft-Kill Protocol',
            condition: 'Action == soft_kill?',
            result: true,
            note: 'High-power RF spoofing / GNSS takeover executed successfully (90% score).',
          });
          return { score: 90, roeScore: 100, critical: false, nodes };
        } else if (action === 'jam_ew') {
          nodes.push({
            node: 'EW Jamming',
            condition: 'Action == jam_ew?',
            result: true,
            note: 'Directional EW jamming disrupted downlink; inertial guidance may persist (70% score).',
          });
          return { score: 70, roeScore: 90, critical: false, nodes };
        } else if (action === 'take_cover') {
          nodes.push({
            node: 'Base Warning',
            condition: 'Action == take_cover?',
            result: true,
            note: 'Personnel warned, but incoming munition was not neutralized (40% score).',
          });
          return { score: 40, roeScore: 80, critical: false, nodes };
        } else {
          return { score: 30, roeScore: 70, critical: false, nodes };
        }
      } else if (contact.type === 'swarm') {
        if (action === 'jam_ew') {
          nodes.push({
            node: 'Swarm Mesh Disruption',
            condition: 'Action == jam_ew against coordinated swarm elements?',
            result: true,
            note: 'Wideband EW interdiction severed swarm inter-node communication mesh (100% score).',
          });
          return { score: 100, roeScore: 100, critical: false, nodes };
        } else if (action === 'soft_kill') {
          nodes.push({
            node: 'Swarm Soft-Kill Protocol',
            condition: 'Action == soft_kill?',
            result: true,
            note: 'Multi-target RF takeover forced swarm into failsafe descent (95% score).',
          });
          return { score: 95, roeScore: 100, critical: false, nodes };
        } else if (action === 'hard_kill') {
          nodes.push({
            node: 'Kinetic Single Target Intercept',
            condition: 'Action == hard_kill on swarm element?',
            result: true,
            note: 'Single element neutralized, but kinetic action is sub-optimal against distributed swarm (75% score).',
          });
          return { score: 75, roeScore: 90, critical: false, nodes };
        } else {
          return { score: 35, roeScore: 70, critical: false, nodes };
        }
      } else {
        // Recon UAV
        if (action === 'jam_ew' || action === 'soft_kill') {
          nodes.push({
            node: 'Recon Electronic Interdiction',
            condition: 'Action == EW or soft-kill on loitering recon?',
            result: true,
            note: 'Recon transmission stream severed cleanly without collateral debris (100% score).',
          });
          return { score: 100, roeScore: 100, critical: false, nodes };
        } else if (action === 'hard_kill') {
          nodes.push({
            node: 'Recon Kinetic Intercept',
            condition: 'Action == hard_kill?',
            result: true,
            note: 'Kinetic splash confirmed on recon UAV (85% score).',
          });
          return { score: 85, roeScore: 90, critical: false, nodes };
        } else {
          return { score: 50, roeScore: 80, critical: false, nodes };
        }
      }
    } else {
      // Outside envelope (> 1200m)
      nodes.push({
        node: 'Engagement Envelope',
        condition: `Range ${contact.distanceToBase.toFixed(0)}m > ${ENGAGEMENT_ENVELOPE_METERS}m perimeter envelope?`,
        result: true,
        note: 'Target outside active intercept envelope.',
      });

      if (action === 'alert_alarm' || !action) {
        nodes.push({
          node: 'Long-Range Surveillance Doctrine',
          condition: 'Did trainee maintain track and issue alert without premature weapon discharge?',
          result: true,
          note: 'Disciplined early tracking maintained pending envelope entry (100% score).',
        });
        return { score: 100, roeScore: 100, critical: false, nodes };
      } else if (action === 'hard_kill' || action === 'soft_kill') {
        nodes.push({
          node: 'Premature Weapon Release',
          condition: 'Weapon release attempted outside maximum engagement envelope?',
          result: true,
          note: 'ROE Infraction: Early firing beyond confirmed engagement corridor (penalty applied).',
        });
        return { score: 30, roeScore: 40, critical: false, nodes };
      } else {
        return { score: 70, roeScore: 80, critical: false, nodes };
      }
    }
  }

  // Branch 2: Non-hostile (Friendly, Bird flock, Hobby)
  nodes.push({
    node: 'Threat Assessment',
    condition: 'Is entity non-hostile (Friendly / Bird / Civilian)?',
    result: true,
    note: `Non-threat entity identified (${contact.type.toUpperCase()}).`,
  });

  if (!action || action === 'hold_fire' || action === 'alert_alarm') {
    nodes.push({
      node: 'ROE Restraint Compliance',
      condition: 'Did trainee hold fire and refrain from kinetic/EW action?',
      result: true,
      note: 'Target tracked with full ROE compliance. Non-hostile airspace preserved (100% score).',
    });
    return { score: 100, roeScore: 100, critical: false, nodes };
  }

  if (action === 'hard_kill' || action === 'soft_kill') {
    const isFriendly = contact.type === 'friendly';
    nodes.push({
      node: 'Fratricide / Unauthorized Engagement Check',
      condition: 'Was kinetic or soft-kill countermeasure discharged against non-hostile?',
      result: true,
      note: isFriendly
        ? 'CRITICAL FRATRICIDE: Weapons fired on confirmed friendly asset!'
        : 'CRITICAL ROE BREACH: Kinetic intercept of civilian/biological object!',
    });
    return {
      score: 0,
      roeScore: 0,
      critical: true,
      reason: isFriendly
        ? `FATAL FRATRICIDE: Fired ${action.toUpperCase()} on friendly aircraft ${contact.callsign}!`
        : `SEVERE ROE BREACH: Unlawful kinetic engagement of ${contact.type.toUpperCase()} ${contact.callsign}`,
      nodes,
    };
  }

  if (action === 'jam_ew') {
    nodes.push({
      node: 'Unsanctioned EW Discharge',
      condition: 'Electronic warfare jammed civilian/friendly spectrum?',
      result: true,
      note: 'Civilian spectrum disruption without threat justification (ROE penalty).',
    });
    return { score: 30, roeScore: 40, critical: false, nodes };
  }

  return { score: 80, roeScore: 90, critical: false, nodes };
}

/**
 * Calculates complete mission score, grade, decision tree paths, and coaching feedback.
 */
export function calculateMissionScore(
  sessionId: string,
  scenarioId: string,
  scenarioName: string,
  seed: number,
  contacts: ContactEntity[],
  missionDuration: number
): MissionScoreResult {
  const threatScores: PerThreatScore[] = [];
  const criticalErrors: string[] = [];

  let totalDetection = 0;
  let totalClassification = 0;
  let totalEngagement = 0;
  let totalRoe = 0;

  // Swarm bonus calculation: check priority order of engagement
  const swarmContacts = contacts.filter((c) => c.type === 'swarm' && c.respondedAt !== null);
  let swarmBonusApplied = false;
  if (swarmContacts.length >= 2) {
    // Check if sorted by distance (closer threats addressed first)
    const correctlyPrioritized = swarmContacts.every((curr, i, arr) => {
      if (i === 0) return true;
      const prev = arr[i - 1];
      return (curr.respondedAt ?? 0) >= (prev.respondedAt ?? 0);
    });
    if (correctlyPrioritized) swarmBonusApplied = true;
  }

  contacts.forEach((contact) => {
    const det = evaluateDetection(contact, missionDuration);
    const cls = evaluateClassification(contact);
    const eng = evaluateEngagement(contact);

    let isCrit = det.critical || cls.critical || eng.critical;
    let critReason = det.reason || cls.reason || eng.reason;

    if (isCrit && critReason) {
      criticalErrors.push(critReason);
    }

    // Weighted score per contact:
    // Detection 25%, Classification 30%, Engagement 35%, ROE 10%
    let contactTotal =
      det.score * 0.25 +
      cls.score * 0.30 +
      eng.score * 0.35 +
      eng.roeScore * 0.10;

    if (swarmBonusApplied && contact.type === 'swarm') {
      contactTotal = Math.min(100, contactTotal + 5);
    }

    // Combine decision path
    const combinedPath: DecisionNode[] = [
      ...det.nodes,
      ...cls.nodes,
      ...eng.nodes,
    ];

    threatScores.push({
      threatId: contact.id,
      callsign: contact.callsign,
      actualType: contact.type,
      hostile: contact.hostile,
      detectionScore: det.score,
      detectionTimeElapsed: det.elapsed,
      classificationScore: cls.score,
      classifiedAs: contact.classifiedAs,
      engagementScore: eng.score,
      actionTaken: contact.responseAction,
      roeScore: eng.roeScore,
      totalScore: Math.round(contactTotal),
      criticalError: isCrit,
      criticalReason: critReason,
      decisionPath: combinedPath,
    });

    totalDetection += det.score;
    totalClassification += cls.score;
    totalEngagement += eng.score;
    totalRoe += eng.roeScore;
  });

  const count = contacts.length || 1;
  const avgDetection = Math.round(totalDetection / count);
  const avgClassification = Math.round(totalClassification / count);
  const avgEngagement = Math.round(totalEngagement / count);
  const avgRoe = Math.round(totalRoe / count);

  let rawOverall = Math.round(
    avgDetection * 0.25 +
    avgClassification * 0.30 +
    avgEngagement * 0.35 +
    avgRoe * 0.10
  );

  // Grade bands
  let grade: GradeBand = 'F';
  if (rawOverall >= 90) grade = 'A';
  else if (rawOverall >= 80) grade = 'B';
  else if (rawOverall >= 70) grade = 'C';
  else if (rawOverall >= 55) grade = 'D';
  else grade = 'F';

  // HARD RULE: Any critical error caps the grade at 'C'
  if (criticalErrors.length > 0) {
    if (grade === 'A' || grade === 'B') {
      grade = 'C';
    }
  }

  // Generate tactical coaching feedback
  const coachingFeedback: string[] = [];
  if (criticalErrors.length > 0) {
    coachingFeedback.push(
      `CRITICAL DEBRIEF: ${criticalErrors.length} safety or containment breaches recorded. In high-tempo ops, single errors result in asset destruction or fratricide.`
    );
  }
  if (avgDetection < 75) {
    coachingFeedback.push(
      'Surveillance Picket: Detection lag exceeded tactical norms. Scan radar bearing changes faster and correlate with acoustic bearings.'
    );
  }
  if (avgClassification < 75) {
    coachingFeedback.push(
      'Classification Discipline: Verify RF signature and IFF transponder squawk before locking in engagement protocols.'
    );
  }
  if (avgEngagement < 75) {
    coachingFeedback.push(
      'Weapons Envelope: Deploy EW jamming early against swarms to break data links; reserve kinetic hard-kill for high-speed strike drones.'
    );
  }
  if (coachingFeedback.length === 0) {
    coachingFeedback.push(
      'Exemplary Command Execution: Target detection, classification taxonomy, and ROE weapons release met DSSC top-tier criteria.'
    );
  }

  return {
    sessionId,
    scenarioId,
    scenarioName,
    timestamp: new Date().toISOString(),
    durationSeconds: Math.round(missionDuration),
    overallScore: rawOverall,
    grade,
    breakdown: {
      detection: avgDetection,
      classification: avgClassification,
      engagement: avgEngagement,
      roe: avgRoe,
    },
    criticalErrors,
    threatScores,
    coachingFeedback,
    seed,
  };
}
