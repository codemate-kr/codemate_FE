import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, RefreshCw, ExternalLink, CheckCircle, Settings, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { teamsApi, type TodayProblemsResponse, type TeamRecommendationSettingsResponse } from '../../../api/teams';
import { memberApi } from '../../../api/member';
import { getTierIcon } from '../../../components/common/TierIcon';
import { useAuthStore } from '../../../store/authStore';

interface TodayProblemsProps {
  teamId: number;
  isTeamLeader: boolean;
  isTeamMember: boolean;
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onOpenSettings?: () => void;
  recommendationSettings?: TeamRecommendationSettingsResponse | null;
}

export function TodayProblems({ teamId, isTeamLeader, isTeamMember, onShowToast, onOpenSettings, recommendationSettings }: TodayProblemsProps) {
  const [todayProblems, setTodayProblems] = useState<TodayProblemsResponse | null>(null);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [verifyingProblemId, setVerifyingProblemId] = useState<number | null>(null);
  const [showErrorFlash, setShowErrorFlash] = useState(false);
  const { updateUser, user } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    const loadTodayProblems = async () => {
      try {
        setProblemsLoading(true);
        const problems = await teamsApi.getTodayProblems(teamId);
        if (!cancelled) {
          setTodayProblems(problems);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('오늘의 미션 로딩 실패:', error);
        }
      } finally {
        if (!cancelled) {
          setProblemsLoading(false);
        }
      }
    };

    loadTodayProblems();

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const handleRefreshProblems = async () => {
    if (!isTeamLeader) return;

    setProblemsLoading(true);
    try {
      const newProblems = await teamsApi.createManualRecommendation(teamId);
      setTodayProblems(newProblems);
      onShowToast('✨ 오늘의 미션이 생성되었습니다!', 'success');
    } catch (error: any) {
      console.error('수동 미션 생성 실패:', error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;

      // Handle specific error cases from backend
      if (status === 409) {
        // Duplicate recommendation within the same mission cycle
        onShowToast('오늘은 이미 미션을 받았습니다.\n새벽 2시 이후 다시 시도해주세요.', 'warning');
      } else if (status === 403) {
        // Blocked time window (01:00-02:00)
        onShowToast('미션 전환 시간대(01:00-02:00)에는 즉시 미션 생성이 불가합니다.', 'warning');
      } else if (status === 400 && message?.includes('추천 설정')) {
        // Recommendation settings not configured or inactive
        onShowToast('문제 추천 설정을 먼저 활성화해주세요.', 'warning');
      } else {
        // Generic error
        onShowToast('미션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    } finally {
      setProblemsLoading(false);
    }
  };

  const handleVerifyProblem = async (problemId: number) => {
    setVerifyingProblemId(problemId);
    try {
      await memberApi.verifyProblemSolved(problemId);

      // 검증 성공 시 팡파레 효과
      confetti({
        particleCount: 500,
        spread: 240,
        origin: { x: 0.25 },
      });
      confetti({
        particleCount: 500,
        spread: 240,
        origin: { x: 0.75 },
      });
      confetti({
        particleCount: 500,
        spread: 240,
        origin: { x: 0.5 },
      });

      // 문제 상태 업데이트
      if (todayProblems) {
        setTodayProblems({
          ...todayProblems,
          problems: todayProblems.problems.map(p =>
            p.problemId === problemId ? { ...p, isSolved: true } : p
          ),
        });
      }

      // 유저의 총 해결 문제 수 증가
      if (user) {
        updateUser({ solvedCount: (user.solvedCount ?? 0) + 1 });
      }

      onShowToast('🎉 문제 해결을 축하합니다!');
    } catch (error: any) {
      const status = error?.response?.status;

      // 429 에러는 특별 처리 (빨간 화면 효과 없음)
      if (status === 429) {
        onShowToast(error.userMessage || error.message || 'solved.ac API 호출 제한에 도달했습니다.\n잠시 후 다시 시도해주세요.', 'warning');
      } else {
        // 다른 에러는 빨간 화면 효과
        setShowErrorFlash(true);
        setTimeout(() => setShowErrorFlash(false), 500);

        if (status === 404) {
          onShowToast('문제를 찾을 수 없습니다.', 'error');
        } else if (status === 400) {
          onShowToast('아직 해결되지 않은 문제입니다.', 'error');
        } else if (status === 409) {
          onShowToast('이미 인증된 문제입니다.', 'warning');
        } else {
          onShowToast('문제 인증에 실패했습니다.', 'error');
        }
      }
    } finally {
      setVerifyingProblemId(null);
    }
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

      <div className={`relative bg-white rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 ${showErrorFlash ? 'shake border-red-400 bg-red-50' : 'border-blue-200'}`}>
        {/* 에러 플래시 오버레이 - 컴포넌트 내부 */}
        {showErrorFlash && (
          <div className="absolute inset-0 bg-red-500/20 z-10 pointer-events-none animate-pulse" />
        )}
        {/* 헤더 */}
        <div className="px-4 sm:px-6 py-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">오늘의 미션</h3>
            {todayProblems && todayProblems.problems.length > 0 && (
              <span className="text-sm text-blue-600 font-medium flex-shrink-0">· {todayProblems.problems.length}개</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isTeamLeader && onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Settings className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">문제 추천 설정</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="px-4 sm:px-6 pb-6 pt-4">
        {problemsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !recommendationSettings?.isActive ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-3">
              <Calendar className="h-7 w-7 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isTeamLeader
                ? '아직 문제 추천이 설정되지 않았습니다'
                : '문제 추천이 설정되지 않았습니다'}
            </p>
            <p className="text-xs text-gray-500 mb-5">
              {isTeamLeader
                ? '문제 추천을 설정하면 팀원들에게 미션이 자동으로 제공됩니다.'
                : '팀장이 문제 추천을 설정하면 이곳에 표시됩니다.'}
            </p>
            {isTeamLeader && onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                문제 추천 설정하기
              </button>
            )}
          </div>
        ) : todayProblems && todayProblems.problems.length > 0 ? (
          <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {todayProblems.problems.map((problem, index) => (
              <div
                key={problem.problemId}
                className="flex-shrink-0 w-52 sm:w-56 flex flex-col gap-2"
              >
              <Link
                to={`https://www.acmicpc.net/problem/${problem.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-blue-100 rounded-lg p-3 sm:p-4 hover:border-blue-400 hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer"
              >
                {/* 번호 */}
                <div className="absolute top-2 left-2 w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>

                <div className="flex flex-col h-full pt-6">
                  {/* 제목과 티어 */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                      {getTierIcon(problem.level, 14)}
                      <span className="flex-1">{problem.titleKo}</span>
                    </h4>
                  </div>

                  {/* 하단 정보 */}
                  <div className="mt-auto pt-3 border-t border-blue-50">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center group/solved relative">
                          <svg className="w-3.5 h-3.5 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          <span>{problem.acceptedUserCount.toLocaleString()}</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/solved:opacity-100 transition-opacity pointer-events-none">
                            해결한 사람 수
                          </div>
                        </div>
                        <div className="flex items-center group/tries relative">
                          <svg className="w-3.5 h-3.5 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          <span>{problem.averageTries?.toFixed(1) ?? '-'}</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tries:opacity-100 transition-opacity pointer-events-none">
                            평균 시도 횟수
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-blue-400">#{problem.problemId}</span>
                    </div>
                  </div>

                  {/* 문제 풀기 버튼 */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
              {problem.isSolved ? (
                <button
                  disabled
                  className="w-full py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed opacity-80"
                >
                  <CheckCircle className="h-4 w-4" />
                  해결 완료
                </button>
              ) : (
                <button
                  onClick={() => isTeamMember && handleVerifyProblem(problem.problemId)}
                  disabled={!isTeamMember || verifyingProblemId === problem.problemId}
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
                      {isTeamMember ? '해결 인증하기' : '팀원만 인증 가능'}
                    </>
                  )}
                </button>
              )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-3">
              <Calendar className="h-7 w-7 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              설정이 완료되었습니다
            </p>
            <p className="text-xs text-gray-500 mb-5">
              추천 요일마다 새벽에 미션이 제공되며, 오전 9시에 이메일이 발송됩니다.
            </p>

            {isTeamLeader && (
              <>
                <button
                  onClick={handleRefreshProblems}
                  disabled={problemsLoading}
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {problemsLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      미션 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      바로 미션 받기
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  하루 1회 · 새벽 2시 초기화
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
