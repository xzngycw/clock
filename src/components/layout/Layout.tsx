import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSettingsStore, useProgressStore } from '@/store';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showFooter?: boolean;
  showThemeToggle?: boolean;
}

export function Layout({ 
  children, 
  title,
  showBack = false,
  showFooter = true,
  showThemeToggle = true,
}: LayoutProps) {
  const { theme } = useSettingsStore();
  const { initProgress } = useProgressStore();
  
  // 初始化用户进度
  useEffect(() => {
    initProgress();
  }, [initProgress]);
  
  // 应用主题
  useEffect(() => {
    const html = document.documentElement;
    
    // 移除所有主题类
    html.classList.remove('light', 'dark', 'eyecare');
    
    // 设置 DaisyUI 主题
    html.setAttribute('data-theme', theme);
    
    // 添加主题类
    html.classList.add(theme);
  }, [theme]);
  
  return (
    <div className="min-h-screen relative">
      {/* 背景装饰层 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 
          rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-200/30 
          rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          title={title} 
          showBack={showBack}
          showThemeToggle={showThemeToggle}
        />
        
        <main className={`flex-1 container mx-auto px-3 sm:px-4 py-2 sm:py-4 ${showFooter ? 'pb-16 sm:pb-20' : ''}`}>
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </div>
  );
}
