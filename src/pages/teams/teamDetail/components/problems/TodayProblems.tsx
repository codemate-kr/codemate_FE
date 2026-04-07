import { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, ExternalLink, CheckCircle, Settings, Loader2, Sparkles, Pause, Play, RotateCcw, Clock } from 'lucide-react';
import { type TodayProblemsResponse } from '../../../../../api/teams';
import { squadsApi, type SquadRecommendationSettingsResponse } from '../../../../../api/squads';
import { recommendationApi } from '../../../../../api/recommendation';
import { getTierIcon } from '../../../../../components/common/TierIcon';
import { verifyProblemSolved, triggerSuccessConfetti, type VerifyErrorType } from '../../../../../utils/problemVerify';
import { getApiErrorCode, getApiErrorMessage, getApiErrorStatus } from '../../../../../utils/apiError';
import { useTimerStore } from '../../../../../store/timerStore';
import { useTimer, formatDuration } from '../../../../../hooks/useTimer';
import Tooltip from '../../../../../components/common/Tooltip';
import { MissionActionButton } from './MissionActionButton';

// 개별 문제의 타이머 표시 컴포넌트 (일시정지/초기화 버튼 포함)
function ProblemTimerDisplay({ problemId, problemTitle, isSolved, solvedTime }: { problemId: number; problemTitle: string; isSolved: boolean | null; solvedTime?: string }) {
  const { isRunning, isPaused, isCompleted, completedDuration, pause, resume, reset, formattedTime } = useTimer({ problemId, problemTitle });

  // 해결된 문제: solvedTime이 있으면 그것을, 없으면 로컬 타이머 사용
  if (isSolved) {
    const displayTime = solvedTime || (isCompleted && completedDuration !== null ? formatDuration(completedDuration) : null);
    if (displayTime) {
      return (
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-xs text-green-600 dark:text-green-400">
          <CheckCircle className="h-3.5 w-3.5" />
          <span className="font-medium">{displayTime}</span>
        </div>
      );
    }
    // 해결됐지만 시간 정보 없음
    return (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-xs text-green-600 dark:text-green-400">
        <CheckCircle className="h-3.5 w-3.5" />
      </div>
    );
  }

  if (isCompleted && completedDuration !== null) {
    // 완료 상태: 걸린 시간 표시
    return (
      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 dark:bg-green-900/20 text-xs text-green-600 dark:text-green-400">
        <CheckCircle className="h-3.5 w-3.5" />
        <span className="font-medium">{formatDuration(completedDuration)}</span>
      </div>
    );
  }

  if (isRunning) {
    // 진행 중 또는 일시정지: 경과 시간 + 일시정지/재개 + 초기화 버튼
    return (
      <div className="flex items-center gap-0.5">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-mono font-medium ${isPaused ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-300' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'}`}>
          <Clock className={`h-3.5 w-3.5 ${isPaused ? '' : 'animate-pulse'}`} />
          <span>{formattedTime}</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isPaused) {
              resume();
            } else {
              pause();
            }
          }}
          className={`p-1 rounded-full transition-colors ${isPaused ? 'text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20' : 'text-orange-400 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20'}`}
          title={isPaused ? '재개' : '일시정지'}
        >
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            reset();
          }}
          className="p-1 text-gray-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition-colors"
          title="초기화"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // 시작 전: 재생 버튼 표시 (타이머 기능 인지용)
  return (
    <Tooltip text="문제 클릭 시 타이머 시작 (로컬 저장)" position="bottom">
      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors">
        <Clock className="h-3.5 w-3.5" />
        <span className="font-mono">00:00</span>
      </div>
    </Tooltip>
  );
}

interface TodayProblemsProps {
  teamId: number;
  isTeamLeader: boolean;
  isTeamMember: boolean;
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onOpenSettings?: () => void;
  onOpenSquadManagement?: () => void;
  onRefreshActivity?: () => void;
  recommendationSettings?: SquadRecommendationSettingsResponse | null;
  initialTodayProblems?: TodayProblemsResponse | null;
  selectedSquadId?: number | null;
  selectedSquadMemberCount?: number;
  isDemo?: boolean;
}

export function TodayProblems({
  teamId,
  isTeamLeader,
  isTeamMember,
  onShowToast,
  onOpenSettings,
  onOpenSquadManagement,
  onRefreshActivity,
  recommendationSettings,
  initialTodayProblems,
  selectedSquadId,
  selectedSquadMemberCount = 0,
  isDemo = false,
}: TodayProblemsProps) {
  // 통합 API에서 받아온 초기 데이터 사용 (중복 API 호출 방지)
  const [todayProblems, setTodayProblems] = useState<TodayProblemsResponse | null>(initialTodayProblems ?? null);
  const [todayProblemsBySquad, setTodayProblemsBySquad] = useState<Map<number, TodayProblemsResponse | null>>(new Map());
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [verifyingProblemId, setVerifyingProblemId] = useState<number | null>(null);
  const [showErrorFlash, setShowErrorFlash] = useState(false);
  const [demoFailMode, setDemoFailMode] = useState(false);
  const [verifiableProblemIds, setVerifiableProblemIds] = useState<Set<number> | null>(null);
  const missionStatus = todayProblems?.status ?? null;
  const isRecommendationLoading = problemsLoading || missionStatus === 'PENDING';

  const buildVerifiableProblemIds = useCallback((teams: { teamId: number; problems: { problemId: number }[] }[]) => {
    const ids = new Set<number>();
    teams
      .filter((team) => team.teamId === teamId)
      .forEach((team) => {
        team.problems.forEach((problem) => ids.add(problem.problemId));
      });
    return ids;
  }, [teamId]);

  // 데모 모드: Cmd+Shift+F (Mac) 또는 Ctrl+Shift+F (Windows)로 실패 모드 토글
  useEffect(() => {
    if (!isDemo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        setDemoFailMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemo]);

  // 서버에서 내려온 스쿼드별 초기 데이터 동기화
  useEffect(() => {
    if (!selectedSquadId) return;
    setTodayProblemsBySquad((prev) => {
      const cached = prev.get(selectedSquadId);
      const nextFromServer = initialTodayProblems ?? null;
      const shouldSync =
        !prev.has(selectedSquadId) ||
        cached?.recommendationId !== nextFromServer?.recommendationId ||
        cached?.status !== nextFromServer?.status ||
        cached?.date !== nextFromServer?.date ||
        (cached?.problems.length ?? 0) !== (nextFromServer?.problems.length ?? 0);
      if (!shouldSync) return prev;
      const next = new Map(prev);
      next.set(selectedSquadId, nextFromServer);
      return next;
    });
  }, [selectedSquadId, initialTodayProblems]);

  // 현재 선택된 스쿼드의 문제셋 표시
  useEffect(() => {
    if (!selectedSquadId) {
      setTodayProblems(initialTodayProblems ?? null);
      return;
    }
    if (todayProblemsBySquad.has(selectedSquadId)) {
      setTodayProblems(todayProblemsBySquad.get(selectedSquadId) ?? null);
      return;
    }
    setTodayProblems(initialTodayProblems ?? null);
  }, [selectedSquadId, initialTodayProblems, todayProblemsBySquad]);

  useEffect(() => {
    if (isDemo || !isTeamMember) {
      setVerifiableProblemIds(null);
      return;
    }

    let cancelled = false;
    recommendationApi.getMyTodayProblemsV2()
      .then((response) => {
        if (cancelled) return;
        setVerifiableProblemIds(buildVerifiableProblemIds(response.teams));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('내 오늘 추천 문제(v2) 로딩 실패:', error);
        setVerifiableProblemIds(new Set());
      });

    return () => {
      cancelled = true;
    };
  }, [isDemo, isTeamMember, buildVerifiableProblemIds]);

  const handleRefreshProblems = async () => {
    if (!isTeamLeader) return;
    if (!selectedSquadId) {
      onShowToast('스쿼드 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'warning');
      return;
    }
    if (selectedSquadMemberCount < 1) {
      onShowToast('현재 스쿼드에 배정된 팀원이 없어 미션을 생성할 수 없습니다.', 'warning');
      return;
    }
    if (todayProblems?.status === 'PENDING') {
      onShowToast('추천이 아직 준비 중입니다. 잠시 후 다시 확인해주세요.', 'info');
      return;
    }
    if (todayProblems?.status === 'SUCCESS') {
      onShowToast('오늘 추천이 이미 생성되었습니다.', 'info');
      return;
    }

    setProblemsLoading(true);
    try {
      const newProblems = await squadsApi.createManualRecommendation(teamId, selectedSquadId);
      setTodayProblems(newProblems);
      setTodayProblemsBySquad((prev) => {
        if (!selectedSquadId) return prev;
        const next = new Map(prev);
        next.set(selectedSquadId, newProblems);
        return next;
      });
      recommendationApi.getMyTodayProblemsV2()
        .then((response) => {
          setVerifiableProblemIds(buildVerifiableProblemIds(response.teams));
        })
        .catch(() => {
          // 인증 가능 체크용 보조 호출 실패는 UI를 막지 않는다.
        });
      onShowToast('✨ 오늘의 미션이 생성되었습니다!', 'success');
      onRefreshActivity?.();
    } catch (error: unknown) {
      console.error('수동 미션 생성 실패:', error);

      const status = getApiErrorStatus(error);
      const message = getApiErrorMessage(error, '');
      const errorCode = getApiErrorCode(error);

      // Handle specific error cases from backend
      if (status === 409 && errorCode === '5009') {
        // Blocked time window (05:00-07:00)
        onShowToast('새벽 5시~7시에는 미션 생성이 불가합니다.\n오전 7시 이후 다시 시도해주세요.', 'warning');
      } else if (status === 409 && errorCode === '5008') {
        // Duplicate recommendation within the same mission cycle
        onShowToast('오늘은 이미 미션을 받았습니다.\n오전 7시 이후 다시 시도해주세요.', 'warning');
      } else if (status === 409) {
        // 오늘 PENDING/SUCCESS가 이미 존재하는 경우 포함
        onShowToast('이미 오늘 추천이 생성 중이거나 완료되었습니다.', 'warning');
      } else if (status === 403) {
        // Blocked time window (fallback)
        onShowToast('미션 전환 시간대(05:00-07:00)에는 즉시 미션 생성이 불가합니다.', 'warning');
      } else if (status === 400 && message?.includes('추천 설정')) {
        // Recommendation settings not configured or inactive
        onShowToast('문제 추천 설정을 먼저 활성화해주세요.', 'warning');
      } else {
        // Generic error
        onShowToast('미션 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.', 'error');
      }
    } finally {
      setProblemsLoading(false);
    }
  };

  const { startTimer, stopTimer, activeTimers, cancelTimer } = useTimerStore();

  const handleVerifyProblem = async (problemId: number) => {
    setVerifyingProblemId(problemId);

    // 데모 모드: API 호출 없이 성공/실패 시뮬레이션 (Ctrl+Shift+F로 실패 모드 토글)
    if (isDemo) {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (demoFailMode) {
        // 실패 시뮬레이션
        setShowErrorFlash(true);
        setTimeout(() => setShowErrorFlash(false), 500);
        onShowToast('아직 해결되지 않은 문제입니다.', 'error');
      } else {
        // 성공 시뮬레이션
        triggerSuccessConfetti();

        // 타이머 경과 시간 계산
        const timer = activeTimers[problemId];
        let solvedTime: string | undefined;
        if (timer) {
          const elapsedMs = timer.isPaused
            ? timer.accumulatedTime
            : timer.accumulatedTime + (Date.now() - timer.startedAt);
          const elapsedSeconds = Math.floor(elapsedMs / 1000);
          solvedTime = formatDuration(elapsedSeconds);
          cancelTimer(problemId); // localStorage에서 삭제 (새로고침 시 초기화)
        }

        if (todayProblems?.status === 'SUCCESS') {
          const updated = {
            ...todayProblems,
            problems: todayProblems.problems.map(p =>
              p.problemId === problemId ? { ...p, isSolved: true, solvedTime } : p
            ),
          };
          setTodayProblems(updated);
          setTodayProblemsBySquad((prev) => {
            if (!selectedSquadId) return prev;
            const next = new Map(prev);
            next.set(selectedSquadId, updated);
            return next;
          });
        }
        onShowToast('문제 해결을 축하합니다!');
      }
      setVerifyingProblemId(null);
      return;
    }

    await verifyProblemSolved(problemId, {
      customToast: onShowToast,
      onSuccess: () => {
        // 타이머가 실행 중이면 자동 정지
        stopTimer(problemId);
        // 문제 상태 업데이트
        if (todayProblems?.status === 'SUCCESS') {
          const updated = {
            ...todayProblems,
            problems: todayProblems.problems.map(p =>
              p.problemId === problemId ? { ...p, isSolved: true } : p
            ),
          };
          setTodayProblems(updated);
          setTodayProblemsBySquad((prev) => {
            if (!selectedSquadId) return prev;
            const next = new Map(prev);
            next.set(selectedSquadId, updated);
            return next;
          });
        }
        // 팀 활동 현황 갱신
        onRefreshActivity?.();
      },
      onError: (errorType: VerifyErrorType) => {
        // rate-limit 에러는 빨간 화면 효과 없음
        if (errorType !== 'rate-limit') {
          setShowErrorFlash(true);
          setTimeout(() => setShowErrorFlash(false), 500);
        }
      },
    });

    setVerifyingProblemId(null);
  };

  const renderVerifyButton = (problem: NonNullable<TodayProblemsResponse>['problems'][number]) => {
    const isVerifiableByTodayList = !isTeamMember
      ? false
      : (verifiableProblemIds === null || verifiableProblemIds.has(problem.problemId));
    const isDisabled = !isTeamMember || !isVerifiableByTodayList || verifyingProblemId === problem.problemId;
    const buttonLabel = !isTeamMember
      ? '팀원만 인증 가능'
      : !isVerifiableByTodayList
        ? '내 미션 문제 아님'
        : '해결 인증하기';

    return (
      <button
        onClick={() => isTeamMember && handleVerifyProblem(problem.problemId)}
        disabled={isDisabled}
        className="w-full py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
      >
        {verifyingProblemId === problem.problemId ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            인증 중...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            {buttonLabel}
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {/* 화면 떨림 효과를 위한 스타일 */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .shake {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>

      <div className={`relative bg-white dark:bg-slate-900 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 ${showErrorFlash ? 'shake border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-blue-200 dark:border-slate-700'}`}>
        {/* 에러 플래시 오버레이 - 컴포넌트 내부 */}
        {showErrorFlash && (
          <div className="absolute inset-0 bg-red-500/20 z-10 pointer-events-none animate-pulse" />
        )}
        {/* 헤더 */}
        <div className="px-4 sm:px-6 py-3 bg-blue-50 dark:bg-slate-800 border-b border-blue-100 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">오늘의 미션</h3>
              {todayProblems?.status === 'SUCCESS' && todayProblems.problems.length > 0 && (
                <span className="text-sm text-blue-600 dark:text-blue-300 font-medium flex-shrink-0">· {todayProblems.problems.length}개</span>
              )}
              <span className="text-xs text-gray-400 dark:text-slate-400 flex-shrink-0">· 오전 6시 초기화</span>
            </div>
          </div>
        </div>

      {/* 컨텐츠 */}
      <div className="relative px-4 sm:px-6 pb-4 pt-3">
        {isRecommendationLoading && (
          <>
            <div className="absolute inset-0 z-20 bg-slate-900/5 pointer-events-none" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-center pointer-events-none px-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-4 py-2.5 shadow-lg">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">미션 문제를 준비하고 있어요</span>
              </div>
            </div>
          </>
        )}
        {isRecommendationLoading ? (
          <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-52 sm:w-56 flex flex-col gap-2 animate-pulse">
                  <div className="relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4">
                    <div className="absolute top-2 left-2 w-5 h-5 bg-gray-200 dark:bg-slate-800 rounded"></div>
                    <div className="flex flex-col pt-6">
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-4 h-4 bg-gray-200 dark:bg-slate-800 rounded"></div>
                          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                            <div className="w-8 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                          </div>
                          <div className="w-14 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-10 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
              ))}
          </div>
        ) : !recommendationSettings?.isActive ? (
          <div className="text-center py-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-slate-800 mb-3">
              <Calendar className="h-7 w-7 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              {isTeamLeader
                ? '아직 문제 추천이 설정되지 않았습니다'
                : '문제 추천이 설정되지 않았습니다'}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
              {isTeamLeader
                ? '문제 추천을 설정하면 팀원들에게 미션이 자동으로 제공됩니다.'
                : '팀장이 문제 추천을 설정하면 이곳에 표시됩니다.'}
            </p>
            {isTeamLeader && onOpenSettings && (
              <MissionActionButton
                onClick={onOpenSettings}
                variant="secondary"
                size="md"
                leadingIcon={<Settings className="h-3.5 w-3.5" />}
              >
                문제 추천 설정하기
              </MissionActionButton>
            )}
          </div>
        ) : missionStatus === 'FAILED' ? (
          <div className="text-center py-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 dark:bg-slate-800 mb-3">
              <Calendar className="h-7 w-7 text-rose-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              오늘 미션 생성에 실패했습니다
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
              잠시 후 다시 시도해주세요.
            </p>
            {isTeamLeader && (
              <MissionActionButton
                onClick={handleRefreshProblems}
                disabled={problemsLoading}
                variant="primary"
                size="md"
                leadingIcon={
                  problemsLoading
                    ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    : <Sparkles className="h-3.5 w-3.5" />
                }
              >
                다시 미션받기
              </MissionActionButton>
            )}
          </div>
        ) : missionStatus === 'SUCCESS' && todayProblems?.problems.length ? (
          <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {todayProblems.problems.map((problem, index) => (
              <div
                key={problem.problemId}
                className="flex-shrink-0 w-52 sm:w-56 flex flex-col gap-2"
              >
              <a
                href={`https://www.acmicpc.net/problem/${problem.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // 문제 링크 클릭 시 타이머 자동 시작 (아직 시작 안 된 경우만)
                  if (!problem.isSolved) {
                    startTimer(problem.problemId, problem.titleKo);
                  }
                }}
                className="group relative bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-lg p-3 sm:p-4 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:bg-blue-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {/* 번호 */}
                <div className="absolute top-2 left-2 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>

                <div className="flex flex-col h-full pt-6">
                  {/* 제목과 티어 */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                      {getTierIcon(problem.level, 14)}
                      <span className="flex-1">{problem.titleKo}</span>
                    </h4>
                  </div>

                  {/* 하단 정보 */}
                  <div className="mt-auto pt-3 border-t border-blue-50 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center group/solved relative">
                          <svg className="w-3.5 h-3.5 mr-1 text-blue-400 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span>{problem.acceptedUserCount.toLocaleString()}</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/solved:opacity-100 transition-opacity pointer-events-none">
                            해결한 사람 수
                          </div>
                        </div>
                        <div className="flex items-center group/tries relative">
                          <svg className="w-3.5 h-3.5 mr-1 text-blue-400 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          <span>{problem.averageTries?.toFixed(1) ?? '-'}</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tries:opacity-100 transition-opacity pointer-events-none">
                            평균 시도 횟수
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-blue-400">#{problem.problemId}</span>
                    </div>
                  </div>

                  {/* 우측 상단: 타이머 + 문제 링크 */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <ProblemTimerDisplay problemId={problem.problemId} problemTitle={problem.titleKo} isSolved={problem.isSolved} solvedTime={problem.solvedTime} />
                    <div className="p-1.5 text-blue-600 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </a>
              {problem.isSolved ? (
                <button
                  disabled
                  className="w-full py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
                >
                  <CheckCircle className="h-4 w-4" />
                  해결 완료
                </button>
              ) : (
                renderVerifyButton(problem)
              )}
              </div>
            ))}
          </div>
        ) : selectedSquadMemberCount < 1 ? (
          <div className="text-center py-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 dark:bg-slate-800 mb-3">
              <Calendar className="h-7 w-7 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              현재 스쿼드에 배정된 팀원이 없습니다
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
              팀원이 있어야 미션이 제공됩니다.
            </p>
            {isTeamLeader && onOpenSquadManagement && (
              <MissionActionButton
                onClick={onOpenSquadManagement}
                variant="secondary"
                size="md"
                leadingIcon={<Settings className="h-3.5 w-3.5" />}
              >
                스쿼드 관리
              </MissionActionButton>
            )}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-slate-800 mb-3">
              <Calendar className="h-7 w-7 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              설정이 완료되었습니다
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
              추천 요일마다 오전 6시에 미션이 제공되며, 오전 9시에 이메일이 발송됩니다.
            </p>
            {isTeamLeader && (
              <>
                <MissionActionButton
                  onClick={handleRefreshProblems}
                  disabled={problemsLoading}
                  variant="primary"
                  size="md"
                  leadingIcon={
                    problemsLoading
                      ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      : <Sparkles className="h-3.5 w-3.5" />
                  }
                >
                  {problemsLoading ? '미션 생성 중...' : '바로 미션 받기'}
                </MissionActionButton>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                  하루 1회 · 이메일 즉시 발송
                </p>
              </>
            )}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
