import { useState, useEffect, useCallback, useRef } from 'react';
import type { ClockTime } from '@/types';

interface UseClockOptions {
  /**
   * 是否自动运行（实时时间）
   */
  autoRun?: boolean;
  
  /**
   * 初始时间
   */
  initialTime?: ClockTime;
  
  /**
   * 时间变化回调
   */
  onChange?: (time: ClockTime) => void;
  
  /**
   * 是否包含秒针
   */
  includeSeconds?: boolean;
}

/**
 * 时钟状态管理 Hook
 */
export function useClock(options: UseClockOptions = {}) {
  const {
    autoRun = false,
    initialTime = { hours: 0, minutes: 0, seconds: 0 },
    onChange,
    includeSeconds = true,
  } = options;

  const [time, setTime] = useState<ClockTime>(initialTime);
  const [isRunning, setIsRunning] = useState(autoRun);
  const intervalRef = useRef<number | null>(null);

  // 更新时间
  const updateTime = useCallback((newTime: ClockTime) => {
    setTime(newTime);
    onChange?.(newTime);
  }, [onChange]);

  // 设置时间（手动）
  const setManualTime = useCallback((newTime: Partial<ClockTime>) => {
    setTime(prev => {
      const updated = { ...prev, ...newTime };
      onChange?.(updated);
      return updated;
    });
  }, [onChange]);

  // 获取当前实时时间
  const getCurrentTime = useCallback((): ClockTime => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  }, []);

  // 开始运行（实时时间）
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // 停止运行
  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 重置时间
  const reset = useCallback(() => {
    setTime(initialTime);
    onChange?.(initialTime);
  }, [initialTime, onChange]);

  // 设置为当前时间
  const setToCurrent = useCallback(() => {
    const current = getCurrentTime();
    updateTime(current);
  }, [getCurrentTime, updateTime]);

  // 自动运行效果
  useEffect(() => {
    if (isRunning) {
      // 立即更新一次
      const current = getCurrentTime();
      updateTime(current);

      // 设置定时器
      intervalRef.current = window.setInterval(() => {
        const current = getCurrentTime();
        updateTime(current);
      }, includeSeconds ? 1000 : 60000); // 秒针：1秒，无秒针：1分钟

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, getCurrentTime, updateTime, includeSeconds]);

  // 清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    time,
    isRunning,
    setTime: setManualTime,
    start,
    stop,
    reset,
    setToCurrent,
  };
}
