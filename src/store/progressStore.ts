import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Achievement,
  Answer,
  GameSession,
  LessonProgress,
  LessonStatus,
  ParentSummary,
  Question,
  UserProgress,
  WrongQuestionRecord,
} from '@/types';
import { MVP_LESSONS } from '@/constants';
import { generateId } from '@/utils';

interface ProgressState {
  progress: UserProgress | null;
  initProgress: () => void;
  addPracticeSession: (session: GameSession) => void;
  recordWrongAnswer: (question: Question, answer: Answer, source?: 'practice') => void;
  clearWrongQuestions: () => void;
  markLessonStarted: (lessonId: string) => void;
  markLessonCompleted: (lessonId: string, score?: number) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getLessonStatus: (lessonId: string) => LessonStatus;
  getNextLessonId: () => string | null;
  getParentSummary: () => ParentSummary | null;
  updateStreak: () => void;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
}

const createInitialProgress = (): UserProgress => ({
  id: generateId(),
  completedLessons: [],
  practiceHistory: [],
  wrongQuestions: [],
  totalPracticeTime: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  accuracy: 0,
  streakDays: 1,
  longestStreak: 1,
  lastLoginDate: Date.now(),
  lastActiveAt: Date.now(),
  achievements: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastUpdated: Date.now(),
});

