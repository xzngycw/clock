import { create } from 'zustand';
import type { Answer, ClockTime, DifficultyLevel, GameSession, PracticeMode, Question, QuestionType } from '@/types';
import { DIFFICULTY_CONFIG } from '@/constants';
import { QuestionGenerator, generateId, randomChoice } from '@/utils';

interface GameState {
  session: GameSession | null;
  currentQuestion: Question | null;
  isPlaying: boolean;
  isCustomSession: boolean;
  currentMode: PracticeMode;
  startSession: (difficulty: DifficultyLevel, mode?: PracticeMode) => void;
  startCustomSession: (questions: Question[], difficulty?: DifficultyLevel) => void;
  submitAnswer: (answer: ClockTime) => Answer | null;
  nextQuestion: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

const createSession = (questions: Question[], difficulty: DifficultyLevel): GameSession => ({
  id: generateId(),
  difficulty,
  questions,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  totalQuestions: questions.length,
  correctAnswers: 0,
  startedAt: Date.now(),
  duration: 0,
});

const createQuestionByMode = (difficulty: DifficultyLevel, mode: PracticeMode): Question => {
  if (mode === 'manual-input') {
    return QuestionGenerator.generate('manual-input', difficulty);
  }

  const type: QuestionType =
    mode === 'mixed'
      ? randomChoice(['analog-to-digital', 'digital-to-analog'] as QuestionType[])
      : 'analog-to-digital';

  let question = QuestionGenerator.generate(type, difficulty);

  if (mode === 'whole-hours' || mode === 'half-hours') {
    const targetMinute = mode === 'whole-hours' ? 0 : 30;

    while (question.time.minutes !== targetMinute) {
      question = QuestionGenerator.generate(type, difficulty);
    }
  }

  return question;
};

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  currentQuestion: null,
  isPlaying: false,
  isCustomSession: false,
  currentMode: 'mixed',

  startSession: (difficulty, mode = 'mixed') => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const questionCount = config.questionCount;
    const questions = Array.from({ length: questionCount }, () => createQuestionByMode(difficulty, mode));
    const session = createSession(questions, difficulty);

    set({
      session,
      currentQuestion: questions[0] ?? null,
      isPlaying: true,
      isCustomSession: false,
      currentMode: mode,
    });
  },

  startCustomSession: (questions, difficulty = 'junior') => {
    const sanitizedQuestions = questions.map((question) => ({
      ...question,
      id: question.id || generateId(),
      createdAt: question.createdAt || Date.now(),
    }));
    const session = createSession(sanitizedQuestions, difficulty);

    set({
      session,
      currentQuestion: sanitizedQuestions[0] ?? null,
      isPlaying: true,
      isCustomSession: true,
      currentMode: 'mixed',
    });
  },

  submitAnswer: (answer) => {
    const { session, currentQuestion } = get();
    if (!session || !currentQuestion) return null;

    const isCorrect =
      answer.hours === currentQuestion.time.hours &&
      answer.minutes === currentQuestion.time.minutes;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correctAnswer: currentQuestion.time,
      isCorrect,
      timeSpent: 0,
      timestamp: Date.now(),
    };

    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            answers: [...state.session.answers, newAnswer],
            correctAnswers: state.session.correctAnswers + (isCorrect ? 1 : 0),
            score: state.session.score + (isCorrect ? 10 : 0),
          }
        : null,
    }));

    return newAnswer;
  },

  nextQuestion: () => {
    const { session } = get();
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      get().completeSession();
      return;
    }

    set({
      session: { ...session, currentQuestionIndex: nextIndex },
      currentQuestion: session.questions[nextIndex],
    });
  },

  completeSession: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: {
        ...session,
        completedAt: Date.now(),
        duration: Math.floor((Date.now() - session.startedAt) / 1000),
      },
      isPlaying: false,
      currentQuestion: null,
    });
  },

  resetSession: () => {
    set({
      session: null,
      currentQuestion: null,
      isPlaying: false,
      isCustomSession: false,
      currentMode: 'mixed',
    });
  },
}));
