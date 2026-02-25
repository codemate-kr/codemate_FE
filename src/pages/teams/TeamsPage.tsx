import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useLoginRedirect } from '../../hooks/useLoginRedirect';
import { useTeamStore, useTeams, useTeamsLoading } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/common/toast';
import CreateTeamModal from './components/CreateTeamModal';
import { TeamCard } from './components/TeamCard';
import InvitationBanner from '../../components/common/InvitationBanner';
import type { CreateTeamRequest, MyTeamResponse } from '../../api/teams';
import { getApiErrorMessage } from '../../utils/apiError';

// 비로그인 시 보여줄 데모 팀 데이터
const DEMO_TEAMS: MyTeamResponse[] = [
  { teamId: 1, teamName: '알고리즘 스터디', teamDescription: '매일 1문제씩 함께 풀어요', memberCount: 5, myRole: 'LEADER', isRecommendationActive: true, isPrivate: false, createdAt: '' },
  { teamId: 2, teamName: '코딩 테스트 준비반', teamDescription: 'FAANG 대비 코테 준비', memberCount: 8, myRole: 'MEMBER', isRecommendationActive: true, isPrivate: false, createdAt: '' },
  { teamId: 3, teamName: 'PS 연습', teamDescription: '', memberCount: 3, myRole: 'MEMBER', isRecommendationActive: false, isPrivate: true, createdAt: '' },
];

export default function TeamsPage() {
  useDocumentTitle('팀 관리');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const openLoginModal = useLoginRedirect();

  // Selector hooks 사용 (필요한 상태만 구독)
  const teams = useTeams();
  const teamsLoading = useTeamsLoading();
  const { fetchTeams, createTeam } = useTeamStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated, fetchTeams]);

  // URL에서 action=create 감지하여 모달 열기
  useEffect(() => {
    if (searchParams.get('action') === 'create' && isAuthenticated) {
      setShowCreateModal(true);
      // URL에서 action 파라미터 제거
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, isAuthenticated]);

  // 팀장으로 있는 팀의 개수 계산 (메모이제이션)
  const canCreateTeam = useMemo(
    () => teams.filter(team => team.myRole === 'LEADER').length < 3,
    [teams]
  );

  const handleCreateButtonClick = useCallback(() => {
    if (!canCreateTeam) {
      toast('팀장으로 생성할 수 있는 팀은 최대 3개입니다', 'warning');
      return;
    }
    setShowCreateModal(true);
  }, [canCreateTeam]);

  const handleCloseModal = useCallback(() => setShowCreateModal(false), []);

  const handleModalSubmit = useCallback(async (data: CreateTeamRequest) => {
    setIsLoading(true);
    try {
      const newTeam = await createTeam(data);
      setShowCreateModal(false);
      toast(`${newTeam.name} 팀이 생성되었습니다`);
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error, '팀 생성에 실패했습니다.');
      toast(errorMessage, 'error');
      setShowCreateModal(false);
    } finally {
      setIsLoading(false);
    }
  }, [createTeam]);

  const handleTeamClick = useCallback((teamId: number) => {
    navigate(`/teams/${teamId}`);
  }, [navigate]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">내 팀</h1>
            <p className="mt-1 sm:mt-2 text-sm text-gray-600">
              참여 중인 스터디 팀을 관리하고 새 팀을 만들어보세요.
            </p>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-16 sm:flex-none">
          {isAuthenticated ? (
            <button
              onClick={handleCreateButtonClick}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 팀 만들기
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              로그인하기
            </button>
          )}
          </div>
        </div>
      </div>

      {/* 팀 초대 알림 배너 */}
      {isAuthenticated && (
        <div className="mb-6 lg:w-[calc(50%-12px)]">
          <InvitationBanner />
        </div>
      )}

      <div className="relative">
        {!isAuthenticated && (
          <button
            onClick={openLoginModal}
            className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
          >
            <p className="text-2xl font-bold text-white mb-2">팀 목록을 보려면</p>
            <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
          </button>
        )}
        {(isAuthenticated && teamsLoading) ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 animate-pulse">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_TEAMS.map((team) => (
              <TeamCard
                key={team.teamId}
                team={team}
                isInteractive={false}
              />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 참여한 스터디 팀이 없어요
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto mb-8">
              새 스터디 팀을 만들어 친구들과 함께 알고리즘 문제를 풀어보세요.
            </p>
            <button
              onClick={handleCreateButtonClick}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              첫 스터디 팀 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard
                key={team.teamId}
                team={team}
                onClick={() => handleTeamClick(team.teamId)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
