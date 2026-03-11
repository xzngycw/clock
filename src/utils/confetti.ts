import confetti from 'canvas-confetti';

/**
 * 彩带效果 - 答对题目时使用
 */
export function celebrateCorrect() {
  const count = 100;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * 烟花效果 - 完成所有练习时使用
 */
export function celebrateComplete() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 9999,
  };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // 左侧烟花
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // 右侧烟花
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * 星星爆炸效果 - 获得成就时使用
 */
export function celebrateAchievement() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'] as confetti.Shape[],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    zIndex: 9999,
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

/**
 * 简单的彩带效果 - 答对一题
 */
export function miniCelebration() {
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    zIndex: 9999,
  });

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    zIndex: 9999,
  });
}

/**
 * 爱心雨效果 - 特殊鼓励
 */
export function heartRain() {
  const duration = 2000;
  const animationEnd = Date.now() + duration;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0 },
      colors: ['#ff0000', '#ff69b4', '#ff1493'],
      shapes: ['circle'],
      gravity: 0.5,
      scalar: 2,
      drift: 0,
      zIndex: 9999,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0 },
      colors: ['#ff0000', '#ff69b4', '#ff1493'],
      shapes: ['circle'],
      gravity: 0.5,
      scalar: 2,
      drift: 0,
      zIndex: 9999,
    });
  }, 100);
}

/**
 * 清除所有彩带效果
 */
export function clearConfetti() {
  confetti.reset();
}
