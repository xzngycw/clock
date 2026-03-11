import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import { AnalogClock, DigitalClock } from '@/components/clock';
import { AnalogClockTutorial } from '@/components/clock/AnalogClockTutorial';
import { ClockTimeUtils } from '@/utils';
import type { ClockTime } from '@/types';

export function AnalogClockPage() {
  const [time, setTime] = useState<ClockTime>(ClockTimeUtils.now());
  const [isRealTime, setIsRealTime] = useState(true);
  const [showDigitalClock, setShowDigitalClock] = useState(true);
  const [activeTip, setActiveTip] = useState(0);
  
  // 实时更新时间
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      setTime(ClockTimeUtils.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRealTime]);
  
  // 处理时间变化（拖拽时）
  const handleTimeChange = (newTime: ClockTime) => {
    setIsRealTime(false);
    setTime(newTime);
  };
  
  // 恢复实时模式
  const handleRealTimeToggle = () => {
    if (!isRealTime) {
      setTime(ClockTimeUtils.now());
    }
    setIsRealTime(!isRealTime);
  };
  
  // 学习提示
  const tips = [
    { icon: '👆', text: '时针（短针）指示小时' },
    { icon: '👆', text: '分针（长针）指示分钟' },
    { icon: '👆', text: '红色细针是秒针' },
  ];
  
  // 自动切换提示
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Layout title="认识模拟时钟" showBack showFooter={false}>
      <div className="flex flex-col items-center gap-6 py-4 relative">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30"
          />
        </div>
        
        {/* 介绍卡片 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-md px-4"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full 
            px-4 py-2 shadow-lg mb-3">
            <span className="text-2xl">🕐</span>
            <span className="font-display text-lg text-gradient">模拟时钟</span>
          </div>
          <p className="text-base-content/70 text-sm leading-relaxed">
            模拟时钟有三个指针，<br />
            让我们一起来认识它们吧！
          </p>
        </motion.div>
        
        {/* 新手教程（演示 + 互动）：仅在学习模式显示 */}
        {!isRealTime && (
          <div className="w-full max-w-md px-4">
            <AnalogClockTutorial
              value={time}
              onChange={handleTimeChange}
              clockSize={220}
              showPracticeClockAfterDone={false}
            />
          </div>
        )}

        {/* 时钟容器 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative"
        >
          {/* 时钟光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 
            rounded-full blur-2xl scale-110" />
          
          {/* 时钟卡片 */}
          <div className="relative bg-white rounded-3xl p-6 shadow-xl shadow-indigo-500/10">
            <AnalogClock
              time={time}
              size={280}
              draggable={!isRealTime}
              showNumbers
              showMinuteMarks
              animated
              onTimeChange={handleTimeChange}
            />
            
            {/* 学习模式提示 */}
            {!isRealTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                  bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 
                  rounded-full shadow-md whitespace-nowrap"
              >
                💡 拖拽指针来调整时间
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* 数字时钟显示 */}
        <AnimatePresence>
          {showDigitalClock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                <DigitalClock time={time} size="md" format="12h" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 指针说明卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTip}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 justify-center"
              >
                <span className="text-xl">{tips[activeTip].icon}</span>
                <span className="text-base-content/80">{tips[activeTip].text}</span>
              </motion.div>
            </AnimatePresence>
            
            {/* 指示点 */}
            <div className="flex justify-center gap-2 mt-3">
              {tips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTip(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTip 
                      ? 'bg-primary w-6' 
                      : 'bg-base-300 hover:bg-base-content/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* 指针图例 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm"
        >
          {[
            { label: '时针', desc: '短针', color: 'bg-gray-800', width: 'w-2 h-10' },
            { label: '分针', desc: '长针', color: 'bg-indigo-500', width: 'w-1.5 h-12' },
            { label: '秒针', desc: '细针', color: 'bg-rose-500', width: 'w-1 h-14' },
          ].map((hand, i) => (
            <motion.div
              key={hand.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-md"
            >
              <div className="flex justify-center mb-2">
                <div className={`${hand.width} ${hand.color} rounded-full`} />
              </div>
              <p className="font-display text-sm text-base-content">{hand.label}</p>
              <p className="text-xs text-base-content/60">{hand.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 控制按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRealTimeToggle}
            className={`relative overflow-hidden rounded-2xl px-5 py-3 font-display text-sm
              ${isRealTime 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' 
                : 'bg-white text-base-content shadow-md border-2 border-dashed border-indigo-300'
              }`}
          >
            {isRealTime ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                切换到学习模式
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                切换到实时模式
              </span>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDigitalClock(!showDigitalClock)}
            className="bg-white rounded-2xl px-5 py-3 font-display text-sm text-base-content 
              shadow-md border-2 border-dashed border-amber-300"
          >
            {showDigitalClock ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">🙈</span>
                隐藏数字时钟
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-lg">👁️</span>
                显示数字时钟
              </span>
            )}
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