const getSuggestedNextAction = (progress: UserProgress): string => {
  const completedLessons = progress.completedLessons ?? [];
  const wrongQuestions = progress.wrongQuestions ?? [];

  if (completedLessons.filter((lesson) => lesson.completed).length < MVP_LESSONS.length) {
    return '继续学习下一节课程';
  }

  if (wrongQuestions.length > 0) {
    return '先复习错题，再继续练习';
  }

  if (progress.accuracy >= 85) {
    return '表现很棒，可以挑战更高难度';
  }

  return '继续保持练习，巩固读钟能力';
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: null,

      initProgress: () => {
        const { progress } = get();
        if (!progress) {
          set({ progress: createInitialProgress() });
          return;
        }

        const normalizedLessons = progress.completedLessons.map((lesson) => ({
          ...lesson,
          status: lesson.completed ? 'completed' : lesson.status ?? 'in_progress',
        }));

        set({
          progress: {
            ...progress,
            completedLessons: normalizedLessons,
            wrongQuestions: progress.wrongQuestions ?? [],
          },
        });
      },

      addPracticeSession: (session) => {
        set((state) => {
          if (!state.progress) return state;

          const totalQuestions = state.progress.totalQuestions + session.totalQuestions;
          const correctAnswers = state.progress.correctAnswers + session.correctAnswers;
          const totalPracticeTime = state.progress.totalPracticeTime + Math.max(1, Math.floor(session.duration / 60));
          const now = Date.now();

          return {
            progress: {
              ...state.progress,
              practiceHistory: [...state.progress.practiceHistory, session],
              totalQuestions,
              correctAnswers,
              totalPracticeTime,
              accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
              lastActiveAt: now,
              updatedAt: now,
              lastUpdated: now,
            },
          };
        });
      },

      recordWrongAnswer: (question, answer, source = 'practice') => {
        if (answer.isCorrect) return;

        set((state) => {
          if (!state.progress) return state;

          const existingIndex = state.progress.wrongQuestions.findIndex(
            (item) => item.questionId === question.id,
          );

          const record: WrongQuestionRecord = {
            id: existingIndex >= 0 ? state.progress.wrongQuestions[existingIndex].id : generateId(),
            questionId: question.id,
            questionType: question.type,
            difficulty: question.difficulty,
            correctAnswer: answer.correctAnswer,
            userAnswer: answer.userAnswer,
            explanation: question.explanation ?? '请再次观察时针和分针的位置。',
            createdAt: Date.now(),
            source,
          };

          const wrongQuestions = [...(state.progress.wrongQuestions ?? [])];
          if (existingIndex >= 0) {
            wrongQuestions[existingIndex] = record;
          } else {
            wrongQuestions.unshift(record);
          }

          return {
            progress: {
              ...state.progress,
              wrongQuestions: wrongQuestions.slice(0, 100),
              updatedAt: Date.now(),
              lastUpdated: Date.now(),
            },
          };
        });
      },

      clearWrongQuestions: () => {
        set((state) => {
          if (!state.progress) return state;
          return {
            progress: {
              ...state.progress,
              completedLessons: state.progress.completedLessons ?? [],
              wrongQuestions: [],
              updatedAt: Date.now(),
              lastUpdated: Date.now(),
            },
          };
        });
      },

      markLessonStarted: (lessonId) => {
        set((state) => {
          if (!state.progress) return state;

          const existing = (state.progress.completedLessons ?? []).find((lesson) => lesson.lessonId === lessonId);
          if (existing) {
            if (existing.status !== 'not_started') return state;
            return {
              progress: {
                ...state.progress,
                completedLessons: (state.progress.completedLessons ?? []).map((lesson) =>
                  lesson.lessonId === lessonId
                    ? { ...lesson, status: 'in_progress', startedAt: Date.now() }
                    : lesson,
                ),
                updatedAt: Date.now(),
                lastUpdated: Date.now(),
              },
            };
          }

          return {
            progress: {
              ...state.progress,
              completedLessons: [
                ...(state.progress.completedLessons ?? []),
                {
                  lessonId,
                  status: 'in_progress',
                  completed: false,
                  startedAt: Date.now(),
                },
              ],
              updatedAt: Date.now(),
              lastUpdated: Date.now(),
            },
          };
        });
      },

      markLessonCompleted: (lessonId, score) => {
        set((state) => {
          if (!state.progress) return state;

          const existing = (state.progress.completedLessons ?? []).find((lesson) => lesson.lessonId === lessonId);
          const nextLesson: LessonProgress = {
            lessonId,
            status: 'completed',
            completed: true,
            startedAt: existing?.startedAt ?? Date.now(),
            completedAt: Date.now(),
            score,
          };

          const completedLessons = existing
            ? (state.progress.completedLessons ?? []).map((lesson) =>
                lesson.lessonId === lessonId ? nextLesson : lesson,
              )
            : [...(state.progress.completedLessons ?? []), nextLesson];

          return {
            progress: {
              ...state.progress,
              completedLessons,
              updatedAt: Date.now(),
              lastUpdated: Date.now(),
            },
          };
        });
      },

      getLessonProgress: (lessonId) => {
        return get().progress?.completedLessons?.find((lesson) => lesson.lessonId === lessonId);
      },

      getLessonStatus: (lessonId) => {
        const lesson = get().progress?.completedLessons?.find((item) => item.lessonId === lessonId);
        if (!lesson) return 'not_started';
        if (lesson.completed) return 'completed';
        return lesson.status;
      },

      getNextLessonId: () => {
        const progress = get().progress;
        for (const lesson of MVP_LESSONS) {
          const status = progress?.completedLessons?.find((item) => item.lessonId === lesson.id);
          if (!status || !status.completed) {
            return lesson.id;
          }
        }
        return MVP_LESSONS[0]?.id ?? null;
      },

      getParentSummary: () => {
        const progress = get().progress;
        if (!progress) return null;

        const completedLessons = (progress.completedLessons ?? []).filter((lesson) => lesson.completed).length;
        const wrongQuestionCount = progress.wrongQuestions?.length ?? 0;

        return {
          completedLessons,
          totalLessons: MVP_LESSONS.length,
          totalPracticeTime: progress.totalPracticeTime,
          totalQuestions: progress.totalQuestions,
          correctAnswers: progress.correctAnswers,
          accuracy: progress.accuracy,
          wrongQuestionCount,
          suggestedNextAction: getSuggestedNextAction(progress),
        };
      },

      updateStreak: () => {
        set((state) => {
          if (!state.progress) return state;

          const now = Date.now();
          const lastActive = state.progress.lastActiveAt;
          const dayInMs = 24 * 60 * 60 * 1000;
          const daysDiff = Math.floor((now - lastActive) / dayInMs);

          let streakDays = state.progress.streakDays;
          if (daysDiff >= 1 && daysDiff < 2) {
            streakDays += 1;
          } else if (daysDiff >= 2) {
            streakDays = 1;
          }

          return {
            progress: {
              ...state.progress,
              streakDays,
              longestStreak: Math.max(streakDays, state.progress.longestStreak),
              lastActiveAt: now,
              lastLoginDate: now,
              updatedAt: now,
              lastUpdated: now,
            },
          };
        });
      },

      addAchievement: (achievement) => {
        set((state) => {
          if (!state.progress) return state;

          const exists = state.progress.achievements.some((item) => item.type === achievement.type);
          if (exists) return state;

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
              lastUpdated: Date.now(),
            },
          };
        });
      },
    }),
    {
      name: 'clock-app-progress',
    },
  ),
);
