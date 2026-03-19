import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, Star, Sparkles, Target } from 'lucide-react';
import { Layout } from '@/components/layout';
import { AnalogClock, DigitalClock } from '@/components/clock';
import { AnalogClockTutorial } from '@/components/clock/AnalogClockTutorial';
import { useGameStore, useProgressStore, useSettingsStore } from '@/store';
import { ClockTimeUtils, randomChoice, celebrateComplete, miniCelebration } from '@/utils';
import { DIFFICULTY_CONFIG, ENCOURAGEMENTS, ROUTES } from '@/constants';
import type { ClockTime, DifficultyLevel, PracticeMode, Question } from '@/types';
import { Link, useLocation } from 'react-router-dom';
import { useAudio } from '@/hooks';

type GameStage = 'select' | 'playing' | 'result';

type ConfettiParticle = {
  id: number;
  x: string;
  rotate: number;
  duration: number;
  delay: number;
  icon: string;
};

const confettiIcons = ['⭐', '🎉', '✨', '🌟'] as const;

const createConfettiParticles = (count: number): ConfettiParticle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${Math.round((i / count) * 100)}%`,
    rotate: (i * 47) % 360,
    duration: 3 + (i % 5) * 0.4,
    delay: (i % 6) * 0.08,
    icon: confettiIcons[i % confettiIcons.length],
  }));
};

const practiceModes: Array<{
  key: PracticeMode;
  title: string;
  description: string;
  emoji: string;
}> = [
  { key: 'mixed', title: '综合训练', description: '模拟钟和数字钟混合练习', emoji: '🎯' },
  { key: 'whole-hours', title: '整点专项', description: '只练整点读时', emoji: '🕐' },
  { key: 'half-hours', title: '半点专项', description: '集中巩固半点', emoji: '🕡' },
  { key: 'manual-input', title: '动手拨针', description: '手动调整指针到目标时间', emoji: '✋' },
];

// 难度配置
const difficultyConfig = [
  { key: 'beginner' as DifficultyLevel, emoji: '🌱', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
  { key: 'junior' as DifficultyLevel, emoji: '🌿', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/30' },
  { key: 'intermediate' as DifficultyLevel, emoji: '🌳', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/30' },
  { key: 'advanced' as DifficultyLevel, emoji: '🏆', color: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-500/30' },
];

export function PracticePage() {
  const { setDifficulty } = useSettingsStore();
  const { addPracticeSession, recordWrongAnswer } = useProgressStore();
  const { playSound } = useAudio();
  const { 
    session, 
    currentQuestion, 
    isCustomSession,
    currentMode,
    startSession,
    startCustomSession,
    submitAnswer, 
    nextQuestion, 
    resetSession,
    completeSession
  } = useGameStore();
  
  const [stage, setStage] = useState<GameStage>('select');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('mixed');
  const [selectedAnswer, setSelectedAnswer] = useState<ClockTime | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userTimeInput, setUserTimeInput] = useState<ClockTime>({ hours: 0, minutes: 0, seconds: 0 });
  const location = useLocation();
  const customSessionInitializedRef = useRef(false);
  const recordedSessionIdRef = useRef<string | null>(null);
  
  const confettiParticles = createConfettiParticles(20);
  const customPracticeState = location.state as { mode?: 'wrong-questions'; questions?: Question[] } | null;

  // 结果页面音效播放（必须在组件顶层）
  useEffect(() => {
    if (stage === 'result' && session) {
      const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
      if (accuracy >= 70) {
        playSound('success');
      }

      if (recordedSessionIdRef.current !== session.id) {
        addPracticeSession(session);
        recordedSessionIdRef.current = session.id;
      }
    }
  }, [stage, session, playSound, addPracticeSession]);

  useEffect(() => {
    if (customSessionInitializedRef.current) return;
    if (stage !== 'select') return;
    if (customPracticeState?.mode !== 'wrong-questions' || !customPracticeState.questions?.length) return;

    const difficulty = customPracticeState.questions[0]?.difficulty ?? 'junior';
    startCustomSession(customPracticeState.questions, difficulty);
    setStage('playing');
    customSessionInitializedRef.current = true;
  }, [stage, customPracticeState, startCustomSession]);
  
  // 开始游戏
  const handleStartGame = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    startSession(diff, selectedMode);
    setStage('playing');
    setSelectedAnswer(null);
    setShowFeedback(false);
    recordedSessionIdRef.current = null;
    customSessionInitializedRef.current = false;
    playSound('transition');
  };
  
  // 提交答案
  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer && currentQuestion?.type !== 'manual-input') return;
    
    const answer = currentQuestion?.type === 'manual-input' ? userTimeInput : selectedAnswer;
    if (!answer) return;
    
    const result = submitAnswer(answer);
    if (result) {
      setIsCorrect(result.isCorrect);
      setShowFeedback(true);

      if (!result.isCorrect && currentQuestion) {
        recordWrongAnswer(currentQuestion, result, 'practice');
      }
      
      // 播放音效和动画
      if (result.isCorrect) {
        playSound('correct');
        miniCelebration();
      } else {
        playSound('wrong');
      }
    }
  }, [selectedAnswer, userTimeInput, currentQuestion, submitAnswer, playSound, recordWrongAnswer]);
  
  // 下一题
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setUserTimeInput({ hours: 0, minutes: 0, seconds: 0 });
    
    // 检查是否完成所有题目
    if (session && session.currentQuestionIndex >= session.totalQuestions - 1) {
      // 完成所有题目，调用 completeSession 更新 session 状态
      completeSession();
      // 播放庆祝效果
      playSound('complete');
      celebrateComplete();
      setStage('result');
    } else {
      nextQuestion();
    }
  };
  
  // 重新开始
  const handleRestart = () => {
    resetSession();
    setStage('select');
    setSelectedAnswer(null);
    setShowFeedback(false);
  };
  
  // 选择难度界面
  if (stage === 'select') {
    return (
      <Layout title="游戏练习" showBack showFooter={false}>
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-3 sm:py-6 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 left-10 text-4xl opacity-30"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-20 right-10 text-3xl opacity-30"
            >
              🎮
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-20 left-20 text-2xl opacity-20"
            >
              🕐
            </motion.div>
          </div>
          
          {/* 标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🎮</div>
            <h2 className="font-display text-2xl sm:text-3xl text-gradient mb-1.5 sm:mb-2">游戏练习</h2>
            <p className="text-sm sm:text-base text-base-content/70">先选择专项模式，再开始挑战吧！</p>
          </motion.div>

          <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2 relative z-10">
            {practiceModes.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => setSelectedMode(mode.key)}
                className={`rounded-2xl border p-4 text-left shadow-md transition-all ${
                  selectedMode === mode.key
                    ? 'border-indigo-400 bg-indigo-50 shadow-indigo-200/60'
                    : 'border-white/70 bg-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mode.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg text-base-content">{mode.title}</h3>
                    <p className="text-sm text-base-content/65">{mode.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* 难度选择卡片 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg relative z-10">
            {difficultyConfig.map((diff, index) => {
              const config = DIFFICULTY_CONFIG[diff.key];
              return (
                <motion.button
                  key={diff.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartGame(diff.key)}
                  className={`relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-left
                    shadow-lg ${diff.shadow} group`}
                >
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${diff.color} 
                    opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl sm:text-3xl">{diff.emoji}</span>
                      <h3 className="font-display text-base sm:text-xl text-base-content">{config.name}</h3>
                    </div>
                    <p className="hidden sm:block text-sm text-base-content/60 mb-3">{config.description}</p>
                    <div className="flex items-center gap-2 text-xs text-base-content/50">
                      <Target className="w-4 h-4" />
                      <span>{config.questionCount} 道题目</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }
  
  // 结果界面
  if (stage === 'result') {
    console.log('结果页面渲染检查:', { stage, session, hasSession: !!session });
    
    if (!session) {
      console.log('session 为空，返回选择界面');
      return (
        <Layout title="练习完成" showBack showFooter={false}>
          <div className="flex flex-col items-center gap-6 py-6">
            <p>会话数据丢失，请重新开始</p>
            <button
              onClick={() => setStage('select')}
              className="btn-primary-fun"
            >
              返回选择难度
            </button>
          </div>
        </Layout>
      );
    }
    
    const accuracy = Math.round((session.correctAnswers / session.totalQuestions) * 100);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
    
    console.log('结果页面数据:', {
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      accuracy,
      stars,
      score: session.score
    });
    
    return (
      <Layout title="练习完成" showBack showFooter={false}>
        <div className="flex flex-col items-center gap-4 sm:gap-6 py-3 sm:py-6 relative overflow-hidden">
          {/* 庆祝效果 */}
          {accuracy >= 70 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    y: -20,
                    x: particle.x,
                    opacity: 1,
                    rotate: 0
                  }}
                  animate={{ 
                    y: '100vh',
                    opacity: [1, 1, 0],
                    rotate: particle.rotate
                  }}
                  transition={{ 
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute text-2xl"
                >
                  {particle.icon}
                </motion.div>
              ))}
            </div>
          )}
          
          {/* 结果卡片 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative z-10"
          >
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <h2 className="font-display text-2xl sm:text-3xl text-gradient mb-2 sm:mb-3">
              {isCustomSession ? '错题复习完成' : `${practiceModes.find((mode) => mode.key === currentMode)?.title ?? '练习'}完成`}
            </h2>
            
            {/* 星星评价 */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 ${
                      i < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-sm relative z-10"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '正确', value: session.correctAnswers, color: 'text-emerald-500', icon: '✓' },
                  { label: '错误', value: session.totalQuestions - session.correctAnswers, color: 'text-rose-500', icon: '✗' },
                  { label: '得分', value: session.score, color: 'text-indigo-500', icon: '★' },
                  { label: '正确率', value: `${accuracy}%`, color: 'text-amber-500', icon: '%' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center p-3 bg-base-100/50 rounded-xl"
                  >
                    <div className={`font-display text-2xl ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-base-content/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 relative z-10 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white rounded-xl sm:rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3 font-display shadow-lg shadow-indigo-500/30"
            >
              <RotateCcw className="w-4 h-4" />
              再来一次
            </motion.button>
            <Link 
              to={ROUTES.WRONG_QUESTIONS}
              className="flex items-center justify-center gap-2 bg-white text-base-content 
                rounded-xl sm:rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3 font-display shadow-md border-2 border-dashed border-indigo-300"
            >
              查看错题本
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }
  
  // 游戏进行中界面
  if (!currentQuestion || !session) return null;
  
  return (
    <Layout title="游戏练习" showBack showFooter={false}>
      <div className="flex flex-col items-center gap-3 sm:gap-4 py-2 sm:py-4 relative">
        {/* 进度条 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="font-display text-base-content/70">
              题目 {session.currentQuestionIndex + 1} / {session.totalQuestions}
            </span>
            <span className="font-display text-indigo-500">
              得分: {session.score}
            </span>
          </div>
          <div className="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((session.currentQuestionIndex + 1) / session.totalQuestions) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </motion.div>
        
        {/* 题目区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            {/* 题目卡片 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg mb-3 sm:mb-4">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 
                  text-sm font-display px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  请选择正确的时间
                </span>
                {!isCustomSession && (
                  <p className="mt-3 text-sm text-base-content/60">
                    当前模式：{practiceModes.find((mode) => mode.key === currentMode)?.title ?? '综合训练'}
                  </p>
                )}
              </div>
              
              {/* 显示题目时钟 */}
              <div className="flex justify-center mb-2">
                {currentQuestion.type === 'analog-to-digital' ? (
                  <AnalogClock
                    time={currentQuestion.time}
                    size={190}
                    draggable={false}
                    showNumbers
                    showMinuteMarks={false}
                  />
                ) : currentQuestion.type === 'digital-to-analog' ? (
                  <div className="bg-base-100/80 rounded-xl p-4">
                    <DigitalClock
                      time={currentQuestion.time}
                      size="lg"
                      format="12h"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-3 text-base-content/70">请调整时钟到:</p>
                    <div className="bg-base-100/80 rounded-xl p-4 inline-block">
                      <DigitalClock
                        time={currentQuestion.time}
                        size="lg"
                        format="12h"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 选项区域 */}
            {currentQuestion.type !== 'manual-input' && currentQuestion.options && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedAnswer(option);
                      playSound('click');
                    }}
                    disabled={showFeedback}
                    className={`relative overflow-hidden rounded-xl p-4
                      transition-all duration-200 min-h-[112px] sm:min-h-[140px] flex items-center justify-center
                      ${selectedAnswer === option
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white text-base-content shadow-md hover:shadow-lg'
                      }
                      ${showFeedback && ClockTimeUtils.isEqual(option, currentQuestion.time) 
                        ? 'ring-4 ring-emerald-400 ring-offset-2' 
                        : ''
                      }`}
                  >
                    {/* 如果题目是模拟时钟，答案显示数字时间 */}
                    {currentQuestion.type === 'analog-to-digital' && (
                      <span className="font-display text-3xl">
                        {ClockTimeUtils.format(option, '12h')}
                      </span>
                    )}
                    
                    {/* 如果题目是数字时钟，答案显示模拟时钟 */}
                    {currentQuestion.type === 'digital-to-analog' && (
                      <AnalogClock
                        time={option}
                        size={112}
                        draggable={false}
                        showNumbers={false}
                        showMinuteMarks={false}
                      />
                    )}
                    
                    {showFeedback && ClockTimeUtils.isEqual(option, currentQuestion.time) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 
                          rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
            
            {/* 手动输入模式 */}
            {currentQuestion.type === 'manual-input' && (
              <AnalogClockTutorial
                value={userTimeInput}
                onChange={setUserTimeInput}
                clockSize={176}
                showPracticeClockAfterDone
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* 反馈区域 */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`w-full max-w-sm p-3 sm:p-4 rounded-2xl shadow-lg ${
                isCorrect 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-display">{randomChoice(ENCOURAGEMENTS.correct)}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    <span className="font-display">
                      正确答案是 {ClockTimeUtils.format(currentQuestion.time, '12h')}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 操作按钮 */}
        <div className="flex gap-2.5 sm:gap-4 w-full sm:w-auto">
          {!showFeedback ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer && currentQuestion.type !== 'manual-input'}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white rounded-xl sm:rounded-2xl px-5 sm:px-8 py-3 sm:py-4 font-display text-base sm:text-lg shadow-lg shadow-indigo-500/30
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交答案
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextQuestion}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white rounded-xl sm:rounded-2xl px-5 sm:px-8 py-3 sm:py-4 font-display text-base sm:text-lg shadow-lg shadow-indigo-500/30"
            >
              {session.currentQuestionIndex < session.totalQuestions - 1 ? (
                <>
                  下一题
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  查看结果
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </Layout>
  );
}
