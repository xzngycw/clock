export interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export type DifficultyLevel = 'beginner' | 'junior' | 'intermediate' | 'advanced';

export type PracticeMode = 'mixed' | 'whole-hours' | 'half-hours' | 'manual-input';

export type QuestionType =
  | 'analog-to-digital'
  | 'digital-to-analog'
  | 'manual-input';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  time: ClockTime;
  options?: ClockTime[];
  hint?: string;
  explanation?: string;
  createdAt: number;
}

export interface Answer {
  questionId: string;
  userAnswer: ClockTime;
  correctAnswer: ClockTime;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: number;
}

export interface GameSession {
  id: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: number;
  completedAt?: number;
  duration: number;
}

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
  score?: number;
}

export type AchievementType =
  | 'first-lesson'
  | 'streak-7'
  | 'streak-30'
  | 'accuracy-90'
  | 'questions-100';

export interface Achievement {
  id: string;
  type: AchievementType;
  unlockedAt: number;
  description: string;
}

export interface WrongQuestionRecord {
  id: string;
  questionId: string;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  correctAnswer: ClockTime;
  userAnswer: ClockTime;
  explanation: string;
  createdAt: number;
  source: 'practice';
}

export interface ParentSummary {
  completedLessons: number;
  totalLessons: number;
  totalPracticeTime: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  wrongQuestionCount: number;
  suggestedNextAction: string;
}

export interface UserProgress {
  id: string;
  completedLessons: LessonProgress[];
  practiceHistory: GameSession[];
  wrongQuestions: WrongQuestionRecord[];
  totalPracticeTime: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  streakDays: number;
  longestStreak: number;
  lastLoginDate: number;
  lastActiveAt: number;
  achievements: Achievement[];
  createdAt: number;
  updatedAt: number;
  lastUpdated: number;
}

export type Theme = 'light' | 'dark' | 'eyecare';

export type Language = 'zh-CN' | 'en-US';

export interface UserSettings {
  id: string;
  theme: Theme;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  difficulty: DifficultyLevel;
  language: Language;
  animationsEnabled: boolean;
  autoAdvance: boolean;
  showTimer: boolean;
  createdAt: number;
  updatedAt: number;
}

export type LessonType = 'concept' | 'interactive' | 'practice';

export type SectionType = 'text' | 'animation' | 'interactive' | 'quiz';

export interface SectionContent {
  text?: string;
  animationId?: string;
  interactionId?: string;
  quizId?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  type: SectionType;
  content: SectionContent;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  difficulty: DifficultyLevel;
  duration: number;
  sections: LessonSection[];
  prerequisites?: string[];
  order: number;
}

export interface LessonStepSummary {
  id: string;
  title: string;
  description: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  goal: string;
  duration: number;
  difficultyLabel: string;
  order: number;
  linkedRoute: string;
  tag: string;
  steps: LessonStepSummary[];
}
