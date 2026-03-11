/**
 * 时钟时间
 */
export interface ClockTime {
  hours: number;      // 0-23
  minutes: number;    // 0-59
  seconds: number;    // 0-59
}

/**
 * 难度等级
 */
export type DifficultyLevel = 'beginner' | 'junior' | 'intermediate' | 'advanced';

/**
 * 题目类型
 */
export type QuestionType = 
  | 'analog-to-digital'    // 模拟时钟 → 数字时钟
  | 'digital-to-analog'    // 数字时钟 → 模拟时钟
  | 'manual-input';        // 手动输入

/**
 * 题目
 */
export interface Question {
  id: string;                          // 唯一标识
  type: QuestionType;                  // 题目类型
  difficulty: DifficultyLevel;         // 难度等级
  time: ClockTime;                     // 题目时间
  options?: ClockTime[];               // 选择题选项
  hint?: string;                       // 提示文本
  explanation?: string;                // 答案解析
  createdAt: number;                   // 创建时间戳
}

/**
 * 答案
 */
export interface Answer {
  questionId: string;          // 题目 ID
  userAnswer: ClockTime;       // 用户答案
  correctAnswer: ClockTime;    // 正确答案
  isCorrect: boolean;          // 是否正确
  timeSpent: number;           // 答题耗时（秒）
  timestamp: number;           // 答题时间戳
}

/**
 * 游戏会话
 */
export interface GameSession {
  id: string;                          // 会话 ID
  difficulty: DifficultyLevel;         // 难度等级
  questions: Question[];               // 题目列表
  currentQuestionIndex: number;        // 当前题目索引
  answers: Answer[];                   // 答案列表
  score: number;                       // 得分
  totalQuestions: number;              // 总题数
  correctAnswers: number;              // 正确题数
  startedAt: number;                   // 开始时间戳
  completedAt?: number;                // 完成时间戳
  duration: number;                    // 总耗时（秒）
}

/**
 * 课程进度
 */
export interface LessonProgress {
  lessonId: string;          // 课程 ID
  completed: boolean;        // 是否完成
  completedAt?: number;      // 完成时间戳
  score?: number;            // 得分
}

/**
 * 成就类型
 */
export type AchievementType = 
  | 'first-lesson'           // 完成第一课
  | 'streak-7'               // 连续学习 7 天
  | 'streak-30'              // 连续学习 30 天
  | 'accuracy-90'            // 正确率达到 90%
  | 'questions-100';         // 完成 100 道题目

/**
 * 成就
 */
export interface Achievement {
  id: string;                // 成就 ID
  type: AchievementType;     // 成就类型
  unlockedAt: number;        // 解锁时间戳
  description: string;       // 成就描述
}

/**
 * 用户进度
 */
export interface UserProgress {
  id: string;                          // 用户 ID
  completedLessons: LessonProgress[];  // 已完成的课程
  practiceHistory: GameSession[];      // 练习历史
  totalPracticeTime: number;           // 总练习时长（分钟）
  totalQuestions: number;              // 总答题数
  correctAnswers: number;              // 正确答题数
  accuracy: number;                    // 正确率（0-100）
  streakDays: number;                  // 连续学习天数
  longestStreak: number;               // 最长连续学习天数
  lastLoginDate: number;               // 最后登录日期时间戳
  lastActiveAt: number;                // 最后活跃时间戳
  achievements: Achievement[];         // 成就列表
  createdAt: number;                   // 创建时间戳
  updatedAt: number;                   // 更新时间戳
  lastUpdated: number;                 // 最后更新时间戳（用于兼容）
}

/**
 * 主题
 */
export type Theme = 'light' | 'dark' | 'eyecare';

/**
 * 语言
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * 用户设置
 */
export interface UserSettings {
  id: string;                          // 用户 ID
  theme: Theme;                        // 主题
  soundEnabled: boolean;               // 音效开关
  musicEnabled: boolean;               // 背景音乐开关
  volume: number;                      // 音量（0-100）
  difficulty: DifficultyLevel;         // 默认难度
  language: Language;                  // 语言
  animationsEnabled: boolean;          // 动画开关
  autoAdvance: boolean;                // 自动进入下一题
  showTimer: boolean;                  // 显示计时器
  createdAt: number;                   // 创建时间戳
  updatedAt: number;                   // 更新时间戳
}

/**
 * 课程类型
 */
export type LessonType = 
  | 'concept'                 // 概念教学
  | 'interactive'             // 互动学习
  | 'practice';               // 练习巩固

/**
 * 章节类型
 */
export type SectionType = 
  | 'text'                    // 文本内容
  | 'animation'               // 动画演示
  | 'interactive'             // 互动练习
  | 'quiz';                   // 小测验

/**
 * 章节内容
 */
export interface SectionContent {
  text?: string;              // 文本内容
  animationId?: string;       // 动画 ID
  interactionId?: string;     // 互动 ID
  quizId?: string;            // 测验 ID
}

/**
 * 课程章节
 */
export interface LessonSection {
  id: string;                 // 章节 ID
  title: string;              // 章节标题
  type: SectionType;          // 章节类型
  content: SectionContent;    // 章节内容
  order: number;              // 章节顺序
}

/**
 * 课程
 */
export interface Lesson {
  id: string;                          // 课程 ID
  title: string;                       // 课程标题
  description: string;                 // 课程描述
  type: LessonType;                    // 课程类型
  difficulty: DifficultyLevel;         // 难度等级
  duration: number;                    // 预计时长（分钟）
  sections: LessonSection[];           // 课程章节
  prerequisites?: string[];            // 前置课程 ID
  order: number;                       // 课程顺序
}
