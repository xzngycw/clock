import { create } from 'zustand';
import type { ClockTime, DifficultyLevel, Question, Answer, GameSession } from '@/types';
import { QuestionGenerator, generateId } from '@/utils';
import { DIFFICULTY_CONFIG } from '@/constants';

interface GameState {
  session: GameSession | null;
  currentQuestion: Question | null;
  isPlaying: boolean;
  
  // Actions
  startSession: (difficulty: DifficultyLevel) => void;
  submitAnswer: (answer: ClockTime) => Answer | null;
  nextQuestion: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  currentQuestion: null,
  isPlaying: false,
  
  startSession: (difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const questions = QuestionGenerator.generateBatch('analog-to-digital', difficulty, config.questionCount);
    
    const session: GameSession = {
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
    };
    
    set({
      session,
      currentQuestion: questions[0],
      isPlaying: true,
    });
  },
  
  submitAnswer: (answer) => {
    const { session, currentQuestion } = get();
    if (!session || !currentQuestion) return null;
    
    const isCorrect = answer.hours === currentQuestion.time.hours && 
                      answer.minutes === currentQuestion.time.minutes;
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      correctAnswer: currentQuestion.time,
      isCorrect,
      timeSpent: 0, // TODO: 计算答题时间
      timestamp: Date.now(),
    };
    
    set((state) => ({
      session: state.session ? {
        ...state.session,
        answers: [...state.session.answers, newAnswer],
        correctAnswers: state.session.correctAnswers + (isCorrect ? 1 : 0),
        score: state.session.score + (isCorrect ? 10 : 0),
      } : null,
    }));
    
    return newAnswer;
  },
  
  nextQuestion: () => {
    const { session } = get();
    if (!session) return;
    
    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.questions.length) {
      // 所有题目完成
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
    });
  },
}));
