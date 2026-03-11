import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout';
import { AnalogClock, DigitalClock } from '@/components/clock';
import { ClockTimeUtils } from '@/utils';
import type { ClockTime } from '@/types';
import { Sun, Moon, Settings } from 'lucide-react';

export function DigitalClockPage() {
  const [time, setTime] = useState<ClockTime>(ClockTimeUtils.now());
  const [isRealTime, setIsRealTime] = useState(true);
  const [showAnalogClock, setShowAnalogClock] = useState(true);
  const [format, setFormat] = useState<'12h' | '24h'>('12h');
  
  // 实时更新时间
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      setTime(ClockTimeUtils.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRealTime]);
  
  // 处理时间变化
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
  
  return (
    <Layout title="认识数字时钟" showBack showFooter={false}>
      <div className="flex flex-col items-center gap-6 py-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 网格背景 */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* 渐变光斑 */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full
              bg-gradient-to-br from-indigo-400/30 to-cyan-400/30 blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full
              bg-gradient-to-br from-amber-400/30 to-orange-400/30 blur-3xl"
          />
        </div>
        
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center z-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 
            text-white rounded-full px-4 py-1.5 shadow-lg shadow-indigo-500/30 mb-3">
            <span className="text-xl">⌚</span>
            <span className="font-display">数字时钟</span>
          </div>
          <p className="text-base-content/70 text-sm">
            数字直接显示时间，一目了然！
          </p>
        </motion.div>
        
        {/* 主时钟显示 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative z-10"
        >
          {/* 时钟容器 */}
          <div className="relative">
            {/* 外部装饰环 */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              rounded-3xl opacity-20 blur-xl" />
            
            {/* 主卡片 */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-500/10
              border border-white/50">
              
              {/* 时间格式指示 */}
              <div className="absolute top-3 right-4 flex items-center gap-1">
                <span className="text-xs text-base-content/50 font-medium">
                  {format === '12h' ? '12小时制' : '24小时制'}
                </span>
              </div>
              
              {/* 数字时钟组件 */}
              <DigitalClock
                time={time}
                size="lg"
                editable={!isRealTime}
                showSeconds
                format={format}
                onTimeChange={handleTimeChange}
              />
              
              {/* 编辑模式提示 */}
              {!isRealTime && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 
                    text-xs font-medium px-3 py-1 rounded-full">
                    <Settings className="w-3 h-3" />
                    点击箭头调整时间
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* 对应的模拟时钟 */}
        <AnimatePresence>
          {showAnalogClock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative z-10"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                <AnalogClock
                  time={time}
                  size={160}
                  draggable={false}
                  showNumbers
                  showMinuteMarks={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 数字说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm z-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: time.hours.toString().padStart(2, '0'), label: '小时', range: '0-23', color: 'text-indigo-500' },
                { value: time.minutes.toString().padStart(2, '0'), label: '分钟', range: '0-59', color: 'text-amber-500' },
                { value: time.seconds.toString().padStart(2, '0'), label: '秒', range: '0-59', color: 'text-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`font-display text-2xl ${item.color}`}
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-xs text-base-content/70 mt-1">{item.label}</div>
                  <div className="text-xs text-base-content/40">({item.range})</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* 控制按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 justify-center z-10"
        >
          {/* 模式切换 */}
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
            <span className="flex items-center gap-2">
              {isRealTime ? (
                <>
                  <span className="text-lg">🎬</span>
                  切换到学习模式
                </>
              ) : (
                <>
                  <span className="text-lg">⏰</span>
                  切换到实时模式
                </>
              )}
            </span>
          </motion.button>
          
          {/* 显示/隐藏模拟时钟 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAnalogClock(!showAnalogClock)}
            className="bg-white rounded-2xl px-5 py-3 font-display text-sm text-base-content 
              shadow-md border-2 border-dashed border-amber-300"
          >
            <span className="flex items-center gap-2">
              {showAnalogClock ? (
                <>
                  <span className="text-lg">🕐</span>
                  隐藏模拟时钟
                </>
              ) : (
                <>
                  <span className="text-lg">🕐</span>
                  显示模拟时钟
                </>
              )}
            </span>
          </motion.button>
          
          {/* 时间格式切换 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFormat(format === '12h' ? '24h' : '12h')}
            className="bg-white rounded-2xl px-5 py-3 font-display text-sm text-base-content 
              shadow-md border-2 border-dashed border-emerald-300"
          >
            <span className="flex items-center gap-2">
              {format === '12h' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  切换到24小时制
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  切换到12小时制
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
