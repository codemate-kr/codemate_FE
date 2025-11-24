import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '../../../components/common/toast';
import { useLoginRedirect } from '../../../hooks/useLoginRedirect';
import { TeamSettingsModal } from '../components/TeamSettingsModal';
import { MemberInviteModal } from '../components/MemberInviteModal';
import { TodayProblems } from '../components/TodayProblems';
import { TeamDetailError } from '../../../components/common/TeamDetailError';
import ConfirmModal from '../../../components/common/ConfirmModal';
import TeamInfoSection from './components/TeamInfoSection';
import TeamMembersList from './components/TeamMembersList';
import TeamActionMenu from './components/TeamActionMenu';
import { useTeamStore, useCurrentTeamDetails, useDetailLoading, useDetailError, useTeams } from '../../../store/teamStore';
import { useAuthStore } from '../../../store/authStore';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const loginRedirect = useLoginRedirect();

  // Selector hooks 사용
  const currentTeamDetails = useCurrentTeamDetails();
  const detailLoading = useDetailLoading();
  const detailError = useDetailError();
  const teams = useTeams();
  const { fetchTeamDetails, refreshTeamSettings, leaveTeam, deleteTeam } = useTeamStore();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // 현재 사용자가 팀장인지 확인
  const teamMembers = currentTeamDetails?.members || [];
  const recommendationSettings = currentTeamDetails?.settings || null;
  const currentUserMember = teamMembers.find(member => member.isMe);
  const isTeamLeader = currentUserMember?.role === 'LEADER';
  const isTeamMember = !!currentUserMember;

  // 팀 기본 정보 가져오기
  const currentTeam = teams.find(team => team.teamId === Number(teamId));

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails(Number(teamId));
    }
  }, [teamId, fetchTeamDetails]);

  const loadRecommendationSettings = async () => {
    if (!teamId) return;
    await refreshTeamSettings(Number(teamId));
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    toast(message, type);
  };

  const handleRetry = () => {
    if (teamId) {
      fetchTeamDetails(Number(teamId));
    }
  };

  const handleLeaveTeam = async () => {
    if (!teamId) return;

    setIsActionLoading(true);
    try {
      await leaveTeam(Number(teamId));
      showToastMessage('팀에서 탈퇴했습니다');
      setShowLeaveConfirm(false);
      setTimeout(() => navigate('/teams'), 1000);
    } catch (error: any) {
      showToastMessage(error?.message || '팀 탈퇴에 실패했습니다');
      setShowLeaveConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamId) return;

    setIsActionLoading(true);
    try {
      await deleteTeam(Number(teamId));
      showToastMessage('팀이 해산되었습니다');
      setShowDeleteConfirm(false);
      setTimeout(() => navigate('/teams'), 1000);
    } catch (error: any) {
      showToastMessage(error?.message || '팀 해산에 실패했습니다');
      setShowDeleteConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (detailLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (detailError) {
    return <TeamDetailError error={detailError} onRetry={handleRetry} />;
  }

  return (
    <div className="relative">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="py-6 mb-8 border-b border-gray-200">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  {currentTeam?.teamName || recommendationSettings?.teamName || `스터디 팀 #${teamId}`}
                </h1>
                {isTeamLeader && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                    팀장
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 break-words">
                {currentTeam?.teamDescription || `${teamMembers.length}명의 팀원과 함께 성장하는 알고리즘 스터디`}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center justify-end gap-2">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                >
                  <Lock className="h-4 w-4 mr-1.5" />
                  로그인하여 참여하기
                </Link>
              ) : (
                <>
                  {isTeamLeader && (
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">멤버 초대</span>
                      <span className="sm:hidden">초대</span>
                    </button>
                  )}
                  <TeamActionMenu
                    isTeamLeader={isTeamLeader}
                    onLeaveClick={() => setShowLeaveConfirm(true)}
                    onDeleteClick={() => setShowDeleteConfirm(true)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayProblems
              teamId={Number(teamId)}
              isTeamLeader={isTeamLeader}
              isTeamMember={isTeamMember}
              onShowToast={showToastMessage}
              onOpenSettings={() => setShowSettingsModal(true)}
              recommendationSettings={recommendationSettings}
            />

            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">진행률</h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                  개발 중
                </span>
              </div>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-sm text-gray-400">차트 준비 중</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TeamInfoSection
              memberCount={teamMembers.length}
              recommendationSettings={recommendationSettings}
            />

            <TeamMembersList members={teamMembers} />
          </div>
        </div>

        {/* 설정 모달 */}
        {showSettingsModal && (
          <TeamSettingsModal
            teamId={Number(teamId)}
            settings={recommendationSettings}
            onClose={() => setShowSettingsModal(false)}
            onSettingsUpdate={loadRecommendationSettings}
            onShowToast={showToastMessage}
          />
        )}

        {/* 멤버 초대 모달 */}
        {showInviteModal && (
          <MemberInviteModal
            teamId={Number(teamId)}
            onClose={() => setShowInviteModal(false)}
            onShowToast={showToastMessage}
            onInviteSuccess={() => {
              if (teamId) {
                fetchTeamDetails(Number(teamId));
              }
            }}
          />
        )}

        {/* 팀 탈퇴 확인 모달 */}
        <ConfirmModal
          isOpen={showLeaveConfirm}
          title="팀 탈퇴"
          message={`정말 ${currentTeam?.teamName || '이 팀'}에서 탈퇴하시겠습니까?\n탈퇴 후에는 다시 초대를 받아야 합니다.`}
          confirmText="탈퇴"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={handleLeaveTeam}
          onCancel={() => setShowLeaveConfirm(false)}
          isLoading={isActionLoading}
        />

        {/* 팀 해산 확인 모달 */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="팀 해산"
          message={`정말 ${currentTeam?.teamName || '이 팀'}을(를) 해산하시겠습니까?\n해산된 팀은 복구할 수 없으며, 모든 팀원이 팀에서 제거됩니다.`}
          confirmText="해산"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={handleDeleteTeam}
          onCancel={() => setShowDeleteConfirm(false)}
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
}
