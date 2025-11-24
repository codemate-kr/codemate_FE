import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore, useTeams } from '../../store/teamStore';
import { teamsApi, type TodayProblem } from '../../api/teams';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import StatsCards from './components/StatsCards';
import MyTeamsSection from './components/MyTeamsSection';
import TodayTodoSection from './components/TodayTodoSection';

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
        <StatsCards
          isAuthenticated={isAuthenticated}
          loginRedirect={loginRedirect}
          teamCount={isAuthenticated ? teams.length : 3}
          problemCount={isAuthenticated ? todayProblems.length : 5}
          solvedCount={isAuthenticated ? (user?.solvedCount ?? 0) : 127}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 내 스터디 팀 */}
          <MyTeamsSection
            isAuthenticated={isAuthenticated}
            loginRedirect={loginRedirect}
            teams={teams}
          />

          {/* 오늘의 할 일 */}
          <TodayTodoSection
            isAuthenticated={isAuthenticated}
            loginRedirect={loginRedirect}
            problems={todayProblems}
            loading={problemsLoading}
          />

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
