import { useCallback, useEffect, useRef } from 'react';
import type { ClockTime } from '@/types';
import { ClockTimeUtils } from '@/utils';
import { COLORS } from '@/constants';

interface AnalogClockProps {
  time: ClockTime;
  size?: number;
  draggable?: boolean;
  /**
   * 限制可拖拽的指针（仅在 draggable=true 时生效）
   */
  draggableHands?: { hour?: boolean; minute?: boolean };
  /**
   * 高亮某根指针（教程演示用）
   */
  highlightHand?: 'hour' | 'minute' | 'second' | null;
  /**
   * 教程演示用：当某根指针被高亮介绍时，是否把其它指针弱化
   */
  focusOnHighlightedHand?: boolean;
  showNumbers?: boolean;
  showMinuteMarks?: boolean;
  animated?: boolean;
  onTimeChange?: (time: ClockTime) => void;
}

export function AnalogClock({
  time,
  size = 300,
  draggable = false,
  draggableHands,
  highlightHand = null,
  focusOnHighlightedHand = false,
  showNumbers = true,
  showMinuteMarks = true,
  animated = true,
  onTimeChange,
}: AnalogClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hourHandRef = useRef<SVGLineElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);
  const secondHandRef = useRef<SVGLineElement>(null);
  const timeRef = useRef<ClockTime>(time);
  
  // 拖拽状态
  const isDraggingRef = useRef(false);
  const dragTargetRef = useRef<'hour' | 'minute' | null>(null);
  const startAngleRef = useRef(0);
  const initialHandAngleRef = useRef(0);
  
  // 当前指针角度（用于非拖拽状态下的动画）
  const handAnglesRef = useRef({ hour: 0, minute: 0, second: 0 });

  const center = size / 2;
  const radius = size / 2 - 10;

  // 计算角度：从中心点到指定点的角度（以12点方向为0度，顺时针为正）
  const getAngleFromCenter = useCallback(
    (clientX: number, clientY: number): number => {
      if (!svgRef.current) return 0;

      const rect = svgRef.current.getBoundingClientRect();
      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const dx = clientX - svgCenterX;
      const dy = clientY - svgCenterY;

      // 计算角度（以12点方向为0度，顺时针为正）
      let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      return angle;
    },
    []
  );

  // 磁吸函数：将角度吸附到最近的刻度
  const snapAngle = useCallback((angle: number, step: number): number => {
    const normalized = ((angle % 360) + 360) % 360;
    return Math.round(normalized / step) * step;
  }, []);

  // 设置指针旋转角度（使用 CSS transform）
  const setHandRotation = useCallback((hand: 'hour' | 'minute' | 'second', angle: number) => {
    const ref = hand === 'hour' ? hourHandRef : hand === 'minute' ? minuteHandRef : secondHandRef;
    if (ref.current) {
      // 使用 CSS transform，设置 transform-origin 为时钟中心
      ref.current.style.transformOrigin = `${center}px ${center}px`;
      ref.current.style.transform = `rotate(${angle}deg)`;
    }
    handAnglesRef.current[hand] = angle;
  }, [center]);

  // 获取当前指针角度
  const getHandRotation = useCallback((hand: 'hour' | 'minute' | 'second'): number => {
    return handAnglesRef.current[hand] || 0;
  }, []);

  // 更新指针位置
  const updateHands = useCallback(
    (newTime: ClockTime, animate: boolean = animated) => {
      // 拖拽中不更新
      if (isDraggingRef.current) return;

      let hourAngle = ClockTimeUtils.getHourAngle(newTime);
      let minuteAngle = ClockTimeUtils.getMinuteAngle(newTime);
      let secondAngle = ClockTimeUtils.getSecondAngle(newTime);

      // 处理角度跳变
      const lastAngles = handAnglesRef.current;
      if (lastAngles.second > 300 && secondAngle < 60) secondAngle += 360;
      if (lastAngles.minute > 300 && minuteAngle < 60) minuteAngle += 360;
      if (lastAngles.hour > 300 && hourAngle < 60) hourAngle += 360;

      // 使用 CSS transition 实现动画
      const transition = animate ? 'transform 0.3s ease-out' : 'none';
      
      if (hourHandRef.current) {
        hourHandRef.current.style.transition = transition;
        setHandRotation('hour', hourAngle % 360);
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transition = transition;
        setHandRotation('minute', minuteAngle % 360);
      }
      if (secondHandRef.current) {
        secondHandRef.current.style.transition = transition;
        setHandRotation('second', secondAngle % 360);
      }
    },
    [animated, setHandRotation]
  );

  // 时间变化时更新指针
  useEffect(() => {
    timeRef.current = time;
    updateHands(time);
  }, [time, updateHands]);

  // 设置拖拽功能
  useEffect(() => {
    if (!draggable) return;

    const allowHour = draggableHands?.hour ?? true;
    const allowMinute = draggableHands?.minute ?? true;

    // 磁吸步长
    const hourStep = 30; // 时针：每30度（1小时）
    const minuteStep = 6; // 分针：每6度（1分钟）

    // 指针按下
    const handlePointerDown = (e: PointerEvent, target: 'hour' | 'minute') => {
      e.preventDefault();
      e.stopPropagation();

      isDraggingRef.current = true;
      dragTargetRef.current = target;

      // 记录鼠标起始角度
      const mouseAngle = getAngleFromCenter(e.clientX, e.clientY);
      startAngleRef.current = mouseAngle;

      // 记录指针当前角度
      initialHandAngleRef.current = getHandRotation(target);

      // 添加拖拽样式
      const handRef = target === 'hour' ? hourHandRef : minuteHandRef;
      if (handRef.current) {
        handRef.current.style.transition = 'none'; // 禁用动画
        handRef.current.classList.add('dragging');
      }

      // 震动反馈
      if ('vibrate' in navigator) navigator.vibrate(10);

      // 捕获指针
      (e.target as Element).setPointerCapture(e.pointerId);
    };

    // 指针移动
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragTargetRef.current) return;

      e.preventDefault();

      const target = dragTargetRef.current;
      const newMouseAngle = getAngleFromCenter(e.clientX, e.clientY);

      // 计算鼠标角度变化
      let deltaAngle = newMouseAngle - startAngleRef.current;

      // 处理跨越0度的情况
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      // 计算新的指针角度
      let newHandAngle = initialHandAngleRef.current + deltaAngle;
      newHandAngle = ((newHandAngle % 360) + 360) % 360;

      // 实时磁吸：拖拽过程中就吸附到刻度
      const step = target === 'hour' ? hourStep : minuteStep;
      const snappedAngle = snapAngle(newHandAngle, step);

      // 设置指针角度（吸附后的角度）
      setHandRotation(target, snappedAngle);

      // 更新时间
      const value = ClockTimeUtils.fromAngle(snappedAngle, target === 'hour');
      const newTime = { ...timeRef.current };
      if (target === 'hour') {
        newTime.hours = value === 12 ? 0 : value;
        // 时针吸附到整点时，重置分钟为 0，实现真正的"整点吸附"
        newTime.minutes = 0;
        newTime.seconds = 0;
      } else {
        newTime.minutes = value;
        newTime.seconds = 0;
      }
      timeRef.current = newTime;
      onTimeChange?.(newTime);
    };

    // 指针抬起
    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragTargetRef.current) return;

      const target = dragTargetRef.current;
      const handRef = target === 'hour' ? hourHandRef : minuteHandRef;

      // 移除拖拽样式，添加吸附动画
      if (handRef.current) {
        handRef.current.classList.remove('dragging');
        handRef.current.classList.add('snapping');
        setTimeout(() => {
          if (handRef.current) {
            handRef.current.classList.remove('snapping');
          }
        }, 150);
      }

      // 震动反馈（磁吸时震动）
      if ('vibrate' in navigator) navigator.vibrate([5, 30, 5]);

      // 重置状态
      isDraggingRef.current = false;
      dragTargetRef.current = null;
      startAngleRef.current = 0;
      initialHandAngleRef.current = 0;

      // 释放指针捕获
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // 忽略错误
      }
    };

    // 全局鼠标抬起
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        // 清理样式
        if (hourHandRef.current) {
          hourHandRef.current.classList.remove('dragging');
        }
        if (minuteHandRef.current) {
          minuteHandRef.current.classList.remove('dragging');
        }
        isDraggingRef.current = false;
        dragTargetRef.current = null;
      }
    };

    // 添加事件监听
    const handlers: Array<{ element: Element; event: string; handler: EventListener }> = [];

    if (allowHour && hourHandRef.current) {
      const handler = (e: Event) => handlePointerDown(e as PointerEvent, 'hour');
      hourHandRef.current.addEventListener('pointerdown', handler);
      handlers.push({ element: hourHandRef.current, event: 'pointerdown', handler });
      hourHandRef.current.style.cursor = 'grab';
      hourHandRef.current.style.touchAction = 'none';
    }

    if (allowMinute && minuteHandRef.current) {
      const handler = (e: Event) => handlePointerDown(e as PointerEvent, 'minute');
      minuteHandRef.current.addEventListener('pointerdown', handler);
      handlers.push({ element: minuteHandRef.current, event: 'pointerdown', handler });
      minuteHandRef.current.style.cursor = 'grab';
      minuteHandRef.current.style.touchAction = 'none';
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      handlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [draggable, draggableHands, getAngleFromCenter, snapAngle, getHandRotation, setHandRotation, onTimeChange]);

  // 生成小时刻度和数字
  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = center + (radius - 15) * Math.cos(angle);
    const y1 = center + (radius - 15) * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);

    return { x1, y1, x2, y2, hour: i === 0 ? 12 : i };
  });

  // 生成分钟刻度
  const minuteMarks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const x1 = center + (radius - 8) * Math.cos(angle);
    const y1 = center + (radius - 8) * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);

    return { x1, y1, x2, y2 };
  }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[];

  // 生成小时数字位置
  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = center + (radius - 35) * Math.cos(angle);
    const y = center + (radius - 35) * Math.sin(angle);

    return { x, y, hour };
  });

  // 指针长度
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.85;

  // 弱化其它指针
  const shouldFocus = focusOnHighlightedHand && highlightHand != null;
  const handOpacity = (hand: 'hour' | 'minute' | 'second') =>
    shouldFocus && highlightHand !== hand ? 0.2 : 1;

  return (
    <div className="flex justify-center items-center">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
        role="img"
        aria-label={`模拟时钟，当前时间 ${ClockTimeUtils.format(time, '12h')}`}
      >
        {/* CSS样式定义 */}
        <style>{`
          .hour-hand, .minute-hand, .second-hand {
            will-change: transform;
          }
          
          .dragging {
            stroke-width: 14 !important;
            filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
          }

          .snapping {
            stroke-width: 16 !important;
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.7));
            transition: stroke-width 0.1s ease, filter 0.1s ease;
          }
        `}</style>

        {/* 渐变定义 */}
        <defs>
          <radialGradient id="clockGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor={COLORS.PRIMARY} stopOpacity={0.2} />
            <stop offset="100%" stopColor={COLORS.PRIMARY} stopOpacity={0.8} />
          </radialGradient>

          <radialGradient id="clockFaceGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="#f8f9fa" />
          </radialGradient>

          <filter id="clockShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外圈装饰 */}
        <circle
          cx={center}
          cy={center}
          r={radius + 5}
          fill="none"
          stroke="url(#clockGradient)"
          strokeWidth={3}
          opacity={0.5}
        />

        {/* 表盘背景 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="url(#clockFaceGradient)"
          stroke={COLORS.CLOCK_BORDER}
          strokeWidth={10}
          filter="url(#clockShadow)"
        />

        {/* 内圈装饰 */}
        <circle
          cx={center}
          cy={center}
          r={radius - 20}
          fill="none"
          stroke={COLORS.PRIMARY}
          strokeWidth={1}
          opacity={0.15}
        />

        {/* 分钟刻度 */}
        {showMinuteMarks &&
          minuteMarks.map((mark, i) => (
            <line
              key={`minute-${i}`}
              x1={mark.x1}
              y1={mark.y1}
              x2={mark.x2}
              y2={mark.y2}
              stroke={COLORS.TEXT_SECONDARY}
              strokeWidth={1.5}
              opacity={0.4}
              strokeLinecap="round"
            />
          ))}

        {/* 小时刻度 */}
        {hourMarks.map((mark, i) => (
          <g key={`hour-${i}`}>
            <line
              x1={mark.x1}
              y1={mark.y1}
              x2={mark.x2}
              y2={mark.y2}
              stroke={COLORS.TEXT_PRIMARY}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.8}
            />
            <circle cx={mark.x2} cy={mark.y2} r={2.5} fill={COLORS.PRIMARY} opacity={0.6} />
          </g>
        ))}

        {/* 小时数字 */}
        {showNumbers &&
          hourNumbers.map((num, i) => (
            <text
              key={`num-${i}`}
              x={num.x}
              y={num.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display"
              fill={COLORS.TEXT_PRIMARY}
              style={{
                fontSize: size / 12,
                fontWeight: num.hour % 3 === 0 ? 'bold' : 'normal',
              }}
            >
              {num.hour}
            </text>
          ))}

        {/* 时针 - 直接使用 line 元素，设置更大的点击区域 */}
        <line
          ref={hourHandRef}
          className={`hour-hand ${draggable && (draggableHands?.hour ?? true) ? 'cursor-grab' : ''}`}
          x1={center}
          y1={center}
          x2={center}
          y2={center - hourHandLength}
          stroke={COLORS.HOUR_HAND}
          strokeWidth={draggable && (draggableHands?.hour ?? true) ? 12 : 10}
          strokeLinecap="round"
          opacity={handOpacity('hour')}
          style={{ 
            pointerEvents: draggable && (draggableHands?.hour ?? true) ? 'all' : 'none'
          }}
        />

        {/* 分针 */}
        <line
          ref={minuteHandRef}
          className={`minute-hand ${draggable && (draggableHands?.minute ?? true) ? 'cursor-grab' : ''}`}
          x1={center}
          y1={center}
          x2={center}
          y2={center - minuteHandLength}
          stroke={COLORS.MINUTE_HAND}
          strokeWidth={draggable && (draggableHands?.minute ?? true) ? 8 : 6}
          strokeLinecap="round"
          opacity={handOpacity('minute')}
          style={{ 
            pointerEvents: draggable && (draggableHands?.minute ?? true) ? 'all' : 'none'
          }}
        />

        {/* 秒针 */}
        <line
          ref={secondHandRef}
          className="second-hand"
          x1={center}
          y1={center + 15}
          x2={center}
          y2={center - secondHandLength}
          stroke={COLORS.SECOND_HAND}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={handOpacity('second')}
        />

        {/* 中心装饰点 */}
        <circle cx={center} cy={center} r={8} fill={COLORS.HOUR_HAND} />
        <circle cx={center} cy={center} r={4} fill={COLORS.SECOND_HAND} />
        <circle cx={center} cy={center} r={2} fill="white" />
      </svg>
    </div>
  );
}
