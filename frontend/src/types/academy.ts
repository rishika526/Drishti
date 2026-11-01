// DRISHTI: Academy Domain Types & Data Contracts
// Stage 4: Drishti Academy, AAR & Performance Analytics

export type AcademyCategory =
  | 'All'
  | 'Counter-Drone Fundamentals'
  | 'Drone Recognition and Classification'
  | 'Airspace Observation'
  | 'FPV Flight Fundamentals'
  | 'Sensor Awareness and Low-Visibility Observation'
  | 'Aerial Observation and Reporting'
  | 'Simulation Safety and Decision-Making';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveModuleSlide {
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyTakeaways: string[];
  diagramLabel?: string;
  diagramSvgSnippet?: string;
}

export interface InteractiveLearningModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: AcademyCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  objectives: string[];
  slides: InteractiveModuleSlide[];
  quiz: QuizQuestion[];
  passingScorePct: number;
}

export interface EducationalVideoLesson {
  id: string;
  title: string;
  channelName: string;
  youtubeId: string;
  embedUrl: string;
  watchUrl: string;
  duration: string;
  category: AcademyCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  keyTopics: string[];
}

export interface ModuleProgressRecord {
  moduleId: string;
  started: boolean;
  completed: boolean;
  highestQuizScorePct: number;
  attemptsCount: number;
  lastAttemptIso: string;
}

export interface AcademyProgressState {
  completedVideoIds: string[];
  moduleProgress: Record<string, ModuleProgressRecord>;
  lastActivityTitle?: string;
  lastActivityType?: 'video' | 'module';
  lastActivityIso?: string;
}
