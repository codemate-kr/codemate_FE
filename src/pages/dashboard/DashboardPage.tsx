import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Target, TrendingUp, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore, useTeams } from '../../store/teamStore';
import { memberApi, type MyProfileResponse } from '../../api/member';
import { teamsApi, type TodayProblem } from '../../api/teams';
import useDocumentTitle from '../../hooks/useDocumentTitle';

interface TeamProblem extends TodayProblem {
  teamId: number;
  teamName: string;
}

export default function DashboardPage() {
  useDocumentTitle('대시보드');
  const { isAuthenticated } = useAuthStore();
  const teams = useTeams();
  const { fetchTeams } = useTeamStore();
  const [userProfile, setUserProfile] = useState<MyProfileResponse | null>(null);
  const [todayProblems, setTodayProblems] = useState<TeamProblem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
      // store의 fetchTeams 사용 (자동 캐싱)
      fetchTeams();
    }
  }, [isAuthenticated, fetchTeams]);

  useEffect(() => {
    if (teams.length > 0) {
      loadAllTodayProblems();
    }
  }, [teams]);

  const loadUserProfile = async () => {
    try {
      const profile = await memberApi.getMe();
      setUserProfile(profile);
    } catch (error) {
      console.error('사용자 프로필 로딩 실패:', error);
    }
  };

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
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words">
            안녕하세요, {userProfile?.handle || '백준 미인증'}님!
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            오늘도 알고리즘 문제를 풀어보세요.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none w-full sm:w-auto">
          <Link
            to="/teams?action=create"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            스터디 팀 만들기
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      참여 중인 그룹
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">
                      {teams.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      오늘의 문제
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      이번 주 해결
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                </div>
                <div className="ml-4 sm:ml-5 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      연속 해결일
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 내 스터디 팀 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">내 스터디 팀</h3>
              <Link
                to="/teams"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                전체 보기
              </Link>
            </div>
          </div>
          <div className="p-4">
            {teams.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">
                  아직 참여한 스터디 팀이 없습니다
                </p>
                <Link
                  to="/teams?action=create"
                  className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  팀 만들기
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {teams.slice(0, 3).map((team) => (
                  <Link
                    key={team.teamId}
                    to={`/teams/${team.teamId}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {team.teamName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {team.memberCount}명 · {team.isRecommendationActive ? '추천 활성' : '추천 비활성'}
                        </p>
                      </div>
                      {team.myRole === 'LEADER' && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          팀장
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                {teams.length > 3 && (
                  <div className="pt-2 text-center">
                    <Link
                      to="/teams"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      +{teams.length - 3}개 더 보기
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 오늘의 할 일 */}
        <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
          <div className="px-4 py-4 bg-blue-50 border-b border-blue-100">
            <h3 className="text-base font-semibold text-gray-900">오늘의 할 일</h3>
          </div>
          <div className="p-4">
            {problemsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : todayProblems.length === 0 ? (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded border-2 border-gray-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">
                    오늘 풀어야 할 문제가 없습니다
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    팀장이 문제를 추천하면 여기에 표시됩니다
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {todayProblems.map((problem) => (
                  <a
                    key={`${problem.teamId}-${problem.problemId}`}
                    href={`https://www.acmicpc.net/problem/${problem.problemId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-blue-500 transition-colors"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                            {problem.titleKo}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {problem.teamName} · #{problem.problemId}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 최근 성취 */}
        <div className="bg-white border border-gray-200 rounded-lg lg:col-span-2">
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">최근 성취</h3>
          </div>
          <div className="p-4">
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">
                아직 기록이 없습니다
              </p>
              <p className="text-xs text-gray-400 mt-1">
                문제를 풀면 여기에 활동 기록이 표시됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}