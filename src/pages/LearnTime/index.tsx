import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, History, Play, Pause, RotateCcw, Sparkles, Timer, Watch, Sun, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAudio, useClock } from '@/hooks';

interface TimeConcept {
  title: string;
  description: string;
  example: string;
  icon: React.ReactNode;
  animation: 'blink' | 'challenge10s' | 'animalRace' | 'dailyRoutine' | 'pizza' | 'day' | 'seasons';
}

const timeConcepts: TimeConcept[] = [
  {
    title: '一秒',
    description: '一秒是很短的时间',
    example: '眨一下眼睛大约就是一秒！试着眨眨眼，感受一下吧！',
    icon: <Timer className="w-8 h-8" />,
    animation: 'blink',
  },
  {
    title: '十秒挑战',
    description: '10秒钟能做多少事？',
    example: '看看你在10秒内能点破多少个泡泡！',
    icon: <Sparkles className="w-8 h-8" />,
    animation: 'challenge10s',
  },
  {
    title: '一分钟',
    description: '一分钟有60秒',
    example: '同样是一分钟，猎豹能跑很远，但小蜗牛只能爬一点点！',
    icon: <Clock className="w-8 h-8" />,
    animation: 'animalRace',
  },
  {
    title: '半小时和一刻钟',
    description: '把一小时像切披萨一样分开',
    example: '切一半是半小时（30分钟），再切一刀是一刻钟（15分钟）！',
    icon: <Watch className="w-8 h-8" />,
    animation: 'pizza',
  },
  {
    title: '一天的作息',
    description: '每天在不同的时间做不同的事',
    example: '早上7点起床，中午12点吃饭，晚上8点睡觉！',
    icon: <Sun className="w-8 h-8" />,
    animation: 'dailyRoutine',
  },
  {
    title: '一年和四季',
    description: '春夏秋冬轮流转',
    example: '大树发芽、长叶、落叶、下雪，四个季节轮完就是一年啦！',
    icon: <Calendar className="w-8 h-8" />,
    animation: 'seasons',
  },
];

function StickerFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[2.25rem] bg-white/70 blur-sm" />
      <div className="relative rounded-[2.25rem] bg-white/90 border-4 border-white shadow-[0_18px_45px_rgba(255,155,155,0.25)] p-2">
        {children}
      </div>
    </div>
  );
}

