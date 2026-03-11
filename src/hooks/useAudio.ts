import { useEffect, useCallback } from 'react';
import { audioManager, type SoundType } from '@/services/audio';
import { useSettingsStore } from '@/store';

/**
 * 音频控制 Hook
 */
export function useAudio() {
  const { soundEnabled, musicEnabled, volume } = useSettingsStore();

  // 同步设置到音频管理器
  useEffect(() => {
    audioManager.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioManager.setMusicEnabled(musicEnabled);
  }, [musicEnabled]);

  useEffect(() => {
    audioManager.setVolume(volume);
  }, [volume]);

  // 播放音效
  const playSound = useCallback((type: SoundType) => {
    audioManager.play(type);
  }, []);

  // 停止音效
  const stopSound = useCallback((type: SoundType) => {
    audioManager.stop(type);
  }, []);

  // 播放背景音乐
  const playBackgroundMusic = useCallback((src: string) => {
    audioManager.playBackgroundMusic(src);
  }, []);

  // 停止背景音乐
  const stopBackgroundMusic = useCallback(() => {
    audioManager.stopBackgroundMusic();
  }, []);

  return {
    playSound,
    stopSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    isSoundEnabled: soundEnabled,
    isMusicEnabled: musicEnabled,
    volume,
  };
}
