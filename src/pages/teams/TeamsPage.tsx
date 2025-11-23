import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings, Crown, ChevronRight } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useTeamStore, useTeams, useTeamsLoading } from '../../store/teamStore';
import { toast } from '../../components/common/toast';
import Tooltip from '../../components/common/Tooltip';
import CreateTeamModal from './components/CreateTeamModal';
import type { CreateTeamRequest } from '../../api/teams';

export default function TeamsPage() {
  useDocumentTitle('팀 관리');
  const navigate = useNavigate();

  // Selector hooks 사용 (필요한 상태만 구독)
  const teams = useTeams();
  const teamsLoading = useTeamsLoading();
  const { fetchTeams, createTeam } = useTeamStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // store의 fetchTeams 사용 (자동 캐싱)
    fetchTeams();
  }, [fetchTeams]);

  // 팀장으로 있는 팀의 개수 계산
  const leaderTeamsCount = teams.filter(team => team.myRole === 'LEADER').length;
  const canCreateTeam = leaderTeamsCount < 3;

  const handleCreateButtonClick = () => {
    if (!canCreateTeam) {
      toast('팀장으로 생성할 수 있는 팀은 최대 3개입니다', 'warning');
      return;
    }
    setShowCreateModal(true);
  };

  const handleModalSubmit = async (data: CreateTeamRequest) => {
    setIsLoading(true);
    try {
      // store의 createTeam 사용 (자동으로 store 업데이트)
      const newTeam = await createTeam(data);
      setShowCreateModal(false);
      toast(`${newTeam.name} 팀이 생성되었습니다`);
    } catch (error: any) {
      // 백엔드에서 온 에러 메시지 표시
      const errorMessage = error?.message || '팀 생성에 실패했습니다.';
      toast(errorMessage, 'error');
      setShowCreateModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">팀 관리</h1>
          <p className="mt-2 text-sm text-gray-700">
            참여 중인 스터디 팀을 관리하고 새 팀을 만들어보세요.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleCreateButtonClick}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 팀 만들기
          </button>
        </div>
      </div>

      <div className="mt-8">
        {teamsLoading ? (
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
              <div
                key={team.teamId}
                onClick={() => navigate(`/teams/${team.teamId}`)}
                className="group bg-white overflow-hidden rounded-lg cursor-pointer hover:shadow-md transition-all border border-gray-200 hover:border-gray-400"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {team.teamName}
                          </h3>
                          {team.myRole === 'LEADER' && (
                            <Tooltip text="팀장">
                              <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {team.teamDescription || '설명이 없습니다'}
                        </p>
                      </div>
                    </div>
                    <Tooltip text="팀 설정">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast('팀 설정 기능은 개발 중입니다');
                        }}
                        className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Tooltip text="멤버 수">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1.5" />
                            <span className="font-medium">{team.memberCount}명</span>
                          </div>
                        </Tooltip>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded ${
                          team.myRole === 'LEADER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {team.myRole === 'LEADER' ? '팀장' : '팀원'}
                        </span>
                        {team.isRecommendationActive && (
                          <Tooltip text="문제 추천 활성화됨">
                            <span className="px-2.5 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                              추천 활성
                            </span>
                          </Tooltip>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}