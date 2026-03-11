import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Clock, Watch, Gamepad2 } from 'lucide-react';
import { ROUTES } from '@/constants';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const navItems: NavItem[] = [
  { path: ROUTES.HOME, label: '首页', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
  { path: ROUTES.ANALOG_CLOCK, label: '模拟时钟', icon: <Clock className="w-5 h-5" />, emoji: '🕐' },
  { path: ROUTES.DIGITAL_CLOCK, label: '数字时钟', icon: <Watch className="w-5 h-5" />, emoji: '⌚' },
  { path: ROUTES.PRACTICE, label: '练习', icon: <Gamepad2 className="w-5 h-5" />, emoji: '🎮' },
];

export function Footer() {
  const location = useLocation();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      {/* 背景模糊效果 */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-white/50" />
      
      <nav className="relative container mx-auto px-2">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0
                    }}
                    className={`relative z-10 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-base-content/50'
                    }`}
                  >
                    {isActive ? (
                      <span className="text-xl">{item.emoji}</span>
                    ) : (
                      item.icon
                    )}
                  </motion.div>
                  
                  <motion.span 
                    className={`relative z-10 text-xs font-medium ${
                      isActive 
                        ? 'text-primary font-display' 
                        : 'text-base-content/50'
                    }`}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 
                        bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
