import type { ClockTime } from '@/types';

/**
 * 时钟时间工具类
 */
export class ClockTimeUtils {
  /**
   * 验证时间是否有效
   */
  static isValid(time: ClockTime): boolean {
    return (
      time.hours >= 0 &&
      time.hours < 24 &&
      time.minutes >= 0 &&
      time.minutes < 60 &&
      time.seconds >= 0 &&
      time.seconds < 60
    );
  }

  /**
   * 转换为 12 小时制
   */
  static to12Hour(time: ClockTime): { hours: number; minutes: number; seconds: number } {
    const hours = time.hours % 12 || 12;
    return { hours, minutes: time.minutes, seconds: time.seconds };
  }

  /**
   * 格式化为字符串
   */
  static format(time: ClockTime, format: '12h' | '24h' = '24h'): string {
    if (format === '12h') {
      const { hours, minutes } = this.to12Hour(time);
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
  }

  /**
   * 格式化为完整字符串（包含秒）
   */
  static formatFull(time: ClockTime, format: '12h' | '24h' = '24h'): string {
    if (format === '12h') {
      const { hours, minutes, seconds } = this.to12Hour(time);
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  }

  /**
   * 计算两个时间的差异（分钟）
   */
  static difference(a: ClockTime, b: ClockTime): number {
    const aMinutes = a.hours * 60 + a.minutes;
    const bMinutes = b.hours * 60 + b.minutes;
    return Math.abs(aMinutes - bMinutes);
  }

  /**
   * 时间比较
   * @returns -1 if a < b, 0 if a === b, 1 if a > b
   */
  static compare(a: ClockTime, b: ClockTime): -1 | 0 | 1 {
    const aTotal = a.hours * 3600 + a.minutes * 60 + a.seconds;
    const bTotal = b.hours * 3600 + b.minutes * 60 + b.seconds;
    
    if (aTotal < bTotal) return -1;
    if (aTotal > bTotal) return 1;
    return 0;
  }

  /**
   * 检查两个时间是否相等
   */
  static isEqual(a: ClockTime, b: ClockTime): boolean {
    return a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds;
  }

  /**
   * 获取当前时间
   */
  static now(): ClockTime {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  }

  /**
   * 创建时间对象
   */
  static create(hours: number = 0, minutes: number = 0, seconds: number = 0): ClockTime {
    return { hours, minutes, seconds };
  }

  /**
   * 复制时间对象
   */
  static clone(time: ClockTime): ClockTime {
    return { ...time };
  }

  /**
   * 获取时针角度（12小时制）
   */
  static getHourAngle(time: ClockTime): number {
    const hours = time.hours % 12;
    return (hours * 30) + (time.minutes * 0.5); // 30 degrees per hour + minute offset
  }

  /**
   * 获取分针角度
   */
  static getMinuteAngle(time: ClockTime): number {
    return time.minutes * 6; // 6 degrees per minute
  }

  /**
   * 获取秒针角度
   */
  static getSecondAngle(time: ClockTime): number {
    return time.seconds * 6; // 6 degrees per second
  }

  /**
   * 从角度计算时间（用于拖拽交互）
   */
  static fromAngle(angle: number, isHour: boolean): number {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    if (isHour) {
      return Math.round(normalizedAngle / 30) % 12 || 12;
    }
    return Math.round(normalizedAngle / 6) % 60;
  }

  /**
   * 添加分钟
   */
  static addMinutes(time: ClockTime, minutes: number): ClockTime {
    let totalMinutes = time.hours * 60 + time.minutes + minutes;
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440; // 确保在 0-1439 范围内
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      seconds: time.seconds,
    };
  }

  /**
   * 添加小时
   */
  static addHours(time: ClockTime, hours: number): ClockTime {
    let newHours = (time.hours + hours) % 24;
    if (newHours < 0) newHours += 24;
    
    return {
      hours: newHours,
      minutes: time.minutes,
      seconds: time.seconds,
    };
  }
}
