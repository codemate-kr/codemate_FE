import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerEntry {
  problemId: number;
  problemTitle: string;
  startedAt: number;           // timestamp
  pausedAt?: number;           // 일시정지된 시점 timestamp
  accumulatedTime: number;     // 일시정지 전까지 누적된 시간 (ms)
  endedAt?: number;            // timestamp (풀이 완료 시)
  duration?: number;           // 걸린 시간 (초)
  isPaused: boolean;           // 일시정지 상태
}

interface TimerState {
  // 진행 중인 타이머들
  activeTimers: Record<number, TimerEntry>;
  // 완료된 타이머 기록
  completedTimers: Record<number, TimerEntry>;

  // Actions
  startTimer: (problemId: number, problemTitle: string) => void;
  stopTimer: (problemId: number) => void;
  pauseTimer: (problemId: number) => void;
  resumeTimer: (problemId: number) => void;
  resetTimer: (problemId: number) => void;
  cancelTimer: (problemId: number) => void;
  getTimer: (problemId: number) => TimerEntry | null;
  getActiveTimerCount: () => number;
  clearAllTimers: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTimers: {},
      completedTimers: {},

      startTimer: (problemId: number, problemTitle: string) => {
        // 이미 타이머가 있으면 무시
        if (get().activeTimers[problemId]) return;

        const now = Date.now();
        set((state) => ({
          activeTimers: {
            ...state.activeTimers,
            [problemId]: {
              problemId,
              problemTitle,
              startedAt: now,
              accumulatedTime: 0,
              isPaused: false,
            },
          },
        }));
      },

      stopTimer: (problemId: number) => {
        const timer = get().activeTimers[problemId];
        if (!timer) return;

        const now = Date.now();
        // 일시정지 상태면 누적 시간만 사용, 아니면 현재까지 시간 추가
        const totalMs = timer.isPaused
          ? timer.accumulatedTime
          : timer.accumulatedTime + (now - timer.startedAt);
        const duration = Math.floor(totalMs / 1000);

        set((state) => {
          const { [problemId]: _, ...remainingActive } = state.activeTimers;
          return {
            activeTimers: remainingActive,
            completedTimers: {
              ...state.completedTimers,
              [problemId]: {
                ...timer,
                endedAt: now,
                duration,
                isPaused: false,
              },
            },
          };
        });
      },

      pauseTimer: (problemId: number) => {
        const timer = get().activeTimers[problemId];
        if (!timer || timer.isPaused) return;

        const now = Date.now();
        const elapsedSinceStart = now - timer.startedAt;

        set((state) => ({
          activeTimers: {
            ...state.activeTimers,
            [problemId]: {
              ...timer,
              pausedAt: now,
              accumulatedTime: timer.accumulatedTime + elapsedSinceStart,
              isPaused: true,
            },
          },
        }));
      },

      resumeTimer: (problemId: number) => {
        const timer = get().activeTimers[problemId];
        if (!timer || !timer.isPaused) return;

        const now = Date.now();

        set((state) => ({
          activeTimers: {
            ...state.activeTimers,
            [problemId]: {
              ...timer,
              startedAt: now,  // 재개 시점을 새 시작점으로
              pausedAt: undefined,
              isPaused: false,
            },
          },
        }));
      },

      resetTimer: (problemId: number) => {
        const timer = get().activeTimers[problemId];
        if (!timer) return;

        const now = Date.now();

        set((state) => ({
          activeTimers: {
            ...state.activeTimers,
            [problemId]: {
              ...timer,
              startedAt: now,
              pausedAt: undefined,
              accumulatedTime: 0,
              isPaused: false,
            },
          },
        }));
      },

      cancelTimer: (problemId: number) => {
        set((state) => {
          const { [problemId]: _, ...remainingActive } = state.activeTimers;
          return { activeTimers: remainingActive };
        });
      },

      getTimer: (problemId: number) => {
        const active = get().activeTimers[problemId];
        if (active) return active;
        const completed = get().completedTimers[problemId];
        if (completed) return completed;
        return null;
      },

      getActiveTimerCount: () => {
        return Object.keys(get().activeTimers).length;
      },

      clearAllTimers: () => {
        set({ activeTimers: {}, completedTimers: {} });
      },
    }),
    {
      name: 'solve-timer-store',
      partialize: (state) => ({
        activeTimers: state.activeTimers,
        completedTimers: state.completedTimers,
      }),
    }
  )
);

// Selector hooks
export const useActiveTimers = () => useTimerStore((state) => state.activeTimers);
export const useCompletedTimers = () => useTimerStore((state) => state.completedTimers);
export const useActiveTimerCount = () => useTimerStore((state) => Object.keys(state.activeTimers).length);
