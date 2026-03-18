import { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ClockTime } from '@/types';
import { ClockTimeUtils } from '@/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DigitalClockProps {
  time: ClockTime;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  showSeconds?: boolean;
  format?: '12h' | '24h';
  onTimeChange?: (time: ClockTime) => void;
}

const sizeConfig = {
  sm: {
    container: 'text-xl',
    digit: 'w-8 h-10',
    separator: 'text-lg',
    button: 'w-8 h-6',
  },
  md: {
    container: 'text-2xl sm:text-3xl',
    digit: 'w-10 h-12 sm:w-12 sm:h-14',
    separator: 'text-xl sm:text-2xl',
    button: 'w-9 h-7 sm:w-10 sm:h-8',
  },
  lg: {
    container: 'text-3xl sm:text-5xl',
    digit: 'w-12 h-14 sm:w-16 sm:h-20',
    separator: 'text-2xl sm:text-4xl',
    button: 'w-10 h-8 sm:w-14 sm:h-10',
  },
};

export function DigitalClock({
  time,
  size = 'md',
  editable = false,
  showSeconds = false,
  format = '24h',
  onTimeChange,
}: DigitalClockProps) {
  const config = sizeConfig[size];
  
  const { hours: displayHours, minutes, seconds } = ClockTimeUtils.to12Hour(time);
  const hours = format === '12h' ? displayHours : time.hours;
  
  // 数字变化动画 - 移除动画，使用静态显示避免跳动
  const DigitDisplay = ({ value, padStart = 2 }: { value: number; padStart?: number }) => (
    <div className={`relative ${config.digit} bg-gradient-to-br from-base-200 to-base-300 rounded-xl 
      flex items-center justify-center overflow-hidden shadow-lg border-2 border-base-300`}>
      <span className="font-display text-base-content tabular-nums font-bold">
        {value.toString().padStart(padStart, '0')}
      </span>
      {/* 装饰性反光 */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent 
        pointer-events-none rounded-t-xl" />
    </div>
  );
  
  // 编辑模式下的数字调整
  const adjustValue = useCallback((type: 'hours' | 'minutes' | 'seconds', delta: number) => {
    if (!onTimeChange) return;
    
    let newTime = { ...time };
    
    if (type === 'hours') {
      let newHours = (time.hours + delta) % 24;
      if (newHours < 0) newHours = 23;
      newTime.hours = newHours;
    } else if (type === 'minutes') {
      let newMinutes = (time.minutes + delta) % 60;
      if (newMinutes < 0) newMinutes = 59;
      newTime.minutes = newMinutes;
    } else if (type === 'seconds') {
      let newSeconds = (time.seconds + delta) % 60;
      if (newSeconds < 0) newSeconds = 59;
      newTime.seconds = newSeconds;
    }
    
    onTimeChange(newTime);
  }, [time, onTimeChange]);
  
  // 可编辑数字组件
  const EditableDigit = ({ 
    type, 
    value, 
    padStart = 2 
  }: { 
    type: 'hours' | 'minutes' | 'seconds'; 
    value: number;
    padStart?: number;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => adjustValue(type, 1)}
        className={`${config.button} btn btn-ghost btn-sm`}
        aria-label={`增加${type === 'hours' ? '小时' : type === 'minutes' ? '分钟' : '秒'}`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      
      <DigitDisplay value={value} padStart={padStart} />
      
      <button
        onClick={() => adjustValue(type, -1)}
        className={`${config.button} btn btn-ghost btn-sm`}
        aria-label={`减少${type === 'hours' ? '小时' : type === 'minutes' ? '分钟' : '秒'}`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
  
  // 冒号分隔符
  const Separator = () => (
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className={`font-display text-primary ${config.separator}`}
    >
      :
    </motion.span>
  );
  
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4">
      <div className={`inline-flex items-center gap-1.5 sm:gap-2 ${config.container}`}>
        {editable ? (
          <>
            <EditableDigit type="hours" value={hours} />
            <Separator />
            <EditableDigit type="minutes" value={minutes} />
            {showSeconds && (
              <>
                <Separator />
                <EditableDigit type="seconds" value={seconds} />
              </>
            )}
          </>
        ) : (
          <>
            <DigitDisplay value={hours} />
            <Separator />
            <DigitDisplay value={minutes} />
            {showSeconds && (
              <>
                <Separator />
                <DigitDisplay value={seconds} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
