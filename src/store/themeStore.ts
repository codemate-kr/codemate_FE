import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  syncSystemTheme: (resolvedTheme: ResolvedTheme) => void;
}

const THEME_STORAGE_KEY = 'theme-storage';

const isBrowser = typeof window !== 'undefined';

export const getSystemTheme = (): ResolvedTheme => {
  if (!isBrowser || !window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'light';
  }

  return 'dark';
};

export const resolveTheme = (theme: ThemePreference): ResolvedTheme => {
  return theme === 'system' ? getSystemTheme() : theme;
};

export const applyTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
};

const readStoredTheme = (): ThemePreference => {
  if (!isBrowser) {
    return 'system';
  }

  try {
    const rawValue = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!rawValue) {
      return 'system';
    }

    const parsedValue = JSON.parse(rawValue) as {
      state?: {
        theme?: unknown;
      };
    };

    const storedTheme = parsedValue.state?.theme;
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme;
    }
  } catch {
    return 'system';
  }

  return 'system';
};

const initialTheme = readStoredTheme();
const initialResolvedTheme = resolveTheme(initialTheme);

export const bootstrapTheme = () => {
  applyTheme(initialResolvedTheme);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      resolvedTheme: initialResolvedTheme,

      setTheme: (theme) => {
        const resolvedTheme = resolveTheme(theme);
        applyTheme(resolvedTheme);

        set({
          theme,
          resolvedTheme,
        });
      },

      toggleTheme: () => {
        const nextTheme = get().resolvedTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
      },

      syncSystemTheme: (resolvedTheme) => {
        if (get().theme !== 'system') {
          return;
        }

        applyTheme(resolvedTheme);
        set({ resolvedTheme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
