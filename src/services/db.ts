import Dexie, { type Table } from 'dexie';
import type { GameSession, UserProgress, Achievement, LessonProgress } from '@/types';

/**
 * 数据库类
 */
export class ClockAppDatabase extends Dexie {
  // 表定义
  userProgress!: Table<UserProgress, string>;
  gameSessions!: Table<GameSession, string>;
  lessonProgress!: Table<LessonProgress, string>;
  achievements!: Table<Achievement, string>;

  constructor() {
    super('ClockAppDB');
    
    // 定义数据库版本和表结构
    this.version(1).stores({
      userProgress: 'id, lastUpdated',
      gameSessions: 'id, difficulty, startedAt, completedAt',
      lessonProgress: 'id, lessonId, completedAt',
      achievements: 'id, type, unlockedAt',
    });
  }
}

// 创建数据库实例
export const db = new ClockAppDatabase();

/**
 * 用户进度相关操作
 */
export const userProgressService = {
  /**
   * 获取用户进度
   */
  async get(): Promise<UserProgress | undefined> {
    const progress = await db.userProgress.toArray();
    return progress[0];
  },

  /**
   * 保存或更新用户进度
   */
  async save(progress: UserProgress): Promise<void> {
    await db.userProgress.put({
      ...progress,
      lastUpdated: Date.now(),
    });
  },

  /**
   * 更新连续学习天数
   */
  async updateStreak(): Promise<void> {
    const progress = await this.get();
    if (!progress) return;

    const now = Date.now();
    const lastLogin = progress.lastLoginDate;
    const oneDay = 24 * 60 * 60 * 1000;

    // 检查是否是连续的一天
    if (lastLogin && now - lastLogin < oneDay * 2 && now - lastLogin > oneDay) {
      progress.streakDays += 1;
      progress.longestStreak = Math.max(progress.longestStreak, progress.streakDays);
    } else if (lastLogin && now - lastLogin >= oneDay * 2) {
      // 超过两天未登录，重置连续天数
      progress.streakDays = 1;
    }

    progress.lastLoginDate = now;
    await this.save(progress);
  },

  /**
   * 添加成就
   */
  async addAchievement(achievement: Omit<Achievement, 'id' | 'unlockedAt'>): Promise<void> {
    const progress = await this.get();
    if (!progress) return;

    const newAchievement: Achievement = {
      ...achievement,
      id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      unlockedAt: Date.now(),
    };

    await db.achievements.add(newAchievement);
    
    // 更新用户进度中的成就列表
    if (!progress.achievements) {
      progress.achievements = [];
    }
    progress.achievements.push(newAchievement);
    await this.save(progress);
  },
};

/**
 * 游戏会话相关操作
 */
export const gameSessionService = {
  /**
   * 保存游戏会话
   */
  async save(session: GameSession): Promise<void> {
    await db.gameSessions.put(session);
  },

  /**
   * 获取最近的游戏会话
   */
  async getRecent(limit: number = 10): Promise<GameSession[]> {
    return await db.gameSessions
      .orderBy('startedAt')
      .reverse()
      .limit(limit)
      .toArray();
  },

  /**
   * 按难度获取游戏会话
   */
  async getByDifficulty(difficulty: string): Promise<GameSession[]> {
    return await db.gameSessions
      .where('difficulty')
      .equals(difficulty)
      .toArray();
  },

  /**
   * 获取统计数据
   */
  async getStats() {
    const sessions = await db.gameSessions.toArray();
    
    const totalSessions = sessions.length;
    const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const correctAnswers = sessions.reduce((sum, s) => {
      return sum + s.answers.filter(a => a.isCorrect).length;
    }, 0);
    
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const totalTime = sessions.reduce((sum, s) => {
      return sum + (s.completedAt ? s.completedAt - s.startedAt : 0);
    }, 0);

    return {
      totalSessions,
      totalQuestions,
      correctAnswers,
      accuracy,
      totalTime,
    };
  },

  /**
   * 删除旧的游戏会话（保留最近100条）
   */
  async cleanOldSessions(): Promise<void> {
    const sessions = await db.gameSessions
      .orderBy('startedAt')
      .reverse()
      .toArray();
    
    if (sessions.length > 100) {
      const toDelete = sessions.slice(100);
      const idsToDelete = toDelete.map(s => s.id);
      await db.gameSessions.bulkDelete(idsToDelete);
    }
  },
};

/**
 * 课程进度相关操作
 */
export const lessonProgressService = {
  /**
   * 保存课程进度
   */
  async save(progress: LessonProgress): Promise<void> {
    await db.lessonProgress.put(progress);
  },

  /**
   * 获取特定课程的进度
   */
  async getByLessonId(lessonId: string): Promise<LessonProgress | undefined> {
    return await db.lessonProgress
      .where('lessonId')
      .equals(lessonId)
      .first();
  },

  /**
   * 获取所有已完成的课程
   */
  async getCompleted(): Promise<LessonProgress[]> {
    return await db.lessonProgress
      .where('completed')
      .equals(1) // Dexie 使用 1/0 表示 true/false
      .toArray();
  },
};

/**
 * 成就相关操作
 */
export const achievementService = {
  /**
   * 获取所有成就
   */
  async getAll(): Promise<Achievement[]> {
    return await db.achievements
      .orderBy('unlockedAt')
      .reverse()
      .toArray();
  },

  /**
   * 检查成就是否已解锁
   */
  async isUnlocked(type: string): Promise<boolean> {
    const achievement = await db.achievements
      .where('type')
      .equals(type)
      .first();
    return !!achievement;
  },
};

/**
 * 数据库初始化
 */
export async function initDatabase(): Promise<void> {
  try {
    // 检查是否已有用户进度
    const progress = await userProgressService.get();
    
    if (!progress) {
      // 创建初始用户进度
      const initialProgress: UserProgress = {
        id: 'user_progress_main',
        totalPracticeTime: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        completedLessons: [],
        practiceHistory: [],
        wrongQuestions: [],
        achievements: [],
        streakDays: 0,
        longestStreak: 0,
        lastLoginDate: Date.now(),
        lastActiveAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastUpdated: Date.now(),
      };
      
      await userProgressService.save(initialProgress);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

/**
 * 清除所有数据（用于重置）
 */
export async function clearAllData(): Promise<void> {
  await db.userProgress.clear();
  await db.gameSessions.clear();
  await db.lessonProgress.clear();
  await db.achievements.clear();
  
  // 重新初始化
  await initDatabase();
}
