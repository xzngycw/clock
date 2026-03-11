import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme, DifficultyLevel } from '@/types';
import { DEFAULT_USER_SETTINGS } from '@/constants';

interface SettingsState {
  theme: Theme;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  difficulty: DifficultyLevel;
  animationsEnabled: boolean;
  autoAdvance: boolean;
  showTimer: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  toggleAnimations: () => void;
  toggleAutoAdvance: () => void;
  toggleTimer: () => void;
  resetSettings: () => void;
}

const initialState = {
  theme: DEFAULT_USER_SETTINGS.theme,
  soundEnabled: DEFAULT_USER_SETTINGS.soundEnabled,
  musicEnabled: DEFAULT_USER_SETTINGS.musicEnabled,
  volume: DEFAULT_USER_SETTINGS.volume,
  difficulty: DEFAULT_USER_SETTINGS.difficulty,
  animationsEnabled: DEFAULT_USER_SETTINGS.animationsEnabled,
  autoAdvance: DEFAULT_USER_SETTINGS.autoAdvance,
  showTimer: DEFAULT_USER_SETTINGS.showTimer,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTheme: (theme) => set({ theme }),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      
      setVolume: (volume) => set({ volume }),
      
      setDifficulty: (difficulty) => set({ difficulty }),
      
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      
      toggleAutoAdvance: () => set((state) => ({ autoAdvance: !state.autoAdvance })),
      
      toggleTimer: () => set((state) => ({ showTimer: !state.showTimer })),
      
      resetSettings: () => set(initialState),
    }),
    {
      name: 'clock-app-settings',
    }
  )
);
