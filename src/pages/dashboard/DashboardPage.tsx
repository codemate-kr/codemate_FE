import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore, useTeams } from '../../store/teamStore';
import { recommendationApi, type TodayProblem } from '../../api/recommendation';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import StatsCards from './components/StatsCards';
import MyTeamsSection from './components/MyTeamsSection';
import TodayTodoSection from './components/TodayTodoSection';
import DailySolvedChart from './components/DailySolvedChart';
import AdSenseBlock from '../../components/common/adsense/AdSenseBlock';
import { isDemoMode, demoUser, demoTeams, demoTodayProblems } from '../../data/demoData';

interface TeamProblem extends TodayProblem {
  teamId: number;
  teamName: string;
}

export default function DashboardPage() {
  useDocumentTitle('내 학습');
  const { isAuthenticated: realIsAuthenticated, user: realUser } = useAuthStore();
  const realTeams = useTeams();
  const { fetchTeams } = useTeamStore();
  const [todayProblems, setTodayProblems] = useState<TeamProblem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const openLoginModal = useLoginRedirect();

  // 데모 모드 체크
  const isDemo = isDemoMode();
  const isAuthenticated = isDemo ? true : realIsAuthenticated;
  const user = isDemo ? demoUser : realUser;
  const teams = isDemo ? demoTeams : realTeams;

  useEffect(() => {
    if (isDemo) {
      setTodayProblems(demoTodayProblems);
      return;
    }
    if (realIsAuthenticated) {
      fetchTeams();
    }
  }, [isDemo, realIsAuthenticated, fetchTeams]);

  useEffect(() => {
    if (isDemo) return;
    if (realIsAuthenticated) {
      loadAllTodayProblems();
    }
  }, [isDemo, realIsAuthenticated]);

  const loadAllTodayProblems = async () => {
    setProblemsLoading(true);
    try {
      const response = await recommendationApi.getMyTodayProblemsV2();
      const allProblems = response.teams.flatMap(team =>
        team.problems.map(problem => ({
          ...problem,
          teamId: team.teamId,
          teamName: team.teamName,
        }))
      );
      setTodayProblems(allProblems);
    } catch (error) {
      console.error('오늘의 문제 로딩 실패:', error);
    } finally {
      setProblemsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSenseBlock slotKey="TOP" sectionClassName="mt-0 mb-3 sm:mb-4" />

        {/* Header + 팀 초대 알림 배너 */}
        <div className="mb-6 sm:mb-8">
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-6">
            <div className="lg:flex-1">
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

        <AdSenseBlock slotKey="BOTTOM" />
      </div>
    </div>
  );
}
