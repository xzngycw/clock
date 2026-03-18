/**
 * 音效类型
 */
export type SoundType = 
  | 'correct'          // 答对音效
  | 'wrong'            // 答错音效
  | 'click'            // 点击音效
  | 'success'          // 成功音效
  | 'complete'         // 完成音效
  | 'tick'             // 时钟滴答声
  | 'cheer'            // 欢呼音效
  | 'star'             // 星星闪烁音效
  | 'transition';      // 页面过渡音效

/**
 * 使用 Web Audio API 生成音效
 */
const generateBeep = (frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> => {
  return new Promise((resolve) => {
    const audioWindow = window as Window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioContextClass = globalThis.AudioContext ?? audioWindow.webkitAudioContext;
    if (!AudioContextClass) {
      resolve();
      return;
    }

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    setTimeout(() => {
      audioContext.close();
      resolve();
    }, duration * 1000);
  });
};

/**
 * 播放成功音效（上升音调）
 */
const playSuccessBeep = async () => {
  await generateBeep(523, 0.1); // C5
  await generateBeep(659, 0.1); // E5
  await generateBeep(784, 0.2); // G5
};

/**
 * 播放错误音效（下降音调）
 */
const playErrorBeep = async () => {
  await generateBeep(400, 0.15);
  await generateBeep(300, 0.15);
};

/**
 * 播放点击音效
 */
const playClickBeep = () => {
  return generateBeep(800, 0.05, 'square');
};

/**
 * 播放完成音效（和弦）
 */
const playCompleteBeep = async () => {
  await generateBeep(523, 0.1); // C5
  await generateBeep(659, 0.1); // E5
  await generateBeep(784, 0.1); // G5
  await generateBeep(1047, 0.3); // C6
};

/**
 * 使用 Web Speech API 播放语音
 */
const speak = (text: string, lang: string = 'zh-CN') => {
  if ('speechSynthesis' in window) {
    // 取消之前的语音
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * 赞美语句
 */
const PRAISE_MESSAGES = [
  '太棒了！',
  '你真聪明！',
  '答对了！',
  '做得好！',
  '继续加油！',
  '真厉害！',
  '很棒哦！',
  '你学得真快！',
];

/**
 * 鼓励语句
 */
const ENCOURAGE_MESSAGES = [
  '没关系，再试一次！',
  '加油！',
  '继续努力哦！',
  '不要灰心！',
  '再想一想！',
  '你可以的！',
];

/**
 * 随机选择
 */
const randomChoice = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 音频管理类
 */
class AudioManager {
  private enabled: boolean = true;
  private volume: number = 1;
  private voiceEnabled: boolean = false;
  private musicEnabled: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;

  /**
   * 播放音效
   */
  async play(type: SoundType) {
    if (!this.enabled) return;

    try {
      switch (type) {
        case 'correct':
          await playSuccessBeep();
          if (this.voiceEnabled) {
            speak(randomChoice(PRAISE_MESSAGES));
          }
          break;
        case 'wrong':
          await playErrorBeep();
          if (this.voiceEnabled) {
            speak(randomChoice(ENCOURAGE_MESSAGES));
          }
          break;
        case 'click':
          await playClickBeep();
          break;
        case 'success':
        case 'complete':
          await playCompleteBeep();
          break;
        case 'star':
          await generateBeep(1200, 0.1, 'sine');
          break;
        case 'transition':
          await generateBeep(600, 0.1);
          break;
        default:
          await playClickBeep();
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${type}`, error);
    }
  }

  /**
   * 停止音效（Web Audio API 不需要手动停止）
   */
  stop(type: SoundType) {
    void type;
    // Web Audio API 音效会自动停止
    // 但我们可以停止语音
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * 设置音效开关
   */
  setSoundEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * 设置语音开关
   */
  setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * 设置音乐开关
   */
  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
  }

  /**
   * 播放背景音乐
   */
  playBackgroundMusic(src: string) {
    if (!this.musicEnabled) return;

    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.src = src;
    } else {
      this.backgroundMusic = new Audio(src);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.volume;
    }

    this.backgroundMusic.play().catch(error => {
      console.warn('Failed to play background music:', error);
    });
  }

  /**
   * 停止背景音乐
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * 获取音效是否已启用
   */
  isSoundEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 获取语音是否已启用
   */
  isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  /**
   * 获取当前音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 清理所有音频资源
   */
  cleanup() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }
  }
}

// 导出单例
export const audioManager = new AudioManager();

// 便捷方法
export const playSound = (type: SoundType) => audioManager.play(type);
export const stopSound = (type: SoundType) => audioManager.stop(type);
