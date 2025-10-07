import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, RefreshCw, ExternalLink, CheckCircle } from 'lucide-react';
import { teamsApi, type TodayProblemsResponse } from '../../../api/teams';
import { getTierName, getTierColor } from '../../../utils/tierUtils';

interface TodayProblemsProps {
  teamId: number;
  isTeamLeader: boolean;
  onShowToast: (message: string) => void;
}

export function TodayProblems({ teamId, isTeamLeader, onShowToast }: TodayProblemsProps) {
  const [todayProblems, setTodayProblems] = useState<TodayProblemsResponse | null>(null);
  const [problemsLoading, setProblemsLoading] = useState(false);

  useEffect(() => {
    loadTodayProblems();
  }, [teamId]);

  const loadTodayProblems = async () => {
    try {
      setProblemsLoading(true);
      const problems = await teamsApi.getTodayProblems(teamId);
      setTodayProblems(problems);
    } catch (error) {
      console.error('오늘의 문제 로딩 실패:', error);
    } finally {
      setProblemsLoading(false);
    }
  };

  const handleRefreshProblems = async () => {
    if (!isTeamLeader) return;
    try {
      const newProblems = await teamsApi.refreshTodayProblems(teamId);
      setTodayProblems(newProblems);
      onShowToast('문제가 새로고침되었습니다!');
    } catch (error) {
      console.error('문제 새로고침 실패:', error);
      onShowToast('문제 새로고침에 실패했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">오늘의 문제</h3>
            {todayProblems && todayProblems.problems.length > 0 && (
              <span className="text-sm text-blue-600 font-medium">· {todayProblems.problems.length}개</span>
            )}
          </div>
          {isTeamLeader && todayProblems && (
            <button
              onClick={handleRefreshProblems}
              disabled={true}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-md cursor-not-allowed opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              새로고침
            </button>
          )}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="px-6 pb-6 pt-4">
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
        ) : todayProblems && todayProblems.problems.length > 0 ? (
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            {todayProblems.problems.map((problem, index) => (
              <Link
                key={problem.problemId}
                to={`https://www.acmicpc.net/problem/${problem.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-shrink-0 w-56 relative bg-white border border-blue-100 rounded-lg p-4 hover:border-blue-400 hover:shadow-md hover:bg-blue-50 transition-all cursor-pointer"
              >
                {/* 번호 */}
                <div className="absolute top-2 left-2 w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>

                <div className="flex flex-col h-full pt-6">
                  {/* 제목과 티어 */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {problem.titleKo}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTierColor(problem.level)}`}>
                        {getTierName(problem.level)}
                      </span>
                      {problem.isSolved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          완료
                        </span>
                      )}
                    </div>
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
                          <span>{problem.averageTries.toFixed(1)}</span>
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
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-200 text-blue-600 text-xs font-medium rounded group-hover:bg-blue-50 group-hover:border-blue-400 transition-colors">
                      <span>문제 풀기</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-3">
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-sm text-gray-500">
              {isTeamLeader
                ? '문제 추천 설정을 완료하면 문제가 자동으로 추천됩니다.'
                : '팀장이 문제 추천을 설정하면 이곳에 표시됩니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
