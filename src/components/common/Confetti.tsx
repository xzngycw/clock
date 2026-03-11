import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  /**
   * 是否触发彩带效果
   */
  trigger: boolean;
  
  /**
   * 彩带类型
   */
  type?: 'correct' | 'complete' | 'achievement';
  
  /**
   * 触发后的回调
   */
  onComplete?: () => void;
}

/**
 * 彩带效果组件
 */
export function Confetti({ trigger, type = 'correct', onComplete }: ConfettiProps) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;

      switch (type) {
        case 'correct':
          // 简单的彩带效果
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            zIndex: 9999,
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            zIndex: 9999,
          });
          setTimeout(() => {
            onComplete?.();
          }, 500);
          break;

        case 'complete':
          // 烟花效果
          const duration = 3000;
          const animationEnd = Date.now() + duration;

          const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              clearInterval(interval);
              onComplete?.();
              return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
              particleCount,
              startVelocity: 30,
              spread: 360,
              origin: {
                x: Math.random() * 0.6 + 0.2,
                y: Math.random() - 0.2,
              },
              zIndex: 9999,
            });
          }, 250);
          break;

        case 'achievement':
          // 星星效果
          confetti({
            particleCount: 40,
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ['star'],
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
            scalar: 1.2,
            zIndex: 9999,
          });
          setTimeout(() => {
            onComplete?.();
          }, 1000);
          break;
      }
    }
  }, [trigger, type, onComplete]);

  useEffect(() => {
    // 重置触发状态
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger]);

  return null; // 不渲染任何 DOM 元素
}
