import { Link } from 'react-router-dom';
import { motion, type Easing } from 'framer-motion';
import { Clock, Watch, Timer, Gamepad2, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/constants';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
  shadowColor: string;
  emoji: string;
}

const features: FeatureCard[] = [
  {
    title: '认识时间',
    description: '学习时间的奥秘',
    icon: <Timer className="w-7 h-7" />,
    path: ROUTES.LEARN_TIME,
    gradient: 'from-indigo-500 to-purple-500',
    shadowColor: 'shadow-indigo-500/30',
    emoji: '⏰',
  },
  {
    title: '模拟时钟',
    description: '学习读取指针时钟',
    icon: <Clock className="w-7 h-7" />,
    path: ROUTES.ANALOG_CLOCK,
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/30',
    emoji: '🕐',
  },
  {
    title: '数字时钟',
    description: '认识数字时间显示',
    icon: <Watch className="w-7 h-7" />,
    path: ROUTES.DIGITAL_CLOCK,
    gradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-500/30',
    emoji: '⌚',
  },
  {
    title: '游戏练习',
    description: '边玩边学更有趣',
    icon: <Gamepad2 className="w-7 h-7" />,
    path: ROUTES.PRACTICE,
    gradient: 'from-rose-400 to-pink-500',
    shadowColor: 'shadow-rose-500/30',
    emoji: '🎮',
  },
];

// 浮动装饰动画变体
const floatVariants = {
  animate: (i: number) => ({
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as Easing,
    },
  }),
};

// 卡片动画变体
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export function HomePage() {
  return (
    <Layout showBack={false} showFooter={true}>
      <div className="relative flex flex-col items-center gap-8 py-6 overflow-hidden">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 浮动的时钟图标 */}
          {['🕐', '🕑', '🕒', '🕓', '🕔', '🕕'].map((emoji, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={floatVariants}
              animate="animate"
              className="absolute text-3xl opacity-20"
              style={{
                left: `${10 + i * 15}%`,
                top: `${5 + (i % 3) * 25}%`,
              }}
            >
              {emoji}
            </motion.span>
          ))}
          
          {/* 装饰性圆形 */}
          <div className="decoration-circle w-64 h-64 -top-20 -right-20 opacity-50" />
          <div className="decoration-circle w-48 h-48 bottom-20 -left-10 opacity-40" />
          <div className="decoration-blob w-32 h-32 top-1/3 right-10 opacity-30" />
        </div>

        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl sm:text-7xl block mb-2">⏰</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl mb-3"
          >
            <span className="text-gradient">认识时间</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-base-content/70 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            让我们一起学习认识时间吧！
            <Sparkles className="w-5 h-5 text-amber-500" />
          </motion.p>
        </motion.div>

        {/* 功能卡片区域 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-2xl relative z-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Link
                to={feature.path}
                className={`group relative block bg-white rounded-3xl p-5 overflow-hidden
                  shadow-lg ${feature.shadowColor} hover:shadow-xl transition-shadow duration-300`}
              >
                {/* 卡片背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 
                  group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* 内容 */}
                <div className="relative flex items-start gap-4">
                  {/* 图标区域 */}
                  <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl 
                    bg-gradient-to-br ${feature.gradient} 
                    flex items-center justify-center text-white
                    shadow-lg transform group-hover:scale-110 group-hover:rotate-3 
                    transition-transform duration-300`}
                  >
                    {feature.icon}
                    {/* 光晕效果 */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                      blur-lg opacity-50 group-hover:opacity-70 transition-opacity`} />
                  </div>
                  
                  {/* 文字区域 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{feature.emoji}</span>
                      <h3 className="font-display text-xl text-base-content group-hover:text-primary 
                        transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm text-base-content/60 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* 箭头指示 */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 
                  opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 
                  transition-all duration-300">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.gradient} 
                    flex items-center justify-center text-white text-sm`}>
                    →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-2 text-base-content/50 text-sm"
        >
          <span className="animate-bounce">👆</span>
          点击卡片开始学习
        </motion.div>
      </div>
    </Layout>
  );
}
