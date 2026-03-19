import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Home, ChartColumn } from 'lucide-react';
import { ROUTES } from '@/constants';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const navItems: NavItem[] = [
  { path: ROUTES.HOME, label: '首页', icon: <Home className="w-5 h-5" />, emoji: '🏠' },
  { path: ROUTES.LESSONS, label: '课程', icon: <BookOpen className="w-5 h-5" />, emoji: '📚' },
  { path: ROUTES.PRACTICE, label: '练习', icon: <Gamepad2 className="w-5 h-5" />, emoji: '🎮' },
  { path: ROUTES.PARENT_SUMMARY, label: '家长', icon: <ChartColumn className="w-5 h-5" />, emoji: '👨‍👩‍👧' },
];

export function Footer() {
  const location = useLocation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      <div className="absolute inset-0 border-t border-white/50 bg-white/80 backdrop-blur-md" />

      <nav className="relative container mx-auto px-1.5 sm:px-2">
        <ul className="flex h-14 items-center justify-around sm:h-16">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === ROUTES.LESSONS && location.pathname.startsWith('/lessons'));

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors sm:px-3 sm:py-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}

                  <motion.div
                    initial={false}
                    animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -2 : 0 }}
                    className={`relative z-10 ${isActive ? 'text-primary' : 'text-base-content/50'}`}
                  >
                    {isActive ? <span className="text-lg sm:text-xl">{item.emoji}</span> : <span className="scale-90 sm:scale-100">{item.icon}</span>}
                  </motion.div>

                  <motion.span
                    className={`relative z-10 text-[11px] font-medium sm:text-xs ${
                      isActive ? 'font-display text-primary' : 'text-base-content/50'
                    }`}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
