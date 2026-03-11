import { STORAGE_KEYS } from '@/constants';

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  /**
   * 清空所有存储项
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};

/**
 * 获取主题设置
 */
export function getStoredTheme(): 'light' | 'dark' | 'eyecare' {
  return storage.get(STORAGE_KEYS.THEME, 'light');
}

/**
 * 保存主题设置
 */
export function setStoredTheme(theme: 'light' | 'dark' | 'eyecare'): void {
  storage.set(STORAGE_KEYS.THEME, theme);
}

/**
 * 获取音效设置
 */
export function getStoredSoundEnabled(): boolean {
  return storage.get(STORAGE_KEYS.SOUND_ENABLED, true);
}

/**
 * 保存音效设置
 */
export function setStoredSoundEnabled(enabled: boolean): void {
  storage.set(STORAGE_KEYS.SOUND_ENABLED, enabled);
}

/**
 * 获取音乐设置
 */
export function getStoredMusicEnabled(): boolean {
  return storage.get(STORAGE_KEYS.MUSIC_ENABLED, true);
}

/**
 * 保存音乐设置
 */
export function setStoredMusicEnabled(enabled: boolean): void {
  storage.set(STORAGE_KEYS.MUSIC_ENABLED, enabled);
}

/**
 * 获取音量设置
 */
export function getStoredVolume(): number {
  return storage.get(STORAGE_KEYS.VOLUME, 70);
}

/**
 * 保存音量设置
 */
export function setStoredVolume(volume: number): void {
  storage.set(STORAGE_KEYS.VOLUME, volume);
}

/**
 * 获取难度设置
 */
export function getStoredDifficulty(): 'beginner' | 'junior' | 'intermediate' | 'advanced' {
  return storage.get(STORAGE_KEYS.DIFFICULTY, 'beginner');
}

/**
 * 保存难度设置
 */
export function setStoredDifficulty(difficulty: 'beginner' | 'junior' | 'intermediate' | 'advanced'): void {
  storage.set(STORAGE_KEYS.DIFFICULTY, difficulty);
}

/**
 * 检查是否完成引导
 */
export function isOnboardingCompleted(): boolean {
  return storage.get(STORAGE_KEYS.ONBOARDING_COMPLETED, false);
}

/**
 * 设置引导完成状态
 */
export function setOnboardingCompleted(completed: boolean): void {
  storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
}

/**
 * 获取最后活跃时间
 */
export function getLastActiveTime(): number {
  return storage.get(STORAGE_KEYS.LAST_ACTIVE, Date.now());
}

/**
 * 更新最后活跃时间
 */
export function updateLastActiveTime(): void {
  storage.set(STORAGE_KEYS.LAST_ACTIVE, Date.now());
}
