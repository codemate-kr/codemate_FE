import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '../store/timerStore';

interface UseTimerOptions {
  problemId: number;
  problemTitle: string;
}

interface UseTimerReturn {
  // 상태
  isRunning: boolean;      // 타이머가 활성화됨 (일시정지 포함)
  isPaused: boolean;       // 일시정지 상태
  isCompleted: boolean;    // 완료됨
  elapsedSeconds: number;
  completedDuration: number | null;

  // 액션
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  cancel: () => void;

  // 포맷된 시간
  formattedTime: string;
}

// 초를 MM:SS 형식으로 변환
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 초를 "X분 Y초" 형식으로 변환
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}초`;
  if (secs === 0) return `${mins}분`;
  return `${mins}분 ${secs}초`;
};

export function useTimer({ problemId, problemTitle }: UseTimerOptions): UseTimerReturn {
  const {
    activeTimers,
    completedTimers,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    cancelTimer,
  } = useTimerStore();

  const activeTimer = activeTimers[problemId];
  const completedTimer = completedTimers[problemId];

  const isRunning = !!activeTimer;
  const isPaused = activeTimer?.isPaused ?? false;
  const isCompleted = !!completedTimer;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 타이머 경과 시간 계산
  useEffect(() => {
    if (!activeTimer) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      if (activeTimer.isPaused) {
        // 일시정지 상태: 누적 시간만 표시
        return Math.floor(activeTimer.accumulatedTime / 1000);
      } else {
        // 진행 중: 누적 시간 + 현재 세션 시간
        const currentSessionMs = Date.now() - activeTimer.startedAt;
        return Math.floor((activeTimer.accumulatedTime + currentSessionMs) / 1000);
      }
    };

    setElapsedSeconds(calculateElapsed());

    // 일시정지 상태면 업데이트 불필요
    if (activeTimer.isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const start = useCallback(() => {
    startTimer(problemId, problemTitle);
  }, [problemId, problemTitle, startTimer]);

  const pause = useCallback(() => {
    pauseTimer(problemId);
  }, [problemId, pauseTimer]);

  const resume = useCallback(() => {
    resumeTimer(problemId);
  }, [problemId, resumeTimer]);

  const reset = useCallback(() => {
    resetTimer(problemId);
  }, [problemId, resetTimer]);

  const cancel = useCallback(() => {
    cancelTimer(problemId);
  }, [problemId, cancelTimer]);

  return {
    isRunning,
    isPaused,
    isCompleted,
    elapsedSeconds,
    completedDuration: completedTimer?.duration ?? null,
    start,
    pause,
    resume,
    reset,
    cancel,
    formattedTime: formatTime(elapsedSeconds),
  };
}
