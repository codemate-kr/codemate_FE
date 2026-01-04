import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore, useTeams } from '../../store/teamStore';
import { teamsApi, type TodayProblem } from '../../api/teams';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import StatsCards from './components/StatsCards';
import MyTeamsSection from './components/MyTeamsSection';
import TodayTodoSection from './components/TodayTodoSection';
import DailySolvedChart from './components/DailySolvedChart';

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
  const openLoginModal = useLoginRedirect();
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
          </div>
        </div>

        {/* Stats Cards - 모바일에서 숨김 */}
        <StatsCards
          isAuthenticated={isAuthenticated}
          onLoginClick={openLoginModal}
          teamCount={isAuthenticated ? teams.length : 3}
          problemCount={isAuthenticated ? todayProblems.length : 5}
          solvedCount={isAuthenticated ? (user?.solvedCount ?? 0) : 127}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 내 스터디 팀 */}
          <MyTeamsSection
            isAuthenticated={isAuthenticated}
            onLoginClick={openLoginModal}
            teams={teams}
          />

          {/* 오늘의 할 일 */}
          <TodayTodoSection
            isAuthenticated={isAuthenticated}
            onLoginClick={openLoginModal}
            problems={todayProblems}
            loading={problemsLoading}
            onProblemVerified={(problemId) => {
              setTodayProblems(prev =>
                prev.map(p => p.problemId === problemId ? { ...p, isSolved: true } : p)
              );
            }}
          />

          {/* 최근 활동 차트 */}
          <DailySolvedChart
            isAuthenticated={isAuthenticated}
            onLoginClick={openLoginModal}
          />

        </div>
      </div>
    </div>
  );
}
