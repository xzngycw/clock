import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, GameSession, Achievement } from '@/types';
import { generateId } from '@/utils';

interface ProgressState {
  progress: UserProgress | null;
  
  // Actions
  initProgress: () => void;
  addPracticeSession: (session: GameSession) => void;
  updateStreak: () => void;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
}

const createInitialProgress = (): UserProgress => ({
  id: generateId(),
  completedLessons: [],
  practiceHistory: [],
  totalPracticeTime: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  accuracy: 0,
  streakDays: 0,
  longestStreak: 0,
  lastLoginDate: Date.now(),
  lastActiveAt: Date.now(),
  achievements: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastUpdated: Date.now(),
});

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: null,
      
      initProgress: () => {
        const { progress } = get();
        if (!progress) {
          set({ progress: createInitialProgress() });
        }
      },
      
      addPracticeSession: (session) => {
        set((state) => {
          if (!state.progress) return state;
          
          const newTotalQuestions = state.progress.totalQuestions + session.totalQuestions;
          const newCorrectAnswers = state.progress.correctAnswers + session.correctAnswers;
          const newTotalPracticeTime = state.progress.totalPracticeTime + Math.floor(session.duration / 60);
          
          return {
            progress: {
              ...state.progress,
              practiceHistory: [...state.progress.practiceHistory, session],
              totalQuestions: newTotalQuestions,
              correctAnswers: newCorrectAnswers,
              totalPracticeTime: newTotalPracticeTime,
              accuracy: Math.round((newCorrectAnswers / newTotalQuestions) * 100),
              lastActiveAt: Date.now(),
              updatedAt: Date.now(),
            },
          };
        });
      },
      
      updateStreak: () => {
        set((state) => {
          if (!state.progress) return state;
          
          const lastActive = state.progress.lastActiveAt;
          const now = Date.now();
          const dayInMs = 24 * 60 * 60 * 1000;
          const daysDiff = Math.floor((now - lastActive) / dayInMs);
          
          let newStreak = state.progress.streakDays;
          if (daysDiff === 1) {
            newStreak += 1;
          } else if (daysDiff > 1) {
            newStreak = 1;
          }
          
          return {
            progress: {
              ...state.progress,
              streakDays: newStreak,
              lastActiveAt: now,
              updatedAt: now,
            },
          };
        });
      },
      
      addAchievement: (achievement) => {
        set((state) => {
          if (!state.progress) return state;
          
          // 检查是否已经有这个成就
          const existingAchievement = state.progress.achievements.find(
            (a) => a.type === achievement.type
          );
          if (existingAchievement) return state;
          
          const newAchievement: Achievement = {
            ...achievement,
            id: generateId(),
            unlockedAt: Date.now(),
          };
          
          return {
            progress: {
              ...state.progress,
              achievements: [...state.progress.achievements, newAchievement],
              updatedAt: Date.now(),
            },
          };
        });
      },
    }),
    {
      name: 'clock-app-progress',
    }
  )
);
