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
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">오늘의 문제</h3>
              {todayProblems && todayProblems.problems.length > 0 && (
                <p className="text-sm text-gray-600">총 {todayProblems.problems.length}개의 추천 문제</p>
              )}
            </div>
          </div>
          {isTeamLeader && todayProblems && (
            <button
              onClick={handleRefreshProblems}
              disabled={true}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed opacity-60"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </button>
          )}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6">
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
          <div className="flex items-stretch gap-4">
            {todayProblems.problems.map((problem, index) => (
              <Link
                key={problem.problemId}
                to={`https://www.acmicpc.net/problem/${problem.problemId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300"
              >
                {/* 좌측 순서 표시 */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl"></div>

                {/* 번호 뱃지 */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                <div className="flex flex-col h-full pl-3">
                  {/* 제목과 티어 */}
                  <div className="mb-3">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {problem.titleKo}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getTierColor(problem.level)} border border-current border-opacity-20`}>
                        {getTierName(problem.level)}
                      </span>
                      {problem.isSolved && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          완료
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 태그 */}
                  {problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-gray-700 border border-gray-300 group-hover:border-blue-400 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-500">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 하단 정보 */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span className="font-medium text-gray-700">{problem.acceptedUserCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">{problem.averageTries.toFixed(1)}</span>
                      </div>
                      <span className="font-mono text-gray-400">#{problem.problemId}</span>
                    </div>
                  </div>

                  {/* 외부링크 아이콘 */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              추천된 문제가 없습니다
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              {isTeamLeader
                ? '문제 추천 설정을 완료하면 팀원들을 위한 문제가 자동으로 추천됩니다.'
                : '팀장이 문제 추천을 설정하면 이곳에 표시됩니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
