import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, ArrowRight, Hand, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ClockTime } from '@/types';
import { AnalogClock } from '@/components/clock/AnalogClock';
import { miniCelebration } from '@/utils';
import { useAudio } from '@/hooks';

type TutorialMode = 'idle' | 'demo' | 'interactive' | 'done';

type DemoStep =
  | 'intro'
  | 'hour'
  | 'minute'
  | 'second'
  | 'marks'
  | 'demoDone';

type InteractiveStep = 'hourTo3' | 'minuteTo30' | 'mixTo330' | 'interactiveDone';

export interface AnalogClockTutorialProps {
  /** 教程占用的时间状态（通常来自外层的 userTimeInput） */
  value: ClockTime;
  /** 更新外层时间 */
  onChange: (time: ClockTime) => void;
  /** 时钟尺寸 */
  clockSize?: number;
  /** 是否默认自动弹出教程 */
  autoStart?: boolean;
  /** 教程完成回调 */
  onFinish?: () => void;
  /** 教程完成后是否继续显示“答题用”的可拖时钟 */
  showPracticeClockAfterDone?: boolean;
}

function isSameTime(a: ClockTime, b: ClockTime) {
  return a.hours === b.hours && a.minutes === b.minutes;
}

export function AnalogClockTutorial({
  value,
  onChange,
  clockSize = 220,
  autoStart = false,
  onFinish,
  showPracticeClockAfterDone = true,
}: AnalogClockTutorialProps) {
  const { playSound } = useAudio();

  const [mode, setMode] = useState<TutorialMode>(autoStart ? 'demo' : 'idle');
  const [demoStep, setDemoStep] = useState<DemoStep>(autoStart ? 'intro' : 'intro');
  const [interactiveStep, setInteractiveStep] = useState<InteractiveStep>('hourTo3');

  // 教程用的“目标时间”
  const targets = useMemo(
    () => ({
      hourTo3: { hours: 3, minutes: 0, seconds: 0 } satisfies ClockTime,
      minuteTo30: { hours: 0, minutes: 30, seconds: 0 } satisfies ClockTime,
      mixTo330: { hours: 3, minutes: 30, seconds: 0 } satisfies ClockTime,
    }),
    [],
  );

  const demoContent: Record<DemoStep, { title: string; desc: string; highlight: 'hour' | 'minute' | 'second' | null } > = {
    intro: {
      title: '欢迎来到模拟时钟小课堂！',
      desc: '我们先认识三根“指针”，再做几个小任务。准备好了吗？',
      highlight: null,
    },
    hour: {
      title: '这是时针（短短粗粗）',
      desc: '时针走一大格，就是 1 小时。比如从 3 走到 4，就是过了 1 小时。',
      highlight: 'hour',
    },
    minute: {
      title: '这是分针（长长细细）',
      desc: '分针走一小格，就是 1 分钟。走满一圈是 60 分钟。',
      highlight: 'minute',
    },
    second: {
      title: '这是秒针（红色最快）',
      desc: '秒针走一小格，就是 1 秒。走满一圈是 60 秒 = 1 分钟。',
      highlight: 'second',
    },
    marks: {
      title: '表盘的“格子”是什么意思？',
      desc: '同一格，在不一样的指针下，代表的时间不一样：时针看小时，分针看分钟，秒针看秒。',
      highlight: null,
    },
    demoDone: {
      title: '认识完啦！',
      desc: '接下来做互动小任务：把指针拖到指定位置，试试看！',
      highlight: null,
    },
  };

  const interactiveMeta: Record<InteractiveStep, {
    title: string;
    desc: string;
    allow: { hour?: boolean; minute?: boolean };
    highlight: 'hour' | 'minute' | null;
    target: ClockTime;
  }> = {
    hourTo3: {
      title: '任务 1：拖动时针到 3 点',
      desc: '提示：时针只能吸到整点哦！',
      allow: { hour: true, minute: false },
      highlight: 'hour',
      target: targets.hourTo3,
    },
    minuteTo30: {
      title: '任务 2：拖动分针到 6（30 分）',
      desc: '分针指向 6 就是 30 分钟。',
      allow: { hour: false, minute: true },
      highlight: 'minute',
      target: targets.minuteTo30,
    },
    mixTo330: {
      title: '任务 3：把时间调到 3:30',
      desc: '同时拖动时针和分针，完成最后挑战！',
      allow: { hour: true, minute: true },
      highlight: null,
      target: targets.mixTo330,
    },
    interactiveDone: {
      title: '你太棒了！',
      desc: '现在你已经会认时针、分针、秒针和刻度啦！',
      allow: { hour: true, minute: true },
      highlight: null,
      target: targets.mixTo330,
    },
  };

  const startDemo = () => {
    playSound('transition');
    setMode('demo');
    setDemoStep('intro');
  };

  const startInteractive = () => {
    playSound('transition');
    // 给一个合理的起始时间
    onChange({ hours: 12, minutes: 0, seconds: 0 });
    setMode('interactive');
    setInteractiveStep('hourTo3');
  };

  const finishTutorial = useCallback(() => {
    playSound('success');
    miniCelebration();
    setMode('done');
    onFinish?.();
  }, [onFinish, playSound]);

  const nextDemo = () => {
    playSound('click');
    const order: DemoStep[] = ['intro', 'hour', 'minute', 'second', 'marks', 'demoDone'];
    const idx = order.indexOf(demoStep);
    const next = order[Math.min(idx + 1, order.length - 1)];
    setDemoStep(next);

    if (next === 'demoDone') {
      // 小延迟让孩子看清提示
      window.setTimeout(() => {
        // 不自动进入互动，避免打断
      }, 200);
    }
  };

  // 互动步骤完成判定
  useEffect(() => {
    if (mode !== 'interactive') return;

    const meta = interactiveMeta[interactiveStep];
    if (!meta || interactiveStep === 'interactiveDone') return;

    // 判定：
    // - 任务1：只看 hours=3 & minutes=0
    // - 任务2：只看 minutes=30（hours 不要求）
    // - 任务3：hours=3 & minutes=30
    const ok =
      interactiveStep === 'hourTo3'
        ? value.hours === 3 && value.minutes === 0
        : interactiveStep === 'minuteTo30'
          ? value.minutes === 30
          : isSameTime(value, meta.target);

    if (ok) {
      playSound('correct');
      miniCelebration();

      const order: InteractiveStep[] = ['hourTo3', 'minuteTo30', 'mixTo330', 'interactiveDone'];
      const idx = order.indexOf(interactiveStep);
      const next = order[Math.min(idx + 1, order.length - 1)];

      window.setTimeout(() => {
        setInteractiveStep(next);
        if (next === 'interactiveDone') {
          finishTutorial();
        }
      }, 500);
    }
  }, [mode, interactiveStep, interactiveMeta, value, playSound, finishTutorial]);

  const renderOverlay = () => {
    if (mode === 'idle') {
      return (
        <div className="card-fun w-full">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-display text-xl">新手教程</h3>
              </div>
              <p className="text-sm text-base-content/70 leading-relaxed">
                我们会用“演示 + 互动”的方式，教你认识时针、分针、秒针和表盘刻度。
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="btn-primary-fun flex items-center gap-2" onClick={startDemo}>
                <Play className="w-4 h-4" />
                开始教程
              </button>
              <button
                className="btn-secondary-fun flex items-center gap-2"
                onClick={() => {
                  setMode('done');
                  onFinish?.();
                }}
              >
                <SkipForward className="w-4 h-4" />
                跳过
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (mode === 'demo') {
      const c = demoContent[demoStep];
      return (
        <div className="relative w-full">
          <div className="card-fun">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl mb-1">{c.title}</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">{c.desc}</p>
              </div>
              <button
                className="btn-primary-fun flex items-center gap-2 shrink-0"
                onClick={() => {
                  if (demoStep === 'demoDone') startInteractive();
                  else nextDemo();
                }}
              >
                <span>{demoStep === 'demoDone' ? '开始互动' : '下一步'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <AnalogClock
              time={value}
              size={clockSize}
              draggable={false}
              showNumbers
              showMinuteMarks
              highlightHand={c.highlight}
              focusOnHighlightedHand
            />
          </div>
        </div>
      );
    }

    if (mode === 'interactive') {
      const meta = interactiveMeta[interactiveStep];
      const isDone = interactiveStep === 'interactiveDone';

      return (
        <div className="relative w-full">
          <div className="card-fun">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hand className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl">{meta.title}</h3>
                </div>
                <p className="text-sm text-base-content/70 leading-relaxed">{meta.desc}</p>
              </div>
              {isDone && (
                <div className="flex items-center gap-1 text-emerald-600 font-display">
                  <CheckCircle2 className="w-5 h-5" />
                  完成
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <AnalogClock
              time={value}
              size={clockSize}
              draggable
              draggableHands={meta.allow}
              showNumbers
              showMinuteMarks
              highlightHand={meta.highlight}
              focusOnHighlightedHand
              onTimeChange={onChange}
            />
          </div>

          <div className="mt-3 text-center text-xs text-base-content/60">
            {interactiveStep === 'hourTo3' && '拖动短短粗粗的时针 → 让它指向 3'}
            {interactiveStep === 'minuteTo30' && '拖动长长细细的分针 → 让它指向 6（30 分）'}
            {interactiveStep === 'mixTo330' && '一起拖动两根针 → 调到 3:30'}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${demoStep}-${interactiveStep}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderOverlay()}
        </motion.div>
      </AnimatePresence>

      {mode === 'done' && (
        <div className="mt-3">
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
            <span>教程已完成</span>
            <button
              className="underline font-medium text-primary"
              onClick={() => {
                setMode('demo');
                setDemoStep('intro');
              }}
            >
              再看一遍
            </button>
          </div>

          {showPracticeClockAfterDone && (
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
              <p className="text-center mb-4 text-base-content/70">调整时钟到正确的时间</p>
              <div className="flex justify-center">
                <AnalogClock
                  time={value}
                  size={180}
                  draggable
                  showNumbers
                  showMinuteMarks={false}
                  onTimeChange={onChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
