import type { ClockTime, DifficultyLevel, Question, QuestionType } from '@/types';
import { DIFFICULTY_CONFIG } from '@/constants';
import { ClockTimeUtils } from './time';

/**
 * 生成随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 从数组中随机选择一个元素
 */
export function randomChoice<T>(array: readonly T[] | T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * 打乱数组顺序
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 根据难度生成随机时间
 */
export function generateRandomTime(difficulty: DifficultyLevel): ClockTime {
  const config = DIFFICULTY_CONFIG[difficulty];
  
  const hours = randomInt(0, 23);
  const minutes = randomChoice(config.allowedMinutes);
  const seconds = config.includeSeconds ? randomInt(0, 59) : 0;
  
  return { hours, minutes, seconds };
}

/**
 * 生成错误选项
 */
export function generateWrongOptions(correctTime: ClockTime, count: number = 3): ClockTime[] {
  const options: ClockTime[] = [];
  const usedOffsets = new Set<string>();
  
  while (options.length < count) {
    // 生成随机偏移（±1-5小时或±5-55分钟）
    const offsetType = Math.random() > 0.5 ? 'hours' : 'minutes';
    let offset: number;
    
    if (offsetType === 'hours') {
      offset = randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    } else {
      offset = randomChoice([5, 10, 15, 20, 30, 45, 50, 55]) * (Math.random() > 0.5 ? 1 : -1);
    }
    
    const offsetKey = offsetType === 'hours' ? `h${offset}` : `m${offset}`;
    if (usedOffsets.has(offsetKey)) continue;
    usedOffsets.add(offsetKey);
    
    let wrongTime: ClockTime;
    if (offsetType === 'hours') {
      wrongTime = ClockTimeUtils.addHours(correctTime, offset);
    } else {
      wrongTime = ClockTimeUtils.addMinutes(correctTime, offset);
    }
    
    // 确保错误选项与正确答案不同
    if (!ClockTimeUtils.isEqual(wrongTime, correctTime)) {
      options.push(wrongTime);
    }
  }
  
  return options;
}

/**
 * 题目生成器
 */
export class QuestionGenerator {
  /**
   * 生成单个题目
   */
  static generate(type: QuestionType, difficulty: DifficultyLevel): Question {
    const time = generateRandomTime(difficulty);
    const id = generateId();
    
    const question: Question = {
      id,
      type,
      difficulty,
      time,
      createdAt: Date.now(),
    };
    
    // 选择题需要生成选项
    if (type !== 'manual-input') {
      const wrongOptions = generateWrongOptions(time, 3);
      const allOptions = shuffle([time, ...wrongOptions]);
      question.options = allOptions;
    }
    
    // 生成提示
    question.hint = this.generateHint(time);
    question.explanation = this.generateExplanation(time);
    
    return question;
  }
  
  /**
   * 批量生成题目
   */
  static generateBatch(type: QuestionType, difficulty: DifficultyLevel, count: number): Question[] {
    const config = DIFFICULTY_CONFIG[difficulty];
    const questionCount = count || config.questionCount;
    
    const questions: Question[] = [];
    for (let i = 0; i < questionCount; i++) {
      // 随机选择题目类型
      const questionType = type === 'manual-input' ? 'manual-input' : randomChoice(['analog-to-digital', 'digital-to-analog'] as QuestionType[]);
      questions.push(this.generate(questionType, difficulty));
    }
    
    return questions;
  }
  
  /**
   * 生成提示
   */
  static generateHint(time: ClockTime): string {
    const { hours, minutes } = ClockTimeUtils.to12Hour(time);
    
    if (minutes === 0) {
      return `整点时间，看看时针指向哪里？`;
    } else if (minutes === 30) {
      return `半点时间，分针指向 6`;
    } else if (minutes === 15) {
      return `一刻钟，分针指向 3`;
    } else if (minutes === 45) {
      return `差一刻到下一个整点，分针指向 9`;
    }
    
    return `时针过了 ${hours > 12 ? hours - 12 : hours}，分针指向 ${minutes}`;
  }
  
  /**
   * 生成答案解析
   */
  static generateExplanation(time: ClockTime): string {
    const formatted = ClockTimeUtils.format(time, '12h');
    const { hours, minutes } = ClockTimeUtils.to12Hour(time);
    
    let explanation = `正确答案是 ${formatted}。\n`;
    explanation += `时针（短针）过了 ${hours} 的位置`;
    
    if (minutes > 0) {
      explanation += `，分针（长针）指向 ${minutes}`;
    }
    
    explanation += `。`;
    
    return explanation;
  }
}
