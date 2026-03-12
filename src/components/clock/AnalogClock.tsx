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
  const hourHandGroupRef = useRef<SVGGElement>(null);
  const minuteHandGroupRef = useRef<SVGGElement>(null);
  const secondHandRef = useRef<SVGLineElement>(null);
  const timeRef = useRef<ClockTime>(time);
  
  // 拖拽状态
  const isDraggingRef = useRef(false);
  const dragTargetRef = useRef<'hour' | 'minute' | null>(null);
  const startAngleRef = useRef(0);
  const initialHandAngleRef = useRef(0);
  
  // 当前指针角度
  const handAnglesRef = useRef({ hour: 0, minute: 0, second: 0 });

  const center = size / 2;
  const radius = size / 2 - 10;

  // 计算角度
  const getAngleFromCenter = useCallback(
    (clientX: number, clientY: number): number => {
      if (!svgRef.current) return 0;

      const rect = svgRef.current.getBoundingClientRect();
      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const dx = clientX - svgCenterX;
      const dy = clientY - svgCenterY;

      let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      return angle;
    },
    []
  );

  // 磁吸函数
  const snapAngle = useCallback((angle: number, step: number): number => {
    const normalized = ((angle % 360) + 360) % 360;
    return Math.round(normalized / step) * step;
  }, []);

  // 设置指针旋转角度
  const setHandRotation = useCallback((hand: 'hour' | 'minute' | 'second', angle: number) => {
    const ref = hand === 'hour' ? hourHandGroupRef : hand === 'minute' ? minuteHandGroupRef : secondHandRef;
    if (ref.current) {
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
      if (isDraggingRef.current) return;

      let hourAngle = ClockTimeUtils.getHourAngle(newTime);
      let minuteAngle = ClockTimeUtils.getMinuteAngle(newTime);
      let secondAngle = ClockTimeUtils.getSecondAngle(newTime);

      const lastAngles = handAnglesRef.current;
      if (lastAngles.second > 300 && secondAngle < 60) secondAngle += 360;
      if (lastAngles.minute > 300 && minuteAngle < 60) minuteAngle += 360;
      if (lastAngles.hour > 300 && hourAngle < 60) hourAngle += 360;

      const transition = animate ? 'transform 0.3s ease-out' : 'none';
      
      if (hourHandGroupRef.current) {
        hourHandGroupRef.current.style.transition = transition;
        setHandRotation('hour', hourAngle % 360);
      }
      if (minuteHandGroupRef.current) {
        minuteHandGroupRef.current.style.transition = transition;
        setHandRotation('minute', minuteAngle % 360);
      }
      if (secondHandRef.current) {
        secondHandRef.current.style.transition = transition;
        setHandRotation('second', secondAngle % 360);
      }
    },
    [animated, setHandRotation]
  );

  useEffect(() => {
    timeRef.current = time;
    updateHands(time);
  }, [time, updateHands]);

  // 设置拖拽功能
  useEffect(() => {
    if (!draggable) return;

    const allowHour = draggableHands?.hour ?? true;
    const allowMinute = draggableHands?.minute ?? true;

    const hourStep = 30;
    const minuteStep = 6;

    const handlePointerDown = (e: PointerEvent, target: 'hour' | 'minute') => {
      e.preventDefault();
      e.stopPropagation();

      isDraggingRef.current = true;
      dragTargetRef.current = target;

      const mouseAngle = getAngleFromCenter(e.clientX, e.clientY);
      startAngleRef.current = mouseAngle;
      initialHandAngleRef.current = getHandRotation(target);

      // 添加拖拽样式
      const groupRef = target === 'hour' ? hourHandGroupRef : minuteHandGroupRef;
      if (groupRef.current) {
        groupRef.current.style.transition = 'none';
        const line = groupRef.current.querySelector('line.hand-line');
        if (line) line.classList.add('dragging');
      }

      if ('vibrate' in navigator) navigator.vibrate(10);
      (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragTargetRef.current) return;

      e.preventDefault();

      const target = dragTargetRef.current;
      const newMouseAngle = getAngleFromCenter(e.clientX, e.clientY);

      let deltaAngle = newMouseAngle - startAngleRef.current;
      if (deltaAngle > 180) deltaAngle -= 360;
      if (deltaAngle < -180) deltaAngle += 360;

      let newHandAngle = initialHandAngleRef.current + deltaAngle;
      newHandAngle = ((newHandAngle % 360) + 360) % 360;

      const step = target === 'hour' ? hourStep : minuteStep;
      const snappedAngle = snapAngle(newHandAngle, step);

      setHandRotation(target, snappedAngle);

      const value = ClockTimeUtils.fromAngle(snappedAngle, target === 'hour');
      const newTime = { ...timeRef.current };
      if (target === 'hour') {
        newTime.hours = value === 12 ? 0 : value;
        newTime.minutes = 0;
        newTime.seconds = 0;
      } else {
        newTime.minutes = value;
        newTime.seconds = 0;
      }
      timeRef.current = newTime;
      onTimeChange?.(newTime);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current || !dragTargetRef.current) return;

      const target = dragTargetRef.current;
      const groupRef = target === 'hour' ? hourHandGroupRef : minuteHandGroupRef;

      if (groupRef.current) {
        const line = groupRef.current.querySelector('line.hand-line');
        if (line) {
          line.classList.remove('dragging');
          line.classList.add('snapping');
          setTimeout(() => {
            if (line) line.classList.remove('snapping');
          }, 150);
        }
      }

      if ('vibrate' in navigator) navigator.vibrate([5, 30, 5]);

      isDraggingRef.current = false;
      dragTargetRef.current = null;
      startAngleRef.current = 0;
      initialHandAngleRef.current = 0;

      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // 忽略
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        if (hourHandGroupRef.current) {
          const line = hourHandGroupRef.current.querySelector('line.hand-line');
          if (line) line.classList.remove('dragging');
        }
        if (minuteHandGroupRef.current) {
          const line = minuteHandGroupRef.current.querySelector('line.hand-line');
          if (line) line.classList.remove('dragging');
        }
        isDraggingRef.current = false;
        dragTargetRef.current = null;
      }
    };

    const handlers: Array<{ element: Element; event: string; handler: EventListener }> = [];

    // 为热区添加事件监听
    if (allowHour && hourHandGroupRef.current) {
      const hitArea = hourHandGroupRef.current.querySelector('.hand-hit-area');
      if (hitArea) {
        const handler = (e: Event) => handlePointerDown(e as PointerEvent, 'hour');
        hitArea.addEventListener('pointerdown', handler);
        handlers.push({ element: hitArea, event: 'pointerdown', handler });
      }
    }

    if (allowMinute && minuteHandGroupRef.current) {
      const hitArea = minuteHandGroupRef.current.querySelector('.hand-hit-area');
      if (hitArea) {
        const handler = (e: Event) => handlePointerDown(e as PointerEvent, 'minute');
        hitArea.addEventListener('pointerdown', handler);
        handlers.push({ element: hitArea, event: 'pointerdown', handler });
      }
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

  // 生成刻度和数字
  const hourMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = center + (radius - 15) * Math.cos(angle);
    const y1 = center + (radius - 15) * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return { x1, y1, x2, y2, hour: i === 0 ? 12 : i };
  });

  const minuteMarks = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const x1 = center + (radius - 8) * Math.cos(angle);
    const y1 = center + (radius - 8) * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return { x1, y1, x2, y2 };
  }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number }[];

  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = center + (radius - 35) * Math.cos(angle);
    const y = center + (radius - 35) * Math.sin(angle);
    return { x, y, hour };
  });

  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.85;

  const shouldFocus = focusOnHighlightedHand && highlightHand != null;
  const handOpacity = (hand: 'hour' | 'minute' | 'second') =>
    shouldFocus && highlightHand !== hand ? 0.2 : 1;

  // 触摸热区半径（手机上需要更大的触摸区域）
  const hitAreaRadius = Math.max(40, size / 7);

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
          .hand-line {
            will-change: transform;
          }
          
          .hand-hit-area {
            cursor: grab;
            fill: transparent;
            stroke: transparent;
            touch-action: none;
          }
          
          .hand-hit-area:active {
            cursor: grabbing;
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

        {/* 时针组 - 包含指针和触摸热区 */}
        <g ref={hourHandGroupRef} opacity={handOpacity('hour')}>
          {/* 指针本体 */}
          <line
            className="hand-line"
            x1={center}
            y1={center}
            x2={center}
            y2={center - hourHandLength}
            stroke={COLORS.HOUR_HAND}
            strokeWidth={10}
            strokeLinecap="round"
            style={{ pointerEvents: 'none' }}
          />
          {/* 触摸热区 - 大的透明圆形，覆盖指针区域 */}
          {draggable && (draggableHands?.hour ?? true) && (
            <circle
              className="hand-hit-area"
              cx={center}
              cy={center - hourHandLength / 2}
              r={hitAreaRadius}
              style={{ pointerEvents: 'all' }}
            />
          )}
        </g>

        {/* 分针组 */}
        <g ref={minuteHandGroupRef} opacity={handOpacity('minute')}>
          {/* 指针本体 */}
          <line
            className="hand-line"
            x1={center}
            y1={center}
            x2={center}
            y2={center - minuteHandLength}
            stroke={COLORS.MINUTE_HAND}
            strokeWidth={6}
            strokeLinecap="round"
            style={{ pointerEvents: 'none' }}
          />
          {/* 触摸热区 */}
          {draggable && (draggableHands?.minute ?? true) && (
            <circle
              className="hand-hit-area"
              cx={center}
              cy={center - minuteHandLength / 2}
              r={hitAreaRadius}
              style={{ pointerEvents: 'all' }}
            />
          )}
        </g>

        {/* 秒针 */}
        <line
          ref={secondHandRef}
          className="hand-line"
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