interface ClockHistory {
  era: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const clockHistory: ClockHistory[] = [
  {
    era: '远古时代',
    name: '日晷',
    description: '聪明的古人利用太阳的影子来知道时间。太阳越高，影子越短！',
    imageSrc: `${import.meta.env.BASE_URL}images/clock-history/sundial.jpg`,
    imageAlt: '日晷照片',
  },
  {
    era: '古代',
    name: '沙漏',
    description: '沙子从上面漏到下面，漏完就代表过了一段时间。',
    imageSrc: `${import.meta.env.BASE_URL}images/clock-history/hourglass.png`,
    imageAlt: '沙漏透明PNG图片',
  },
  {
    era: '近代',
    name: '机械钟',
    description: '里面有好多小齿轮，会发出"滴答滴答"的声音。',
    imageSrc: `${import.meta.env.BASE_URL}images/clock-history/alarm-clock.png`,
    imageAlt: '老式机械闹钟透明PNG图片',
  },
  {
    era: '现代',
    name: '智能手表',
    description: '不仅能看时间，还能打电话、测心跳呢！',
    imageSrc: `${import.meta.env.BASE_URL}images/clock-history/smartwatch.png`,
    imageAlt: '智能手表透明PNG图片',
  },
];

export function LearnTimePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showClockTypes, setShowClockTypes] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { playSound } = useAudio();
  
  // 眨眼动画
  const [isBlinking, setIsBlinking] = useState(false);
  
  
  // 时钟动画（当前页不直接使用 clockTime/startClock，但 stop/reset 用于切换概念时清理）
  const { stop: stopClock, reset: resetClock } = useClock({
    autoRun: false,
    initialTime: { hours: 12, minutes: 0, seconds: 0 },
    includeSeconds: true,
  });
  
  // 昼夜循环动画
  const [dayProgress, setDayProgress] = useState(0);
  const [isDayRunning, setIsDayRunning] = useState(false);
  const dayIntervalRef = useRef<number | null>(null);
  
  // 10秒挑战动画
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(10);
  const [isChallengeRunning, setIsChallengeRunning] = useState(false);
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number}[]>([]);
  const challengeIntervalRef = useRef<number | null>(null);

  // 动物赛跑动画
  const [raceProgress, setRaceProgress] = useState(0);
  const [isRaceRunning, setIsRaceRunning] = useState(false);
  const raceIntervalRef = useRef<number | null>(null);

  // 切披萨动画
  const [pizzaSlices, setPizzaSlices] = useState(1); // 1: 整块(1小时), 2: 两半(半小时), 4: 四块(一刻钟)

  // 作息时间线
  const [routineIndex, setRoutineIndex] = useState(0);
  const routines = [
    { time: '07:00', event: '起床刷牙', icon: '🪥', bg: 'from-blue-200 to-cyan-200' },
    { time: '12:00', event: '吃午饭啦', icon: '🍱', bg: 'from-orange-200 to-amber-200' },
    { time: '15:00', event: '做游戏/运动', icon: '⚽', bg: 'from-green-200 to-emerald-200' },
    { time: '20:00', event: '盖被子睡觉', icon: '😴', bg: 'from-indigo-400 to-purple-500' },
  ];

  // 四季树动画
  const [seasonIndex, setSeasonIndex] = useState(0);
  const seasonIntervalRef = useRef<number | null>(null);
  const seasons = [
    { name: '春天', desc: '树枝发小芽，长出绿绿的叶子', tree: '🌱', color: 'text-green-500', bg: 'bg-green-50' },
    { name: '夏天', desc: '绿树成荫，知了在唱歌', tree: '🌳', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: '秋天', desc: '叶子变黄啦，随风飘落下来', tree: '🍂', color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: '冬天', desc: '光秃秃的树枝落满了白雪', tree: '❄️', color: 'text-blue-300', bg: 'bg-blue-50' },
  ];

  // 时光机状态
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNextConcept = () => {
    playSound('click');
    if (currentStep < timeConcepts.length - 1) {
      setCurrentStep(currentStep + 1);
      playSound('transition');
      // 重置动画状态
      resetAnimations();
    } else {
      setShowClockTypes(true);
      playSound('success');
    }
  };
  
  const resetAnimations = () => {
    setIsBlinking(false);
    stopClock();
    resetClock();
    setIsDayRunning(false);
    setDayProgress(0);
    
    // 重置新动画状态
    setIsChallengeRunning(false);
    setChallengeTimeLeft(10);
    setChallengeScore(0);
    setBubbles([]);
    setIsRaceRunning(false);
    setRaceProgress(0);
    setPizzaSlices(1);
    setRoutineIndex(0);
    setSeasonIndex(0);

    if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
    if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    if (seasonIntervalRef.current) clearInterval(seasonIntervalRef.current);
  };
  
  // 互动点击
  const handleInteraction = () => {
    setClickCount(prev => prev + 1);
    playSound('star');
  };
  
  // 眨眼动画
  const handleBlink = () => {
    setIsBlinking(true);
    playSound('click');
    setTimeout(() => setIsBlinking(false), 200);
  };
  
  
  
  // 昼夜循环动画
  const handleDayToggle = () => {
    if (isDayRunning) {
      setIsDayRunning(false);
      if (dayIntervalRef.current) {
        clearInterval(dayIntervalRef.current);
        dayIntervalRef.current = null;
      }
    } else {
      setIsDayRunning(true);
      setDayProgress(0);
      playSound('click');
      
      dayIntervalRef.current = window.setInterval(() => {
        setDayProgress(prev => {
          if (prev >= 100) {
            if (dayIntervalRef.current) {
              clearInterval(dayIntervalRef.current);
              dayIntervalRef.current = null;
            }
            setIsDayRunning(false);
            playSound('success');
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
  };
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
      if (challengeIntervalRef.current) clearInterval(challengeIntervalRef.current);
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
      if (seasonIntervalRef.current) clearInterval(seasonIntervalRef.current);
    };
  }, []);

  const handleStartChallenge = () => {
    if (isChallengeRunning) return;
    setIsChallengeRunning(true);
    setChallengeTimeLeft(10);
    setChallengeScore(0);
    setBubbles(Array.from({length: 15}).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    })));
    playSound('transition');

    challengeIntervalRef.current = window.setInterval(() => {
      setChallengeTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(challengeIntervalRef.current!);
          setIsChallengeRunning(false);
          playSound('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBubbleClick = (id: number) => {
    if (!isChallengeRunning) return;
    setBubbles(prev => prev.filter(b => b.id !== id));
    setChallengeScore(prev => prev + 1);
    playSound('click');
  };

  const handleStartRace = () => {
    if (isRaceRunning) return;
    setIsRaceRunning(true);
    setRaceProgress(0);
    playSound('transition');

    raceIntervalRef.current = window.setInterval(() => {
      setRaceProgress(prev => {
        if (prev >= 100) {
          clearInterval(raceIntervalRef.current!);
          setIsRaceRunning(false);
          playSound('success');
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const handleCutPizza = () => {
    if (pizzaSlices === 1) {
      setPizzaSlices(2);
    } else if (pizzaSlices === 2) {
      setPizzaSlices(4);
    } else {
      setPizzaSlices(1);
    }
    playSound('click');
  };

  const handleNextRoutine = () => {
    setRoutineIndex(prev => (prev + 1) % routines.length);
    playSound('transition');
  };

  const handleNextSeason = () => {
    setSeasonIndex(prev => (prev + 1) % seasons.length);
    playSound('transition');
  };

  // 渲染动画内容
  const renderAnimation = () => {
    const concept = timeConcepts[currentStep];
    
    switch (concept.animation) {
      case 'blink':
        return (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
              transition={{ duration: 0.18 }}
              className="text-8xl"
            >
              👁️
            </motion.div>
            <button
              onClick={handleBlink}
              className="btn-primary-fun flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>点击眨眼</span>
            </button>
          </div>
        );

      case 'challenge10s':
        return (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-6xl font-display text-gradient">
              {challengeTimeLeft}s
            </div>
            
            <div className="relative w-full h-48 bg-blue-50 rounded-2xl overflow-hidden border-2 border-blue-200">
              <AnimatePresence>
                {bubbles.map(bubble => (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="absolute w-10 h-10 bg-cyan-300 rounded-full cursor-pointer shadow-sm
                      flex items-center justify-center text-white border-2 border-cyan-100"
                    style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                    onClick={() => handleBubbleClick(bubble.id)}
                    whileHover={{ scale: 1.1 }}
                  >
                    🫧
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!isChallengeRunning && challengeTimeLeft === 0 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-xl font-bold text-primary">得分: {challengeScore}</div>
                </motion.div>
              )}
            </div>

            <button
              onClick={handleStartChallenge}
              disabled={isChallengeRunning}
              className={`btn-primary-fun flex items-center gap-2 ${isChallengeRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Play className="w-5 h-5" />
              <span>{challengeTimeLeft === 0 ? '再玩一次' : '开始挑战'}</span>
            </button>
          </div>
        );

      case 'animalRace':
        return (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full bg-green-50 p-4 rounded-2xl relative overflow-hidden">
              {/* 跑道 1 - 猎豹 */}
              <div className="relative h-12 border-b-2 border-green-200 border-dashed mb-4">
                <motion.div
                  className="absolute text-4xl"
                  animate={{ left: `${raceProgress}%` }}
                  transition={{ ease: "linear" }}
                >
                  🐆
                </motion.div>
              </div>
              {/* 跑道 2 - 蜗牛 */}
              <div className="relative h-12">
                <motion.div
                  className="absolute text-4xl"
                  animate={{ left: `${raceProgress * 0.1}%` }} // 蜗牛只跑10%
                  transition={{ ease: "linear" }}
                >
                  🐌
                </motion.div>
              </div>
              
              {/* 终点线 */}
              <div className="absolute right-4 top-0 bottom-0 w-2 bg-red-400 opacity-50"></div>
            </div>
            
            <button
              onClick={handleStartRace}
              disabled={isRaceRunning}
              className={`btn-primary-fun flex items-center gap-2 ${isRaceRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Play className="w-5 h-5" />
              <span>{raceProgress >= 100 ? '再比一次' : '开始赛跑'}</span>
            </button>
          </div>
        );

      case 'pizza':
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-48 h-48">
              <motion.div 
                className="absolute inset-0 bg-yellow-400 rounded-full border-8 border-orange-500 shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                {/* 披萨纹理/配料 */}
                <div className="absolute top-4 left-10 text-2xl">🌶️</div>
                <div className="absolute bottom-8 right-8 text-2xl">🍄</div>
                <div className="absolute top-1/2 left-4 text-2xl">🧀</div>
              </motion.div>
              
              {/* 切割线 - 垂直 (切两半) */}
              <AnimatePresence>
                {pizzaSlices >= 2 && (
                  <motion.div 
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="absolute top-0 bottom-0 left-1/2 w-2 -ml-1 bg-amber-800 rounded-full origin-top"
                  />
                )}
              </AnimatePresence>
              
              {/* 切割线 - 水平 (切四块) */}
              <AnimatePresence>
                {pizzaSlices >= 4 && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute left-0 right-0 top-1/2 h-2 -mt-1 bg-amber-800 rounded-full origin-left"
                  />
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600 mb-1">
                {pizzaSlices === 1 ? '1小时 (60分钟)' : 
                 pizzaSlices === 2 ? '半小时 (30分钟)' : 
                 '一刻钟 (15分钟)'}
              </div>
            </div>
            
            <button
              onClick={handleCutPizza}
              className="btn-primary-fun bg-orange-500 border-orange-700 hover:bg-orange-400"
            >
              🔪 切一刀看看
            </button>
          </div>
        );

      case 'dailyRoutine': {
        const currentRoutine = routines[routineIndex];
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <motion.div 
              key={routineIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full p-8 rounded-3xl bg-gradient-to-br ${currentRoutine.bg} 
                flex flex-col items-center justify-center shadow-inner relative overflow-hidden`}
            >
              <div className="absolute top-4 left-4 bg-white/50 px-3 py-1 rounded-full font-bold text-gray-700">
                {currentRoutine.time}
              </div>
              <motion.div 
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentRoutine.icon}
              </motion.div>
              <div className="text-2xl font-bold text-gray-800">
                {currentRoutine.event}
              </div>

              {/* 小小时间线 */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                {routines.map((r, idx) => (
                  <div key={r.time} className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full border-2 ${
                        idx === routineIndex
                          ? 'bg-white border-white'
                          : 'bg-white/40 border-white/70'
                      }`}
                      title={r.time}
                    />
                    {idx < routines.length - 1 && (
                      <div className="h-0.5 w-6 bg-white/60 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
            
            <button
              onClick={handleNextRoutine}
              className="btn-primary-fun flex items-center gap-2"
            >
              <span>下一个时间点</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        );
      }

      case 'seasons': {
        const currentSeason = seasons[seasonIndex];
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <motion.div 
              key={seasonIndex}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full h-56 rounded-3xl ${currentSeason.bg} 
                flex flex-col items-center justify-center relative overflow-hidden border-2 border-white/50`}
            >
              <motion.div 
                className="text-8xl"
                animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {currentSeason.tree}
              </motion.div>
              <div className={`mt-4 text-2xl font-bold ${currentSeason.color}`}>
                {currentSeason.name}
              </div>
              <div className="text-sm text-gray-600 mt-2 text-center px-4">
                {currentSeason.desc}
              </div>
            </motion.div>
            
            <button
              onClick={handleNextSeason}
              className="btn-primary-fun flex items-center gap-2"
            >
              <span>换个季节</span>
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        );
      }

      case 'day':
        return (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-white/60">
              {/* 天空背景 */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    dayProgress < 50
                      ? `linear-gradient(to bottom, #87CEEB ${dayProgress * 2}%, #FFD1DC 100%)`
                      : `linear-gradient(to bottom, #1b1b5a ${(dayProgress - 50) * 2}%, #04041c 100%)`,
                }}
              />

              {/* 云朵 */}
              {dayProgress < 50 && (
                <>
                  <motion.div
                    className="absolute text-3xl opacity-80"
                    animate={{ x: ['-20%', '120%'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    style={{ top: 18 }}
                  >
                    ☁️
                  </motion.div>
                  <motion.div
                    className="absolute text-2xl opacity-70"
                    animate={{ x: ['-30%', '120%'] }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    style={{ top: 56 }}
                  >
                    ☁️
                  </motion.div>
                </>
              )}

              {/* 太阳/月亮 */}
              <motion.div
                className="absolute w-16 h-16 rounded-full flex items-center justify-center"
                animate={{
                  left: `${dayProgress}%`,
                  top: dayProgress < 50 ? `${55 - dayProgress}%` : `${dayProgress - 45}%`,
                }}
                transition={{ duration: 0.1 }}
              >
                {dayProgress < 50 ? (
                  <div className="w-full h-full bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/60 flex items-center justify-center">
                    ☀️
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-full shadow-lg flex items-center justify-center">
                    🌙
                  </div>
                )}
              </motion.div>

              {/* 星星 */}
              {dayProgress >= 50 && (
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white"
                      style={{
                        left: `${(i * 9 + 7) % 100}%`,
                        top: `${(i * 13 + 11) % 80}%`,
                      }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.12 }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-base-content/70 text-center">
              {dayProgress < 50 ? '白天 🌞' : '黑夜 🌙'}
              <br />
              进度: {dayProgress}%
            </div>

            <button
              onClick={handleDayToggle}
              className="btn-primary-fun flex items-center gap-2"
            >
              {isDayRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>暂停</span>
                </>
              ) : dayProgress === 100 ? (
                <>
                  <RotateCcw className="w-5 h-5" />
                  <span>重新播放</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>观看昼夜变化</span>
                </>
              )}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Layout title="认识时间" showBack showFooter={false}>
      <div className="flex flex-col items-center gap-6 py-4">
        <AnimatePresence mode="wait">
          {!showClockTypes ? (
            <motion.div
              key="concepts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              {/* 标题 */}
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="font-display text-2xl text-base-content mb-2">
                  时间是什么？
                </h2>
                <p className="text-base-content/70">
                  让我们一起来认识时间吧！
                </p>
              </motion.div>
              
              {/* 时间概念卡片 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="card-fun mb-6 relative overflow-hidden"
                >
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 text-6xl opacity-10 pointer-events-none">
                    {timeConcepts[currentStep].icon}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleInteraction}
                    >
                      {timeConcepts[currentStep].icon}
                    </motion.div>
                    <h3 className="font-display text-2xl text-gradient">
                      {timeConcepts[currentStep].title}
                    </h3>
                  </div>
                  
                  <motion.p 
                    className="text-base-content text-lg mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {timeConcepts[currentStep].description}
                  </motion.p>
                  
                  {/* 动画演示区域 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-base-200 rounded-xl p-6 mb-4"
                  >
                    {renderAnimation()}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 
                      rounded-xl p-4 border-2 border-amber-200 dark:border-amber-700"
                  >
                    <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      {timeConcepts[currentStep].example}
                    </p>
                  </motion.div>
                  
                  {/* 互动提示 */}
                  {clickCount > 0 && clickCount % 3 === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 
                        text-white px-3 py-1 rounded-full text-sm font-display shadow-lg"
                    >
                      太棒了！🎉
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* 进度指示器 */}
              <div className="flex justify-center gap-2 mb-6">
                {timeConcepts.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'w-8 bg-gradient-to-r from-primary to-primary-dark' 
                        : index < currentStep
                        ? 'w-2 bg-accent'
                        : 'w-2 bg-base-content/20'
                    }`}
                  />
                ))}
              </div>
              
              {/* 下一步按钮 */}
              <motion.button
                onClick={handleNextConcept}
                className="btn-primary-fun w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentStep < timeConcepts.length - 1 ? (
                  <>
                    <span>继续学习</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>认识时钟种类</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="clock-types"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md"
            >
              {/* 时光机 */}
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="font-display text-2xl text-base-content mb-2 flex items-center justify-center gap-2">
                  <History className="w-6 h-6 text-primary" />
                  时钟家族时光机
                </h2>
                <p className="text-base-content/70">
                  人类是怎么知道时间的呢？一起坐上时光机看看吧！
                </p>
              </motion.div>
              
              {/* 时光机卡片展示区 */}
              <div className="relative mb-8 h-64">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={historyIndex}
                    initial={{ opacity: 0, x: 100, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -100, rotateY: 15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 card-fun p-0 grid grid-rows-[auto_minmax(0,1fr)] text-center overflow-hidden h-full"
                  >
                    {/* 时代标签 */}
                    <div className="absolute top-4 left-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
                      {clockHistory[historyIndex].era}
                    </div>
                    
                    {/* 上半部分：图片区 */}
                    <div className="relative pt-5 px-6 flex items-start justify-center">
                      <motion.div
                        className="shrink-0"
                        animate={{ y: [0, -6, 0], rotate: [0, -1.5, 1.5, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <StickerFrame>
                          <img
                            src={clockHistory[historyIndex].imageSrc}
                            alt={clockHistory[historyIndex].imageAlt}
                            loading="lazy"
                            decoding="async"
                            className="w-44 h-32 object-contain rounded-2xl"
                          />
                        </StickerFrame>
                      </motion.div>
                    </div>

                    {/* 下半部分：文字区，占剩余空间，超出可滚动 */}
                    <div className="min-h-0 overflow-auto scrollbar-hide px-6 pb-4">
                      <h3 className="font-display text-2xl mt-2 mb-1 text-gradient">
                        {clockHistory[historyIndex].name}
                      </h3>

                      <p className="text-sm text-base-content/70 leading-relaxed">
                        {clockHistory[historyIndex].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 时代切换控制 */}
              <div className="flex items-center justify-between gap-4 mb-8 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-white">
                <button
                  onClick={() => {
                    setHistoryIndex(prev => (prev > 0 ? prev - 1 : clockHistory.length - 1));
                    playSound('click');
                  }}
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex gap-2">
                  {clockHistory.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === historyIndex ? 'w-6 bg-primary' : 'w-2 bg-primary/20'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    setHistoryIndex(prev => (prev < clockHistory.length - 1 ? prev + 1 : 0));
                    playSound('click');
                  }}
                  className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              
              {/* 学习更多 */}
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-base-content/70 text-lg mb-2">
                  太棒了！你已经认识了时间和时钟 🎉
                </p>
                <p className="text-base-content/60">
                  现在选择一个课程，深入学习吧！
                </p>
              </motion.div>
              
              <div className="flex flex-col gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link 
                    to={ROUTES.ANALOG_CLOCK} 
                    className="btn-primary-fun w-full flex items-center justify-center gap-2"
                    onClick={() => playSound('click')}
                  >
                    <Clock className="w-5 h-5" />
                    <span>学习模拟时钟</span>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link 
                    to={ROUTES.DIGITAL_CLOCK} 
                    className="btn-secondary-fun w-full flex items-center justify-center gap-2"
                    onClick={() => playSound('click')}
                  >
                    <Watch className="w-5 h-5" />
                    <span>学习数字时钟</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
