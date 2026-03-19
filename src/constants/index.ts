/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lessons/:lessonId',
  LEARN_TIME: '/learn-time',
  ANALOG_CLOCK: '/analog-clock',
  DIGITAL_CLOCK: '/digital-clock',
  PRACTICE: '/practice',
  WRONG_QUESTIONS: '/wrong-questions',
  PARENT_SUMMARY: '/parent-summary',
  SETTINGS: '/settings',
} as const;

/**
 * 难度等级配置
 */
export const DIFFICULTY_CONFIG = {
  beginner: {
    name: '入门',
    icon: '🌱',
    description: '我刚开始学习认识时间',
    questionCount: 3,
    allowedMinutes: [0], // 整点
    includeSeconds: false,
  },
  junior: {
    name: '初级',
    icon: '🌿',
    description: '我已经认识整点和半点',
    questionCount: 5,
    allowedMinutes: [0, 30], // 整点和半点
    includeSeconds: false,
  },
  intermediate: {
    name: '中级',
    icon: '🌳',
    description: '我能读取大部分时间',
    questionCount: 7,
    allowedMinutes: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
    includeSeconds: false,
  },
  advanced: {
    name: '高级',
    icon: '🏆',
    description: '我想挑战更难的内容',
    questionCount: 10,
    allowedMinutes: Array.from({ length: 60 }, (_, i) => i), // 所有分钟
    includeSeconds: true,
  },
} as const;

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  light: {
    name: '明亮主题',
    icon: '☀️',
  },
  dark: {
    name: '暗黑主题',
    icon: '🌙',
  },
  eyecare: {
    name: '护眼主题',
    icon: '👓',
  },
} as const;

/**
 * 音效 ID
 */
export const SOUND_IDS = {
  // 交互音效
  BUTTON_CLICK: 'button-click',
  BUTTON_HOVER: 'button-hover',
  SUCCESS: 'success',
  ERROR: 'error',
  COMPLETE: 'complete',
  
  // 教学音效
  TICK_TOCK: 'tick-tock',
  CLOCK_CHIME: 'clock-chime',
  ENCOURAGE: 'encourage',
  
  // 背景音乐
  LEARNING: 'learning',
  PRACTICE: 'practice',
} as const;

/**
 * 颜色常量
 */
export const COLORS = {
  PRIMARY: '#6366F1',
  PRIMARY_LIGHT: '#818CF8',
  PRIMARY_DARK: '#4F46E5',
  
  SECONDARY: '#F59E0B',
  ACCENT: '#10B981',
  ERROR: '#EF4444',
  
  // 时钟指针颜色
  HOUR_HAND: '#1F2937',
  MINUTE_HAND: '#6366F1',
  SECOND_HAND: '#EF4444',
  CLOCK_FACE: '#FFFFFF',
  CLOCK_BORDER: '#E5E7EB',
  
  // 背景色
  BG_PRIMARY: '#F3F4F6',
  BG_SECONDARY: '#FFFFFF',
  BG_ACCENT: '#EEF2FF',
  
  // 文字颜色
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  TEXT_DISABLED: '#9CA3AF',
} as const;

/**
 * 动画时长（毫秒）
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

/**
 * 存储键
 */
export const STORAGE_KEYS = {
  THEME: 'clock-app-theme',
  SOUND_ENABLED: 'clock-app-sound',
  MUSIC_ENABLED: 'clock-app-music',
  VOLUME: 'clock-app-volume',
  DIFFICULTY: 'clock-app-difficulty',
  LAST_ACTIVE: 'clock-app-last-active',
  ONBOARDING_COMPLETED: 'clock-app-onboarding',
  ANIMATIONS_ENABLED: 'clock-app-animations',
} as const;

/**
 * 鼓励语
 */
export const ENCOURAGEMENTS = {
  correct: [
    '太棒了！🎉',
    '你真聪明！🌟',
    '回答正确！✨',
    '做得好！👏',
    '继续加油！💪',
  ],
  wrong: [
    '没关系，再试一次！',
    '别灰心，加油！',
    '再想想看哦～',
    '提示：仔细看看时针和分针的位置',
  ],
  complete: [
    '恭喜你完成了练习！🏆',
    '你太厉害了！🎉',
    '继续努力，你会更棒的！⭐',
  ],
} as const;

/**
 * 默认用户设置
 */
export const DEFAULT_USER_SETTINGS = {
  theme: 'light' as const,
  soundEnabled: true,
  musicEnabled: true,
  volume: 70,
  difficulty: 'beginner' as const,
  language: 'zh-CN' as const,
  animationsEnabled: true,
  autoAdvance: false,
  showTimer: true,
};

export { MVP_LESSONS, getLessonById } from './lessons';
