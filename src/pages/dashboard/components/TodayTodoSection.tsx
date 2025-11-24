import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import type { TodayProblem } from '../../../api/teams';

interface TodayTodoSectionProps {
  isAuthenticated: boolean;
  loginRedirect: string;
  problems: Array<TodayProblem & { teamId: number; teamName: string }>;
  loading: boolean;
}

const SAMPLE_PROBLEMS = [
  { problemId: 1000, titleKo: 'A+B', teamName: '알고리즘 스터디', isSolved: true, teamId: 1 },
  { problemId: 10950, titleKo: 'A+B - 3', teamName: '코딩 테스트 준비반', isSolved: false, teamId: 2 },
  { problemId: 10952, titleKo: 'A+B - 5', teamName: 'PS 연습', isSolved: false, teamId: 3 },
];

export default function TodayTodoSection({
  isAuthenticated,
  loginRedirect,
  problems,
  loading,
}: TodayTodoSectionProps) {
  const displayProblems = isAuthenticated ? problems : SAMPLE_PROBLEMS;
  const solvedCount = displayProblems.filter(p => p.isSolved).length;
  const totalCount = displayProblems.length;
  const progressPercent = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      {!isAuthenticated && (
        <Link
          to={loginRedirect}
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
        >
          <p className="text-2xl font-bold text-white mb-2">오늘의 할 일을 보려면</p>
          <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
        </Link>
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
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-base text-gray-600 mb-1">
                오늘 풀어야 할 문제가 없습니다
              </p>
              <p className="text-sm text-gray-500">
                팀장이 문제를 추천하면 여기에 표시됩니다
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {problem.isSolved ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-semibold truncate ${
                            problem.isSolved
                              ? 'text-green-700 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {problem.titleKo}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {problem.teamName} · #{problem.problemId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 ml-2">
                      <ExternalLink className={`h-5 w-5 flex-shrink-0 ${
                        problem.isSolved ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
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
                className={`group block border rounded-lg p-4 transition-all ${
                  problem.isSolved
                    ? 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      {problem.isSolved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-blue-500 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          problem.isSolved
                            ? 'text-green-700 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {problem.titleKo}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {problem.teamName} · #{problem.problemId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 ml-2">
                    {!problem.isSolved && (
                      <Link
                        to={`/teams/${problem.teamId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex-shrink-0"
                      >
                        인증하기
                      </Link>
                    )}
                    <ExternalLink className={`h-5 w-5 flex-shrink-0 ${
                      problem.isSolved ? 'text-green-500' : 'text-gray-400 group-hover:text-blue-600'
                    } transition-colors`} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
