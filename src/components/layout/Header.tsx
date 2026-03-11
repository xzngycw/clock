import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Glasses, Home } from 'lucide-react';
import { useSettingsStore } from '@/store';
import { ROUTES } from '@/constants';
import type { Theme } from '@/types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showThemeToggle?: boolean;
}

const themeConfig: Record<Theme, { icon: React.ReactNode; label: string; color: string }> = {
  light: { icon: <Sun className="w-4 h-4" />, label: '明亮', color: 'text-amber-500' },
  dark: { icon: <Moon className="w-4 h-4" />, label: '暗黑', color: 'text-indigo-400' },
  eyecare: { icon: <Glasses className="w-4 h-4" />, label: '护眼', color: 'text-emerald-500' },
};

const themeCycle: Theme[] = ['light', 'eyecare', 'dark'];

export function Header({ 
  title = '认识时间', 
  showBack = false,
  showThemeToggle = true 
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useSettingsStore();
  
  // 检查是否在首页
  const isHomePage = location.pathname === ROUTES.HOME;
  
  const handleThemeToggle = () => {
    const currentIndex = themeCycle.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    setTheme(themeCycle[nextIndex]);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* 左侧 - 返回按钮或 Logo */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 rounded-xl 
                  bg-white/80 shadow-sm border border-white/50
                  text-base-content/70 hover:text-primary hover:bg-primary/5
                  transition-colors"
                aria-label="返回"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            ) : (
              <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🕐
                </motion.span>
                <span className="font-display text-lg text-gradient hidden sm:inline">
                  认识时间
                </span>
              </Link>
            )}
            
            {/* 回到首页按钮（非首页显示） */}
            {!isHomePage && (
              <Link to={ROUTES.HOME}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl 
                    bg-white/80 shadow-sm border border-white/50
                    text-base-content/70 hover:text-primary hover:bg-primary/5
                    transition-colors ml-2"
                  aria-label="回到首页"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">
                    首页
                  </span>
                </motion.button>
              </Link>
            )}
          </div>
          
          {/* 中间 - 标题 */}
          {title && showBack && (
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-lg text-base-content"
            >
              {title}
            </motion.h1>
          )}
          
          {/* 右侧 - 主题切换 */}
          {showThemeToggle && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleThemeToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl 
                bg-white/80 shadow-sm border border-white/50
                hover:bg-primary/5 transition-colors ${themeConfig[theme].color}`}
              aria-label="切换主题"
            >
              {themeConfig[theme].icon}
              <span className="text-xs font-medium hidden sm:inline">
                {themeConfig[theme].label}
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
