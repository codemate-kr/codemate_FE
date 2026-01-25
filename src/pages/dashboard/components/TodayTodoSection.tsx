import { useState } from 'react';
import { BookOpen, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import type { TodayProblem } from '../../../api/teams';
import { verifyProblemSolved, type VerifyErrorType } from '../../../utils/problemVerify';

interface TodayTodoSectionProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  problems: Array<TodayProblem & { teamId: number; teamName: string }>;
  loading: boolean;
  onProblemVerified?: (problemId: number) => void;
}

const SAMPLE_PROBLEMS = [
  { problemId: 1000, titleKo: 'A+B', teamName: '알고리즘 스터디', isSolved: true, teamId: 1 },
  { problemId: 10950, titleKo: 'A+B - 3', teamName: '코딩 테스트 준비반', isSolved: false, teamId: 2 },
  { problemId: 10952, titleKo: 'A+B - 5', teamName: 'PS 연습', isSolved: false, teamId: 3 },
];

export default function TodayTodoSection({
  isAuthenticated,
  onLoginClick,
  problems,
  loading,
  onProblemVerified,
}: TodayTodoSectionProps) {
  const [verifyingProblemId, setVerifyingProblemId] = useState<number | null>(null);
  const [showErrorFlash, setShowErrorFlash] = useState(false);
  const displayProblems = isAuthenticated ? problems : SAMPLE_PROBLEMS;

  const handleVerify = async (e: React.MouseEvent, problemId: number) => {
    e.preventDefault();
    e.stopPropagation();

    setVerifyingProblemId(problemId);
    await verifyProblemSolved(problemId, {
      onSuccess: () => onProblemVerified?.(problemId),
      onAlreadyVerified: () => onProblemVerified?.(problemId),
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
  const solvedCount = displayProblems.filter(p => p.isSolved).length;
  const totalCount = displayProblems.length;
  const progressPercent = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

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
      <div className={`rounded-xl border overflow-hidden relative transition-colors duration-300 ${showErrorFlash ? 'shake border-red-400 bg-red-50' : 'bg-white border-gray-200'}`}>
        {/* 에러 플래시 오버레이 - 컴포넌트 전체 덮음 */}
        {showErrorFlash && (
          <div className="absolute inset-0 bg-red-500/20 z-10 pointer-events-none animate-pulse" />
        )}
      {!isAuthenticated && (
        <button
          onClick={onLoginClick}
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
        >
          <p className="text-2xl font-bold text-white mb-2">오늘의 할 일을 보려면</p>
          <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
        </button>
      )}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">오늘의 할 일</h3>
          {(isAuthenticated ? totalCount > 0 : true) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {isAuthenticated ? `${solvedCount}/${totalCount}` : '1/3'} 완료
              </span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{
                    width: isAuthenticated ? `${progressPercent}%` : '33%'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        {isAuthenticated && loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !isAuthenticated || totalCount === 0 ? (
          isAuthenticated ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                아직 추천받은 문제가 없어요
              </p>
              <p className="text-xs text-gray-500">
                팀 설정에서 추천을 활성화하면 오전 9시에 문제가 도착해요
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {SAMPLE_PROBLEMS.map((problem) => (
                <div
                  key={problem.problemId}
                  className={`block border rounded-lg p-4 cursor-default ${
                    problem.isSolved
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {problem.isSolved ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              problem.isSolved
                                ? 'text-green-700 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {problem.titleKo}
                          </h4>
                          <ExternalLink className={`h-4 w-4 flex-shrink-0 ${
                            problem.isSolved ? 'text-green-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {problem.teamName} · #{problem.problemId}
                        </p>
                      </div>
                    </div>
                    {!problem.isSolved && (
                      <div className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md flex items-center gap-1.5 border border-gray-200">
                        <CheckCircle className="h-3 w-3" />
                        해결 인증
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {displayProblems.map((problem) => (
              <a
                key={`${problem.teamId}-${problem.problemId}`}
                href={`https://www.acmicpc.net/problem/${problem.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block border rounded-lg p-4 transition-colors group ${
                  problem.isSolved
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 relative group/checkbox">
                      {problem.isSolved ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="absolute left-0 top-7 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap opacity-0 group-hover/checkbox:opacity-100 transition-opacity pointer-events-none z-10">
                            해결 완료
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded border-2 border-gray-300" />
                          <span className="absolute left-0 top-7 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap opacity-0 group-hover/checkbox:opacity-100 transition-opacity pointer-events-none z-10">
                            미해결
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            problem.isSolved
                              ? 'text-green-700 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {problem.titleKo}
                        </h4>
                        <ExternalLink className={`h-4 w-4 flex-shrink-0 transition-colors ${
                          problem.isSolved ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-500'
                        }`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {problem.teamName} · #{problem.problemId}
                      </p>
                    </div>
                  </div>
                  {!problem.isSolved && (
                    <button
                      onClick={(e) => handleVerify(e, problem.problemId)}
                      disabled={verifyingProblemId === problem.problemId}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 rounded-md transition-colors flex items-center gap-1.5 border border-gray-200"
                    >
                      {verifyingProblemId === problem.problemId ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          확인 중
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          해결 인증
                        </>
                      )}
                    </button>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
