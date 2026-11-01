// DRISHTI: Operator Training Types & Data Contracts
// Stage 3: Operator Training Experiences

export type OperatorTrainingId = 'fpv-flight' | 'indoor-inspection' | 'aerial-observation';

export interface TrainingControlHint {
  key: string;
  label: string;
  action: string;
}

export interface TrainingBriefing {
  operationalRole: string;
  context: string;
  primaryDirective: string;
  objectives: string[];
  instructions: string[];
  controls: TrainingControlHint[];
}

export interface OperatorExperienceDefinition {
  id: OperatorTrainingId;
  code: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  description: string;
  briefing: TrainingBriefing;
}

// Experience A: FPV Flight Checkpoint
export interface FPVCheckpointGate {
  id: number;
  label: string;
  position: [number, number, number];
  rotationY: number; // in radians
  cleared: boolean;
  timeSec?: number;
}

// Experience B: Indoor Inspection Target
export interface IndoorTargetObject {
  id: string;
  name: string;
  room: string;
  position: [number, number, number];
  description: string;
  hazardCondition: 'Normal' | 'Compromised' | 'Hazardous';
  inspected: boolean;
  loggedCondition?: 'Normal' | 'Compromised' | 'Hazardous';
  isCorrect?: boolean;
}

// Experience C: Aerial Observation Landmark
export interface AerialLandmarkTarget {
  id: string;
  name: string;
  gridSector: string;
  position: [number, number, number];
  description: string;
  expectedObservation: string;
  observationOptions: string[];
  observed: boolean;
  selectedObservation?: string;
  isCorrect?: boolean;
}

// Detailed Explainable Assessment for Operator Training
export interface OperatorTrainingAssessment {
  totalScore: number;
  handlingScore: number;
  objectiveScore: number;
  timeBonusScore: number;
  durationSec: number;
  rankRating: 'Distinguished Operator' | 'Proficient Pilot' | 'Qualified' | 'Remedial Practice Required';
  metricsSummary: {
    label: string;
    value: string;
    quality: 'optimal' | 'good' | 'remedial';
  }[];
  detailedFeedback: string[];
  improvementSuggestions: string[];
}
