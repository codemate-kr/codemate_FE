import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { useTimerStore, useActiveTimerCount } from '../../store/timerStore';
import { formatTime } from '../../hooks/useTimer';

interface TimerItemProps {
  problemId: number;
  problemTitle: string;
  startedAt: number;
  accumulatedTime: number;
  isPaused: boolean;
  onPause: (problemId: number) => void;
  onResume: (problemId: number) => void;
  onReset: (problemId: number) => void;
  onCancel: (problemId: number) => void;
}

function TimerItem({ problemId, problemTitle, startedAt, accumulatedTime, isPaused, onPause, onResume, onReset, onCancel }: TimerItemProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      if (isPaused) {
        return Math.floor(accumulatedTime / 1000);
      } else {
        const currentSessionMs = Date.now() - startedAt;
        return Math.floor((accumulatedTime + currentSessionMs) / 1000);
      }
    };

    setElapsed(calculateElapsed());

    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, accumulatedTime, isPaused]);

  // 1시간 초과 여부
  const isOverTime = elapsed > 60 * 60;

  return (
    <div className={`flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg transition-colors ${
      isPaused ? 'bg-orange-50/50' : 'bg-blue-50/50'
    }`}>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs text-gray-600 truncate font-medium" title={problemTitle}>
          {problemTitle} <span className="text-gray-400">#{problemId}</span>
        </p>
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
          <span className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
            isOverTime ? 'text-red-500' : isPaused ? 'text-orange-500' : 'text-blue-600'
          }`}>
            {formatTime(elapsed)}
          </span>
          {isPaused && (
            <span className="text-[9px] sm:text-[10px] text-orange-500 bg-orange-100 px-1 sm:px-1.5 py-0.5 rounded font-medium">
              일시정지
            </span>
          )}
          {isOverTime && !isPaused && (
            <span className="text-[9px] sm:text-[10px] text-red-500 bg-red-100 px-1 sm:px-1.5 py-0.5 rounded font-medium">
              1시간 초과
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* 일시정지/재개 */}
        <button
          onClick={() => isPaused ? onResume(problemId) : onPause(problemId)}
          className={`p-1.5 sm:p-2 rounded-lg transition-all ${
            isPaused
              ? 'text-green-600 bg-green-100 hover:bg-green-200 active:bg-green-300'
              : 'text-orange-500 bg-orange-100 hover:bg-orange-200 active:bg-orange-300'
          }`}
          title={isPaused ? '재개' : '일시정지'}
        >
          {isPaused ? <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        </button>
        {/* 초기화 */}
        <button
          onClick={() => onReset(problemId)}
          className="p-1.5 sm:p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all"
          title="초기화"
        >
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        {/* 취소 */}
        <button
          onClick={() => onCancel(problemId)}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 active:bg-red-200 rounded-lg transition-all"
          title="타이머 취소"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}

export function FloatingTimerWidget() {
  const activeTimerCount = useActiveTimerCount();
  const { activeTimers, pauseTimer, resumeTimer, resetTimer, cancelTimer } = useTimerStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [primaryElapsed, setPrimaryElapsed] = useState(0);

  const timerEntries = Object.values(activeTimers);
  const primaryTimer = timerEntries[0];

  // 대표 타이머 시간 업데이트
  useEffect(() => {
    if (!primaryTimer) return;

    const calculateElapsed = () => {
      if (primaryTimer.isPaused) {
        return Math.floor(primaryTimer.accumulatedTime / 1000);
      } else {
        const currentSessionMs = Date.now() - primaryTimer.startedAt;
        return Math.floor((primaryTimer.accumulatedTime + currentSessionMs) / 1000);
      }
    };

    setPrimaryElapsed(calculateElapsed());

    if (primaryTimer.isPaused) return;

    const interval = setInterval(() => {
      setPrimaryElapsed(calculateElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, [primaryTimer]);

  // 활성 타이머가 없으면 렌더링하지 않음
  if (activeTimerCount === 0) {
    return null;
  }

  // 일시정지 중인 타이머가 있는지 확인
  const hasAnyPaused = timerEntries.some(t => t.isPaused);
  // 1시간 초과 타이머가 있는지 확인
  const hasOverTime = primaryElapsed > 60 * 60;

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200/80 overflow-hidden min-w-[260px] max-w-[300px] sm:min-w-[280px] sm:max-w-[340px]">
        {/* 헤더 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between transition-all ${
            hasOverTime ? 'bg-red-50 hover:bg-red-100 active:bg-red-200' :
            hasAnyPaused ? 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200' :
            'bg-blue-50 hover:bg-blue-100 active:bg-blue-200'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className={`p-1 sm:p-1.5 rounded-lg ${
              hasOverTime ? 'bg-red-100' :
              hasAnyPaused ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <Timer className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                hasOverTime ? 'text-red-600' :
                hasAnyPaused ? 'text-orange-600' : 'text-blue-600 animate-pulse'
              }`} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                풀이 타이머
              </span>
              <span className={`text-sm sm:text-base font-bold tabular-nums ${
                hasOverTime ? 'text-red-600' :
                hasAnyPaused ? 'text-orange-600' : 'text-gray-900'
              }`}>
                {activeTimerCount === 1 ? (
                  <span className="font-mono">{formatTime(primaryElapsed)}</span>
                ) : (
                  <span>{activeTimerCount}개 진행 중</span>
                )}
              </span>
            </div>
          </div>
          <div className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
            isExpanded ? 'bg-gray-100' : 'bg-transparent'
          }`}>
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
            )}
          </div>
        </button>

        {/* 확장된 타이머 목록 */}
        {isExpanded && (
          <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2 bg-gray-50/50 max-h-[50vh] overflow-y-auto">
            {timerEntries.map((timer) => (
              <TimerItem
                key={timer.problemId}
                problemId={timer.problemId}
                problemTitle={timer.problemTitle}
                startedAt={timer.startedAt}
                accumulatedTime={timer.accumulatedTime}
                isPaused={timer.isPaused}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onReset={resetTimer}
                onCancel={cancelTimer}
              />
            ))}

            {/* 안내 메시지 */}
            <div className="pt-1.5 sm:pt-2 border-t border-gray-200/80">
              <p className="text-[10px] sm:text-[11px] text-gray-500 text-center leading-relaxed">
                <span className="text-blue-600 font-semibold">해결 인증</span> 시 자동 완료 · 1시간 내 풀이 목표
                <br />
                (서버에는 저장되지 않습니다.)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
