import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Target, TrendingUp, ExternalLink, Crown, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore, useTeams } from '../../store/teamStore';
import { teamsApi, type TodayProblem } from '../../api/teams';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import Tooltip from '../../components/common/Tooltip';

interface TeamProblem extends TodayProblem {
  teamId: number;
  teamName: string;
}

export default function DashboardPage() {
  useDocumentTitle('내 학습');
  const { isAuthenticated, user } = useAuthStore();
  const teams = useTeams();
  const { fetchTeams } = useTeamStore();
  const [todayProblems, setTodayProblems] = useState<TeamProblem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const loginRedirect = useLoginRedirect();

  useEffect(() => {
    if (isAuthenticated) {
      // store의 fetchTeams 사용 (자동 캐싱)
      fetchTeams();
    }
  }, [isAuthenticated, fetchTeams]);

  useEffect(() => {
    if (teams.length > 0) {
      loadAllTodayProblems();
    }
  }, [teams]);

  const loadAllTodayProblems = async () => {
    setProblemsLoading(true);
    try {
      const problemsPromises = teams.map(async (team) => {
        try {
          const response = await teamsApi.getTodayProblems(team.teamId);
          return response.problems.map(problem => ({
            ...problem,
            teamId: team.teamId,
            teamName: team.teamName,
          }));
        } catch (error) {
          console.error(`팀 ${team.teamId}의 문제 로딩 실패:`, error);
          return [];
        }
      });

      const allProblems = await Promise.all(problemsPromises);
      setTodayProblems(allProblems.flat());
    } catch (error) {
      console.error('오늘의 문제 로딩 실패:', error);
    } finally {
      setProblemsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                안녕하세요, {isAuthenticated ? (user?.handle || '백준 미인증') : '게스트'}님!
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
                {isAuthenticated ? '오늘도 알고리즘 문제를 풀어보세요.' : '로그인하고 알고리즘 학습을 시작하세요.'}
              </p>
            </div>
            {isAuthenticated && (
              <div className="mt-3 sm:mt-0 sm:ml-16 sm:flex-none w-full sm:w-auto">
                <Link
                  to="/teams/my?action=create"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-blue-600 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  스터디 팀 만들기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - 모바일에서 숨김 */}
        <div className="hidden sm:grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8 relative">
          {!isAuthenticated && (
            <Link
              to={loginRedirect}
              className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
            >
              <p className="text-2xl font-bold text-white mb-2">통계를 확인하려면</p>
              <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
            </Link>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">참여 중인 그룹</p>
                <p className="text-2xl font-bold text-gray-900">{isAuthenticated ? teams.length : '3'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">오늘의 문제</p>
                <p className="text-2xl font-bold text-gray-900">{isAuthenticated ? todayProblems.length : '5'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">총 해결 문제</p>
                <p className="text-2xl font-bold text-gray-900">{isAuthenticated ? (user?.solvedCount ?? 0) : '127'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 opacity-60 relative">
            <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
              개발 중
            </span>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">연속 해결일</p>
                <p className="text-2xl font-bold text-gray-400">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 내 스터디 팀 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative">
            {!isAuthenticated && (
              <Link
                to={loginRedirect}
                className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
              >
                <p className="text-2xl font-bold text-white mb-2">참여 팀을 보려면</p>
                <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
              </Link>
            )}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">내 스터디 팀</h3>
                <Link
                  to="/teams/my"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  전체 보기 →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {(isAuthenticated && teams.length === 0) ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    아직 참여한 스터디 팀이 없습니다
                  </p>
                  <Link
                    to="/teams/my?action=create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    팀 만들기
                  </Link>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  {[
                    { teamId: 1, teamName: '알고리즘 스터디', memberCount: 5, myRole: 'LEADER', isRecommendationActive: true },
                    { teamId: 2, teamName: '코딩 테스트 준비반', memberCount: 8, myRole: 'MEMBER', isRecommendationActive: true },
                    { teamId: 3, teamName: 'PS 연습', memberCount: 3, myRole: 'MEMBER', isRecommendationActive: false },
                  ].map((team) => (
                    <div
                      key={team.teamId}
                      className="group block bg-white border border-gray-200 rounded-lg p-4 cursor-default"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {team.teamName}
                              </h4>
                              {team.myRole === 'LEADER' && (
                                <Tooltip text="팀장">
                                  <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                </Tooltip>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              멤버 {team.memberCount}명
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 ml-2">
                          {team.isRecommendationActive && (
                            <Tooltip text="문제 추천 활성화됨">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 flex-shrink-0">
                                추천 활성
                              </span>
                            </Tooltip>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.slice(0, 3).map((team) => (
                    <Link
                      key={team.teamId}
                      to={`/teams/${team.teamId}`}
                      className="group block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {team.teamName}
                              </h4>
                              {team.myRole === 'LEADER' && (
                                <Tooltip text="팀장">
                                  <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                </Tooltip>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              멤버 {team.memberCount}명
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 ml-2">
                          {team.isRecommendationActive && (
                            <Tooltip text="문제 추천 활성화됨">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 flex-shrink-0">
                                추천 활성
                              </span>
                            </Tooltip>
                          )}
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {teams.length > 3 && (
                    <div className="pt-2 text-center">
                      <Link
                        to="/teams/my"
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                      >
                        외 {teams.length - 3}개 팀 →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 오늘의 할 일 */}
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
                {(isAuthenticated ? todayProblems.length > 0 : true) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {isAuthenticated ? `${todayProblems.filter(p => p.isSolved).length}/${todayProblems.length}` : '1/3'} 완료
                    </span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{
                          width: isAuthenticated
                            ? `${(todayProblems.filter(p => p.isSolved).length / todayProblems.length) * 100}%`
                            : '33%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {(isAuthenticated && problemsLoading) ? (
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
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  {[
                    { problemId: 1000, titleKo: 'A+B', teamName: '알고리즘 스터디', isSolved: true, teamId: 1 },
                    { problemId: 10950, titleKo: 'A+B - 3', teamName: '코딩 테스트 준비반', isSolved: false, teamId: 2 },
                    { problemId: 10952, titleKo: 'A+B - 5', teamName: 'PS 연습', isSolved: false, teamId: 3 },
                  ].map((problem) => (
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
              ) : todayProblems.length === 0 ? (
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
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {todayProblems.map((problem) => (
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

          {/* 최근 성취 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">최근 성취</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <TrendingUp className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-base text-gray-600 mb-1">
                  🚧 개발 중입니다
                </p>
                <p className="text-sm text-gray-500">
                  곧 활동 기록을 확인할 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}