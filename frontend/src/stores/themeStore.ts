import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true, // Default to dark mode matching the UI design
      toggle: () => set((s) => {
        const next = !s.isDark;
        document.documentElement.classList.toggle('dark', next);
        return { isDark: next };
      }),
    }),
    { name: 'theme-storage' }
  )
);
